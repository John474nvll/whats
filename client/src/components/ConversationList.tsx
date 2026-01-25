import { format } from "date-fns";
import { MessageCircle, Instagram, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation, Contact } from "@shared/schema";

interface ConversationListProps {
  conversations: (Conversation & { contact: Contact })[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <h2 className="text-lg font-display font-bold">Inbox</h2>
        <div className="mt-2 relative">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4 text-center">
            <MessageCircle className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">No active conversations</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 border border-transparent",
                selectedId === conv.id
                  ? "bg-primary/10 border-primary/20 shadow-sm"
                  : "hover:bg-white/5 hover:border-white/5"
              )}
            >
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center ring-2 ring-border">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-background",
                  conv.channel === 'whatsapp' ? "bg-green-500" : "bg-pink-500"
                )}>
                  {conv.channel === 'whatsapp' ? (
                    <MessageCircle className="h-3 w-3 text-white fill-current" />
                  ) : (
                    <Instagram className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={cn(
                    "font-medium truncate text-sm",
                    selectedId === conv.id ? "text-primary" : "text-foreground"
                  )}>
                    {conv.contact.name || conv.contact.phone}
                  </span>
                  {conv.lastMessageAt && (
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(conv.lastMessageAt), "HH:mm")}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate pr-2">
                    {/* Preview would go here if we fetched last message content in list */}
                    Click to view messages...
                  </p>
                  {conv.botStatus && (
                    <Bot className="h-3 w-3 text-primary shrink-0 animate-pulse" />
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
