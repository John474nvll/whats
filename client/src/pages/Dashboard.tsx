
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
        <Zap className="w-12 h-12 text-primary animate-pulse" />
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
            <p className="text-slate-400">Panel de Control Unificado v3.1</p>
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
          <Card className="col-span-8 bg-slate-900/40 border-white/5">
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

          <Card className="col-span-4 bg-slate-900/40 border-white/5">
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
