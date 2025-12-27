import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Settings,
  LogOut,
  ShoppingBag,
  Megaphone,
  Music,
  Send,
  Download,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Widget } from "@shared/schema";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const activityData = [
  { name: "Mon", value: 120, avg: 80 },
  { name: "Tue", value: 150, avg: 95 },
  { name: "Wed", value: 180, avg: 110 },
  { name: "Thu", value: 140, avg: 85 },
  { name: "Fri", value: 210, avg: 160 },
  { name: "Sat", value: 160, avg: 100 },
  { name: "Sun", value: 130, avg: 70 },
];

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: "up" | "down" | "neutral";
}

const StatCard = ({ label, value, change, icon: Icon, color, trend }: StatCard) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group"
  >
    <Card className="border-border/50 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-16 -mt-16">
        <Icon className="w-full h-full" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} shadow-lg shadow-current/20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-bold gap-1 ${
              trend === "up"
                ? "text-green-500 border-green-500/30 bg-green-500/10"
                : trend === "down"
                ? "text-red-500 border-red-500/30 bg-red-500/10"
                : "text-slate-500 border-slate-500/30 bg-slate-500/10"
            }`}
          >
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </Badge>
        </div>
        <h3 className="text-3xl font-black text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground font-semibold">{label}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Dashboard() {
  const { toast } = useToast();
  const { data: widgets, isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });
  const { data: accounts = [] } = useQuery<any[]>({
    queryKey: ["/api/social-accounts"],
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  const stats: StatCard[] = [
    {
      label: "Total Messages",
      value: "12.5K",
      change: "+15%",
      icon: MessageSquare,
      color: "bg-blue-500",
      trend: "up",
    },
    {
      label: "Active Contacts",
      value: "2,847",
      change: "+8%",
      icon: Users,
      color: "bg-purple-500",
      trend: "up",
    },
    {
      label: "Sales Revenue",
      value: "$4.5K",
      change: "+22%",
      icon: TrendingUp,
      color: "bg-green-500",
      trend: "up",
    },
    {
      label: "Engagement Rate",
      value: "5.2%",
      change: "-2.1%",
      icon: Activity,
      color: "bg-pink-500",
      trend: "down",
    },
  ];

  return (
    <div className="min-h-screen bg-background/50 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Dashboard Principal</h1>
            <p className="text-muted-foreground mt-2 font-medium">Resumen general de tu ecosistema digital</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button 
              variant="outline" 
              className="rounded-2xl border-primary/30 bg-primary/10 backdrop-blur-md hover:bg-primary/20 text-sm font-bold"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/api/download/report';
                link.download = 'socialhub_report.csv';
                link.click();
              }}
              data-testid="button-download-report"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar Reporte
            </Button>
            <Button 
              variant="outline" 
              className="rounded-2xl border-secondary/30 bg-secondary/10 backdrop-blur-md hover:bg-secondary/20 text-sm font-bold"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/api/download/libraries';
                link.download = 'libraries.json';
                link.click();
              }}
              data-testid="button-download-libs"
            >
              <Package className="w-4 h-4 mr-2" />
              Descargar Librerías
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" data-testid="button-logout">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Activity Chart */}
        <div className="lg:col-span-8">
          <Card className="border-border/40 bg-card/40 backdrop-blur-2xl h-full shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="w-5 h-5 text-primary" />
                  Rendimiento Semanal
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Tendencias de mensajes y engagement</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">En vivo</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 15, 0.9)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "16px",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                      }}
                      itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4">
          <Card className="border-border/40 bg-card/40 backdrop-blur-2xl h-full shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Actividad Reciente</CardTitle>
              <p className="text-sm text-muted-foreground">Últimas interacciones registradas</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: "Instagram Mention", time: "2 min ago", color: "bg-pink-500", icon: Instagram },
                { name: "WhatsApp Lead", time: "15 min ago", color: "bg-green-500", icon: MessageCircle },
                { name: "Facebook Comment", time: "1 hour ago", color: "bg-blue-500", icon: Facebook },
                { name: "New Follower", time: "3 hours ago", color: "bg-purple-500", icon: Users },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-xl ${item.color}/10 flex items-center justify-center text-white transition-transform group-hover:scale-110`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-5 h-5 text-primary" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Plus, label: "Nuevo Post", color: "bg-blue-500" },
                { icon: MessageSquare, label: "Mensaje", color: "bg-green-500" },
                { icon: Megaphone, label: "Campaña", color: "bg-purple-500" },
                { icon: ShoppingBag, label: "Productos", color: "bg-yellow-500" },
                { icon: Music, label: "Música", color: "bg-pink-500" },
                { icon: Send, label: "Masivo", color: "bg-cyan-500" },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-28 flex flex-col gap-3 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 group transition-all"
                >
                  <div className={`p-3 rounded-xl ${action.color} text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-center tracking-wide">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platforms Summary */}
        <Card className="border-border/40 bg-card/40 backdrop-blur-2xl shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Link2 className="w-5 h-5 text-primary" />
                Cuentas Vinculadas
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{accounts.length} plataformas activas</p>
            </div>
            <Button size="sm" variant="kiwi" className="rounded-xl">Conectar</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.slice(0, 4).map((account) => (
                <div
                  key={account.id}
                  className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      {account.platform === "whatsapp" && <MessageCircle className="w-6 h-6 text-green-500" />}
                      {account.platform === "instagram" && <Instagram className="w-6 h-6 text-pink-500" />}
                      {account.platform === "facebook" && <Facebook className="w-6 h-6 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground truncate text-sm">{account.accountName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Conectado</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
