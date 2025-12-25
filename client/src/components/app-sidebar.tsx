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
import { MessageSquare, Users, BarChart3, Sparkles, Settings, Home, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Messages", url: "/inbox", icon: MessageSquare },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Social Media", url: "/social-media", icon: Share2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "AI Generator", url: "/ai-generator", icon: Sparkles },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800">
      <SidebarContent>
        {/* Logo Section */}
        <div className="px-4 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
              <img src={logoImage} alt="SocialHub" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-lg text-white">SocialHub</h1>
              <p className="text-xs text-slate-400">v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <div
                          className={`flex items-center gap-3 px-3 py-2 rounded-md w-full transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                              : "text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Platforms */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Connected Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
              >
                <div className="w-3 h-3 rounded-full bg-green-500" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-pink-500/10 border-pink-500/20 text-pink-400 hover:bg-pink-500/20"
              >
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                Instagram
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Facebook
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-800 px-4 py-4">
        <div className="text-xs text-slate-500">
          <p>Powered by OpenAI</p>
          <p>© 2025 SocialHub</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
