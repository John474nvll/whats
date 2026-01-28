import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TrendingUp,
  MessageSquare,
  Users,
  Activity,
  Zap,
  LogOut,
  Package,
  Target,
  RefreshCw,
  Calendar,
  ShieldCheck,
  Phone,
  Link2,
  BarChart3,
  LinkIcon,
  Bot,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Megaphone,
  Filter,
  Settings,
  Bell,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import type { SocialAccount } from "@shared/schema";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Ticket } from "@shared/schema";

const activityData = [
  { name: "Lun", mensajes: 120, ventas: 8, leads: 15 },
  { name: "Mar", mensajes: 150, ventas: 12, leads: 22 },
  { name: "Mié", mensajes: 180, ventas: 15, leads: 28 },
  { name: "Jue", mensajes: 140, ventas: 10, leads: 18 },
  { name: "Vie", mensajes: 210, ventas: 18, leads: 35 },
  { name: "Sáb", mensajes: 160, ventas: 14, leads: 20 },
  { name: "Dom", mensajes: 130, ventas: 6, leads: 12 },
];

const botPerformanceData = [
  { name: "00:00", respuestas: 45, conversion: 12 },
  { name: "04:00", respuestas: 28, conversion: 8 },
  { name: "08:00", respuestas: 120, conversion: 35 },
  { name: "12:00", respuestas: 180, conversion: 52 },
  { name: "16:00", respuestas: 165, conversion: 48 },
  { name: "20:00", respuestas: 95, conversion: 28 },
];

const channelData = [
  { name: "WhatsApp", value: 65, color: "#22c55e" },
  { name: "Instagram", value: 20, color: "#ec4899" },
  { name: "Facebook", value: 15, color: "#3b82f6" },
];

export default function Dashboard() {
  const { toast } = useToast();
  const { data: widgets, isLoading: isLoadingWidgets } = useQuery<any[]>({
    queryKey: ["/api/widgets"],
  });
  const { data: accounts = [], isLoading: isLoadingAccounts } = useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts"],
  });
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });
  const { data: crmStats } = useQuery<any>({
    queryKey: ["/api/crm/stats"],
  });
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery<any[]>({
    queryKey: ["/api/conversations"],
  });
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ["/api/crm/projects"],
  });
  const { data: purchaseOrders = [] } = useQuery<any[]>({
    queryKey: ["/api/purchase-orders"],
  });
  const { data: funnels = [] } = useQuery<any[]>({
    queryKey: ["/api/funnels"],
  });

  const { data: tickets = [] } = useQuery<Ticket[]>({
    queryKey: ["/api/crm/tickets"],
  });
  const { data: opportunities = [] } = useQuery<any[]>({
    queryKey: ["/api/crm/opportunities"],
  });

  const refreshMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/social-accounts/${id}/refresh`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
      toast({ title: "Token Refrescado" });
    }
  });
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (isLoadingWidgets || isLoadingAccounts || isLoadingCustomers || isLoadingConversations) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-primary font-black animate-pulse uppercase tracking-widest text-xs">SoftganHub Cargando...</p>
        </div>
      </div>
    );
  }

  const pipelineData = [
    { name: 'Nuevos', value: crmStats?.new || 12, color: '#3b82f6' },
    { name: 'Contactando', value: crmStats?.contacting || 8, color: '#8b5cf6' },
    { name: 'Cualificados', value: crmStats?.qualified || 5, color: '#10b981' },
    { name: 'Ganados', value: crmStats?.won || 3, color: '#f59e0b' },
  ];

  const pendingOrders = purchaseOrders.filter((o: any) => o.status === 'pendiente').length;
  const completedOrders = purchaseOrders.filter((o: any) => o.status === 'completada').length;
  const activeFunnels = funnels.filter((f: any) => f.isActive).length;

  return (
    <div className="min-h-screen bg-[#050a06] text-slate-200">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_50%)] pointer-events-none" />
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 space-y-6 relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-kiwi/20">
                <Zap className="w-8 h-8 text-kiwi" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  Softgan<span className="text-kiwi">Hub</span>
                </h1>
                <p className="text-slate-500 text-sm">Panel de Control v11.0 - Vendedores & Bots IA</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5">
              <Bell className="w-4 h-4 mr-2" />
              <Badge className="bg-red-500 text-white text-[10px] px-1.5">3</Badge>
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-xl border-white/10 bg-white/5">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard label="Clientes Activos" value={customers.length.toString()} icon={Users} color="bg-blue-500" trend="up" change="+12%" />
          <StatCard label="Órdenes de Compra" value={purchaseOrders.length.toString()} icon={ShoppingCart} color="bg-orange-500" trend="up" change="+8%" />
          <StatCard label="Funnels Activos" value={activeFunnels.toString()} icon={Filter} color="bg-purple-500" trend="up" change="+3%" />
          <StatCard label="Bot Respuestas" value="1,248" icon={Bot} color="bg-kiwi" trend="up" change="+45%" />
          <StatCard label="Ventas del Mes" value="$12.5M" icon={DollarSign} color="bg-emerald-500" trend="up" change="+18%" />
          <StatCard label="Tasa Conversión" value="23.4%" icon={TrendingUp} color="bg-cyan-500" trend="up" change="+2.1%" />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-12 lg:col-span-8 bg-slate-900/60 border-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-kiwi" />
                    Actividad Semanal
                  </CardTitle>
                  <CardDescription>Mensajes, ventas y leads generados</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-kiwi/30 text-kiwi">Mensajes</Badge>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">Ventas</Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">Leads</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorMensajes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeOpacity={0.05} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="mensajes" stroke="#22c55e" fillOpacity={1} fill="url(#colorMensajes)" />
                    <Area type="monotone" dataKey="ventas" stroke="#3b82f6" fillOpacity={0.5} fill="url(#colorVentas)" />
                    <Line type="monotone" dataKey="leads" stroke="#a855f7" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-4 bg-slate-900/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bot className="w-5 h-5 text-kiwi" />
                Bot de Ventas IA
              </CardTitle>
              <CardDescription>Rendimiento del agente automático</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-kiwi/10 border border-kiwi/20">
                  <p className="text-2xl font-black text-kiwi">847</p>
                  <p className="text-xs text-slate-400">Respuestas Hoy</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-2xl font-black text-blue-400">23%</p>
                  <p className="text-xs text-slate-400">Tasa Conversión</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Satisfacción</span>
                  <span className="text-sm font-bold text-kiwi">94%</span>
                </div>
                <Progress value={94} className="h-2 bg-slate-800" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Tiempo Respuesta</span>
                  <span className="text-sm font-bold text-cyan-400">1.2s</span>
                </div>
                <Progress value={88} className="h-2 bg-slate-800" />
              </div>
              <Link href="/voice">
                <Button className="w-full bg-kiwi/20 text-kiwi hover:bg-kiwi/30 rounded-xl">
                  <Bot className="w-4 h-4 mr-2" />
                  Gestionar Agentes IA
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-900/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-400" />
                Órdenes de Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                  <p className="text-xl font-black text-yellow-400">{pendingOrders}</p>
                  <p className="text-[10px] text-slate-400">Pendientes</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <p className="text-xl font-black text-blue-400">{purchaseOrders.filter((o: any) => o.status === 'en_proceso').length || 2}</p>
                  <p className="text-[10px] text-slate-400">En Proceso</p>
                </div>
                <div className="p-3 rounded-xl bg-kiwi/10 border border-kiwi/20 text-center">
                  <p className="text-xl font-black text-kiwi">{completedOrders}</p>
                  <p className="text-[10px] text-slate-400">Completadas</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { id: "OC-001", cliente: "Agropecuaria Norte", monto: "$2.4M", estado: "pendiente" },
                  { id: "OC-002", cliente: "Finca El Paraíso", monto: "$890K", estado: "en_proceso" },
                  { id: "OC-003", cliente: "Ganadería Sur", monto: "$1.5M", estado: "aprobada" },
                ].map((orden) => (
                  <div key={orden.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">{orden.id}</p>
                      <p className="text-xs text-slate-400">{orden.cliente}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-kiwi">{orden.monto}</p>
                      <Badge variant="outline" className={`text-[8px] ${
                        orden.estado === 'pendiente' ? 'border-yellow-500/30 text-yellow-400' :
                        orden.estado === 'en_proceso' ? 'border-blue-500/30 text-blue-400' :
                        'border-kiwi/30 text-kiwi'
                      }`}>
                        {orden.estado.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/orders">
                <Button variant="outline" className="w-full border-white/10 rounded-xl">
                  Ver Todas las Órdenes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-900/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-400" />
                Funnels de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={pipelineData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} fontSize={11} stroke="#64748b" />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {pipelineData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-lg font-black text-purple-400">{funnels.length || 4}</p>
                  <p className="text-[10px] text-slate-400">Funnels Totales</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-lg font-black text-emerald-400">$45.2M</p>
                  <p className="text-[10px] text-slate-400">Valor Pipeline</p>
                </div>
              </div>
              <Link href="/funnels">
                <Button variant="outline" className="w-full border-white/10 rounded-xl">
                  Gestionar Funnels
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-900/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-kiwi" />
                Canales de Comunicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[160px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                      stroke="none"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {channelData.map((channel) => (
                  <div key={channel.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: channel.color }} />
                    <span className="text-xs text-slate-400">{channel.name} {channel.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-6 bg-slate-900/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                Equipo de Vendedores
              </CardTitle>
              <CardDescription>Rendimiento del equipo comercial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { nombre: "Carlos Martínez", rol: "Vendedor Senior", ventas: 45, meta: 50, avatar: "CM" },
                  { nombre: "Ana García", rol: "Vendedor", ventas: 38, meta: 40, avatar: "AG" },
                  { nombre: "Luis Rodríguez", rol: "Vendedor Junior", ventas: 22, meta: 30, avatar: "LR" },
                  { nombre: "Bot IA Ventas", rol: "Agente Automático", ventas: 128, meta: 100, avatar: "🤖" },
                ].map((vendedor, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kiwi to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                      {vendedor.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{vendedor.nombre}</p>
                          <p className="text-[10px] text-slate-400">{vendedor.rol}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-kiwi">{vendedor.ventas} ventas</p>
                          <p className="text-[10px] text-slate-400">Meta: {vendedor.meta}</p>
                        </div>
                      </div>
                      <Progress value={(vendedor.ventas / vendedor.meta) * 100} className="h-1.5 mt-2 bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-6 bg-slate-900/60 border-white/5 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-kiwi" />
                Estado del Sistema Softgan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">API WhatsApp</span>
                    <Badge className="bg-kiwi/20 text-kiwi border-none text-[8px]">Conectado</Badge>
                  </div>
                  <p className="text-lg font-bold text-white">24ms</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Base de Datos</span>
                    <Badge className="bg-kiwi/20 text-kiwi border-none text-[8px]">Estable</Badge>
                  </div>
                  <p className="text-lg font-bold text-white">PostgreSQL</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Bots IA Activos</span>
                    <RefreshCw className="w-3 h-3 text-kiwi animate-spin" />
                  </div>
                  <p className="text-lg font-bold text-white">3 Agentes</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Twilio Voice</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-none text-[8px]">Config</Badge>
                  </div>
                  <p className="text-lg font-bold text-white">2 Líneas</p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-2xl bg-black/40 font-mono text-[10px] space-y-1.5 max-h-[120px] overflow-y-auto">
                <p className="text-kiwi">[INFO] WhatsApp Business API sincronizado correctamente</p>
                <p className="text-cyan-400">[BOT] Agente IA-Ventas procesó 47 consultas en última hora</p>
                <p className="text-white/60">[CRM] Nuevo lead cualificado: ID 48293 - Finca El Sol</p>
                <p className="text-yellow-400">[ALERTA] Pico de engagement detectado en Instagram Business</p>
                <p className="text-purple-400">[FUNNEL] 3 prospectos movidos a etapa "Negociación"</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 bg-gradient-to-r from-kiwi/20 via-cyan-500/10 to-purple-500/20 border-kiwi/20 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-kiwi" />
                Acceso Rápido SoftganHub
              </CardTitle>
              <CardDescription>Navegación directa a todos los módulos del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { label: "Clientes", icon: Users, href: "/customers", color: "text-blue-400", bg: "bg-blue-500/20" },
                  { label: "Órdenes", icon: ShoppingCart, href: "/orders", color: "text-orange-400", bg: "bg-orange-500/20" },
                  { label: "Funnels", icon: Filter, href: "/funnels", color: "text-purple-400", bg: "bg-purple-500/20" },
                  { label: "Bot IA", icon: Bot, href: "/voice", color: "text-kiwi", bg: "bg-kiwi/20" },
                  { label: "Inbox", icon: MessageSquare, href: "/inbox", color: "text-cyan-400", bg: "bg-cyan-500/20" },
                  { label: "Campañas", icon: Megaphone, href: "/campaigns", color: "text-pink-400", bg: "bg-pink-500/20" },
                  { label: "Plataformas", icon: Link2, href: "/platforms", color: "text-emerald-400", bg: "bg-emerald-500/20" },
                  { label: "Analytics", icon: BarChart3, href: "/analytics", color: "text-yellow-400", bg: "bg-yellow-500/20" },
                  { label: "Proyectos", icon: Briefcase, href: "/projects", color: "text-indigo-400", bg: "bg-indigo-500/20" },
                  { label: "Tareas", icon: CheckCircle2, href: "/tasks", color: "text-teal-400", bg: "bg-teal-500/20" },
                  { label: "Tickets", icon: Activity, href: "/tickets", color: "text-red-400", bg: "bg-red-500/20" },
                  { label: "Facturación", icon: DollarSign, href: "/billing", color: "text-lime-400", bg: "bg-lime-500/20" },
                  { label: "Contactos", icon: Users, href: "/contacts", color: "text-sky-400", bg: "bg-sky-500/20" },
                  { label: "IA Generator", icon: Zap, href: "/ai-generator", color: "text-violet-400", bg: "bg-violet-500/20" },
                  { label: "Voz & Twilio", icon: Phone, href: "/voice", color: "text-rose-400", bg: "bg-rose-500/20" },
                  { label: "Configuración", icon: Settings, href: "/settings", color: "text-slate-400", bg: "bg-slate-500/20" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button variant="ghost" className="w-full h-auto py-4 flex flex-col gap-2 rounded-2xl hover:bg-white/10 transition-all group border border-white/5">
                      <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center py-6 border-t border-white/5">
          <p className="text-xs text-slate-500">
            SoftganHub v11.0 | softgan.com | Tecnología que impulsa tu crecimiento
          </p>
        </footer>
      </div>
    </div>
  );
}
