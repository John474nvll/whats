import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  Paperclip,
  Bot,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  useMessages,
  useSendMessage,
  useAiAnalysis,
} from '@/hooks/use-conversations';
import { ConversationWithContact } from '@shared/schema';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  conversation: ConversationWithContact;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useMessages(conversation.id);
  const sendMessageMutation = useSendMessage();
  const aiAnalysisMutation = useAiAnalysis();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessageMutation.mutate({
      conversationId: conversation.id,
      content: inputValue,
    });
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAiSuggest = () => {
    aiAnalysisMutation.mutate(conversation.id, {
      onSuccess: (data) => {
        setInputValue(data.suggestedResponse);
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f4f8] relative overflow-hidden">
      {/* Chat Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header */}
      <div className="bg-card border-b border-border p-4 px-6 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            {conversation.contact.profilePic ? (
              <img
                src={conversation.contact.profilePic}
                className="w-10 h-10 rounded-full border border-border"
                alt="Profile"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold">
                {conversation.contact.name?.substring(0, 2).toUpperCase() ||
                  'U'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-foreground">
              {conversation.contact.name || conversation.contact.platformId}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              via{' '}
              <span className="capitalize font-medium">
                {conversation.channel}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {aiAnalysisMutation.isPending ? (
            <div className="px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3 h-3" /> Analyzing...
            </div>
          ) : (
            <button
              onClick={handleAiSuggest}
              className="px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-full text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Bot className="w-3 h-3" />
              Analyze & Suggest
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p>Loading conversation...</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAgent = msg.role === 'agent' || msg.role === 'system';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex w-full',
                    isAgent ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] md:max-w-[60%] p-4 shadow-sm relative group',
                      isAgent
                        ? 'bg-primary text-primary-foreground message-bubble-agent'
                        : 'bg-white text-foreground message-bubble-user',
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>

                    <div
                      className={cn(
                        'flex items-center gap-2 mt-2 text-[10px]',
                        isAgent
                          ? 'text-primary-foreground/70 justify-end'
                          : 'text-muted-foreground',
                      )}
                    >
                      <span>
                        {msg.timestamp
                          ? format(new Date(msg.timestamp), 'HH:mm')
                          : ''}
                      </span>
                      {msg.sentiment && (
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded-full bg-black/5 font-medium uppercase tracking-wider',
                            msg.sentiment === 'positive' &&
                              'text-green-600 bg-green-100',
                            msg.sentiment === 'negative' &&
                              'text-red-600 bg-red-100',
                          )}
                        >
                          {msg.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border z-10">
        {aiAnalysisMutation.error && (
          <div className="mb-2 p-2 bg-destructive/10 text-destructive text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Failed to generate AI suggestion. Try again.
          </div>
        )}

        <div className="bg-muted/50 rounded-2xl p-2 flex items-end gap-2 shadow-inner">
          <button className="p-2 hover:bg-background rounded-xl text-muted-foreground transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 text-sm"
            rows={1}
          />

          <button className="p-2 hover:bg-background rounded-xl text-muted-foreground transition-colors shrink-0">
            <Smile className="w-5 h-5" />
          </button>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
            className="p-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex justify-center text-xs text-muted-foreground/60">
          Press Enter to send
        </div>
      </div>
    </div>
  );
}
