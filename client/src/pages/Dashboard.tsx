import { useConversations } from "@/hooks/use-conversations";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Clock,
  Megaphone,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const activityData = [
  { name: "Mon", messages: 120, bot: 80 },
  { name: "Tue", messages: 150, bot: 95 },
  { name: "Wed", messages: 180, bot: 110 },
  { name: "Thu", messages: 140, bot: 85 },
  { name: "Fri", messages: 210, bot: 160 },
  { name: "Sat", messages: 160, bot: 100 },
  { name: "Sun", messages: 130, bot: 70 },
];

const recentMessages = [
  {
    id: 1,
    name: "María López",
    platform: "Instagram",
    message: "Hola, tengo una pregunta sobre el producto...",
    time: "Hace 5 min",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    platform: "Facebook",
    message: "Necesito información sobre tu servicio",
    time: "Hace 12 min",
  },
  {
    id: 3,
    name: "Ana García",
    platform: "WhatsApp",
    message: "Estoy interesada en tus productos",
    time: "Hace 1 hora",
  },
];

const campaigns = [
  {
    id: 1,
    name: "Lanzamiento de Producto",
    platform: "Instagram",
    status: "Activo",
    reach: "45.2k",
  },
  {
    id: 2,
    name: "Promoción Verano",
    platform: "Facebook",
    status: "Pausado",
    reach: "23.1k",
  },
];

export default function Dashboard() {
  const { data: conversations, isLoading } = useConversations();

  const totalConversations = conversations?.length || 0;
  const activeBots = conversations?.filter((c) => c.botStatus).length || 0;
  const totalFollowers = 24500;
  const engagementRate = 4.8;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">SocialHub</h1>
            <p className="text-muted-foreground mt-1">
              Resumen de actividad de tus redes sociales
            </p>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar mensajes, campañas..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Mensajes Nuevos",
              value: "24",
              icon: MessageCircle,
              color: "bg-blue-500",
              change: "+12%",
            },
            {
              label: "Campañas Activas",
              value: "8",
              icon: Megaphone,
              color: "bg-purple-500",
              change: "+2 y mes anterior",
            },
            {
              label: "Seguidores Totales",
              value: "24.5K",
              icon: Users,
              color: "bg-green-500",
              change: "+5.2% vs mes anterior",
            },
            {
              label: "Tasa de Engagement",
              value: "4.8%",
              icon: TrendingUp,
              color: "bg-amber-500",
              change: "+1.3% vs mes anterior",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${stat.color} text-white w-fit`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Recent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Mensajes Recientes</h2>
                <a href="/inbox" className="text-sm text-primary hover:underline" data-testid="link-view-all-messages">
                  Ver todos
                </a>
              </div>
              <div className="space-y-4">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{msg.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {msg.message}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {msg.time}
                      </p>
                      <div className="mt-1">
                        <Badge variant="secondary">{msg.platform}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Campaigns Recent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Campañas Recientes</h2>
                <a href="#" className="text-sm text-primary hover:underline" data-testid="link-view-all-campaigns">
                  Ver todas
                </a>
              </div>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-foreground">
                        {campaign.name}
                      </p>
                      <Badge
                        variant={
                          campaign.status === "Activo" ? "default" : "outline" as any
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {campaign.platform}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      Alcance: {campaign.reach}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Actividad de Mensajes</h2>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">IA Manejado</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient
                      id="colorMessages"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorBot"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--accent))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--accent))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorMessages)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="bot"
                    stroke="hsl(var(--accent))"
                    fillOpacity={1}
                    fill="url(#colorBot)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
