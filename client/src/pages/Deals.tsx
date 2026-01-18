
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, GitFork, User, Building, DollarSign } from "lucide-react";
import { DealForm } from "@/components/crm/DealForm";
import { queryClient } from "@/lib/queryClient";
import { Deal } from "@shared/schema";

export default function Deals() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: deals, isLoading } = useQuery<Deal[]>({ 
    queryKey: ["/api/crm/deals"],
    queryFn: async () => {
      const res = await fetch('/api/crm/deals');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const deleteDeal = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/crm/deals/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete deal');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      toast({ title: "Oportunidad eliminada" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "lead": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "qualified": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "proposal": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "won": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "lost": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const filteredDeals = deals?.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Oportunidades
            </h1>
            <p className="text-muted-foreground text-lg">Administra tus oportunidades de negocio y su progreso.</p>
          </div>
          <DealForm />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, contacto o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-slate-800/50 border-slate-700 h-11 rounded-lg w-full"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-60 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700" />)}
          </div>
        ) : filteredDeals.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 col-span-full">
            <CardContent className="pt-12 pb-12 text-center">
              <GitFork className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No se encontraron oportunidades.</p>
              <DealForm />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDeals.map((deal) => (
              <Card key={deal.id} className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold truncate flex-1 min-w-0">{deal.name}</CardTitle>
                    <Badge className={`rounded-full ${getStageColor(deal.stage)}`}>{deal.stage}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-between text-sm">
                  <div className="flex-1 space-y-2 text-slate-400">
                    <p className="flex items-center gap-2 font-bold text-lg text-primary">
                      <DollarSign className="h-5 w-5" /> {deal.value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                    </p>
                    {deal.contact && (
                      <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {deal.contact.name}</p>
                    )}
                    {deal.company && (
                      <p className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" /> {deal.company.name}</p>
                    )}
                     {deal.owner && (
                        <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> Asignado a: {deal.owner.name}</p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-3">
                    <DealForm deal={deal} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-600/30 text-red-500 hover:bg-red-500/10 rounded-lg h-9"
                      onClick={() => deleteDeal.mutate(deal.id)}
                      disabled={deleteDeal.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
