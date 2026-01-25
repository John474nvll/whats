import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Inbox from "@/pages/Inbox";
import Contacts from "@/pages/Contacts";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Inbox} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/analytics" component={Inbox} /> {/* Placeholder: Reuse Inbox for now */}
      <Route path="/settings" component={Inbox} />  {/* Placeholder: Reuse Inbox for now */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
