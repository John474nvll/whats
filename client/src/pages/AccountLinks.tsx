import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Instagram, 
  Facebook, 
  MessageSquare, 
  Smartphone, 
  Globe, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Settings2, 
  Plus, 
  ExternalLink,
  MessageCircle,
  Video
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SocialAccount, ChannelConfig } from "@shared/schema";

const PLATFORMS = [
  { id: "whatsapp", name: "WhatsApp Business", icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
  { id: "instagram", name: "Instagram Business", icon: Instagram, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { id: "facebook", name: "Facebook Pages", icon: Facebook, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "tiktok", name: "TikTok Business", icon: Video, color: "text-slate-100", bg: "bg-white/5", border: "border-white/10" }
];

export default function AccountLinks() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: accounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts/demo-user"],
  });

  const { data: configs = [] } = useQuery<ChannelConfig[]>({
    queryKey: ["/api/channels"],
  });

  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      const res = await apiRequest("POST", "/api/social-accounts/connect", {
        platform,
        accessToken: `demo_token_${Math.random().toString(36).substring(7)}`,
        platformId: `demo_id_${Math.random().toString(36).substring(7)}`,
        status: "active"
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts/demo-user"] });
      toast({ title: "Cuenta vinculada", description: "La plataforma se ha conectado correctamente." });
    }
  });

  const renderPlatformSection = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    const account = accounts.find(a => a.platform === platformId);
    const config = configs.find(c => c.platform === platformId);

    if (!platform) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Estado de Conexión
              </CardTitle>
            </CardHeader>
            <CardContent>
              {account ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-kiwi uppercase">Conectado</span>
                    <Badge className="bg-kiwi/20 text-kiwi border-none">API v2.4</Badge>
                  </div>
                  <p className="text-xs text-slate-400">Plataforma: <span className="text-white font-bold">{account.platform}</span></p>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-2xl font-black text-red-500 uppercase">Desconectado</span>
                  <Button 
                    className="w-full rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    onClick={() => connectMutation.mutate(platformId)}
                  >
                    Vincular Ahora
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Configuración Canal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Canal IA</span>
                <Badge variant="outline" className="border-white/10">{config ? "Activo" : "Standard"}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Orchestrator</span>
                <Badge variant="outline" className="border-white/10">Master</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sync Interval</span>
                <span className="text-white font-mono">5m</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Métricas Hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Engagement</span>
                <span className="text-kiwi font-bold">+5.2%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Impacto</span>
                <span className="text-white font-bold">High</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader>
              <CardTitle>Módulos</CardTitle>
              <CardDescription>Funciones para {platform.name}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 rounded-2xl border-white/5 bg-white/5 flex flex-col gap-2 hover:bg-kiwi/10 hover:border-kiwi/20 group">
                <Zap className="w-6 h-6 text-kiwi group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase">Turbo Post</span>
              </Button>
              <Button variant="outline" className="h-24 rounded-2xl border-white/5 bg-white/5 flex flex-col gap-2 hover:bg-pink-500/10 hover:border-pink-500/20 group">
                <MessageCircle className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase">Smart Inbox</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-white">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">Plataformas <span className="text-kiwi">Multicanal</span></h1>
          <p className="text-slate-400 italic">Control centralizado v3.1</p>
        </div>
      </header>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-slate-900/60 p-1 rounded-full border border-white/5 flex-wrap h-auto">
          <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold uppercase text-[10px] tracking-widest transition-all">
            Dashboard Global
          </TabsTrigger>
          {PLATFORMS.map(p => (
            <TabsTrigger key={p.id} value={p.id} className="rounded-full px-6 data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold uppercase text-[10px] tracking-widest transition-all gap-2">
              <p.icon className="w-3 h-3" /> {p.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORMS.map(p => {
              const account = accounts.find(a => a.platform === p.id);
              return (
                <Card 
                  key={p.id} 
                  className={`bg-slate-900/40 border-white/5 rounded-[2.5rem] overflow-hidden hover-elevate transition-all group ${activeTab === p.id ? 'ring-2 ring-kiwi' : ''}`}
                  onClick={() => setActiveTab(p.id)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`p-4 rounded-3xl ${p.bg} ${p.color}`}>
                        <p.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      </div>
                      <Badge className={account ? "bg-kiwi text-black" : "bg-red-500/20 text-red-500 border-none"}>
                        {account ? "ONLINE" : "OFFLINE"}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{p.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {account ? `Platform: ${account.platform}` : "Requiere vinculación"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {PLATFORMS.map(p => (
          <TabsContent key={p.id} value={p.id} className="mt-0">
            {renderPlatformSection(p.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
