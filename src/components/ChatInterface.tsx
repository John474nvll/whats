import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Smartphone, MoreVertical, Paperclip, Smile } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Message, Conversation, Contact } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  conversation: Conversation & { contact: Contact };
  messages: Message[];
  botEnabled: boolean;
  onToggleBot: (enabled: boolean) => void;
  onSendMessage: (content: string) => void;
  isSending: boolean;
}

export function ChatInterface({ 
  conversation, 
  messages, 
  botEnabled, 
  onToggleBot,
  onSendMessage,
  isSending
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-3xl relative overflow-hidden">
      {/* Subtle background gradient pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Header */}
      <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/30 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-white/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {conversation.contact.name || conversation.contact.phone}
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground capitalize">
                {conversation.channel} • {conversation.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300",
              botEnabled 
                ? "bg-primary/10 border-primary/20 text-primary" 
                : "bg-secondary/50 border-white/5 text-muted-foreground"
            )}
          >
            <Bot className={cn("h-4 w-4", botEnabled && "animate-pulse")} />
            <span className="text-xs font-medium">AI Pilot</span>
            <button
              onClick={() => onToggleBot(!botEnabled)}
              className={cn(
                "ml-2 w-8 h-4 rounded-full relative transition-colors duration-300",
                botEnabled ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm",
                botEnabled ? "left-[18px]" : "left-0.5"
              )} />
            </button>
          </div>
          
          <button className="h-9 w-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.role === 'agent' || msg.role === 'system';
            const isBot = msg.role === 'assistant';
            const isUser = msg.role === 'user';
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  (isMe || isBot) ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 shadow-sm",
                  isMe ? "bg-primary/20 text-primary" : 
                  isBot ? "bg-accent/20 text-accent" : 
                  "bg-secondary text-muted-foreground"
                )}>
                  {isMe ? <User className="h-4 w-4" /> : 
                   isBot ? <Bot className="h-4 w-4" /> : 
                   <Smartphone className="h-4 w-4" />}
                </div>

                <div className={cn(
                  "flex flex-col",
                  (isMe || isBot) ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm shadow-md border leading-relaxed",
                    isMe ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none" :
                    isBot ? "bg-card text-foreground border-accent/20 rounded-tr-none" :
                    "bg-secondary/80 text-secondary-foreground border-white/5 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.role === 'assistant' ? 'AI Assistant' : msg.role === 'agent' ? 'You' : 'Customer'} • {format(new Date(msg.createdAt || Date.now()), "HH:mm")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/30 backdrop-blur-md border-t border-border/50 shrink-0 z-10">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex gap-1">
            <button className="h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-foreground transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 bg-secondary/50 rounded-2xl border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all flex items-end">
             <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full bg-transparent border-none focus:ring-0 p-3 min-h-[44px] max-h-32 resize-none text-sm placeholder:text-muted-foreground/50"
              rows={1}
            />
            <button className="h-10 w-10 mb-0.5 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-foreground transition-colors">
              <Smile className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center"
          >
            <Send className="h-5 w-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
