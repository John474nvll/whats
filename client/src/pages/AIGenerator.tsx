import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, RefreshCw, Wand2, Sparkles, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AIGenerator() {
  const [contentType, setContentType] = useState<"post" | "caption" | "message" | "image">("post");
  const [topic, setTopic] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({ title: "Error", description: "Por favor ingresa un tema" });
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/ai/generate-smart-content", {
        type: contentType,
        topic,
        includeInventory: true
      });
      const data = await res.json();
      setGenerated(data.generated);
      toast({ title: "Éxito", description: "Contenido generado con datos reales" });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con el orquestador de IA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    toast({ title: "Copied", description: "Content copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 relative z-10">
          <div className="space-y-2">
            <h1 className="text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              AI<span className="text-kiwi">Gen</span>
            </h1>
            <p className="text-slate-400 font-bold text-xl tracking-tight">Generación neuronal de contenido v2.0</p>
          </div>
        </div>

        <div className="section-divider" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Panel */}
          <Card className="glass-card rounded-[3rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl p-4 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-kiwi/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-kiwi text-black shadow-lg shadow-kiwi/20">
                  <Wand2 className="h-6 w-6" />
                </div>
                Configurar Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-kiwi/70 ml-2">1. Tipo de Contenido</label>
                <div className="flex flex-wrap gap-2">
                  {["post", "caption", "message", "image"].map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      onClick={() => setContentType(type as any)}
                      className={`h-12 px-6 rounded-2xl border-white/5 font-bold transition-all uppercase text-xs tracking-widest ${
                        contentType === type ? "bg-kiwi text-black border-kiwi shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-cyan-neon/70 ml-2">2. Tema o Instrucción</label>
                <Input
                  placeholder="¿Sobre qué quieres que escriba hoy?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-16 rounded-[1.5rem] bg-white/5 border-white/5 focus:border-kiwi/50 focus:ring-kiwi/20 text-white font-bold p-6 text-lg"
                />
              </div>

              <Button
                onClick={generateContent}
                disabled={loading}
                className="w-full h-16 rounded-[2rem] bg-kiwi text-black font-black text-xl hover:bg-kiwi/90 shadow-[0_20px_40px_rgba(34,197,94,0.2)] transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <>
                    GENERAR AHORA
                    <Zap className="ml-3 h-6 w-6" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card className="glass-card rounded-[3rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl p-4 relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-black flex items-center justify-between">
                <span>Resultado Neuronal</span>
                {generated && (
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setGenerated("")} className="rounded-full hover:bg-white/10 no-default-hover-elevate">
                      <RefreshCw className="h-5 w-5 text-slate-400" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={copyToClipboard} className="rounded-full hover:bg-kiwi/20 text-kiwi no-default-hover-elevate">
                      <Copy className="h-5 w-5" />
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
                  className="min-h-[350px] rounded-[1.5rem] bg-black/40 border-white/5 p-8 text-lg font-medium leading-relaxed resize-none focus:ring-kiwi/20"
                />
              ) : (
                <div className="h-[350px] flex flex-col items-center justify-center text-slate-600 space-y-4 border-2 border-dashed border-white/5 rounded-[1.5rem]">
                  <div className="p-4 rounded-full bg-white/5">
                    <Sparkles className="h-10 w-10 opacity-20" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Esperando instrucciones...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
