import { Link, useLocation } from "wouter";
import { MessageSquare, Users, BarChart3, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: MessageSquare, label: "Inbox", href: "/" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-20 lg:w-64 h-screen bg-card border-r border-border flex flex-col items-center lg:items-stretch py-6 z-20 transition-all duration-300">
      {/* Logo Area */}
      <div className="px-4 lg:px-6 mb-8 flex items-center justify-center lg:justify-start">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="hidden lg:block ml-3 font-display font-bold text-xl text-foreground tracking-tight">
          OmniDesk
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className={cn(
              "group flex items-center px-3 py-3 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary font-medium shadow-sm" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <Icon className={cn(
                "w-6 h-6 shrink-0 transition-transform duration-300",
                isActive ? "text-primary scale-110" : "group-hover:scale-105"
              )} />
              <span className="hidden lg:block ml-3 truncate">
                {item.label}
              </span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Snippet */}
      <div className="mt-auto px-3 lg:px-6 pt-6 border-t border-border/50">
        <div className="flex items-center justify-center lg:justify-start gap-3 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-blue-500 border-2 border-background shadow-md flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-semibold text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Senior Agent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
