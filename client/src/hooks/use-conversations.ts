import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { ConversationWithContact, Message } from "@shared/schema";

// Get all conversations
export function useConversations() {
  return useQuery({
    queryKey: [api.conversations.list.path],
    queryFn: async () => {
      const res = await fetch(api.conversations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      // Typing as any temporarily because api definition had z.custom<any>()
      // In a real app, this would be strictly typed to ConversationWithContact[]
      return res.json() as Promise<ConversationWithContact[]>;
    },
    refetchInterval: 5000, // Poll for new messages every 5s
  });
}

// Get single conversation details
export function useConversation(id: number) {
  return useQuery({
    queryKey: [api.conversations.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.conversations.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return res.json() as Promise<ConversationWithContact>;
    },
    enabled: !!id,
  });
}

// Get messages for a conversation
export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: [api.conversations.messages.list.path, conversationId],
    queryFn: async () => {
      const url = buildUrl(api.conversations.messages.list.path, { id: conversationId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.conversations.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!conversationId,
    refetchInterval: 3000, // Poll more frequently for active chat
  });
}

// Send a message
export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      const url = buildUrl(api.conversations.messages.create.path, { id: conversationId });
      const res = await fetch(url, {
        method: api.conversations.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      return api.conversations.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate messages list
      queryClient.invalidateQueries({
        queryKey: [api.conversations.messages.list.path, variables.conversationId]
      });
      // Invalidate conversations list to update last message/timestamp
      queryClient.invalidateQueries({
        queryKey: [api.conversations.list.path]
      });
    },
  });
}

// AI Analysis
export function useAiAnalysis() {
  return useMutation({
    mutationFn: async (conversationId: number) => {
      const url = buildUrl(api.conversations.analyze.path, { id: conversationId });
      const res = await fetch(url, {
        method: api.conversations.analyze.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to analyze conversation");
      return api.conversations.analyze.responses[200].parse(await res.json());
    },
  });
}
