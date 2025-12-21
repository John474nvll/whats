import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface Platform {
  name: string;
  icon: any;
  color: string;
  bgColor: string;
}

const platforms: Record<string, Platform> = {
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  whatsapp: {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
};

export function PlatformIntegration() {
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const handleConnect = async (platformKey: string) => {
    if (!tokens[platformKey]) return;

    setLoading(true);
    try {
      const response = await fetch("/api/platforms/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformKey,
          accessToken: tokens[platformKey],
        }),
      });

      if (response.ok) {
        setConnected({ ...connected, [platformKey]: true });
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Conectar Plataformas</h3>
        <p className="text-muted-foreground text-sm">
          Integra tus redes sociales para comenzar a gestionar mensajes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(platforms).map(([key, platform], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`p-6 ${platform.bgColor} border-2 border-transparent hover:border-primary/50 transition-all`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <platform.icon className={`h-8 w-8 ${platform.color}`} />
                  <div>
                    <h4 className="font-bold">{platform.name}</h4>
                    {connected[key] && (
                      <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Conectado
                      </div>
                    )}
                  </div>
                </div>
                {connected[key] && (
                  <Badge variant="default" className="bg-green-500">
                    Activo
                  </Badge>
                )}
              </div>

              {!connected[key] && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Access Token
                    </label>
                    <Input
                      type="password"
                      placeholder="Ingresa tu access token"
                      value={tokens[key] || ""}
                      onChange={(e) =>
                        setTokens({ ...tokens, [key]: e.target.value })
                      }
                      className="text-xs"
                      data-testid={`input-token-${key}`}
                    />
                  </div>
                  <Button
                    onClick={() => handleConnect(key)}
                    disabled={loading || !tokens[key]}
                    className="w-full text-xs"
                    data-testid={`button-connect-${key}`}
                  >
                    {loading ? "Conectando..." : "Conectar"}
                  </Button>
                </div>
              )}

              {connected[key] && (
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  data-testid={`button-disconnect-${key}`}
                >
                  Desconectar
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-400">
              Cómo obtener tus Access Tokens
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-600 dark:text-amber-300">
              <li>
                • <strong>Instagram/Facebook:</strong> Meta Developers Console
              </li>
              <li>
                • <strong>WhatsApp:</strong> WhatsApp Business Platform
              </li>
              <li>• Asegúrate de que los tokens tengan permisos de lectura</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
