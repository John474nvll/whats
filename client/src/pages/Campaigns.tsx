import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Megaphone, Send, Sparkles, Instagram, Facebook, MessageCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Campaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Campaigns() {
  const { toast } = useToast();
  const { data: accounts } = useQuery<any[]>({
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
    },
  });

  const filteredAccounts = accounts?.filter(acc => platform === "all" || acc.platform === platform) || [];

  if (isLoading) return <div className="p-8">Cargando campañas...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-kiwi">Campañas Pro</h1>
          <p className="text-muted-foreground font-medium">Gestiona tus lanzamientos multicanal con IA.</p>
        </div>
      </div>

      <Card className="glass-card rounded-[2rem] border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-kiwi" />
            Configurar Nueva Campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Plataforma</label>
                <select 
                  className="w-full h-12 bg-muted/10 border-border/50 rounded-2xl px-4 focus:ring-kiwi"
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    setSelectedAccounts([]);
                  }}
                >
                  <option value="all">Todas las plataformas</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cuentas Administradoras</label>
                <div className="flex flex-wrap gap-2 p-2 bg-muted/5 border border-dashed border-border/50 rounded-2xl min-h-[3rem]">
                   {filteredAccounts.map(acc => (
                     <Badge 
                       key={acc.id}
                       onClick={() => setSelectedAccounts(prev => 
                         prev.includes(acc.id) ? prev.filter(id => id !== acc.id) : [...prev, acc.id]
                       )}
                       className={`rounded-full px-3 py-1 cursor-pointer transition-all ${
                         selectedAccounts.includes(acc.id) 
                         ? "bg-kiwi text-black scale-105" 
                         : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                       }`}
                     >
                       {acc.accountName}
                     </Badge>
                   ))}
                </div>
              </div>
           </div>

           <div className="space-y-2">
             <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contenido de la Campaña</label>
             <Textarea 
               placeholder="Escribe el mensaje o deja que la IA lo genere..."
               className="rounded-[1.5rem] bg-muted/10 border-border/50 min-h-[100px]"
               id="campaign-content"
             />
           </div>

           <Button 
             onClick={() => {
               const content = (document.getElementById('campaign-content') as HTMLTextAreaElement).value;
               createCampaign.mutate({
                 name: "Campaña Orquestada " + new Date().toLocaleDateString(),
                 platform,
                 content,
                 status: "active",
                 aiGenerated: true
               });
             }}
             disabled={selectedAccounts.length === 0}
             className="w-full h-14 rounded-[2rem] bg-kiwi text-black font-black text-lg hover:bg-kiwi/90 shadow-2xl shadow-kiwi/20"
           >
             <Send className="h-5 w-5 mr-2" /> Ejecutar Campaña en {selectedAccounts.length} Cuentas
           </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
