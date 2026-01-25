import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ConversationList } from "@/components/ConversationList";
import { ChatWindow } from "@/components/ChatWindow";
import { useConversations } from "@/hooks/use-conversations";
import { MessageSquareDashed } from "lucide-react";

export default function Inbox() {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const { data: conversations = [], isLoading } = useConversations();
  
  const selectedConversation = conversations.find(c => c.id === selectedId);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left List Panel */}
        <ConversationList 
          conversations={conversations} 
          selectedId={selectedId} 
          onSelect={setSelectedId}
          isLoading={isLoading}
        />
        
        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col h-full bg-muted/30 relative">
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <MessageSquareDashed className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h2 className="text-xl font-display font-semibold text-foreground">No Chat Selected</h2>
              <p className="text-center max-w-sm mt-2">
                Select a conversation from the list to start messaging your customers across all channels.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
