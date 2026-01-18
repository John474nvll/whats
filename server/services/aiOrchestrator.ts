
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a response using AI.
 * @param userMessage The message from the user.
 * @param conversationHistory The history of the conversation.
 * @returns The AI-generated response string.
 */
export async function generateResponse(userMessage: string, conversationHistory: any[] = []): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not set. Returning a default message.');
    return "AI is not configured. You said: " + userMessage;
  }

  try {
    const systemPrompt = 'You are a helpful customer service assistant for a company called SocialHub. Your goal is to be friendly and professional. If you do not know the answer, say that you will ask a human agent.';

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({ 
        role: msg.sender === 'user' ? 'user' : 'assistant', 
        content: msg.content 
      })),
      { role: 'user', content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
        throw new Error('No response from OpenAI');
    }

    return response;

  } catch (error) {
    console.error('Failed to generate AI response:', error);
    return 'Sorry, I am having trouble connecting to the AI brain. Please try again later.';
  }
}
