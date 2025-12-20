import { Sidebar } from "@/components/Sidebar";
import { useConversations } from "@/hooks/use-conversations";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area 
} from "recharts";
import { MessageCircle, Users, Zap, TrendingUp, Clock, Bot } from "lucide-react";

// Mock data for charts since we don't have analytics endpoints yet
const activityData = [
  { name: 'Mon', messages: 120, bot: 80 },
  { name: 'Tue', messages: 150, bot: 95 },
  { name: 'Wed', messages: 180, bot: 110 },
  { name: 'Thu', messages: 140, bot: 85 },
  { name: 'Fri', messages: 210, bot: 160 },
  { name: 'Sat', messages: 160, bot: 100 },
  { name: 'Sun', messages: 130, bot: 70 },
];

export default function Dashboard() {
  const { data: conversations, isLoading } = useConversations();

  const totalConversations = conversations?.length || 0;
  const activeBots = conversations?.filter(c => c.botStatus).length || 0;
  const whatsappCount = conversations?.filter(c => c.channel === 'whatsapp').length || 0;

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[url('/grid-pattern.svg')] bg-fixed">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Overview</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium border border-green-500/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Operational
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Chats", value: totalConversations, icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "AI Pilots Active", value: activeBots, icon: Bot, color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: "WhatsApp Traffic", value: whatsappCount, icon: Zap, color: "text-green-500", bg: "bg-green-500/10" },
              { label: "Response Rate", value: "98.5%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-500 flex items-center bg-green-500/10 px-2 py-0.5 rounded">
                    +12%
                  </span>
                </div>
                <h3 className="text-3xl font-bold font-display">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-display">Message Activity</h2>
                <div className="flex gap-2 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Total
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-accent" /> AI Handled
                  </span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBot" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="messages" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMessages)" strokeWidth={2} />
                    <Area type="monotone" dataKey="bot" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorBot)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg flex flex-col"
            >
              <h2 className="text-lg font-bold font-display mb-6">Recent Activity</h2>
              <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary/50" />
                      <div className="w-0.5 h-full bg-border mt-2" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">New conversation started</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 2 mins ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
