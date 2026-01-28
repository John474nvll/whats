import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { SocialAccount } from '@shared/schema';
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
} from '@/components/ui/sidebar';
import {
  MessageSquare, Users, BarChart3, Sparkles, Settings, Home, GitFork, Megaphone,
  Instagram, Facebook, Smartphone, LinkIcon, Package, Lock, Globe, Phone, ShieldCheck, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const menuGroups = [
    {
    label: '🏠 PRINCIPAL',
    items: [
      { title: 'Dashboard', url: '/', icon: Home },
      { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    ],
  },
  {
    label: '📱 CRM & VENTAS',
    items: [
      { title: 'Inbox', url: '/inbox', icon: MessageSquare },
      { title: 'Contactos', url: '/contacts', icon: Users },
      { title: 'Clientes', url: '/customers', icon: Users },
      { title: 'Órdenes', url: '/orders', icon: ShoppingCart },
      { title: 'Facturación', url: '/billing', icon: Package },
      { title: 'Voz & Retell', url: '/voice', icon: Phone },
    ],
  },
  {
    label: '📊 PROYECTOS',
    items: [
      { title: 'Proyectos', url: '/projects', icon: GitFork },
      { title: 'Tareas', url: '/tasks', icon: Package },
      { title: 'Grupos', url: '/sales-groups', icon: Users },
    ],
  },
  {
    label: '📢 MARKETING',
    items: [
      { title: 'Funnels', url: '/funnels', icon: GitFork },
      { title: 'Campaigns', url: '/campaigns', icon: Megaphone },
      { title: 'Links', url: '/links', icon: LinkIcon },
    ],
  },
  {
    label: '✨ IA & AUTOMATIZACIÓN',
    items: [
      { title: 'AI Generator', url: '/ai-generator', icon: Sparkles },
      { title: 'Plataformas', url: '/platforms', icon: Smartphone },
    ],
  },
  {
    label: '⚙️ SOPORTE & SISTEMA',
    items: [
      { title: 'Usuarios', url: '/users', icon: Users },
      { title: 'Soporte', url: '/tickets', icon: ShieldCheck },
      { title: 'Settings', url: '/settings', icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  const { data: connectedAccounts } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts/demo-user'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/social-accounts/demo-user');
      return res.json();
    },
  });

  return (
    <Sidebar className="bg-background/95 backdrop-blur-3xl border-r border-accent-silver/30 shadow-[10px_0_40px_rgba(0,0,0,0.7)] group/sidebar data-[state=collapsed]:w-[var(--sidebar-width-icon)]">
      <SidebarContent className="space-y-1 md:space-y-2 pt-4 text-text">
        <div className="flex-1 overflow-y-auto px-1 md:px-2 scrollbar-thin scrollbar-thumb-accent-gold/50 scrollbar-track-transparent">
          {menuGroups.map((group) => (
            <SidebarGroup key={group.label} className="py-1 md:py-2">
              <SidebarGroupLabel className="text-[9px] md:text-[11px] font-bold uppercase text-accent-silver/70 tracking-[0.2em] px-2 md:px-4 mb-2 group-data-[state=collapsed]/sidebar:hidden">
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
                              className={`flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-lg w-full transition-all duration-300 group/item relative overflow-hidden border-2 ${
                                isActive
                                  ? 'bg-primary/20 border-accent-gold shadow-[0_5px_20px_rgba(0,255,155,0.3)] text-primary'
                                  : 'text-light/70 hover:text-light border-transparent hover:border-accent-silver/50 hover:bg-accent-silver/10'
                              }`}>
                              <item.icon className={`h-4 md:h-5 w-4 md:w-5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 ${isActive ? 'text-accent-gold' : ''}`} />
                              <span className="text-xs md:text-sm font-bold tracking-tight group-data-[state=collapsed]/sidebar:hidden">{item.title}</span>
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
      <SidebarFooter className="border-t border-accent-silver/30 px-2 md:px-4 py-4">
          <div className="text-[10px] text-accent-silver/50 flex justify-between items-center group-data-[state=collapsed]/sidebar:hidden px-1">
            <div className="space-y-0.5">
              <p className="font-bold text-accent-silver/80">SoftganHub</p>
              <p className="opacity-70 tracking-tighter">V12.0 Neon</p>
            </div>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[7px] font-black tracking-widest px-2 py-0.5 rounded-full">
              LIVE
            </Badge>
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}
