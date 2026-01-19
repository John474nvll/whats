import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Megaphone, Send, Sparkles, Instagram, Facebook, MessageCircle, Activity, Loader2, Zap, Phone, LayoutDashboard } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Campaign, SocialAccount } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      toast({ title: "Campaña iniciada", description: "Tu campaña multicanal está en marcha." });
      setSelectedAccounts([]);
      const contentArea = document.getElementById('campaign-content') as HTMLTextAreaElement;
      if (contentArea) contentArea.value = "";
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

  const filteredAccounts = accounts?.filter(acc => platform === "all" || acc.platform === platform) || [];

  if (campaignsLoading || accountsLoading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin h-8 w-8 border-4 border-kiwi border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,197,94,0.1)]">Marketing<span className="text-kiwi">Studio</span></h1>
          <p className="text-slate-400 font-bold text-lg sm:text-xl tracking-tight">Centro de Orquestación y WhatsApp Business v3.0</p>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-2xl">
          <TabsTrigger value="campaigns" className="rounded-xl data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold">
            <Megaphone className="w-4 h-4 mr-2" /> Campañas
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="rounded-xl data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold">
            <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Business
          </TabsTrigger>
          <TabsTrigger value="automation" className="rounded-xl data-[state=active]:bg-kiwi data-[state=active]:text-black font-bold">
            <Zap className="w-4 h-4 mr-2" /> Automatización
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-8 outline-none">
          <Card className="rounded-[2rem] sm:rounded-[3.5rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-kiwi/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <CardHeader>
              <CardTitle className="text-2xl font-black flex items-center gap-3 text-white">
                <Zap className="h-6 w-6 text-kiwi" />
                Configurar Lanzamiento Maestro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-kiwi/70">1. Seleccionar Plataforma</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['all', 'whatsapp', 'instagram', 'facebook'].map((p) => (
                        <Button
                          key={p}
                          variant="outline"
                          onClick={() => {
                            setPlatform(p);
                            setSelectedAccounts([]);
                          }}
                          className={`h-12 rounded-2xl border-white/10 capitalize font-bold transition-all ${
                            platform === p ? "bg-kiwi/20 border-kiwi text-kiwi shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "hover:bg-white/5 text-slate-400"
                          }`}
                        >
                          {p === 'all' ? 'Todas' : p}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-cyan-neon/70">2. Perfiles Administrativos</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-dashed border-white/10 rounded-[2rem] min-h-[5rem] content-start">
                       {filteredAccounts.length > 0 ? filteredAccounts.map(acc => (
                         <Badge 
                           key={acc.id}
                           onClick={() => setSelectedAccounts(prev => 
                             prev.includes(acc.id) ? prev.filter(id => id !== acc.id) : [...prev, acc.id]
                           )}
                           className={`rounded-full px-4 py-2 cursor-pointer transition-all border font-bold text-xs flex items-center gap-2 ${
                             selectedAccounts.includes(acc.id) 
                             ? "bg-kiwi text-black border-kiwi scale-105 shadow-lg shadow-kiwi/20" 
                             : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                           }`}
                         >
                           {acc.platform === 'instagram' && <Instagram className="h-3 w-3" />}
                           {acc.platform === 'facebook' && <Facebook className="h-3 w-3" />}
                           {acc.platform === 'whatsapp' && <MessageCircle className="h-3 w-3" />}
                           {acc.platform} (ID: {acc.id})
                         </Badge>
                       )) : (
                         <p className="text-xs text-slate-500 italic p-2">No hay cuentas vinculadas en esta plataforma.</p>
                       )}
                    </div>
                  </div>
               </div>

               <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-[0.2em] text-raspberry/70">3. Contenido de la Campaña (Herramientas IA)</label>
                 <Textarea 
                   placeholder="Define el mensaje maestro que se aplicará a todas las cuentas seleccionadas..."
                   className="rounded-[2rem] bg-white/5 border-white/10 min-h-[150px] p-6 text-lg focus:ring-kiwi/30 text-white"
                   id="campaign-content"
                 />
               </div>

               <Button 
                 onClick={() => {
                   const content = (document.getElementById('campaign-content') as HTMLTextAreaElement).value;
                   createCampaign.mutate({
                     name: "Campaña " + new Date().toLocaleTimeString(),
                     type: "marketing",
                     content,
                     status: "active",
                     aiGenerated: true
                   });
                 }}
                 disabled={selectedAccounts.length === 0 || createCampaign.isPending}
                 className="w-full h-16 rounded-[2.5rem] bg-kiwi text-black font-black text-xl hover:bg-kiwi/90 shadow-[0_20px_40px_rgba(34,197,94,0.3)] transition-all active:scale-95 disabled:opacity-50"
               >
                 {createCampaign.isPending ? (
                   <Loader2 className="h-6 w-6 animate-spin" />
                 ) : (
                   <>
                     <Send className="h-6 w-6 mr-3" /> Lanzar en {selectedAccounts.length} Canales
                   </>
                 )}
               </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
            <h2 className="text-2xl font-black col-span-full flex items-center gap-2 text-white">
              <Activity className="h-6 w-6 text-kiwi" />
              Ejecuciones Activas
            </h2>
            {campaigns?.map((campaign) => (
              <Card key={campaign.id} className="rounded-[2rem] overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black tracking-tight text-white">{campaign.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className="bg-cyan-neon text-black rounded-full px-3 font-bold text-[10px]">{campaign.status}</Badge>
                      {campaign.aiGenerated && (
                        <Badge variant="outline" className="border-raspberry text-raspberry rounded-full px-3 flex gap-1 items-center text-[10px] font-bold">
                          <Sparkles className="h-3 w-3" /> IA
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => deleteCampaign.mutate(campaign.id)} className="rounded-full hover:bg-destructive/10 text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/5 italic text-slate-400 text-sm">
                    "{campaign.content}"
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="h-10 w-10 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-lg">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="h-10 w-10 rounded-full bg-pink-500 border-2 border-slate-900 flex items-center justify-center shadow-lg">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <Button className="rounded-full bg-white/10 text-white hover:bg-white/20 px-6 font-bold border border-white/10">
                      Ver Métricas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6 outline-none">
          <Card className="rounded-[2.5rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl p-8">
            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">WhatsApp Business Central</h2>
                <p className="text-slate-400 font-medium">Gestiona tu comunicación empresarial masiva y automatizada con la API oficial.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <Activity className="w-6 h-6 text-kiwi mx-auto" />
                  <p className="text-2xl font-black text-white">98%</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Entrega</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <Users className="w-6 h-6 text-cyan-neon mx-auto" />
                  <p className="text-2xl font-black text-white">1.2k</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Contactos</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <Phone className="w-6 h-6 text-raspberry mx-auto" />
                  <p className="text-2xl font-black text-white">15</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Plantillas</p>
                </div>
              </div>

              <Button className="w-full h-16 rounded-2xl bg-emerald-500 text-white font-black text-xl hover:bg-emerald-600 shadow-xl transition-all">
                Configurar Twilio / WhatsApp API
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="outline-none">
          <Card className="rounded-[2.5rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl p-8 text-center space-y-4">
            <Zap className="w-12 h-12 text-kiwi mx-auto opacity-20" />
            <h3 className="text-xl font-black text-white">Automatizaciones de Marketing</h3>
            <p className="text-slate-400">Configura disparadores automáticos basados en el comportamiento de tus leads en CRM.</p>
            <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5">Explorar Recetas</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
