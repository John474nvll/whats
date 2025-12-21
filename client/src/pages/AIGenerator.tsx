import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, RefreshCw, Wand2 } from "lucide-react";

export default function AIGenerator() {
  const [contentType, setContentType] = useState<"post" | "caption" | "message">("post");
  const [topic, setTopic] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({ title: "Error", description: "Please enter a topic" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/conversations/1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `Generate a ${contentType} about: ${topic}. Keep it concise and engaging.`,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      let content = "";
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) content += data.content;
            } catch {}
          }
        }
      }

      setGenerated(content);
      toast({ title: "Success", description: "Content generated!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate content" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    toast({ title: "Copied", description: "Content copied to clipboard" });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">AI Content Generator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generate Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <div className="flex gap-2 mt-2">
                {["post", "caption", "message"].map((type) => (
                  <Button
                    key={type}
                    variant={contentType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setContentType(type as any)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Topic or Prompt</label>
              <Input
                placeholder="What should I write about?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Content</span>
              {generated && (
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => setGenerated("")}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generated ? (
              <Textarea
                value={generated}
                onChange={(e) => setGenerated(e.target.value)}
                className="min-h-[300px] resize-none"
                readOnly={false}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Generated content will appear here...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
