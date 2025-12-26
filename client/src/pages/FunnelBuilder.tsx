import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Play, Pause, GitFork, MessageSquare, Instagram, Facebook } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SalesFunnel } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function FunnelBuilder() {
  const { toast } = useToast();
  const { data: funnels, isLoading } = useQuery<SalesFunnel[]>({
    queryKey: ["/api/funnels"],
  });

  const createFunnel = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/funnels", {
        name: "Nuevo Embudo de Ventas",
        description: "Automatización de ventas multicanal",
        steps: [
          { type: "trigger", platform: "whatsapp", action: "incoming_message", config: { keyword: "info" } },
          { type: "action", platform: "instagram", action: "send_dm", config: { message: "¡Hola! Gracias por tu interés." } }
        ]
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funnels"] });
      toast({ title: "Embudo creado", description: "El embudo se ha creado correctamente." });
    },
  });

  const toggleFunnel = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/funnels/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funnels"] });
    },
  });

  const deleteFunnel = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/funnels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funnels"] });
      toast({ title: "Embudo eliminado" });
    },
  });

  if (isLoading) return <div className="p-8">Cargando embudos...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Embudos de Ventas</h1>
          <p className="text-muted-foreground">Crea flujos de trabajo automatizados entre tus redes sociales.</p>
        </div>
        <Button onClick={() => createFunnel.mutate()} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo Embudo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funnels?.map((funnel) => (
          <Card key={funnel.id} className="hover-elevate border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{funnel.name}</CardTitle>
                <Badge variant={funnel.isActive ? "default" : "secondary"}>
                  {funnel.isActive ? "Activo" : "Pausado"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => toggleFunnel.mutate({ id: funnel.id, isActive: !funnel.isActive })}
                >
                  {funnel.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-green-500" />}
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-destructive"
                  onClick={() => deleteFunnel.mutate(funnel.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{funnel.description}</p>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                  </div>
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <div className="p-2 rounded-lg bg-pink-500/10">
                    <Instagram className="h-4 w-4 text-pink-500" />
                  </div>
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Facebook className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <Button variant="outline" className="w-full">Editar Flujo</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {funnels?.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl border-border/50">
            <p className="text-muted-foreground">No tienes embudos creados. Comienza creando uno nuevo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
