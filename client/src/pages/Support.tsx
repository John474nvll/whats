import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, User, Tag, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Ticket } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusColors: Record<string, string> = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  resolved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  closed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-400",
  medium: "bg-blue-500/10 text-blue-400",
  high: "bg-orange-500/10 text-orange-400",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Support() {
  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tickets");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Centro de Soporte</h1>
            </div>
            <p className="text-slate-400 text-sm">Gestiona tickets de soporte y atención al cliente.</p>
          </div>
          <Button className="bg-primary text-black font-black rounded-xl hover:scale-[1.02] transition-all">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Ticket
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Abiertos", value: tickets.filter(t => t.status === "open").length, icon: AlertCircle, color: "text-blue-400" },
            { label: "En Proceso", value: tickets.filter(t => t.status === "in_progress").length, icon: Clock, color: "text-amber-400" },
            { label: "Resueltos", value: tickets.filter(t => t.status === "resolved").length, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Total", value: tickets.length, icon: Tag, color: "text-primary" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-slate-900/40 border-white/5 backdrop-blur-xl">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-900/40 border-white/5 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xl">Tickets Recientes</CardTitle>
            <CardDescription>Lista detallada de las solicitudes de soporte.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Ticket</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Cliente</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Estado</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Prioridad</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500">Fecha</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando tickets...</td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No hay tickets registrados</td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">#{ticket.id} - {ticket.subject}</span>
                            <span className="text-xs text-slate-500 truncate max-w-[200px]">{ticket.description}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center">
                              <User className="h-3 w-3 text-slate-400" />
                            </div>
                            <span className="text-xs text-slate-300 font-medium">Cliente ID: {ticket.customerId}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-[10px] uppercase font-black tracking-widest ${statusColors[ticket.status]}`}>
                            {ticket.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`text-[9px] uppercase font-black tracking-widest ${priorityColors[ticket.priority]}`}>
                            {ticket.priority}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs text-slate-500">
                          {ticket.createdAt ? format(new Date(ticket.createdAt), "dd MMM, HH:mm", { locale: es }) : "-"}
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">Gestionar</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
