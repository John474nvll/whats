#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS
import g4f
import asyncio
import json

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "provider": "g4f"})

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    try:
        data = request.json
        messages = data.get('messages', [])
        model = data.get('model', 'gpt-4o')
        max_tokens = data.get('max_tokens', 1024)
        stream = data.get('stream', False)
        
        g4f_model = g4f.models.gpt_4o
        if 'gpt-4' in model:
            g4f_model = g4f.models.gpt_4
        elif 'gpt-3.5' in model:
            g4f_model = g4f.models.gpt_35_turbo
        elif 'claude' in model:
            g4f_model = g4f.models.claude_3_5_sonnet
        
        response = g4f.ChatCompletion.create(
            model=g4f_model,
            messages=messages,
            stream=False
        )
        
        return jsonify({
            "id": "chatcmpl-g4f",
            "object": "chat.completion",
            "created": 0,
            "model": model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        })
    except Exception as e:
        return jsonify({"error": {"message": str(e), "type": "g4f_error"}}), 500

@app.route('/v1/images/generations', methods=['POST'])
def image_generations():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        n = data.get('n', 1)
        size = data.get('size', '1024x1024')
        
        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            messages=[{"role": "user", "content": f"Generate an image of: {prompt}"}],
            image=True
        )
        
        images = []
        if isinstance(response, str) and response.startswith('http'):
            images.append({"url": response})
        else:
            images.append({"url": "", "b64_json": str(response) if response else ""})
        
        return jsonify({
            "created": 0,
            "data": images
        })
    except Exception as e:
        return jsonify({"error": {"message": str(e), "type": "g4f_error"}}), 500

@app.route('/v1/models', methods=['GET'])
def list_models():
    return jsonify({
        "data": [
            {"id": "gpt-4o", "object": "model"},
            {"id": "gpt-4", "object": "model"},
            {"id": "gpt-3.5-turbo", "object": "model"},
            {"id": "claude-3-5-sonnet", "object": "model"},
        ]
    })

if __name__ == '__main__':
    port = 5002
    print(f"G4F API server running on port {port}")
    app.run(host='127.0.0.1', port=port, debug=False)
