import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Phone, PhoneCall, PhoneOff, PhoneIncoming, Play, History, Activity, ShieldCheck, Zap, Mic, MicOff, Volume2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useTwilioVoice } from "@/hooks/useTwilioVoice";

interface RetellAgent {
  id: string;
  name: string;
}

interface CallLog {
  id: number;
  duration: number;
  status: string;
  createdAt: string;
}

export default function VoiceManager() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const twilioVoice = useTwilioVoice();

  const { data: agents = [] } = useQuery<RetellAgent[]>({
    queryKey: ["/api/retell/agents"],
  });

  const { data: logs = [] } = useQuery<CallLog[]>({
    queryKey: ["/api/retell/calls"],
  });

  const { data: twilioStatus } = useQuery({
    queryKey: ["/api/twilio/status"],
  });

  const handleInitialize = () => {
    twilioVoice.initialize("socialhub-agent");
  };

  const handleCall = () => {
    if (phoneNumber) {
      twilioVoice.makeCall(phoneNumber);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = () => {
    const statusColors: Record<string, string> = {
      offline: "bg-slate-500",
      ready: "bg-green-500",
      connecting: "bg-yellow-500",
      ringing: "bg-blue-500 animate-pulse",
      "in-call": "bg-green-500 animate-pulse",
      error: "bg-red-500",
    };
    return (
      <Badge className={`${statusColors[twilioVoice.status]} text-white border-none`}>
        {twilioVoice.status === "in-call" ? `En llamada (${formatDuration(twilioVoice.callDuration)})` : twilioVoice.status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-white">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white">Voz & <span className="text-kiwi">Twilio</span></h1>
          <p className="text-slate-400">Gestión de llamadas con Twilio Voice SDK y agentes Retell AI</p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {twilioVoice.status === "offline" && (
            <Button 
              onClick={handleInitialize}
              className="rounded-full bg-kiwi text-black font-bold px-8 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-kiwi/90"
            >
              Conectar Twilio
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Llamadas Hoy" value="24" icon={Phone} color="bg-blue-500" trend="up" change="+15%" />
        <StatCard label="Minutos" value="142" icon={Activity} color="bg-kiwi" trend="up" change="+8%" />
        <StatCard label="Agentes Activos" value={agents.length.toString()} icon={ShieldCheck} color="bg-purple-500" trend="up" change="0%" />
        <StatCard label="Costo Estimado" value="$12.40" icon={Zap} color="bg-yellow-500" trend="down" change="-2%" />
      </div>

      <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-kiwi" />
            Panel de Llamadas - Twilio Voice SDK
          </CardTitle>
          <CardDescription>Realiza y recibe llamadas directamente desde el navegador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {twilioVoice.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
              {twilioVoice.error}
            </div>
          )}

          {twilioVoice.status === "ringing" && (
            <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-4">
                <PhoneIncoming className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="font-bold text-white">Llamada entrante</p>
                  <p className="text-slate-400">Desde número desconocido</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={twilioVoice.acceptIncoming} className="bg-green-500 hover:bg-green-600 rounded-full">
                  <Phone className="w-4 h-4 mr-2" /> Contestar
                </Button>
                <Button onClick={twilioVoice.rejectIncoming} variant="destructive" className="rounded-full">
                  <PhoneOff className="w-4 h-4 mr-2" /> Rechazar
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Input
              type="tel"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 bg-slate-800/50 border-white/10 rounded-full px-6 text-lg"
              disabled={twilioVoice.status === "in-call" || twilioVoice.status === "connecting"}
            />
            
            {twilioVoice.status === "in-call" ? (
              <div className="flex gap-2">
                <Button
                  onClick={twilioVoice.toggleMute}
                  variant={twilioVoice.isMuted ? "destructive" : "secondary"}
                  className="rounded-full w-14 h-14"
                >
                  {twilioVoice.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={twilioVoice.endCall}
                  variant="destructive"
                  className="rounded-full px-8 font-bold"
                >
                  <PhoneOff className="w-5 h-5 mr-2" /> Colgar ({formatDuration(twilioVoice.callDuration)})
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleCall}
                disabled={!phoneNumber || twilioVoice.status !== "ready"}
                className="rounded-full bg-kiwi text-black font-bold px-8 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-kiwi/90 disabled:opacity-50"
              >
                <Phone className="w-5 h-5 mr-2" /> Llamar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
              <Button
                key={digit}
                variant="outline"
                className="rounded-2xl h-14 text-xl font-bold border-white/10 hover:bg-white/10"
                onClick={() => {
                  setPhoneNumber((prev) => prev + digit);
                  if (twilioVoice.status === "in-call") {
                    twilioVoice.sendDigits(digit);
                  }
                }}
              >
                {digit}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-kiwi" />
              Agentes Retell AI
            </CardTitle>
            <CardDescription>Agentes de voz configurados para tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {agents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay agentes configurados</p>
              </div>
            ) : (
              agents.map((agent) => (
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
              ))
            )}
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
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay llamadas registradas</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Llamada a Cliente</h3>
                      <p className="text-xs text-slate-400">{new Date(log.createdAt || "").toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-kiwi/10 text-kiwi border-none">{log.duration}s</Badge>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{log.status}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
