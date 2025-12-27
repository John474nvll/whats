import { useState } from "react";
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
  Megaphone,
  GitFork,
  Music,
  Send,
  Zap,
  Link2,
  Trash2,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SiSpotify } from "react-icons/si";
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
  const { toast } = useToast();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState("");
  const { data: widgets, isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/widgets"],
  });
  const { data: accounts = [] } = useQuery<any[]>({
    queryKey: ["/api/social-accounts"],
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

  const connectAccount = async (platform: string) => {
    setConnectingPlatform(platform);
    try {
      const accountId = prompt(`Enter your ${platform} Account ID:`, `${platform}_id_123`);
      const accountName = prompt(`Account nickname:`, `My ${platform}`);
      const accessToken = prompt(`Access Token:`, `demo_token_${platform}`);

      if (!accountId || !accountName || !accessToken) {
        toast({ title: "Cancelled", description: "All fields required" });
        return;
      }

      const res = await apiRequest("POST", "/api/social-accounts/connect", {
        platform,
        accountId,
        accountName,
        accessToken,
      });

      if (res.ok) {
        toast({ title: "Success!", description: `${platform} connected` });
        queryClient.invalidateQueries({ queryKey: ["/api/social-accounts"] });
        setShowConnectModal(false);
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to connect account", variant: "destructive" });
    } finally {
      setConnectingPlatform("");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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
              { label: "WhatsApp Leads", value: "48", icon: MessageCircle, color: "bg-green-500", change: "+15%" },
              { label: "Instagram Reach", value: "12.2K", icon: Instagram, color: "bg-pink-500", change: "+8%" },
              { label: "Spotify Streams", value: "4.5K", icon: Music, color: "bg-green-600", change: "+22%" },
              { label: "Engagement Rate", value: "5.2%", icon: TrendingUp, color: "bg-amber-500", change: "+2.1%" },
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
                Administrador de Mensajes & Social
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full gap-2">
                  <Zap className="h-4 w-4" /> Auto-Reply
                </Button>
                <Button size="sm" variant="primary" className="rounded-full gap-2">
                  <Send className="h-4 w-4" /> Masivo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Cloudy", platform: "Instagram", msg: "Loved the new post! Check DM", time: "2 min", icon: Instagram, color: "text-pink-500", url: "https://www.instagram.com/johnncloudy" },
                  { name: "Facebook User", platform: "Facebook", msg: "Interested in your latest share", time: "10 min", icon: Facebook, color: "text-blue-500", url: "https://www.facebook.com/share/1N72uj6t9U/" },
                  { name: "Admin (3197368698)", platform: "WhatsApp", msg: "New lead from Bogotá", time: "45 min", icon: MessageCircle, color: "text-green-500", url: "https://wa.me/3197368698" },
                  { name: "New Follower", platform: "Spotify", msg: "Started following your playlist", time: "1h", icon: Music, color: "text-green-400", url: "#" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors group">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{item.name}</p>
                        <item.icon className={`h-3 w-3 ${item.color}`} />
                        {item.platform === 'Spotify' && <Badge variant="secondary" className="text-[8px] h-3 px-1">ARTISTA</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{item.msg}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full no-default-hover-elevate">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full no-default-hover-elevate">
                        <SettingsIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.time}</p>
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

  const salesAccounts = accounts?.filter(acc => 
    acc.accountName.toLowerCase().includes("ventas") || 
    acc.accountName.toLowerCase().includes("sales")
  ) || [];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-8">
      <div className="max-w-[1400px] mx-auto space-y-8 relative">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Sales Accounts Overview */}
        {salesAccounts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {salesAccounts.map(acc => (
              <Card key={acc.id} className="glass-card rounded-[2rem] border-border/50 overflow-hidden relative group bg-card/50 backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                   <Badge variant="outline" className="rounded-full bg-kiwi/10 text-kiwi border-kiwi/20">Ventas Activas</Badge>
                </div>
                <CardHeader className="flex flex-row items-center gap-4">
                  <img 
                    src={acc.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.platform}`} 
                    className="h-16 w-16 rounded-2xl border-2 border-kiwi/30"
                    alt="Sales Profile"
                  />
                  <div>
                    <CardTitle className="text-xl font-black">{acc.accountName}</CardTitle>
                    <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">{acc.platform}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Leads</p>
                      <p className="text-xl font-black text-kiwi">{(acc.followersCount || 0) / 10}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Conversiones</p>
                      <p className="text-xl font-black text-cyan-neon">{(acc.postsCount || 0) * 2}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">ROI</p>
                      <p className="text-xl font-black text-raspberry">12%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">SocialHub</h1>
            <p className="text-muted-foreground font-medium text-lg">Resumen inteligente de tu ecosistema digital</p>
          </div>
          <div className="flex gap-3">
            <Button size="sm" onClick={logout} variant="outline" className="gap-2 rounded-full">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Quick Account Connection */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" /> Connected Accounts
            </CardTitle>
            <Button size="sm" onClick={() => setShowConnectModal(!showConnectModal)} className="rounded-full">
              <Plus className="h-4 w-4 mr-1" /> Connect Account
            </Button>
          </CardHeader>
          {showConnectModal && (
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["instagram", "facebook", "whatsapp"].map((platform) => {
                const isConnected = accounts.some((a) => a.platform === platform);
                return (
                  <div key={platform} className="flex flex-col gap-2">
                    <p className="text-sm font-medium capitalize">{platform}</p>
                    {isConnected ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="flex-1" disabled>
                          ✓ Connected
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => connectAccount(platform)}
                        disabled={connectingPlatform === platform}
                        className="rounded-lg"
                      >
                        {connectingPlatform === platform ? "Connecting..." : "Connect"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          )}
          {!showConnectModal && accounts.length > 0 && (
            <CardContent className="flex flex-wrap gap-2">
              {accounts.map((acc) => (
                <div key={acc.id} className="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center gap-2">
                  <span className="capitalize">{acc.platform}</span>
                  <span className="text-xs text-muted-foreground">({acc.accountName})</span>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

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
