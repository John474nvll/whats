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
import { MessageSquare, Users, BarChart3, Sparkles, Home, GitFork, Megaphone, Instagram, Facebook, Smartphone, LinkIcon, Package, Zap, Settings as SettingsIcon } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";
import VoiceManager from "@/pages/VoiceManager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/voice" component={VoiceManager} />
      <Route path="/login" component={Login} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/customers" component={Customers} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/ai-generator" component={AIGenerator} />
      <Route path="/platforms" component={AccountLinks} />
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
      <div className="flex h-screen w-full bg-slate-950 md:overflow-hidden select-none">
        <AppSidebar />
        <div className="flex flex-col flex-1 relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-kiwi/5 rounded-full blur-[80px] md:blur-[120px] -mr-32 -mt-32 md:-mr-64 md:-mt-64 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-neon/5 rounded-full blur-[80px] md:blur-[120px] -ml-32 -mb-32 md:-ml-64 md:-mb-64 pointer-events-none" />
          
          <header className="flex items-center justify-between px-3 md:px-6 py-2 md:py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl z-50 gap-2 md:gap-4 sticky top-0">
            <div className="flex items-center gap-2 md:gap-6 min-w-0 flex-1">
              <SidebarTrigger data-testid="button-sidebar-toggle" className="rounded-full hover:bg-white/5 no-default-hover-elevate h-10 w-10 border border-white/5 flex-shrink-0" />
              
              <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-4 border-r border-white/10 group cursor-pointer shrink-0">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-kiwi p-0.5 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <div className="w-full h-full rounded-[0.4rem] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img src={logoImage} alt="SocialHub" className="w-full h-full object-contain p-0.5" />
                  </div>
                </div>
                <h1 className="font-black text-base md:text-lg tracking-tighter text-white hidden xs:block">Social<span className="text-kiwi">Hub</span></h1>
              </div>
              
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 mask-fade-right">
                <Button variant="ghost" size="sm" className="rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 px-3 md:px-4 h-8" asChild>
                  <Link href="/">Dash</Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 px-3 md:px-4 h-8" asChild>
                  <Link href="/platforms">Plat</Link>
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 px-3 md:px-4 h-8" asChild>
                  <Link href="/ai-generator">AI</Link>
                </Button>
              </div>

              <div className="hidden lg:flex items-center gap-2">
                <div className="h-4 w-px bg-white/10 mx-2" />
                <Badge variant="outline" className="border-kiwi/30 text-kiwi bg-kiwi/5 font-black uppercase text-[9px] tracking-[0.15em] px-3 py-1 rounded-full whitespace-nowrap">
                  V3.1 PWA
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-slate-400 no-default-hover-elevate h-10 w-10 border border-white/5" asChild title="Ajustes">
                <Link href="/settings">
                  <SettingsIcon className="h-4 w-4" />
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
