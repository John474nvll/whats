import { Link, useLocation } from "wouter";
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inbox", href: "/inbox", icon: MessageSquare },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen flex-col justify-between border-r border-border/50 bg-card/30 backdrop-blur-xl w-20 lg:w-64 transition-all duration-300 z-50">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Cpu className="h-6 w-6" />
          </div>
          <span className="hidden lg:block text-xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            OmniAgent
          </span>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors")} />
                  <span className="hidden lg:block">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto hidden lg:block h-1.5 w-1.5 rounded-full bg-white/50" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          <span className="hidden lg:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
