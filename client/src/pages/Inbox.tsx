import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ConversationList } from "@/components/ConversationList";
import { ChatInterface } from "@/components/ChatInterface";
import { useConversations, useConversation, useMessages, useToggleBot, useSendMessage } from "@/hooks/use-conversations";
import { MessageSquareDashed } from "lucide-react";

export default function Inbox() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const { data: activeConversation } = useConversation(selectedId!);
  const { data: messages } = useMessages(selectedId!);
  
  const toggleBotMutation = useToggleBot();
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    // Select first conversation by default if none selected and data loaded
    if (!selectedId && conversations && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  const handleToggleBot = (enabled: boolean) => {
    if (selectedId) {
      toggleBotMutation.mutate({ id: selectedId, botStatus: enabled });
    }
  };

  const handleSendMessage = (content: string) => {
    if (selectedId) {
      sendMessageMutation.mutate({ conversationId: selectedId, content });
    }
  };

  if (loadingConversations) {
    return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20" />
            <p className="text-muted-foreground">Loading inbox...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      {/* Inbox Layout: 350px List | Remaining Chat */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 lg:w-96 flex-shrink-0 border-r border-border/50 bg-card/20 backdrop-blur-sm">
          <ConversationList 
            conversations={conversations || []} 
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        
        <div className="flex-1 min-w-0 bg-background/50 relative">
          {selectedId && activeConversation ? (
            <ChatInterface 
              conversation={activeConversation}
              messages={messages || []}
              botEnabled={!!activeConversation.botStatus}
              onToggleBot={handleToggleBot}
              onSendMessage={handleSendMessage}
              isSending={sendMessageMutation.isPending}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="h-24 w-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6 ring-1 ring-white/5">
                <MessageSquareDashed className="h-10 w-10 opacity-50" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">No conversation selected</h3>
              <p className="max-w-sm text-sm">Select a conversation from the list to start chatting or viewing AI responses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
