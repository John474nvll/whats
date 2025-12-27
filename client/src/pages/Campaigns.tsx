import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Megaphone, Send, Sparkles, Instagram, Facebook, MessageCircle, Activity, Loader2, Zap } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Campaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Campaigns() {
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: accounts, isLoading: accountsLoading } = useQuery<any[]>({
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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,197,94,0.1)]">Master<span className="text-kiwi">Launch</span></h1>
          <p className="text-slate-400 font-bold text-xl tracking-tight">Orquestación centralizada de activos v2.0</p>
        </div>
      </div>

      <div className="section-divider" />

      <Card className="glass-card rounded-[3.5rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-kiwi/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <CardHeader>
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <Zap className="h-6 w-6 text-kiwi" />
            Configurar Lanzamiento Maestro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-kiwi/70">1. Seleccionar Plataforma</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['all', 'whatsapp', 'instagram', 'facebook'].map((p) => (
                    <Button
                      key={p}
                      variant="outline"
                      onClick={() => {
                        setPlatform(p);
                        setSelectedAccounts([]);
                      }}
                      className={`h-12 rounded-2xl border-border/50 capitalize font-bold transition-all ${
                        platform === p ? "bg-kiwi/20 border-kiwi text-kiwi shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "hover:bg-muted/10"
                      }`}
                    >
                      {p === 'all' ? 'Todas' : p}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-cyan-neon/70">2. Perfiles Administrativos</label>
                <div className="flex flex-wrap gap-2 p-4 bg-muted/5 border border-dashed border-border/30 rounded-[2rem] min-h-[5rem] content-start">
                   {filteredAccounts.length > 0 ? filteredAccounts.map(acc => (
                     <Badge 
                       key={acc.id}
                       onClick={() => setSelectedAccounts(prev => 
                         prev.includes(acc.id) ? prev.filter(id => id !== acc.id) : [...prev, acc.id]
                       )}
                       className={`rounded-full px-4 py-2 cursor-pointer transition-all border font-bold text-xs flex items-center gap-2 ${
                         selectedAccounts.includes(acc.id) 
                         ? "bg-kiwi text-black border-kiwi scale-105 shadow-lg shadow-kiwi/20" 
                         : "bg-muted/20 text-muted-foreground border-transparent hover:bg-muted/30"
                       }`}
                     >
                       {acc.platform === 'instagram' && <Instagram className="h-3 w-3" />}
                       {acc.platform === 'facebook' && <Facebook className="h-3 w-3" />}
                       {acc.platform === 'whatsapp' && <MessageCircle className="h-3 w-3" />}
                       {acc.accountName}
                     </Badge>
                   )) : (
                     <p className="text-xs text-muted-foreground italic p-2">No hay cuentas vinculadas en esta plataforma.</p>
                   )}
                </div>
              </div>
           </div>

           <div className="space-y-3">
             <label className="text-xs font-black uppercase tracking-[0.2em] text-raspberry/70">3. Contenido de la Campaña (Herramientas IA)</label>
             <Textarea 
               placeholder="Define el mensaje maestro que se aplicará a todas las cuentas seleccionadas..."
               className="rounded-[2rem] bg-muted/10 border-border/50 min-h-[150px] p-6 text-lg focus:ring-kiwi/30"
               id="campaign-content"
             />
           </div>

           <Button 
             onClick={() => {
               const content = (document.getElementById('campaign-content') as HTMLTextAreaElement).value;
               createCampaign.mutate({
                 name: "Orquestación Centralizada " + new Date().toLocaleTimeString(),
                 platform,
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
                 <Send className="h-6 w-6 mr-3" /> Aplicar Herramientas a {selectedAccounts.length} Cuentas
               </>
             )}
           </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <h2 className="text-2xl font-black col-span-full flex items-center gap-2 text-foreground">
          <Sparkles className="h-6 w-6 text-kiwi" />
          Control de Ejecución en Tiempo Real
        </h2>
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="glass-card rounded-[2rem] overflow-hidden border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tight">{campaign.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-cyan-neon text-black rounded-full px-3">{campaign.status}</Badge>
                  {campaign.aiGenerated && (
                    <Badge variant="outline" className="border-raspberry text-raspberry rounded-full px-3 flex gap-1 items-center">
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
              <div className="p-4 rounded-3xl bg-muted/20 border border-white/5 italic text-muted-foreground">
                "{campaign.content}"
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full bg-whatsapp border-2 border-background flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-instagram border-2 border-background flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-facebook border-2 border-background flex items-center justify-center">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                </div>
                <Button className="rounded-full bg-raspberry hover:bg-raspberry/90 px-6 font-bold shadow-lg shadow-raspberry/20">
                  Ver Métricas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
