import { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
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
import MusicManager from "@/pages/MusicManager";
import SpotifyArtist from "@/pages/SpotifyArtist";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

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
      <Route path="/music" component={MusicManager} />
      <Route path="/spotify-artist" component={SpotifyArtist} />
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
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
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
