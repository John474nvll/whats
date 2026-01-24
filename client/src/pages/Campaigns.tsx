import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Trash2, Megaphone, Send, Sparkles, Instagram, Facebook, MessageCircle, 
  Activity, Loader2, Zap, Phone, Users, Calendar, Clock, Copy, Edit2, 
  BarChart3, TrendingUp, Target, Eye, MousePointer, CheckCircle2, Pause, Play,
  FileText, Save, RefreshCw
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Campaign, SocialAccount } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const campaignTemplates = [
  { id: 1, name: "Bienvenida", content: "Hola {nombre}, gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros.", category: "onboarding" },
  { id: 2, name: "Promoción Flash", content: "Solo por hoy: 30% de descuento en todos nuestros productos. Usa el código FLASH30", category: "promo" },
  { id: 3, name: "Recordatorio", content: "Hola {nombre}, te recordamos que tienes un carrito pendiente. Completa tu compra hoy.", category: "reminder" },
  { id: 4, name: "Newsletter", content: "Las novedades de esta semana: nuevos productos, tips exclusivos y más.", category: "newsletter" },
];

const mockMetrics = {
  totalReach: 12500,
  totalClicks: 890,
  totalConversions: 156,
  avgEngagement: 7.2,
  topPlatform: "WhatsApp",
  recentGrowth: 23.5
};

export default function Campaigns() {
  const { toast } = useToast();
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: accounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts"],
  });

  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [platform, setPlatform] = useState<string>("all");
  const [campaignName, setCampaignName] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof campaignTemplates[0] | null>(null);

  const createCampaign = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/campaigns", {
        ...data,
        targetAccountIds: selectedAccounts
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Campaña creada", description: isScheduled ? "Tu campaña está programada." : "Tu campaña está en marcha." });
      resetForm();
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Campaña eliminada" });
    },
  });

  const resetForm = () => {
    setSelectedAccounts([]);
    setCampaignName("");
    setCampaignContent("");
    setIsScheduled(false);
    setScheduleDate("");
    setScheduleTime("");
    setSelectedTemplate(null);
  };

  const applyTemplate = (template: typeof campaignTemplates[0]) => {
    setCampaignContent(template.content);
    setSelectedTemplate(template);
    setShowTemplates(false);
    toast({ title: "Plantilla aplicada", description: template.name });
  };

  const duplicateCampaign = (campaign: Campaign) => {
    setCampaignName(`${campaign.name} (Copia)`);
    setCampaignContent(campaign.content || "");
    toast({ title: "Campaña duplicada", description: "Edita y lanza la nueva versión." });
  };

  const filteredAccounts = accounts?.filter(acc => platform === "all" || acc.platform === platform) || [];

  if (campaignsLoading || accountsLoading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            Marketing<span className="text-primary">Studio</span>
          </h1>
          <p className="text-muted-foreground font-bold text-lg sm:text-xl tracking-tight">
            Centro de Orquestación Multicanal v3.1
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-white/10" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] })}>
            <RefreshCw className="w-4 h-4 mr-2" /> Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="rounded-2xl border-white/5 bg-slate-900/40 backdrop-blur p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{mockMetrics.totalReach.toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Alcance</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-white/5 bg-slate-900/40 backdrop-blur p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{mockMetrics.totalClicks}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clics</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-white/5 bg-slate-900/40 backdrop-blur p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{mockMetrics.totalConversions}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Conversiones</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-white/5 bg-slate-900/40 backdrop-blur p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{mockMetrics.avgEngagement}%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Engagement</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-white/5 bg-slate-900/40 backdrop-blur p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{mockMetrics.topPlatform}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Canal</p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-white/5 bg-slate-900/40 backdrop-blur p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">+{mockMetrics.recentGrowth}%</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Crecimiento</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-2xl">
          <TabsTrigger value="campaigns" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
            <Megaphone className="w-4 h-4 mr-2" /> Campañas
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
            <FileText className="w-4 h-4 mr-2" /> Plantillas
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
            <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Business
          </TabsTrigger>
          <TabsTrigger value="automation" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold">
            <Zap className="w-4 h-4 mr-2" /> Automatización
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-8 outline-none">
          <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <CardHeader>
              <CardTitle className="text-2xl font-black flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary" />
                  Nueva Campaña
                </div>
                <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-xl border-white/10 text-sm">
                      <FileText className="w-4 h-4 mr-2" /> Usar Plantilla
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-white/10 rounded-3xl max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black text-white">Plantillas de Campaña</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                      {campaignTemplates.map(template => (
                        <Card 
                          key={template.id}
                          onClick={() => applyTemplate(template)}
                          className="rounded-2xl border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02]"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-white">{template.name}</h4>
                            <Badge className="text-[10px] bg-primary/20 text-primary">{template.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.15em] text-primary/70">Nombre de Campaña</Label>
                    <Input 
                      placeholder="Ej: Campaña Black Friday 2024"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="rounded-xl bg-white/5 border-white/10 h-12 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.15em] text-primary/70">Plataformas</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['all', 'whatsapp', 'instagram', 'facebook'].map((p) => (
                        <Button
                          key={p}
                          variant="outline"
                          onClick={() => {
                            setPlatform(p);
                            setSelectedAccounts([]);
                          }}
                          className={`h-11 rounded-xl border-white/10 capitalize font-bold transition-all ${
                            platform === p ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "hover:bg-white/5 text-slate-400"
                          }`}
                        >
                          {p === 'all' && <Users className="w-4 h-4 mr-2" />}
                          {p === 'whatsapp' && <MessageCircle className="w-4 h-4 mr-2" />}
                          {p === 'instagram' && <Instagram className="w-4 h-4 mr-2" />}
                          {p === 'facebook' && <Facebook className="w-4 h-4 mr-2" />}
                          {p === 'all' ? 'Todas' : p}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-[0.15em] text-cyan-400/70">Cuentas Objetivo</Label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl min-h-[5rem] content-start">
                      {filteredAccounts.length > 0 ? filteredAccounts.map(acc => (
                        <Badge 
                          key={acc.id}
                          onClick={() => setSelectedAccounts(prev => 
                            prev.includes(acc.id) ? prev.filter(id => id !== acc.id) : [...prev, acc.id]
                          )}
                          className={`rounded-full px-4 py-2 cursor-pointer transition-all border font-bold text-xs flex items-center gap-2 ${
                            selectedAccounts.includes(acc.id) 
                            ? "bg-primary text-black border-primary scale-105 shadow-lg shadow-primary/20" 
                            : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                          }`}
                        >
                          {acc.platform === 'instagram' && <Instagram className="h-3 w-3" />}
                          {acc.platform === 'facebook' && <Facebook className="h-3 w-3" />}
                          {acc.platform === 'whatsapp' && <MessageCircle className="h-3 w-3" />}
                          {acc.platform} #{acc.id}
                        </Badge>
                      )) : (
                        <p className="text-xs text-slate-500 italic p-2">No hay cuentas vinculadas en esta plataforma.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-bold text-white text-sm">Programar Envío</p>
                        <p className="text-xs text-muted-foreground">Elige fecha y hora</p>
                      </div>
                    </div>
                    <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
                  </div>
                  
                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Fecha</Label>
                        <Input 
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="rounded-xl bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Hora</Label>
                        <Input 
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="rounded-xl bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black uppercase tracking-[0.15em] text-pink-400/70">Contenido del Mensaje</Label>
                  {selectedTemplate && (
                    <Badge className="bg-primary/20 text-primary text-xs">
                      Plantilla: {selectedTemplate.name}
                    </Badge>
                  )}
                </div>
                <Textarea 
                  placeholder="Escribe el mensaje que se enviará a todas las cuentas seleccionadas..."
                  value={campaignContent}
                  onChange={(e) => setCampaignContent(e.target.value)}
                  className="rounded-2xl bg-white/5 border-white/10 min-h-[120px] p-4 text-base focus:ring-primary/30 text-white resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Variables disponibles: {'{nombre}'}, {'{email}'}, {'{telefono}'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => {
                    createCampaign.mutate({
                      name: campaignName || "Campaña " + new Date().toLocaleTimeString(),
                      type: "marketing",
                      content: campaignContent,
                      status: isScheduled ? "scheduled" : "active",
                      aiGenerated: false,
                      scheduledAt: isScheduled && scheduleDate && scheduleTime 
                        ? new Date(`${scheduleDate}T${scheduleTime}`).getTime() 
                        : null
                    });
                  }}
                  disabled={selectedAccounts.length === 0 || !campaignContent || createCampaign.isPending}
                  className="flex-1 h-14 rounded-2xl bg-primary text-black font-black text-lg hover:bg-primary/90 shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 disabled:opacity-50"
                >
                  {createCampaign.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isScheduled ? (
                    <>
                      <Clock className="h-5 w-5 mr-2" /> Programar Campaña
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" /> Lanzar en {selectedAccounts.length} Canales
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={resetForm}
                  className="h-14 px-6 rounded-2xl border-white/10 text-slate-400 hover:bg-white/5"
                >
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-black flex items-center gap-2 text-white">
              <Activity className="h-6 w-6 text-primary" />
              Campañas ({campaigns?.length || 0})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns?.map((campaign) => (
                <Card key={campaign.id} className="rounded-[1.5rem] overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-xl group hover:border-primary/30 transition-all">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-black tracking-tight text-white">{campaign.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`rounded-full px-3 font-bold text-[10px] ${
                          campaign.status === 'active' ? 'bg-emerald-500 text-white' :
                          campaign.status === 'scheduled' ? 'bg-amber-500 text-black' :
                          campaign.status === 'paused' ? 'bg-slate-500 text-white' :
                          'bg-cyan-500 text-black'
                        }`}>
                          {campaign.status === 'active' && <Play className="w-3 h-3 mr-1" />}
                          {campaign.status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
                          {campaign.status === 'paused' && <Pause className="w-3 h-3 mr-1" />}
                          {campaign.status}
                        </Badge>
                        {campaign.aiGenerated && (
                          <Badge variant="outline" className="border-pink-500 text-pink-400 rounded-full px-3 flex gap-1 items-center text-[10px] font-bold">
                            <Sparkles className="h-3 w-3" /> IA
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => duplicateCampaign(campaign)}
                        className="rounded-full hover:bg-white/10 text-slate-400"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => deleteCampaign.mutate(campaign.id)} 
                        className="rounded-full hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-4">
                    {campaign.content && (
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-sm line-clamp-2">
                        "{campaign.content}"
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <p className="text-lg font-black text-white">{Math.floor(Math.random() * 1000) + 100}</p>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">Alcance</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <p className="text-lg font-black text-white">{Math.floor(Math.random() * 100) + 10}</p>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">Clics</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <p className="text-lg font-black text-white">{(Math.random() * 10 + 2).toFixed(1)}%</p>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">CTR</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-pink-500 border-2 border-slate-900 flex items-center justify-center">
                          <Instagram className="h-4 w-4 text-white" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center">
                          <Facebook className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <Button className="rounded-full bg-white/10 text-white hover:bg-white/20 px-4 py-2 text-sm font-bold border border-white/10">
                        <BarChart3 className="w-4 h-4 mr-2" /> Métricas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!campaigns || campaigns.length === 0) && (
                <Card className="rounded-[1.5rem] border-dashed border-2 border-white/10 bg-transparent col-span-full p-12 text-center">
                  <Megaphone className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white/40">No hay campañas aún</h3>
                  <p className="text-sm text-muted-foreground mt-2">Crea tu primera campaña para empezar a llegar a tu audiencia</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 outline-none">
          <Card className="rounded-[2rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white">Biblioteca de Plantillas</h2>
                <p className="text-muted-foreground">Plantillas reutilizables para tus campañas</p>
              </div>
              <Button className="rounded-xl bg-primary text-black font-bold">
                <Plus className="w-4 h-4 mr-2" /> Nueva Plantilla
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaignTemplates.map(template => (
                <Card 
                  key={template.id}
                  className="rounded-2xl border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{template.name}</h4>
                        <Badge className="text-[10px] bg-white/10 text-muted-foreground mt-1">{template.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-white/10">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{template.content}</p>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl border-white/10 text-sm"
                    onClick={() => applyTemplate(template)}
                  >
                    Usar Plantilla
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6 outline-none">
          <Card className="rounded-[2rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl p-8">
            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">WhatsApp Business Central</h2>
                <p className="text-muted-foreground font-medium">Gestiona tu comunicación empresarial masiva y automatizada con la API oficial.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <Activity className="w-6 h-6 text-primary mx-auto" />
                  <p className="text-2xl font-black text-white">98%</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Entrega</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <Users className="w-6 h-6 text-cyan-400 mx-auto" />
                  <p className="text-2xl font-black text-white">1.2k</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Contactos</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <Phone className="w-6 h-6 text-pink-400 mx-auto" />
                  <p className="text-2xl font-black text-white">15</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Plantillas</p>
                </div>
              </div>

              <Button className="w-full h-16 rounded-2xl bg-emerald-500 text-white font-black text-xl hover:bg-emerald-600 shadow-xl transition-all">
                Configurar WhatsApp Business API
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="outline-none space-y-6">
          <Card className="rounded-[2rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Zap className="w-7 h-7 text-primary" />
                  Automatizaciones
                </h2>
                <p className="text-muted-foreground">Flujos automáticos basados en comportamiento</p>
              </div>
              <Button className="rounded-xl bg-primary text-black font-bold">
                <Plus className="w-4 h-4 mr-2" /> Nueva Automatización
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Bienvenida Automática", trigger: "Nuevo contacto", actions: 2, status: "active" },
                { name: "Seguimiento Lead", trigger: "Sin respuesta 24h", actions: 3, status: "active" },
                { name: "Recordatorio Carrito", trigger: "Carrito abandonado", actions: 2, status: "paused" },
              ].map((auto, i) => (
                <Card key={i} className="rounded-2xl border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${auto.status === 'active' ? 'bg-emerald-500/20' : 'bg-slate-500/20'}`}>
                        <Zap className={`w-5 h-5 ${auto.status === 'active' ? 'text-emerald-400' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{auto.name}</h4>
                        <p className="text-xs text-muted-foreground">{auto.trigger}</p>
                      </div>
                    </div>
                    <Switch checked={auto.status === 'active'} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white/10 text-muted-foreground text-xs">{auto.actions} acciones</Badge>
                    <Button variant="ghost" className="text-xs text-primary hover:bg-primary/10">
                      Editar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
