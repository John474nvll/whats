import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Megaphone, Send, Sparkles, Instagram, Facebook, MessageCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Campaign } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Campaigns() {
  const { toast } = useToast();
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const createCampaign = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/campaigns", {
        name: "Campaña de Verano Neon",
        platform: "all",
        status: "active",
        content: "¡Descubre nuestras ofertas exclusivas en SocialHub!",
        aiGenerated: true
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Campaña iniciada", description: "Tu campaña multicanal está en marcha." });
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

  if (isLoading) return <div className="p-8">Cargando campañas...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-kiwi">Campañas Pro</h1>
          <p className="text-muted-foreground font-medium">Gestiona tus lanzamientos multicanal con IA.</p>
        </div>
        <Button onClick={() => createCampaign.mutate()} className="gap-2 bg-kiwi text-black hover:bg-kiwi/90 rounded-2xl h-12 px-6">
          <Plus className="h-5 w-5" /> Nueva Campaña
        </Button>
      </div>

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
