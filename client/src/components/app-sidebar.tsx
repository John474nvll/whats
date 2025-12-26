import { Link, useLocation } from "wouter";
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
import { MessageSquare, Users, BarChart3, Sparkles, Settings, Home, GitFork, Megaphone, Music, Instagram, Facebook, Smartphone, LinkIcon } from "lucide-react";
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
    <Sidebar className="bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800">
      <SidebarContent className="space-y-2">
        {/* Logo Section */}
        <div className="px-4 py-6 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center overflow-hidden shadow-lg shadow-primary/50">
              <img src={logoImage} alt="SocialHub" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">SocialHub</h1>
              <p className="text-xs text-slate-400">v2.0</p>
            </div>
          </div>
        </div>

        {/* Menu Groups */}
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-4">
            <SidebarGroupLabel className="text-xs font-bold uppercase text-slate-500 tracking-widest px-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <div
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg w-full transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 text-white border border-primary/40 shadow-lg shadow-primary/20"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            }`}
                          >
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                            <span className="font-medium text-sm">{item.title}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
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
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-bold uppercase text-slate-500 tracking-widest px-2">
            🔗 Plataformas Conectadas
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <div className="space-y-2 px-2">
              {socialPlatforms.map((platform) => (
                <a key={platform.name} href={platform.link} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className={`w-full justify-start gap-3 ${platform.bgHover} border ${platform.borderColor} ${platform.textColor} hover:${platform.textColor} transition-all duration-200 rounded-lg h-10 text-sm font-medium`}
                  >
                    <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                    {platform.name}
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
