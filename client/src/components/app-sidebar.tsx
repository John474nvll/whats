import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
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
import { MessageSquare, Users, BarChart3, Sparkles, Settings, Home, GitFork, Megaphone, Music, Instagram, Facebook, Smartphone, LinkIcon, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";

const menuGroups = [
  {
    label: "🏠 PRINCIPAL",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
    ],
  },
  {
    label: "📱 CANALES SOCIALES",
    items: [
      { title: "Inbox", url: "/inbox", icon: MessageSquare },
      { title: "Contacts", url: "/contacts", icon: Users },
      { title: "Customers", url: "/customers", icon: Users },
      { title: "Account Links", url: "/accounts", icon: LinkIcon },
    ],
  },
  {
    label: "📢 MARKETING",
    items: [
      { title: "Campaigns", url: "/campaigns", icon: Megaphone },
      { title: "Products", url: "/products", icon: Package },
      { title: "Custom Links", url: "/links", icon: LinkIcon },
      { title: "Funnels", url: "/funnels", icon: GitFork },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "🎵 CONTENIDO",
    items: [
      { title: "Music Studio", url: "/music", icon: Music },
      { title: "Spotify Artist", url: "/spotify-artist", icon: Music },
      { title: "AI Generator", url: "/ai-generator", icon: Sparkles },
    ],
  },
  {
    label: "🔗 Plataformas",
    items: [
      { title: "Plataformas", url: "/platforms", icon: Smartphone },
    ],
  },
  {
    label: "⚙️ SISTEMA",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

const socialPlatforms = [
  { name: "WhatsApp", color: "bg-green-500", textColor: "text-green-400", borderColor: "border-green-500/20", bgHover: "hover:bg-green-500/20", link: "https://wa.me/3197368698" },
  { name: "Instagram", color: "bg-pink-500", textColor: "text-pink-400", borderColor: "border-pink-500/20", bgHover: "hover:bg-pink-500/20", link: "https://www.instagram.com/johnncloudy" },
  { name: "Facebook", color: "bg-blue-500", textColor: "text-blue-400", borderColor: "border-blue-500/20", bgHover: "hover:bg-blue-500/20", link: "https://www.facebook.com" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)] group/sidebar data-[state=collapsed]:w-[var(--sidebar-width-icon)]">
      <SidebarContent className="space-y-1 md:space-y-2">
        {/* Logo Section - Responsive */}
        <div className="px-3 md:px-6 py-4 md:py-8 border-b border-white/5 mb-2 md:mb-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-kiwi/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex items-center gap-2 md:gap-4 relative z-10 overflow-visible">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-kiwi p-0.5 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
              <div className="w-full h-full rounded-[0.7rem] md:rounded-[0.9rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img src={logoImage} alt="SocialHub" className="w-full h-full object-contain p-1" />
              </div>
            </div>
            <div className="flex-1 min-w-0 group-data-[state=collapsed]/sidebar:hidden overflow-visible">
              <h1 className="font-black text-xl md:text-2xl tracking-tighter text-white leading-none truncate">Social<span className="text-kiwi">Hub</span></h1>
              <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-slate-500 whitespace-nowrap">v3.0 PWA</span>
                <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-kiwi animate-pulse" />
              </div>
            </div>
          </div>
        </div>

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
                              className={`flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-2xl w-full transition-all duration-300 group/item relative overflow-hidden ${
                                isActive
                                  ? "bg-kiwi text-black font-black shadow-[0_10px_20px_rgba(34,197,94,0.2)] scale-[1.02]"
                                  : "text-slate-400 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <item.icon className={`h-4 md:h-5 w-4 md:w-5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 ${isActive ? "text-black" : "group-hover/item:text-kiwi"}`} />
                              <span className="text-xs md:text-sm tracking-tight group-data-[state=collapsed]/sidebar:hidden">{item.title}</span>
                              {isActive && (
                                <motion.div 
                                  layoutId="active-pill"
                                  className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-black"
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
        </div>
      </SidebarContent>

      {/* Social Platforms - Compact in Footer Area */}
      <SidebarFooter className="border-t border-white/5 px-2 md:px-4 py-4 space-y-4 bg-black/20">
        <div className="flex flex-wrap gap-2 justify-center group-data-[state=collapsed]/sidebar:flex-col items-center">
          {socialPlatforms.map((platform) => (
            <a key={platform.name} href={platform.link} target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 group ${platform.textColor} hover:${platform.textColor} shadow-lg shadow-black/40`}
                title={platform.name}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${platform.color} shadow-[0_0_10px_currentColor] group-hover:scale-125 transition-transform`} />
              </Button>
            </a>
          ))}
        </div>
        <div className="text-[10px] text-slate-500 flex justify-between items-center group-data-[state=collapsed]/sidebar:hidden px-1">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-400">SocialHub</p>
            <p className="opacity-50 tracking-tighter">© 2025</p>
          </div>
          <Badge variant="outline" className="border-white/10 text-slate-400 text-[8px] bg-white/5 font-black tracking-widest px-2 py-0.5 rounded-full">
            V3.0 PWA
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
