import { useEffect, useState } from "react";
import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Inbox from "@/pages/Inbox";
import Contacts from "@/pages/Contacts";
import Customers from "@/pages/Customers";
import Settings from "@/pages/Settings";
import Analytics from "@/pages/Analytics";
import AIGenerator from "@/pages/AIGenerator";
import AccountLinks from "@/pages/AccountLinks";
import FunnelBuilder from "@/pages/FunnelBuilder";
import Campaigns from "@/pages/Campaigns";
import Products from "@/pages/Products";
import CustomLinks from "@/pages/CustomLinks";
import MusicManager from "@/pages/MusicManager";
import SpotifyArtist from "@/pages/SpotifyArtist";
import { MessageSquare, Users, BarChart3, Sparkles, Home, GitFork, Megaphone, Music, Instagram, Facebook, Smartphone, LinkIcon, Package, Zap } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import PlatformsHub from "@/pages/PlatformsHub";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/customers" component={Customers} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/ai-generator" component={AIGenerator} />
      <Route path="/accounts" component={AccountLinks} />
      <Route path="/funnels" component={FunnelBuilder} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/products" component={Products} />
      <Route path="/links" component={CustomLinks} />
      <Route path="/music" component={MusicManager} />
      <Route path="/spotify-artist" component={SpotifyArtist} />
      <Route path="/platforms" component={PlatformsHub} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-black md:overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 relative overflow-hidden w-full">
          {/* Background decoration - hidden on mobile for performance */}
          <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-kiwi/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
          <div className="hidden md:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-neon/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />
          
          <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl z-50 gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-1">
              <SidebarTrigger data-testid="button-sidebar-toggle" className="rounded-full hover:bg-white/5 no-default-hover-elevate h-10 w-10 border border-white/5 flex-shrink-0" />
              
              <div className="flex items-center gap-3 pr-4 border-r border-white/10 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-kiwi p-0.5 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <div className="w-full h-full rounded-[0.4rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img src={logoImage} alt="SocialHub" className="w-full h-full object-contain p-0.5" />
                  </div>
                </div>
                <h1 className="font-black text-lg tracking-tighter text-white hidden sm:block">Social<span className="text-kiwi">Hub</span></h1>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar py-1">
                <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 px-4 h-8" asChild>
                  <Link href="/">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 px-4 h-8" asChild>
                  <Link href="/platforms">Plataformas</Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 px-4 h-8" asChild>
                  <Link href="/ai-generator">AI Gen</Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 px-4 h-8" asChild>
                  <Link href="/analytics">Analytics</Link>
                </Button>
              </div>

              <div className="hidden lg:flex items-center gap-2">
                <div className="h-4 w-px bg-white/10 mx-2" />
                <Badge variant="outline" className="border-kiwi/30 text-kiwi bg-kiwi/5 font-black uppercase text-[9px] tracking-[0.15em] px-3 py-1 rounded-full whitespace-nowrap">
                  V3.0 PWA
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-slate-400 no-default-hover-elevate h-10 w-10 border border-white/5" asChild title="Ajustes">
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto relative z-10 custom-scrollbar w-full">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      const token = !!localStorage.getItem("token");
      if (token !== isAuthenticated) {
        setIsAuthenticated(token);
      }
    }, 500);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAuthenticated ? <AppContent /> : <Login />}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
