import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Video,
  Megaphone,
  GitFork,
  ShoppingBag,
  Link2,
  Trash2,
  Activity,
  Copy,
  TrendingUp,
  Package,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type {
  SocialAccount,
  ChannelConfig,
  Campaign,
  SalesFunnel,
  Product,
  CustomLink,
} from '@shared/schema';

const PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: MessageSquare,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    id: 'instagram',
    name: 'Instagram Business',
    icon: Instagram,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    id: 'facebook',
    name: 'Facebook Pages',
    icon: Facebook,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    id: 'tiktok',
    name: 'TikTok Business',
    icon: Video,
    color: 'text-slate-100',
    bg: 'bg-white/5',
    border: 'border-white/10',
  },
];

export default function AccountLinks() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: accounts = [] } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts/demo-user'],
  });

  const { data: configs = [] } = useQuery<ChannelConfig[]>({
    queryKey: ['/api/channels'],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const { data: funnels = [] } = useQuery<SalesFunnel[]>({
    queryKey: ['/api/funnels'],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: links = [] } = useQuery<CustomLink[]>({
    queryKey: ['/api/links'],
  });

  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      const res = await apiRequest('POST', '/api/social-accounts/connect', {
        platform,
        accessToken: `demo_token_${Math.random().toString(36).substring(7)}`,
        platformId: `demo_id_${Math.random().toString(36).substring(7)}`,
        status: 'active',
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/social-accounts/demo-user'],
      });
      toast({
        title: 'Cuenta vinculada',
        description: 'La plataforma se ha conectado correctamente.',
      });
    },
  });

  const renderPlatformSection = (platformId: string) => {
    const platform = PLATFORMS.find((p) => p.id === platformId);
    const account = accounts.find((a) => a.platform === platformId);
    const config = configs.find((c) => c.platform === platformId);

    // Filters for specific platform
    const platformCampaigns = campaigns.filter(
      (c) => c.platform === platformId || c.platform === 'all',
    );
    const platformFunnels = funnels.filter((f) =>
      f.steps.some((s: any) => s.platform === platformId),
    );
    const platformLinks = links.filter((l) => l.platform === platformId);

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
                    <span className="text-2xl font-black text-kiwi uppercase">
                      Conectado
                    </span>
                    <Badge className="bg-kiwi/20 text-kiwi border-none">
                      API v2.4
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Plataforma:{' '}
                    <span className="text-white font-bold">
                      {account.platform}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-2xl font-black text-red-500 uppercase">
                    Desconectado
                  </span>
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
                <Badge variant="outline" className="border-white/10">
                  {config ? 'Activo' : 'Standard'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Orchestrator</span>
                <Badge variant="outline" className="border-white/10">
                  Master
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Actividad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Campañas</span>
                <span className="text-kiwi font-bold">
                  {platformCampaigns.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Embudos</span>
                <span className="text-cyan-neon font-bold">
                  {platformFunnels.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="bg-slate-900/60 p-1 rounded-2xl border border-white/5">
            <TabsTrigger
              value="modules"
              className="rounded-xl data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold text-xs uppercase"
            >
              Módulos
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="rounded-xl data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold text-xs uppercase"
            >
              Contenido
            </TabsTrigger>
            <TabsTrigger
              value="automation"
              className="rounded-xl data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold text-xs uppercase"
            >
              Automatización
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="modules"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-kiwi" /> Campañas Activas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {platformCampaigns.length > 0 ? (
                  platformCampaigns.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-white/5 flex justify-between items-center"
                    >
                      <span className="text-xs font-bold truncate pr-4">
                        {c.name}
                      </span>
                      <Badge className="bg-kiwi/20 text-kiwi text-[9px] uppercase">
                        {c.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No hay campañas para esta plataforma.
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-white/10 hover:bg-kiwi/10 hover:border-kiwi/20 text-xs font-bold"
                  asChild
                >
                  <a href="/campaigns">Gestionar Campañas</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <GitFork className="w-5 h-5 text-cyan-neon" /> Embudos
                  (Funnels)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {platformFunnels.length > 0 ? (
                  platformFunnels.slice(0, 3).map((f) => (
                    <div
                      key={f.id}
                      className="p-3 rounded-xl bg-white/5 flex justify-between items-center"
                    >
                      <span className="text-xs font-bold truncate pr-4">
                        {f.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase border-white/10 text-slate-400"
                      >
                        {f.isActive ? 'Activo' : 'Pausa'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No hay embudos vinculados.
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-white/10 hover:bg-cyan-neon/10 hover:border-cyan-neon/20 text-xs font-bold"
                  asChild
                >
                  <a href="/funnels">Constructor de Embudos</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="content"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-piña" /> Productos
                  Destacados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.length > 0 ? (
                  products.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-white/5 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-3 h-3 text-piña" />
                        <span className="text-xs font-bold">{p.name}</span>
                      </div>
                      <span className="text-xs font-black text-piña">
                        ${(p.price / 100).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Catálogo vacío.
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-white/10 hover:bg-piña/10 hover:border-piña/20 text-xs font-bold"
                  asChild
                >
                  <a href="/products">Ver Catálogo</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-cyan-neon" /> Tracking Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {platformLinks.length > 0 ? (
                  platformLinks.slice(0, 3).map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-xl bg-white/5 flex justify-between items-center"
                    >
                      <span className="text-xs font-bold truncate pr-4">
                        {l.originalUrl}
                      </span>
                      <Badge className="bg-cyan-neon/20 text-cyan-neon text-[9px] font-black">
                        {l.clicks} CLICS
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No hay links para esta red.
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-white/10 hover:bg-cyan-neon/10 hover:border-cyan-neon/20 text-xs font-bold"
                  asChild
                >
                  <a href="/links">Generar Links</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-white">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">
            Plataformas <span className="text-kiwi">Multicanal</span>
          </h1>
          <p className="text-slate-400 italic">Control centralizado v3.1</p>
        </div>
      </header>

      <Tabs
        defaultValue="overview"
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="bg-slate-900/60 p-1 rounded-full border border-white/5 flex-wrap h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-full px-6 data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold uppercase text-[10px] tracking-widest transition-all"
          >
            Dashboard Global
          </TabsTrigger>
          {PLATFORMS.map((p) => (
            <TabsTrigger
              key={p.id}
              value={p.id}
              className="rounded-full px-6 data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold uppercase text-[10px] tracking-widest transition-all gap-2"
            >
              <p.icon className="w-3 h-3" /> {p.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORMS.map((p) => {
              const account = accounts.find((a) => a.platform === p.id);
              const platformCampaigns = campaigns.filter(
                (c) => c.platform === p.id,
              );
              return (
                <Card
                  key={p.id}
                  className={`bg-slate-900/40 border-white/5 rounded-[2.5rem] overflow-hidden hover-elevate transition-all group cursor-pointer ${activeTab === p.id ? 'ring-2 ring-kiwi' : ''}`}
                  onClick={() => setActiveTab(p.id)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`p-4 rounded-3xl ${p.bg} ${p.color}`}>
                        <p.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      </div>
                      <Badge
                        className={
                          account
                            ? 'bg-kiwi text-black'
                            : 'bg-red-500/20 text-red-500 border-none'
                        }
                      >
                        {account ? 'ONLINE' : 'OFFLINE'}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Activity className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {platformCampaigns.length} Campañas activas
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {PLATFORMS.map((p) => (
          <TabsContent key={p.id} value={p.id} className="mt-0">
            {renderPlatformSection(p.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
