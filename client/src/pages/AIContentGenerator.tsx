import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AIContentGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "facebook" | "whatsapp">("instagram");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform }),
      });

      const data = await response.json();
      setGenerated(data.content);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Generador de Contenido con IA</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Plataforma</label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Tema o Descripción
            </label>
            <Input
              placeholder="Ej: Nuevo producto de moda sostenible..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              data-testid="input-ai-topic"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
            data-testid="button-generate-content"
          >
            {loading ? (
              "Generando..."
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Contenido
              </>
            )}
          </Button>
        </div>
      </Card>

      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-accent/5 border-accent/20">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold">Contenido Generado</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                data-testid="button-copy-content"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={generated}
              readOnly
              className="min-h-[120px]"
              data-testid="textarea-generated-content"
            />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
