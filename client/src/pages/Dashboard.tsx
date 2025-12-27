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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here's your business overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={logout} className="rounded-lg hover:bg-destructive/10">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Activity Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activity Over Time
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Weekly message and engagement trends</p>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="border-border/50 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Instagram Mention", time: "2 min ago", color: "bg-pink-500" },
                { name: "WhatsApp Lead", time: "15 min ago", color: "bg-green-500" },
                { name: "Facebook Comment", time: "1 hour ago", color: "bg-blue-500" },
                { name: "New Follower", time: "3 hours ago", color: "bg-purple-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border/50 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { icon: Plus, label: "New Post", color: "bg-blue-500" },
                { icon: MessageSquare, label: "Send Message", color: "bg-green-500" },
                { icon: Megaphone, label: "Campaign", color: "bg-purple-500" },
                { icon: ShoppingBag, label: "Products", color: "bg-yellow-500" },
                { icon: Music, label: "Music", color: "bg-pink-500" },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-24 flex flex-col gap-2 rounded-lg hover:border-primary/50 group"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Connected Platforms */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-border/50 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Connected Platforms
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{accounts.length} accounts connected</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.slice(0, 6).map((account, i) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg border border-border/50 bg-card/30 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      {account.platform === "whatsapp" && <MessageCircle className="w-5 h-5 text-green-500" />}
                      {account.platform === "instagram" && <Instagram className="w-5 h-5 text-pink-500" />}
                      {account.platform === "facebook" && <Facebook className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate text-sm">{account.accountName}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{account.platform}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full rounded-lg text-xs">
                    View Details
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
