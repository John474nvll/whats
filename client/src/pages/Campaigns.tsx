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
  const { toast } = useToast();
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
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,197,94,0.1)]">Marketing</h1>
          <p className="text-slate-400 font-bold text-lg sm:text-xl tracking-tight">Orquestación de Campañas Multicanal</p>
        </div>
      </div>

      <div className="border-b border-white/10" />

      <Card className="rounded-[2rem] border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-black flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            Nueva Campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-primary/70">1. Plataforma</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['all', 'whatsapp', 'instagram', 'facebook'].map((p) => (
                    <Button
                      key={p}
                      variant="outline"
                      onClick={() => {
                        setPlatform(p);
                        setSelectedAccounts([]);
                      }}
                      className={`h-12 rounded-xl border-white/10 capitalize font-bold transition-all ${
                        platform === p ? "bg-primary/20 border-primary text-primary" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {p === 'all' ? 'Todas' : p}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-blue-400/70">2. Cuentas</label>
                <div className="flex flex-wrap gap-2 p-3 bg-black/20 border border-dashed border-white/10 rounded-xl min-h-[4rem] content-start">
                   {filteredAccounts.length > 0 ? filteredAccounts.map(acc => (
                     <Badge 
                       key={acc.id}
                       onClick={() => setSelectedAccounts(prev => 
                         prev.includes(acc.id) ? prev.filter(id => id !== acc.id) : [...prev, acc.id]
                       )}
                       className={`rounded-full px-3 py-1 cursor-pointer transition-all border font-bold text-xs flex items-center gap-2 ${
                         selectedAccounts.includes(acc.id) 
                         ? "bg-primary text-black border-primary" 
                         : "bg-white/10 text-slate-300 border-transparent hover:bg-white/20"
                       }`}
                     >
                       {acc.platform === 'instagram' && <Instagram className="h-3 w-3" />}
                       {acc.platform === 'facebook' && <Facebook className="h-3 w-3" />}
                       {acc.platform === 'whatsapp' && <MessageCircle className="h-3 w-3" />}
                       {acc.name || `Cuenta ${acc.id}`}
                     </Badge>
                   )) : (
                     <p className="text-xs text-slate-500 italic p-2">No hay cuentas para esta plataforma.</p>
                   )}
                </div>
              </div>
           </div>

           <div className="space-y-3">
             <label className="text-xs font-black uppercase tracking-widest text-pink-400/70">3. Contenido</label>
             <Textarea 
               placeholder="Escribe el mensaje para tu campaña..."
               className="rounded-xl bg-black/20 border-white/10 min-h-[120px] p-4 text-base focus:ring-primary/30"
               id="campaign-content"
             />
           </div>

           <Button 
             onClick={() => {
               const content = (document.getElementById('campaign-content') as HTMLTextAreaElement).value;
               createCampaign.mutate({
                 name: "Campaña " + new Date().toLocaleDateString(),
                 platform,
                 content,
                 status: "active",
                 aiGenerated: false
               });
             }}
             disabled={selectedAccounts.length === 0 || createCampaign.isPending}
             className="w-full h-14 rounded-xl bg-primary text-black font-black text-lg hover:bg-primary/90 shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 disabled:opacity-50"
           >
             {createCampaign.isPending ? (
               <Loader2 className="h-6 w-6 animate-spin" />
             ) : (
               <>
                 <Send className="h-5 w-5 mr-3" /> Enviar a {selectedAccounts.length} Cuenta(s)
               </>
             )}
           </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        <h2 className="text-xl font-black col-span-full flex items-center gap-2 text-white">
          <Activity className="h-5 w-5 text-primary" />
          Campañas Activas
        </h2>
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="rounded-2xl border-white/5 bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black tracking-tight">{campaign.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 rounded-full px-3">{campaign.status}</Badge>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => deleteCampaign.mutate(campaign.id)} className="rounded-full hover:bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <p className="p-3 rounded-lg bg-black/20 border border-white/5 text-sm text-slate-300 italic">
                "{campaign.content}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {campaign.platform === 'whatsapp' || campaign.platform === 'all' &&
                    <div className="h-8 w-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                  }
                  {campaign.platform === 'instagram' || campaign.platform === 'all' &&
                    <div className="h-8 w-8 rounded-full bg-pink-500 border-2 border-slate-900 flex items-center justify-center">
                      <Instagram className="h-4 w-4 text-white" />
                    </div>
                  }
                   {campaign.platform === 'facebook' || campaign.platform === 'all' &&
                    <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center">
                      <Facebook className="h-4 w-4 text-white" />
                    </div>
                  }
                </div>
                <Button size="sm" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 px-4 font-bold">
                  Ver Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
