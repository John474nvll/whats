import { Search, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ConversationWithContact } from "@shared/schema";
import { cn } from "@/lib/utils";
import { ChannelIcon } from "./ChannelIcon";

interface ConversationListProps {
  conversations: ConversationWithContact[];
  selectedId?: number;
  onSelect: (id: number) => void;
  isLoading: boolean;
}

export function ConversationList({ conversations, selectedId, onSelect, isLoading }: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="h-full p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-border/40 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-80 lg:w-96 shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl">Inbox</h2>
          <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search messages..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {conversations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <p>No conversations yet.</p>
            <p className="text-sm">Wait for incoming messages.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {conversations.map((conv) => {
              const isSelected = selectedId === conv.id;
              const lastMessage = conv.lastMessage?.content || "No messages yet";
              
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted/50 transition-all duration-200 relative group",
                    isSelected && "bg-primary/5 hover:bg-primary/10 border-l-4 border-primary pl-[13px]" // adjust padding for border
                  )}
                >
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      {conv.contact.profilePic ? (
                        <img 
                          src={conv.contact.profilePic} 
                          alt={conv.contact.name || "User"} 
                          className="w-12 h-12 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-border flex items-center justify-center text-muted-foreground font-semibold">
                          {conv.contact.name?.substring(0, 2).toUpperCase() || "??"}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                        <ChannelIcon channel={conv.channel} className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={cn(
                          "font-semibold truncate", 
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {conv.contact.name || conv.contact.platformId}
                        </h3>
                        {conv.lastMessageAt && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate pr-6">
                        {conv.lastMessage?.role === 'agent' && <span className="text-primary mr-1">You:</span>}
                        {lastMessage}
                      </p>
                    </div>
                  </div>

                  {/* Unread Badge */}
                  {(conv.unreadCount || 0) > 0 && (
                    <div className="absolute right-4 bottom-4 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center shadow-sm">
                      {conv.unreadCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
