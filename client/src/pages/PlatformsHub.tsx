import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { MessageCircle, Send, Zap, CheckCircle2, Instagram, Facebook, Smartphone, AlertCircle, Loader2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: Smartphone,
};

const platformColors: Record<string, { color: string, bg: string, border: string, text: string }> = {
  instagram: { color: "bg-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400" },
  facebook: { color: "bg-blue-600", bg: "bg-blue-600/10", border: "border-blue-600/20", text: "text-blue-400" },
  whatsapp: { color: "bg-green-500", bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400" },
};

export default function PlatformsHub() {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<"whatsapp" | "instagram" | "facebook">("whatsapp");
  const [recipientId, setRecipientId] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [connecting, setConnecting] = useState<string | null>(null);

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["/api/platforms/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/platforms/accounts");
      return res.json();
    },
  });

  const connectedPlatforms = accounts
    ?.map((acc: any) => acc.platform)
    .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index) || [];

  const connectWhatsAppMutation = useMutation({
    mutationFn: async ({ phoneNumber }: { phoneNumber: string }) => {
      const res = await apiRequest("POST", "/api/unified-platforms/connect-whatsapp", {
        phoneNumber,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platforms/accounts"] });
      toast({ title: "WhatsApp Conectado", description: "Tu número ha sido vinculado con éxito." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error al conectar WhatsApp", variant: "destructive" });
    },
    onSettled: () => setConnecting(null),
  });

  const disconnectMutation = useMutation({
    mutationFn: async (accountId: number) => {
      const res = await apiRequest("DELETE", `/api/platforms/disconnect/${accountId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/platforms/accounts"] });
      toast({ title: "Plataforma Desconectada", description: "La cuenta ha sido desvinculada." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo desconectar la plataforma", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <header className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Plataformas <span className="text-neon-cyan">Unificadas</span>
          </h1>
          <p className="text-xl text-silver-gray font-medium tracking-tight max-w-2xl">
            Gestiona tus canales de comunicación en una sola interfaz neuronal con un toque cyberpunk.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[3rem] bg-slate-900/40 border-white/5 backdrop-blur-3xl p-8 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-white">Gestión de Cuentas</h2>
                  <p className="text-silver-gray font-medium">Administra tus perfiles vinculados.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accountsLoading ? (
                  <div className="col-span-2 py-10 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
                  </div>
                ) : accounts?.map((account: any) => (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-[2rem] bg-black/40 border border-white/5 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${platformColors[account.platform]?.bg || 'bg-white/5'} ${platformColors[account.platform]?.text || 'text-white'}`}>
                          {(() => {
                            const PlatformIcon = platformIcons[account.platform];
                            return PlatformIcon ? <PlatformIcon className="h-5 w-5" /> : null;
                          })()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white capitalize">{account.accountName}</h3>
                          <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-white/5 text-slate-500 mt-1">
                            {account.platform}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                        <span className="text-[10px] font-black text-neon-cyan uppercase tracking-widest">Activo</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button 
                        variant="destructive" 
                        className="w-full h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20"
                        onClick={() => disconnectMutation.mutate(account.id)}
                        disabled={disconnectMutation.isPending}
                      >
                        {disconnectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><XCircle className="mr-2 h-4 w-4" />Desconectar</>}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["whatsapp", "instagram", "facebook"].map((platform) => {
                const Icon = platformIcons[platform];
                const isConnected = connectedPlatforms.includes(platform);
                const colors = platformColors[platform];
                
                return (
                  <Card key={platform} className={`group relative overflow-hidden bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2rem] transition-all duration-500 hover:scale-[1.02] ${isConnected ? "border-neon-cyan/20 shadow-[0_20px_40px_rgba(0,255,255,0.1)]" : "hover:border-white/10"}`}>
                    <CardHeader className="relative z-10 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${colors.bg} ${colors.text} shadow-xl`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {isConnected ? (
                          <Badge className="bg-neon-cyan text-black font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full shadow-lg shadow-neon-cyan/20">
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-white/10 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                            Off
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-black capitalize text-white">{platform}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 p-6 pt-0 space-y-4">
                      {!isConnected && platform === 'whatsapp' && (
                        <div className="space-y-4">
                          <Input
                            placeholder="Número de WhatsApp"
                            className="bg-black/40 border-white/5 rounded-xl h-11 text-xs focus:border-neon-cyan/50"
                            value={tokens[platform] || ""}
                            onChange={(e) => setTokens({ ...tokens, [platform]: e.target.value })}
                          />
                          <Button 
                            className="w-full bg-white text-black font-black h-11 rounded-xl hover:bg-white/90 active:scale-95 transition-all text-xs uppercase tracking-widest"
                            onClick={() => {
                              setConnecting(platform);
                              connectWhatsAppMutation.mutate({ phoneNumber: tokens[platform] });
                            }}
                            disabled={!tokens[platform] || connecting === platform}
                          >
                            {connecting === platform ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vincular Número"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <aside className="space-y-8">
            <Card className="rounded-[2.5rem] bg-gold-accent/10 border-gold-accent/20 backdrop-blur-3xl overflow-hidden group">
              <CardHeader className="relative z-10 p-6">
                <CardTitle className="text-xl font-black flex items-center gap-3 text-gold-accent">
                  <AlertCircle className="h-6 w-6" />
                  Guía Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 p-6 pt-0 space-y-4">
                <p className="text-xs text-silver-gray leading-relaxed">
                  Para conectar Instagram y Facebook, necesitarás obtener tokens de acceso desde la consola de desarrolladores de Meta.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
