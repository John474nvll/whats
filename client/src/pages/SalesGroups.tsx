
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Shield, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SalesGroup } from "@shared/schema";

export default function SalesGroups() {
  const { data: groups = [], isLoading } = useQuery<SalesGroup[]>({
    queryKey: ["/api/crm/sales-groups"],
  });

  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Grupos de Ventas</h1>
        <Button className="bg-primary text-black font-bold rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Grupo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="bg-slate-900/40 border-white/5 hover:border-primary/30 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{group.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Manager ID: {group.managerId || 'No asignado'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {groups.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No hay grupos de ventas configurados</p>
          </div>
        )}
      </div>
    </div>
  );
}
