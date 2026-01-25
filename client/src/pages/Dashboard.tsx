
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
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentConversations } from "@/components/dashboard/RecentConversations";
import { SalesPipeline } from "@/components/crm/SalesPipeline";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Ticket, Opportunity } from "@shared/schema";

const activityData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 150 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 140 },
  { name: "Fri", value: 210 },
  { name: "Sat", value: 160 },
  { name: "Sun", value: 130 },
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
    queryKey: ["/api/conversations"],
  });
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ["/api/crm/projects"],
  });

  const { data: tickets = [] } = useQuery<Ticket[]>({
    queryKey: ["/api/crm/tickets"],
  });
  const { data: opportunities = [] } = useQuery<Opportunity[]>({
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
          <p className="text-primary font-black animate-pulse uppercase tracking-widest text-xs">SocialHub Initializing...</p>
        </div>
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
    <div className="min-h-screen bg-[#050a06] text-slate-200">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_50%)] pointer-events-none" />
      <div className="max-w-[1600px] mx-auto p-6 space-y-8 relative">
        <header className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white">
              Control <span className="text-primary">SocialHub</span>
            </h1>
            <p className="text-slate-400">Panel de Control Unificado v9.0</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" size="icon" onClick={logout} className="rounded-2xl">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-5 gap-6">
          <StatCard label="Clientes" value={customers.length.toString()} icon={Users} color="bg-blue-500" trend="up" change="+12%" />
          <StatCard label="Proyectos" value={projects.length.toString()} icon={Package} color="bg-primary" trend="up" change="+5%" />
          <StatCard label="Tickets" value={tickets.length.toString()} icon={Activity} color="bg-orange-500" trend="up" change="+3%" />
          <StatCard label="Oportunidades" value={opportunities.length.toString()} icon={Target} color="bg-emerald-500" trend="up" change="+8%" />
          <StatCard label="Engagement" value="89%" icon={Activity} color="bg-slate-500" trend="up" change="+2%" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-6 bg-slate-900/60 border-primary/20 backdrop-blur-xl rounded-[3rem] p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">API Latency</span>
                  <span className="text-kiwi font-bold">24ms</span>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Database</span>
                  <Badge className="bg-kiwi/20 text-kiwi border-none uppercase text-[8px]">Stable</Badge>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Voz AI Nodes</span>
                  <span className="text-white font-bold">12 Active</span>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Sync status</span>
                  <RefreshCw className="w-3 h-3 text-kiwi animate-spin" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-6 bg-slate-900/60 border-primary/20 backdrop-blur-xl rounded-[3rem] p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Log Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/40 rounded-3xl p-4 font-mono text-[10px] h-[120px] overflow-hidden space-y-2">
                <p className="text-kiwi flex gap-2"><span className="opacity-50">[INFO]</span> WhatsApp API Sync completed successfully</p>
                <p className="text-cyan-neon flex gap-2"><span className="opacity-50">[VOICE]</span> Retell Node-4 connected: Ready for calls</p>
                <p className="text-white/60 flex gap-2"><span className="opacity-50">[CRM]</span> New lead qualified: ID 48293</p>
                <p className="text-piña flex gap-2"><span className="opacity-50">[WARN]</span> High engagement spike detected in IG-Business</p>
              </div>
            </CardContent>
          </Card>

          {/* SocialHub Quick Access Widget */}
          <Card className="col-span-12 bg-slate-900/60 border-primary/20 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,128,0.1)] rounded-[3rem] p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                SocialHub Quick Access
              </CardTitle>
              <CardDescription className="text-slate-400">Acceso directo a todos los módulos del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {[
                  { label: "Clientes", icon: Users, href: "/customers", color: "text-blue-400" },
                  { label: "Proyectos", icon: Package, href: "/projects", color: "text-primary" },
                  { label: "Tareas", icon: Calendar, href: "/tasks", color: "text-yellow-400" },
                  { label: "Ventas", icon: TrendingUp, href: "/sales-groups", color: "text-emerald-400" },
                  { label: "Tickets", icon: Activity, href: "/tickets", color: "text-orange-400" },
                  { label: "Voz & AI", icon: Phone, href: "/voice", color: "text-kiwi" },
                  { label: "Oportunidades", icon: Target, href: "/opportunities", color: "text-cyan-400" },
                  { label: "Campañas", icon: Zap, href: "/campaigns", color: "text-purple-400" },
                  { label: "Cuentas", icon: Link2, href: "/platforms", color: "text-pink-400" },
                  { label: "Finanzas", icon: BarChart3, href: "/finances", color: "text-green-400" },
                  { label: "Links", icon: LinkIcon, href: "/links", color: "text-cyan-neon" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button variant="ghost" className="w-full h-auto py-6 flex flex-col gap-2 rounded-3xl hover:bg-white/5 transition-all group">
                      <div className={`p-3 rounded-2xl bg-slate-800 group-hover:bg-slate-700 transition-colors ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-8 bg-slate-900/40 border-white/5 rounded-[3rem]">
            <CardHeader>
              <CardTitle>Actividad del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={0.1} />
                    <CartesianGrid strokeOpacity={0.05} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-4 bg-slate-900/40 border-white/5 rounded-[3rem]">
            <CardHeader>
              <CardTitle>Pipeline CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={pipelineData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {pipelineData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
