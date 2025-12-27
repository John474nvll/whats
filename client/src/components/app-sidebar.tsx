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
          <div className="flex items-center gap-2 md:gap-4 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-kiwi p-0.5 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
              <div className="w-full h-full rounded-[0.7rem] md:rounded-[0.9rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img src={logoImage} alt="SocialHub" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0 group-data-[state=collapsed]/sidebar:hidden">
              <h1 className="font-black text-xl md:text-2xl tracking-tighter text-white leading-none truncate">Social<span className="text-kiwi">Hub</span></h1>
              <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-slate-500 whitespace-nowrap">v3.0 PWA</span>
                <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-kiwi animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Groups - Responsive */}
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1 md:py-2 px-1 md:px-2">
            <SidebarGroupLabel className="text-[7px] md:text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] md:tracking-[0.25em] px-2 md:px-4 mb-1 md:mb-2 group-data-[state=collapsed]/sidebar:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5 md:gap-1">
                {group.items.map((item) => {
                  const isActive = location === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
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

        {/* Connected Platforms - Responsive */}
        <SidebarGroup className="py-2 md:py-4 px-1 md:px-2">
          <SidebarGroupLabel className="text-[7px] md:text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] md:tracking-[0.25em] px-2 md:px-4 mb-1 md:mb-2 group-data-[state=collapsed]/sidebar:hidden">
            🔗 Plataformas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1 md:space-y-2 px-1 md:px-2">
              {socialPlatforms.map((platform) => (
                <a key={platform.name} href={platform.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`md:w-full md:justify-start md:gap-3 h-9 md:h-11 w-9 md:w-auto px-0 md:px-4 rounded-lg md:rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 group ${platform.textColor} hover:${platform.textColor}`}
                    title={platform.name}
                  >
                    <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${platform.color} shadow-[0_0_10px_currentColor] group-hover:scale-125 transition-transform`} />
                    <span className="hidden md:inline text-xs font-black uppercase tracking-widest">{platform.name}</span>
                  </Button>
                </a>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Responsive */}
      <SidebarFooter className="border-t border-slate-800 px-2 md:px-4 py-2 md:py-4">
        <div className="text-[10px] md:text-xs text-slate-500 space-y-0.5 md:space-y-1 group-data-[state=collapsed]/sidebar:hidden">
          <p className="font-semibold text-slate-400 text-xs md:text-sm">SocialHub</p>
          <p className="text-[9px] md:text-xs">v3.0 PWA</p>
          <p className="text-[9px] md:text-xs">© 2025</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
