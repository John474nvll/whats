import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Instagram, 
  Facebook, 
  MessageCircle,
  Activity,
  Layout,
  Settings as SettingsIcon,
  Plus,
  Search,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "recharts";

const activityData = [
  { name: "Mon", messages: 120, bot: 80 },
  { name: "Tue", messages: 150, bot: 95 },
  { name: "Wed", messages: 180, bot: 110 },
  { name: "Thu", messages: 140, bot: 85 },
  { name: "Fri", messages: 210, bot: 160 },
  { name: "Sat", messages: 160, bot: 100 },
  { name: "Sun", messages: 130, bot: 70 },
];

export default function Dashboard() {
  const { data: widgets, isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });

  const updateWidget = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Widget> }) => {
      const res = await apiRequest("PATCH", `/api/widgets/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "stats":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            {[
              { label: "Mensajes Nuevos", value: "24", icon: MessageCircle, color: "bg-blue-500", change: "+12%" },
              { label: "Campañas Activas", value: "8", icon: Megaphone, color: "bg-purple-500", change: "+2" },
              { label: "Seguidores Totales", value: "24.5K", icon: Users, color: "bg-green-500", change: "+5.2%" },
              { label: "Engagement", value: "4.8%", icon: TrendingUp, color: "bg-amber-500", change: "+1.3%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="hover-elevate border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-green-600 font-bold">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        );
      case "social_feed":
        return (
          <Card className="hover-elevate border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                {widget.title}
              </CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "María López", platform: "Instagram", msg: "Pregunta sobre producto", time: "5 min", icon: Instagram, color: "text-pink-500" },
                  { name: "Carlos R.", platform: "Facebook", msg: "Info de servicio", time: "12 min", icon: Facebook, color: "text-blue-500" },
                  { name: "Ana García", platform: "WhatsApp", msg: "Interesada en compra", time: "1h", icon: MessageCircle, color: "text-green-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.msg}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.time}</p>
                      <item.icon className={`h-3 w-3 ${item.color} mt-1 ml-auto`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case "activity":
        return (
          <Card className="hover-elevate border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area type="monotone" dataKey="messages" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case "quick_actions":
        return (
          <Card className="hover-elevate border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-24 flex flex-col gap-3 rounded-2xl border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Nuevo Post</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-3 rounded-2xl border-border/50 hover:bg-purple-500/5 hover:border-purple-500/30 transition-all">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Megaphone className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Campaña</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-3 rounded-2xl border-border/50 hover:bg-green-500/5 hover:border-green-500/30 transition-all">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Contactos</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-3 rounded-2xl border-border/50 hover:bg-orange-500/5 hover:border-orange-500/30 transition-all">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <SettingsIcon className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Ajustes</span>
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">SocialHub</h1>
            <p className="text-muted-foreground font-medium text-lg">Resumen inteligente de tu ecosistema digital</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar actividad, mensajes..."
              className="pl-12 h-14 rounded-2xl bg-card/50 border-border/50 focus:ring-primary/20 transition-all text-lg"
            />
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {widgets?.filter(w => w.isVisible).map((widget) => (
            <div 
              key={widget.id} 
              className={
                widget.type === "stats" ? "col-span-12" : 
                widget.type === "social_feed" ? "col-span-12 lg:col-span-7" : 
                "col-span-12 lg:col-span-5"
              }
            >
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
