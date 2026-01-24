import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Play, History, Activity, ShieldCheck, Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import type { RetellAgent, CallLog } from "@shared/schema";

export default function VoiceManager() {
  const { data: agents = [] } = useQuery<RetellAgent[]>({
    queryKey: ["/api/retell/agents"],
  });

  const { data: logs = [] } = useQuery<CallLog[]>({
    queryKey: ["/api/retell/calls"],
  });

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-white">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white">Voz & <span className="text-kiwi">Retell AI</span></h1>
          <p className="text-slate-400">Gestión de agentes de voz inteligentes y telefonía Twilio</p>
        </div>
        <Button className="rounded-full bg-kiwi text-black font-bold px-8 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-kiwi/90">
          Nuevo Agente
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Llamadas Hoy" value="24" icon={Phone} color="bg-blue-500" trend="up" change="+15%" />
        <StatCard label="Minutos" value="142" icon={Activity} color="bg-kiwi" trend="up" change="+8%" />
        <StatCard label="Agentes Activos" value={agents.length.toString()} icon={ShieldCheck} color="bg-purple-500" trend="up" change="0%" />
        <StatCard label="Costo Estimado" value="$12.40" icon={Zap} color="bg-yellow-500" trend="down" change="-2%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-kiwi" />
              Agentes Retell
            </CardTitle>
            <CardDescription>Agentes de voz configurados para tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-kiwi/10 flex items-center justify-center text-kiwi">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{agent.name}</h3>
                    <p className="text-xs text-slate-400">ID: {agent.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-kiwi/30 text-kiwi bg-kiwi/5">Listo</Badge>
                  <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-kiwi group-hover:text-black transition-all">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-kiwi" />
              Historial de Llamadas
            </CardTitle>
            <CardDescription>Registro reciente de interacciones de voz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Llamada a Cliente</h3>
                    <p className="text-xs text-slate-400">{new Date(log.createdAt || '').toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-kiwi/10 text-kiwi border-none">{log.duration}s</Badge>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{log.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
