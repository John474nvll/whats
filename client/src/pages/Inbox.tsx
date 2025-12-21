import { useState, useEffect } from "react";
import { ConversationList } from "@/components/ConversationList";
import { ChatInterface } from "@/components/ChatInterface";
import { useConversations, useConversation, useMessages, useToggleBot, useSendMessage } from "@/hooks/use-conversations";
import { MessageSquareDashed } from "lucide-react";
import { motion } from "framer-motion";

export default function Inbox() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const { data: activeConversation } = useConversation(selectedId!);
  const { data: messages } = useMessages(selectedId!);
  
  const toggleBotMutation = useToggleBot();
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
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
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="flex h-screen gap-4 p-6">
        <div className="w-96 flex-shrink-0 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
          <ConversationList 
            conversations={conversations || []} 
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        
        <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
          {selectedId && activeConversation && messages ? (
            <ChatInterface 
              conversation={activeConversation as any}
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
              <h3 className="text-xl font-semibold text-foreground mb-2">Sin conversación seleccionada</h3>
              <p className="max-w-sm text-sm">Selecciona una conversación para empezar a chatear.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
