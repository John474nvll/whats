import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Phone, PhoneCall, PhoneOff, PhoneIncoming, Play, History, Activity, 
  ShieldCheck, Zap, Mic, MicOff, Volume2, Settings, Plus, Trash2,
  CheckCircle, XCircle, Globe, Key, Save, RefreshCw, Bot, Headphones
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useTwilioVoice } from "@/hooks/useTwilioVoice";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumbers: TwilioNumber[];
  isConnected: boolean;
}

interface TwilioNumber {
  id: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: { voice: boolean; sms: boolean; mms: boolean };
  isActive: boolean;
}

interface RetellAgent {
  id: string;
  name: string;
  description?: string;
  voiceId?: string;
  language?: string;
  isActive: boolean;
}

interface CallLog {
  id: number;
  duration: number;
  status: string;
  direction: string;
  fromNumber: string;
  toNumber: string;
  createdAt: string;
}

export default function VoiceManager() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [configOpen, setConfigOpen] = useState(false);
  const [newAgentOpen, setNewAgentOpen] = useState(false);
  const twilioVoice = useTwilioVoice();

  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: "",
    authToken: "",
  });

  const [retellConfig, setRetellConfig] = useState({
    apiKey: "",
  });

  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    voiceId: "es-ES-Standard-A",
    language: "es-ES",
    systemPrompt: "",
  });

  const { data: twilioStatus } = useQuery<{ isConnected: boolean; phoneNumbers: TwilioNumber[] }>({
    queryKey: ["/api/twilio/status"],
  });

  const { data: retellStatus } = useQuery<{ isConnected: boolean }>({
    queryKey: ["/api/retell/status"],
  });

  const { data: agents = [] } = useQuery<RetellAgent[]>({
    queryKey: ["/api/retell/agents"],
  });

  const { data: logs = [] } = useQuery<CallLog[]>({
    queryKey: ["/api/voice/calls"],
  });

  const { data: twilioNumbers = [] } = useQuery<TwilioNumber[]>({
    queryKey: ["/api/twilio/numbers"],
  });

  const saveTwilioConfig = useMutation({
    mutationFn: async (config: typeof twilioConfig) => {
      return await apiRequest("POST", "/api/twilio/configure", config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/twilio/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/twilio/numbers"] });
      toast({ title: "Twilio configurado", description: "Credenciales guardadas correctamente" });
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo guardar la configuración", variant: "destructive" });
    },
  });

  const saveRetellConfig = useMutation({
    mutationFn: async (config: typeof retellConfig) => {
      return await apiRequest("POST", "/api/retell/configure", config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/retell/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/retell/agents"] });
      toast({ title: "Retell AI configurado", description: "API Key guardada correctamente" });
    },
    onError: () => {
      toast({ title: "Error", description: "No se pudo guardar la configuración", variant: "destructive" });
    },
  });

  const createAgent = useMutation({
    mutationFn: async (agent: typeof newAgent) => {
      return await apiRequest("POST", "/api/retell/agents", agent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/retell/agents"] });
      toast({ title: "Agente creado", description: "El agente de voz está listo" });
      setNewAgentOpen(false);
      setNewAgent({ name: "", description: "", voiceId: "es-ES-Standard-A", language: "es-ES", systemPrompt: "" });
    },
  });

  const syncTwilioNumbers = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/twilio/sync-numbers");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/twilio/numbers"] });
      toast({ title: "Números sincronizados", description: "Lista de números actualizada desde Twilio" });
    },
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
    const statusLabels: Record<string, string> = {
      offline: "Desconectado",
      ready: "Listo",
      connecting: "Conectando...",
      ringing: "Llamada entrante",
      "in-call": `En llamada (${formatDuration(twilioVoice.callDuration)})`,
      error: "Error",
    };
    return (
      <Badge className={`${statusColors[twilioVoice.status]} text-white border-none`}>
        {statusLabels[twilioVoice.status] || twilioVoice.status}
      </Badge>
    );
  };

  const stats = {
    llamadasHoy: logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length,
    minutos: logs.reduce((acc, l) => acc + (l.duration || 0), 0),
    agentesActivos: agents.filter(a => a.isActive).length,
    numerosActivos: twilioNumbers.filter(n => n.isActive).length,
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-foreground pb-20 md:pb-8 transition-colors">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white">
              Voz & <span className="text-primary">Twilio</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Gestión de llamadas con Twilio Voice SDK y agentes Retell AI
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <Dialog open={configOpen} onOpenChange={setConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl dark:border-white/10">
                  <Settings className="h-4 w-4 mr-2" /> Configurar APIs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black dark:text-white">Configuración de APIs de Voz</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="twilio" className="mt-4">
                  <TabsList className="dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="twilio" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                      <Phone className="h-4 w-4 mr-2" /> Twilio
                    </TabsTrigger>
                    <TabsTrigger value="retell" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                      <Bot className="h-4 w-4 mr-2" /> Retell AI
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="twilio" className="space-y-4 mt-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                      {twilioStatus?.isConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className="font-medium dark:text-white">
                        {twilioStatus?.isConnected ? "Twilio conectado" : "Twilio no configurado"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-wider">Account SID</Label>
                        <Input
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          value={twilioConfig.accountSid}
                          onChange={(e) => setTwilioConfig({ ...twilioConfig, accountSid: e.target.value })}
                          className="dark:bg-slate-800 dark:border-white/10 font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-wider">Auth Token</Label>
                        <Input
                          type="password"
                          placeholder="Tu Auth Token de Twilio"
                          value={twilioConfig.authToken}
                          onChange={(e) => setTwilioConfig({ ...twilioConfig, authToken: e.target.value })}
                          className="dark:bg-slate-800 dark:border-white/10 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => saveTwilioConfig.mutate(twilioConfig)}
                        disabled={saveTwilioConfig.isPending}
                        className="flex-1 bg-primary font-bold rounded-xl"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saveTwilioConfig.isPending ? "Guardando..." : "Guardar Credenciales"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => syncTwilioNumbers.mutate()}
                        disabled={syncTwilioNumbers.isPending || !twilioStatus?.isConnected}
                        className="dark:border-white/10 rounded-xl"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncTwilioNumbers.isPending ? "animate-spin" : ""}`} />
                        Sincronizar
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Obtén tus credenciales en{" "}
                      <a href="https://console.twilio.com" target="_blank" className="text-primary hover:underline">
                        console.twilio.com
                      </a>
                    </p>
                  </TabsContent>

                  <TabsContent value="retell" className="space-y-4 mt-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                      {retellStatus?.isConnected ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <span className="font-medium dark:text-white">
                        {retellStatus?.isConnected ? "Retell AI conectado" : "Retell AI no configurado"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-wider">API Key</Label>
                      <Input
                        type="password"
                        placeholder="Tu API Key de Retell AI"
                        value={retellConfig.apiKey}
                        onChange={(e) => setRetellConfig({ ...retellConfig, apiKey: e.target.value })}
                        className="dark:bg-slate-800 dark:border-white/10 font-mono"
                      />
                    </div>

                    <Button
                      onClick={() => saveRetellConfig.mutate(retellConfig)}
                      disabled={saveRetellConfig.isPending}
                      className="w-full bg-primary font-bold rounded-xl"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {saveRetellConfig.isPending ? "Guardando..." : "Guardar API Key"}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      Obtén tu API Key en{" "}
                      <a href="https://www.retellai.com" target="_blank" className="text-primary hover:underline">
                        retellai.com
                      </a>
                    </p>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            {twilioVoice.status === "offline" && twilioStatus?.isConnected && (
              <Button 
                onClick={handleInitialize}
                className="rounded-xl bg-primary text-primary-foreground font-bold px-6"
              >
                Conectar Voz
              </Button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard label="Llamadas Hoy" value={stats.llamadasHoy.toString()} icon={Phone} color="bg-blue-500" trend="up" change="+0%" />
          <StatCard label="Minutos Totales" value={formatDuration(stats.minutos)} icon={Activity} color="bg-primary" trend="up" change="+0%" />
          <StatCard label="Agentes IA" value={stats.agentesActivos.toString()} icon={Bot} color="bg-purple-500" trend="up" change="+0%" />
          <StatCard label="Números Activos" value={stats.numerosActivos.toString()} icon={Globe} color="bg-amber-500" trend="up" change="+0%" />
        </div>

        <Tabs defaultValue="dialer" className="space-y-4">
          <TabsList className="dark:bg-slate-900/50 p-1 rounded-xl border dark:border-white/5">
            <TabsTrigger value="dialer" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              <PhoneCall className="h-4 w-4 mr-2" /> Marcador
            </TabsTrigger>
            <TabsTrigger value="numbers" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              <Globe className="h-4 w-4 mr-2" /> Números
            </TabsTrigger>
            <TabsTrigger value="agents" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              <Bot className="h-4 w-4 mr-2" /> Agentes IA
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              <History className="h-4 w-4 mr-2" /> Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dialer">
            <Card className="dark:bg-slate-900/40 dark:border-white/5 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <PhoneCall className="w-5 h-5 text-primary" />
                  Panel de Llamadas - Twilio Voice SDK
                </CardTitle>
                <CardDescription>Realiza y recibe llamadas directamente desde el navegador</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {twilioVoice.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    {twilioVoice.error}
                  </div>
                )}

                {twilioVoice.status === "ringing" && (
                  <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-4">
                      <PhoneIncoming className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="font-bold dark:text-white">Llamada entrante</p>
                        <p className="text-muted-foreground">Desde número desconocido</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={twilioVoice.acceptIncoming} className="bg-green-500 hover:bg-green-600 rounded-xl">
                        <Phone className="w-4 h-4 mr-2" /> Contestar
                      </Button>
                      <Button onClick={twilioVoice.rejectIncoming} variant="destructive" className="rounded-xl">
                        <PhoneOff className="w-4 h-4 mr-2" /> Rechazar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Input
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 dark:bg-slate-800/50 dark:border-white/10 rounded-xl px-6 text-lg h-14"
                    disabled={twilioVoice.status === "in-call" || twilioVoice.status === "connecting"}
                  />
                  
                  {twilioVoice.status === "in-call" ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={twilioVoice.toggleMute}
                        variant={twilioVoice.isMuted ? "destructive" : "secondary"}
                        className="rounded-xl w-14 h-14"
                      >
                        {twilioVoice.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>
                      <Button
                        onClick={twilioVoice.endCall}
                        variant="destructive"
                        className="rounded-xl px-8 font-bold h-14"
                      >
                        <PhoneOff className="w-5 h-5 mr-2" /> Colgar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleCall}
                      disabled={!phoneNumber || twilioVoice.status !== "ready"}
                      className="rounded-xl bg-primary text-primary-foreground font-bold px-8 h-14"
                    >
                      <Phone className="w-5 h-5 mr-2" /> Llamar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                    <Button
                      key={digit}
                      variant="outline"
                      className="rounded-xl h-14 text-xl font-bold dark:border-white/10 hover:bg-primary/10"
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
          </TabsContent>

          <TabsContent value="numbers">
            <Card className="dark:bg-slate-900/40 dark:border-white/5 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Globe className="w-5 h-5 text-primary" />
                    Números Telefónicos Twilio
                  </CardTitle>
                  <CardDescription>Números conectados a tu cuenta para llamadas entrantes y salientes</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => syncTwilioNumbers.mutate()}
                  disabled={syncTwilioNumbers.isPending}
                  className="dark:border-white/10 rounded-xl"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncTwilioNumbers.isPending ? "animate-spin" : ""}`} />
                  Sincronizar
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {twilioNumbers.length === 0 ? (
                  <div className="p-12 text-center">
                    <Phone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No hay números configurados</p>
                    <p className="text-xs text-muted-foreground">
                      Configura tus credenciales de Twilio y sincroniza para ver tus números
                    </p>
                  </div>
                ) : (
                  twilioNumbers.map((num) => (
                    <div key={num.id} className="flex items-center justify-between p-4 rounded-xl dark:bg-slate-800/50 border dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold dark:text-white text-lg">{num.phoneNumber}</p>
                          <p className="text-sm text-muted-foreground">{num.friendlyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          {num.capabilities.voice && <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Voz</Badge>}
                          {num.capabilities.sms && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">SMS</Badge>}
                        </div>
                        <Switch checked={num.isActive} />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card className="dark:bg-slate-900/40 dark:border-white/5 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 dark:text-white">
                    <Bot className="w-5 h-5 text-primary" />
                    Agentes de Voz Retell AI
                  </CardTitle>
                  <CardDescription>Agentes inteligentes para automatizar llamadas</CardDescription>
                </div>
                <Dialog open={newAgentOpen} onOpenChange={setNewAgentOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary font-bold rounded-xl">
                      <Plus className="h-4 w-4 mr-2" /> Nuevo Agente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="dark:bg-slate-900 dark:border-white/10">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">Crear Agente de Voz</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-wider">Nombre del Agente</Label>
                        <Input
                          placeholder="Ej: Asistente de Ventas"
                          value={newAgent.name}
                          onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                          className="dark:bg-slate-800 dark:border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-wider">Descripción</Label>
                        <Input
                          placeholder="Breve descripción del agente"
                          value={newAgent.description}
                          onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                          className="dark:bg-slate-800 dark:border-white/10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-wider">Voz</Label>
                          <Select value={newAgent.voiceId} onValueChange={(v) => setNewAgent({ ...newAgent, voiceId: v })}>
                            <SelectTrigger className="dark:bg-slate-800 dark:border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-slate-900 dark:border-white/10">
                              <SelectItem value="es-ES-Standard-A">Español (Mujer)</SelectItem>
                              <SelectItem value="es-ES-Standard-B">Español (Hombre)</SelectItem>
                              <SelectItem value="es-MX-Standard-A">Español MX (Mujer)</SelectItem>
                              <SelectItem value="es-MX-Standard-B">Español MX (Hombre)</SelectItem>
                              <SelectItem value="en-US-Standard-A">English (Female)</SelectItem>
                              <SelectItem value="en-US-Standard-B">English (Male)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-bold text-xs uppercase tracking-wider">Idioma</Label>
                          <Select value={newAgent.language} onValueChange={(v) => setNewAgent({ ...newAgent, language: v })}>
                            <SelectTrigger className="dark:bg-slate-800 dark:border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-slate-900 dark:border-white/10">
                              <SelectItem value="es-ES">Español (España)</SelectItem>
                              <SelectItem value="es-MX">Español (México)</SelectItem>
                              <SelectItem value="es-CO">Español (Colombia)</SelectItem>
                              <SelectItem value="en-US">English (US)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-wider">Prompt del Sistema</Label>
                        <Textarea
                          placeholder="Instrucciones para el agente. Ej: Eres un asistente de ventas amable..."
                          value={newAgent.systemPrompt}
                          onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                          className="dark:bg-slate-800 dark:border-white/10 min-h-[100px]"
                        />
                      </div>
                      <Button
                        onClick={() => createAgent.mutate(newAgent)}
                        disabled={createAgent.isPending || !newAgent.name}
                        className="w-full bg-primary font-bold rounded-xl"
                      >
                        {createAgent.isPending ? "Creando..." : "Crear Agente"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {agents.length === 0 ? (
                  <div className="p-12 text-center">
                    <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No hay agentes configurados</p>
                    <p className="text-xs text-muted-foreground">
                      Crea tu primer agente de voz para automatizar llamadas
                    </p>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 rounded-xl dark:bg-slate-800/50 border dark:border-white/5 hover:dark:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <Headphones className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.description || "Sin descripción"}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px]">{agent.language}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={agent.isActive ? "bg-green-500/10 text-green-400" : "bg-slate-500/10 text-slate-400"}>
                          {agent.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button size="icon" variant="ghost" className="rounded-xl hover:bg-primary/10">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="dark:bg-slate-900/40 dark:border-white/5 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <History className="w-5 h-5 text-primary" />
                  Historial de Llamadas
                </CardTitle>
                <CardDescription>Registro completo de todas las llamadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {logs.length === 0 ? (
                  <div className="p-12 text-center">
                    <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No hay llamadas registradas</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-xl dark:bg-slate-800/50 border dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.direction === "inbound" ? "bg-blue-500/10" : "bg-green-500/10"
                        }`}>
                          {log.direction === "inbound" ? (
                            <PhoneIncoming className="w-4 h-4 text-blue-400" />
                          ) : (
                            <PhoneCall className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">
                            {log.direction === "inbound" ? log.fromNumber : log.toNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-primary/10 text-primary border-none">{formatDuration(log.duration)}</Badge>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase">{log.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
