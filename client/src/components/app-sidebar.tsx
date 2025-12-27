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
    <Sidebar className="bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      <SidebarContent className="space-y-2">
        {/* Logo Section */}
        <div className="px-6 py-8 border-b border-white/5 mb-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-kiwi/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-kiwi p-0.5 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <div className="w-full h-full rounded-[0.9rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img src={logoImage} alt="MasterHub" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="font-black text-2xl tracking-tighter text-white leading-none">Master<span className="text-kiwi">Hub</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">v2.0 Enterprise</span>
                <div className="w-1.5 h-1.5 rounded-full bg-kiwi animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Groups */}
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2 px-2">
            <SidebarGroupLabel className="text-[10px] font-black uppercase text-slate-600 tracking-[0.25em] px-4 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = location === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-auto p-0 hover:bg-transparent">
                        <Link href={item.url}>
                          <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full transition-all duration-300 group/item relative overflow-hidden ${
                              isActive
                                ? "bg-kiwi text-black font-black shadow-[0_10px_20px_rgba(34,197,94,0.2)] scale-[1.02]"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 ${isActive ? "text-black" : "group-hover/item:text-kiwi"}`} />
                            <span className="text-sm tracking-tight">{item.title}</span>
                            {isActive && (
                              <motion.div 
                                layoutId="active-pill"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-black"
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

        {/* Connected Platforms */}
        <SidebarGroup className="py-4 px-2">
          <SidebarGroupLabel className="text-[10px] font-black uppercase text-slate-600 tracking-[0.25em] px-4 mb-2">
            🔗 Ecosistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              {socialPlatforms.map((platform) => (
                <a key={platform.name} href={platform.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 h-11 px-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 group ${platform.textColor} hover:${platform.textColor}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${platform.color} shadow-[0_0_10px_currentColor] group-hover:scale-125 transition-transform`} />
                    <span className="text-xs font-black uppercase tracking-widest">{platform.name}</span>
                  </Button>
                </a>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-800 px-4 py-4">
        <div className="text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">SocialHub v2.0</p>
          <p>Powered by OpenAI + Replit</p>
          <p>© 2025 SocialHub Platforms</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
