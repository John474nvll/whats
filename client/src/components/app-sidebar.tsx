import { useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Mail,
  Users,
  Cog,
  MessageSquare,
  Megaphone,
  BarChart3,
  Settings,
} from "lucide-react";

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Mensajes",
    url: "/inbox",
    icon: Mail,
  },
  {
    title: "Contactos",
    url: "/contacts",
    icon: Users,
  },
  {
    title: "Respuestas Rápidas",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Campañas",
    url: "#",
    icon: Megaphone,
  },
  {
    title: "Analítica",
    url: "#",
    icon: BarChart3,
  },
];

const bottomItems = [
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SocialHub</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Plataformas Conectadas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <div className="w-4 h-4 bg-pink-500 rounded-md" />
                    <span>Instagram</span>
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <div className="w-4 h-4 bg-blue-600 rounded-md" />
                    <span>Facebook</span>
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <div className="w-4 h-4 bg-green-500 rounded-md" />
                    <span>WhatsApp</span>
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
