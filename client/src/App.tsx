import { Switch, Route, Link } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import NotFound from '@/pages/not-found';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Inbox from '@/pages/Inbox';
import Contacts from '@/pages/Contacts';
import Customers from '@/pages/Customers';
import Settings from '@/pages/Settings';
import Analytics from '@/pages/Analytics';
import AIGenerator from '@/pages/AIGenerator';
import Support from '@/pages/Support';
import UsersManagement from '@/pages/UsersManagement';
import AccountLinks from '@/pages/AccountLinks';
import FunnelBuilder from '@/pages/FunnelBuilder';
import Funnels from '@/pages/Funnels';
import Campaigns from '@/pages/Campaigns';
import Products from '@/pages/Products';
import CustomLinks from '@/pages/CustomLinks';
import VoiceManager from '@/pages/VoiceManager';
import Projects from '@/pages/Projects';
import Tasks from '@/pages/Tasks';
import SalesGroups from '@/pages/SalesGroups';
import Billing from '@/pages/Billing';
import PlatformsHub from '@/pages/PlatformsHub';
import PurchaseOrders from '@/pages/PurchaseOrders';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';

import {
  Settings as SettingsIcon,
} from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QuickAccessToolbar from '@/components/QuickAccessToolbar'; // Import the new component

import logoImage from '@assets/generated_images/socialhub_app_logo_design.png';

function Router() {
  // ... (Router component remains the same)
}

function AppContent() {
  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="neon-forest-theme flex h-screen w-full bg-background text-text-color md:overflow-hidden select-none">
        <AppSidebar />
        <div className="flex flex-col flex-1 relative overflow-hidden w-full">
          <header className="flex items-center justify-between px-3 md:px-6 py-2 md:py-4 border-b border-accent-silver/20 bg-background/80 backdrop-blur-xl z-50 gap-2 md:gap-4 sticky top-0">
            <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-1">
              <SidebarTrigger
                data-testid="button-sidebar-toggle"
                className="rounded-full hover:bg-primary/20 no-default-hover-elevate h-10 w-10 border border-accent-silver/30 flex-shrink-0"
              />
              <div className="hidden lg:flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-accent-gold/30 text-accent-gold bg-accent-gold/5 font-black uppercase text-[9px] tracking-[0.15em] px-3 py-1 rounded-full whitespace-nowrap"
                >
                  V12.0 Softgan
                </Badge>
              </div>
            </div>

            {/* Quick Access Toolbar Integration */}
            <div className="flex-grow flex justify-center">
                <QuickAccessToolbar />
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/20 text-light no-default-hover-elevate h-10 w-10 border border-accent-silver/30"
                asChild
                title="Ajustes"
              >
                <Link href="/settings">
                  <SettingsIcon className="h-4 w-4" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 relative z-10 custom-scrollbar w-full">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <PWAInstallBanner />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}