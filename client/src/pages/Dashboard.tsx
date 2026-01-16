
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
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  MessageCircle,
  Instagram,
  Facebook,
  Link2,
  Plus,
  LogOut,
  ShoppingBag,
  Megaphone,
  Music,
  Send,
  Download,
  Package,
  Contact,
  LineChart,
  User,
  Phone,
  BarChart,
  Target,
  RefreshCw,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { Widget, SocialAccount } from "@shared/schema";
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
} from "recharts";
import { customerGrowthData, StatCard } from "@/components/dashboard/StatCard";
import { RecentConversations } from "@/components/dashboard/RecentConversations";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const activityData = [
  { name: "Mon", value: 120, avg: 80 },
  { name: "Tue", value: 150, avg: 95 },
  { name: "Wed", value: 180, avg: 110 },
  { name: "Thu", value: 140, avg: 85 },
  { name: "Fri", value: 210, avg: 160 },
  { name: "Sat", value: 160, avg: 100 },
  { name: "Sun", value: 130, avg: 70 },
];

export default function Dashboard() {
  const { toast } = useToast();
  const { data: widgets, isLoading: isLoadingWidgets } = useQuery<Widget[]>({
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
    queryKey: ["/api/inbox/conversations"],
  });

  const refreshMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/social-accounts/${id}/refresh`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
      toast({ title: "Token Refrescado", description: "La cuenta se ha sincronizado correctamente." });
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
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full absolute top-0 animate-spin" />
          <Zap className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </div>
    );
  }

  const pipelineData = [
    { name: 'Nuevos', value: crmStats?.new || 0, color: '#3b82f6' },
    { name: 'Contactando', value: crmStats?.contacting || 0, color: '#8b5cf6' },
    { name: 'Cualificados', value: crmStats?.qualified || 0, color: '#10b981' },
    { name: 'Ganados', value: crmStats?.won || 0, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary/30">
      {/* Dynamic Background Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5 px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase">
                v3.1 Stable
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">
              Control <span className="text-primary">SocialHub</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md">
              Gestión unificada de leads, automatización por voz y ecosistema de redes sociales.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-1 rounded-2xl flex gap-1">
              <Button variant="ghost" className="rounded-xl font-bold text-xs px-4 h-10 hover:bg-white/5">
                <Calendar className="w-4 h-4 mr-2" />
                Hoy
              </Button>
              <Button variant="ghost" className="rounded-xl font-bold text-xs px-4 h-10 text-slate-500 hover:text-white">
                Mes
              </Button>
            </div>
            <Button
              className="rounded-2xl bg-primary text-black font-black hover:scale-105 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)] px-6 h-12"
              onClick={() => window.location.href = '/inbox'}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Abrir Inbox
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={logout}
              className="rounded-2xl border-white/10 bg-white/5 h-12 w-12 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </motion.div>
        </header>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard 
            label="Clientes Activos" 
            value={customers.length.toString()} 
            change="+12.5%" 
            icon={Users} 
            color="bg-blue-500" 
            trend="up" 
          />
          <StatCard 
            label="Tasa de Cierre" 
            value="64%" 
            change="+4.2%" 
            icon={Target} 
            color="bg-emerald-500" 
            trend="up" 
          />
          <StatCard 
            label="IA Engagement" 
            value="892" 
            change="+18%" 
            icon={Activity} 
            color="bg-purple-500" 
            trend="up" 
          />
          <StatCard 
            label="Coste Lead" 
            value="$1.24" 
            change="-8%" 
            icon={TrendingUp} 
            color="bg-amber-500" 
            trend="down" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column - CRM & Charts */}
          <div className="xl:col-span-8 space-y-6">
            <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/5 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Actividad de Conversión
                  </CardTitle>
                  <CardDescription className="text-slate-500 mt-1">Interacción en tiempo real a través de canales vinculados</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Live Sync</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '16px',
                          color: '#f8fafc'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={4} 
                        fill="url(#chartGradient)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Pipeline */}
              <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/5 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Pipeline de Ventas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={pipelineData} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={30}>
                          {pipelineData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-slate-500">Valor Total Pipeline</span>
                      <span className="text-xl font-black text-white">$42,850</span>
                    </div>
                    <Button variant="ghost" className="rounded-xl text-primary font-bold text-xs" asChild>
                      <Link href="/customers">Detalles →</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Retell Voice AI Status */}
              <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Phone className="w-32 h-32 text-primary rotate-12" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Asistente de Voz (Retell)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-primary/10 border border-primary/20 relative">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-white text-lg">Retell Agent V1</p>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Modo: Ventas & Agendamiento</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map(i => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 bg-primary rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-slate-500 font-black uppercase">Llamadas Hoy</p>
                      <p className="text-2xl font-black text-white">24</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-slate-500 font-black uppercase">Duración Media</p>
                      <p className="text-2xl font-black text-white">3.2m</p>
                    </div>
                  </div>

                  <Button className="w-full h-12 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 border border-white/10" asChild>
                    <Link href="/platforms">Configurar Agentes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Social Platforms & Recent Activity */}
          <div className="xl:col-span-4 space-y-6">
            <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/5 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-amber-500" />
                    Plataformas Conectadas
                  </CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5 text-slate-400">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {accounts.map((account) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5">
                          {account.platform === 'whatsapp' && <MessageSquare className="w-6 h-6 text-emerald-500" />}
                          {account.platform === 'instagram' && <Instagram className="w-6 h-6 text-pink-500" />}
                          {account.platform === 'facebook' && <Facebook className="w-6 h-6 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-white truncate">{account.platform.toUpperCase()}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">ID: {account.id}</span>
                            <Badge className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black border-none h-4">ACTIVE</Badge>
                          </div>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => refreshMutation.mutate(account.id)}
                          disabled={refreshMutation.isPending}
                        >
                          <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-white/10 hover:border-primary/50 text-slate-500 hover:text-primary transition-all bg-transparent" asChild>
                  <Link href="/platforms">
                    <Plus className="w-4 h-4 mr-2" />
                    Vincular Nueva Cuenta
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <RecentConversations conversations={conversations} />

            {/* System Health */}
            <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/5 shadow-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-tighter">Estado del Sistema</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimizado</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
