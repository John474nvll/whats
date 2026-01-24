import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, MessageSquare, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export function AIWidgets() {
  const widgets = [
    {
      icon: Wand2,
      title: "Generador de Contenido",
      description: "Crea contenido de calidad con IA",
      color: "bg-purple-500",
    },
    {
      icon: MessageSquare,
      title: "Respuestas Inteligentes",
      description: "Genera respuestas automáticas",
      color: "bg-blue-500",
    },
    {
      icon: ImageIcon,
      title: "Generador de Imágenes",
      description: "Crea imágenes con IA",
      color: "bg-pink-500",
    },
    {
      icon: Sparkles,
      title: "Análisis de Sentimiento",
      description: "Analiza el tono de mensajes",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {widgets.map((widget, idx) => (
        <motion.div
          key={widget.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${widget.color} text-white w-fit`}>
                <widget.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">{widget.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {widget.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  data-testid={`button-widget-${widget.title}`}
                >
                  Usar
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
