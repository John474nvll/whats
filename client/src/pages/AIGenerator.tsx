import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Copy, RefreshCw, Wand2, Sparkles, Zap, 
  Image, MessageSquare, Hash, Send, Download,
  Instagram, Facebook, Smartphone, Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

type ContentType = "post" | "caption" | "message" | "story" | "ad" | "image";
type Platform = "instagram" | "facebook" | "whatsapp" | "multi";

interface GenerationHistory {
  id: string;
  prompt: string;
  content: string;
  type: ContentType;
  isImage: boolean;
  timestamp: string;
}

export default function AIGenerator() {
  const [contentType, setContentType] = useState<ContentType>("post");
  const [platform, setPlatform] = useState<Platform>("multi");
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GenerationHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const { toast } = useToast();

  const contentTypes = [
    { value: "post", label: "Post", icon: MessageSquare },
    { value: "caption", label: "Caption", icon: Hash },
    { value: "message", label: "Mensaje", icon: Send },
    { value: "story", label: "Story", icon: Sparkles },
    { value: "ad", label: "Anuncio", icon: Target },
    { value: "image", label: "Imagen", icon: Image },
  ];

  const platforms = [
    { value: "multi", label: "Multi-plataforma", icon: Zap },
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "whatsapp", label: "WhatsApp", icon: Smartphone },
  ];

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({ title: "Error", description: "Por favor ingresa un tema o instruccion" });
      return;
    }

    setLoading(true);
    setGeneratedContent(null);

    try {
      const res = await apiRequest("POST", "/api/ai/generate", {
        prompt: topic,
        type: contentType,
        platform: platform !== "multi" ? platform : undefined,
        context
      });

      const data: GenerationHistory = await res.json();
      setGeneratedContent(data);
      setHistory(prev => [data, ...prev].slice(0, 20));
      toast({ title: "Contenido Generado", description: "Tu contenido está listo para usar" });

    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error de Generación",
        description: "No se pudo generar el contenido. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Contenido copiado al portapapeles" });
  };

  const clearResult = () => {
    setGeneratedContent(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white">
                  AI<span className="text-primary">Gen</span>
                </h1>
                <p className="text-slate-400 text-sm">Motor de contenido inteligente v3.2</p>
              </div>
            </div>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Powered by GPT-4o
          </Badge>
        </header>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="bg-slate-900/60 p-1 rounded-2xl border border-white/5">
            <TabsTrigger value="generator" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
              Generador
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
              Historial ({history.length})
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
              Plantillas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/40 border-white/5 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Configuracion
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipo de Contenido</label>
                    <div className="grid grid-cols-3 gap-2">
                      {contentTypes.map((type) => (
                        <Button
                          key={type.value}
                          variant="outline"
                          onClick={() => setContentType(type.value as ContentType)}
                          className={`h-auto py-3 flex flex-col gap-1 rounded-xl border-white/10 transition-all ${
                            contentType === type.value 
                              ? "bg-primary text-black border-primary" 
                              : "bg-white/5 hover:bg-white/10"
                          }`}
                          data-testid={`button-type-${type.value}`}
                        >
                          <type.icon className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase">{type.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plataforma Destino</label>
                    <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                      <SelectTrigger className="bg-slate-800 border-white/10 rounded-xl h-12" data-testid="select-platform">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            <div className="flex items-center gap-2">
                              <p.icon className="h-4 w-4" />
                              {p.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {contentType === "image" ? "Descripcion de la imagen" : "Tema o Instruccion"}
                    </label>
                    <Textarea
                      placeholder={contentType === "image" 
                        ? "Describe la imagen que quieres generar con detalle..."
                        : "Describe el contenido que necesitas generar..."
                      }
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-[120px] bg-slate-800 border-white/10 rounded-xl resize-none"
                      data-testid="input-topic"
                    />
                  </div>

                   <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contexto Adicional (Opcional)
                    </label>
                    <Textarea
                      placeholder="Ej: Tono amigable, para un público joven..."
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="min-h-[60px] bg-slate-800 border-white/10 rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    onClick={generateContent}
                    disabled={loading || !topic.trim()}
                    className="w-full h-14 rounded-2xl bg-primary text-black font-black text-lg hover:bg-primary/90 disabled:opacity-50"
                    data-testid="button-generate"
                  >
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        {contentType === "image" ? "Generar Imagen" : "Generar Contenido"}
                        <Zap className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-white/5 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Resultado</CardTitle>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={clearResult}
                        className="rounded-full"
                        data-testid="button-clear"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      {!generatedContent.isImage && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => copyToClipboard(generatedContent.content)}
                          className="rounded-full text-primary"
                          data-testid="button-copy"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[350px] flex flex-col items-center justify-center"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                          <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                        </div>
                        <p className="mt-4 text-slate-500 text-sm">Generando contenido...</p>
                      </motion.div>
                    ) : generatedContent ? (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {generatedContent.isImage ? (
                          <div className="space-y-4">
                            <img 
                              src={generatedContent.content} 
                              alt="Generated" 
                              className="w-full rounded-2xl"
                            />
                            <Button 
                              variant="outline" 
                              className="w-full rounded-xl"
                              onClick={() => window.open(generatedContent.content, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Descargar Imagen
                            </Button>
                          </div>
                        ) : (
                          <Textarea
                            value={generatedContent.content}
                            className="min-h-[350px] bg-slate-800/50 border-white/5 rounded-2xl resize-none text-base leading-relaxed"
                            data-testid="textarea-result"
                          />
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        className="h-[350px] flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-2xl"
                      >
                        <Sparkles className="h-12 w-12 mb-4 opacity-30" />
                        <p className="text-xs font-bold uppercase tracking-wider">Esperando instrucciones...</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-slate-900/40 border-white/5 rounded-3xl">
              <CardContent className="p-6">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No hay historial de generaciones</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div 
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] uppercase">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(item.content)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-slate-400 font-medium mb-1 line-clamp-1">{item.prompt}</p>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Promocion de Producto", topic: "Genera un post promocional para [producto] destacando sus beneficios principales", type: "post" },
                { title: "Historia Detras de Escenas", topic: "Crea contenido casual mostrando el proceso de trabajo en [negocio]", type: "story" },
                { title: "Anuncio con CTA", topic: "Escribe un anuncio persuasivo para [producto/servicio] con llamada a la accion clara", type: "ad" },
                { title: "Respuesta a Cliente", topic: "Genera una respuesta profesional y empatica para un cliente que pregunta sobre [tema]", type: "message" },
                { title: "Caption Engagement", topic: "Crea un caption que genere interaccion preguntando a la audiencia sobre [tema]", type: "caption" },
                { title: "Lanzamiento de Producto", topic: "Escribe un anuncio emocionante para el lanzamiento de [nuevo producto]", type: "post" },
              ].map((template, i) => (
                <Card 
                  key={i}
                  className="bg-slate-900/40 border-white/5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => {
                    setTopic(template.topic);
                    setContentType(template.type as ContentType);
                  }}
                >
                  <CardContent className="p-4">
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-2">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{template.topic}</p>
                    <Badge className="mt-3 text-[9px] uppercase" variant="outline">
                      {template.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
