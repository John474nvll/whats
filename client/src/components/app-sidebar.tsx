import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SocialAccount } from "@shared/schema";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { MessageSquare, Users, BarChart3, Sparkles, Settings, Home, GitFork, Megaphone, Instagram, Facebook, Smartphone, LinkIcon, Package, Lock, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";

const menuGroups = [
  {
    label: "🏠 PRINCIPAL",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "📱 CRM & VENTAS",
    items: [
      { title: "Inbox", url: "/inbox", icon: MessageSquare },
      { title: "Contacts", url: "/contacts", icon: Users },
      { title: "Customers", url: "/customers", icon: Users },
      { title: "Facturación", url: "/billing", icon: Package },
      { title: "Voz & Retell", url: "/voice", icon: Phone },
      { title: "Finanzas", url: "/finances", icon: BarChart3 },
    ],
  },
  {
    label: "📊 PROYECTOS",
    items: [
      { title: "Proyectos", url: "/projects", icon: GitFork },
      { title: "Tareas", url: "/tasks", icon: Package },
      { title: "Grupos", url: "/sales-groups", icon: Users },
    ],
  },
  {
    label: "📢 MARKETING",
    items: [
      { title: "Funnels", url: "/funnels", icon: GitFork },
      { title: "Campaigns", url: "/campaigns", icon: Megaphone },
      { title: "Links", url: "/links", icon: LinkIcon },
    ],
  },
  {
    label: "✨ IA & AUTOMATIZACIÓN",
    items: [
      { title: "AI Generator", url: "/ai-generator", icon: Sparkles },
      { title: "Plataformas", url: "/platforms", icon: Smartphone },
    ],
  },
  {
    label: "⚙️ SOPORTE & SISTEMA",
    items: [
      { title: "Soporte", url: "/tickets", icon: ShieldCheck },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { toast } = useToast();

  const { data: connectedAccounts, refetch: refetchAccounts } = useQuery<SocialAccount[]>({
    queryKey: ["/api/social-accounts/demo-user"], // In a real app, use the actual user ID
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/social-accounts/demo-user");
      return res.json();
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/social-accounts/${id}`);
    },
    onSuccess: () => {
      refetchAccounts();
      toast({ title: "Cuenta desconectada" });
    },
  });

  return (
    <Sidebar className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-2xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] group/sidebar data-[state=collapsed]:w-[var(--sidebar-width-icon)]">
      <SidebarContent className="space-y-1 md:space-y-2 pt-4">
        
        {/* Menu Groups - Responsive */}
        <div className="flex-1 overflow-y-auto px-1 md:px-2 scrollbar-none">
          {menuGroups.map((group) => (
            <SidebarGroup key={group.label} className="py-1 md:py-2">
              <SidebarGroupLabel className="text-[7px] md:text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] md:tracking-[0.25em] px-2 md:px-4 mb-1 md:mb-2 group-data-[state=collapsed]/sidebar:hidden">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5 md:gap-1">
                  {group.items.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent no-default-hover-elevate">
                          <Link href={item.url}>
                            <div
                              className={`flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl w-full transition-all duration-300 group/item relative overflow-hidden ${
                                isActive
                                  ? "bg-gradient-to-r from-primary to-primary/80 text-black font-black shadow-[0_10px_25px_rgba(34,197,94,0.25)] scale-[1.02]"
                                  : "text-slate-400 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <item.icon className={`h-4 md:h-5 w-4 md:w-5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 ${isActive ? "text-black" : "group-hover/item:text-primary"}`} />
                              <span className="text-xs md:text-sm tracking-tight group-data-[state=collapsed]/sidebar:hidden">{item.title}</span>
                              {isActive && (
                                <motion.div 
                                  layoutId="active-pill"
                                  className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-black/30"
                                />
                              )}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {/* Connected Accounts & Tokens Section */}
          <div className="py-4 px-1 md:px-2 group-data-[state=collapsed]/sidebar:hidden">
            <div className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] px-2 md:px-4 mb-3">
              🔐 Accesos Conectados
            </div>
            <div className="space-y-2">
              {connectedAccounts?.map((account) => {
                const IconComponent = account.platform === 'instagram' ? Instagram : 
                                     account.platform === 'facebook' ? Facebook : 
                                     account.platform === 'whatsapp' ? MessageSquare : Smartphone;
                return (
                  <motion.div
                    key={account.id}
                    whileHover={{ x: 4 }}
                    className={`p-3 rounded-lg border transition-all duration-300 group ${
                      account.platform === 'whatsapp' ? 'bg-green-500/10 border-green-500/30' : 
                      account.platform === 'instagram' ? 'bg-pink-500/10 border-pink-500/30' : 'bg-blue-500/10 border-blue-500/30'
                    } hover:shadow-lg relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-xs font-bold capitalize">{account.platform}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-red-500/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => disconnectMutation.mutate(account.id)}
                      >
                        <Lock className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {account.accessToken?.substring(0, 10)}••••••
                    </div>
                  </motion.div>
                );
              })}
              {(!connectedAccounts || connectedAccounts.length === 0) && (
                <div className="p-4 rounded-xl border border-dashed border-white/10 text-center space-y-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sin cuentas conectadas</p>
                  <Button variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5" asChild>
                    <Link href="/platforms">Conectar Ahora</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarContent>

      {/* Footer with Social Links */}
      <SidebarFooter className="border-t border-white/5 px-2 md:px-4 py-4 space-y-3 bg-gradient-to-t from-black/20 to-transparent group-data-[state=collapsed]/sidebar:flex-row">
        <div className="flex flex-wrap gap-2 justify-center group-data-[state=collapsed]/sidebar:flex-col items-center">
          {[
            { name: "WhatsApp", icon: MessageSquare, color: "text-green-400", link: "https://wa.me/3197368698" },
            { name: "Instagram", icon: Instagram, color: "text-pink-400", link: "https://www.instagram.com/johnncloudy" },
            { name: "Facebook", icon: Facebook, color: "text-blue-400", link: "https://www.facebook.com" },
          ].map((platform) => (
            <a key={platform.name} href={platform.link} target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] transition-all duration-300 group ${platform.color}`}
                title={platform.name}
              >
                <platform.icon className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </a>
          ))}
        </div>
        <div className="text-[9px] text-slate-500 flex justify-between items-center group-data-[state=collapsed]/sidebar:hidden px-1">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-400">SocialHub</p>
            <p className="opacity-50 tracking-tighter">V3.1 Premium</p>
          </div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[7px] font-black tracking-widest px-2 py-0.5 rounded-full">
            LIVE
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
