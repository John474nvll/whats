
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, DollarSign } from "lucide-react";
import { DealForm } from "@/components/crm/DealForm";
import { queryClient } from "@/lib/queryClient";
import { Deal, Contact, User } from "@shared/schema";

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

  const { data: contacts } = useQuery<Contact[]>({ queryKey: ['/api/crm/contacts'], queryFn: async () => (await fetch('/api/crm/contacts')).json() });
  const { data: users } = useQuery<User[]>({ queryKey: ['/api/crm/users'], queryFn: async () => (await fetch('/api/crm/users')).json() });

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

  const getContactName = (contactId?: number) => contacts?.find(c => c.id === contactId)?.name || "Sin contacto";
  const getOwnerName = (ownerId?: number) => users?.find(u => u.id === ownerId)?.name || "Sin propietario";

  const getStageInfo = (stage: string) => {
    switch (stage) {
      case "lead": return { label: "Lead", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
      case "qualified": return { label: "Cualificado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
      case "proposal": return { label: "Propuesta", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
      case "won": return { label: "Ganada", color: "bg-green-500/20 text-green-400 border-green-500/30" };
      case "lost": return { label: "Perdida", color: "bg-red-500/20 text-red-400 border-red-500/30" };
      default: return { label: stage, color: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
    }
  };

  const filteredDeals = deals?.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Oportunidades
            </h1>
            <p className="text-muted-foreground text-lg">Administra tus oportunidades de negocio.</p>
          </div>
          <DealForm />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-slate-800/50 border-slate-700 h-11 rounded-lg w-full"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-48 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700" />)}
          </div>
        ) : filteredDeals.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 col-span-full">
            <CardContent className="pt-12 pb-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No se encontraron oportunidades.</p>
              <DealForm />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDeals.map(deal => {
              const stageInfo = getStageInfo(deal.stage);
              return (
                <Card key={deal.id} className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold truncate">{deal.name}</CardTitle>
                    <p className="text-lg font-bold text-primary">${deal.amount.toLocaleString()}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end text-sm space-y-2">
                    <p><span className="font-semibold">Contacto:</span> {getContactName(deal.contactId)}</p>
                    <p><span className="font-semibold">Propietario:</span> {getOwnerName(deal.ownerId)}</p>
                  </CardContent>
                  <CardContent className="flex items-center justify-between pt-4">
                    <Badge className={`flex items-center gap-1 rounded-full ${stageInfo.color}`}>{stageInfo.label}</Badge>
                    <div className="flex gap-2">
                      <DealForm deal={deal} />
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-red-600/30 text-red-500 hover:bg-red-500/10 rounded-lg h-9 w-9"
                        onClick={() => deleteDeal.mutate(deal.id)}
                        disabled={deleteDeal.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
