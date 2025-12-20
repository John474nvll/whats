import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertMessage } from "@shared/routes";

export function useConversations() {
  return useQuery({
    queryKey: [api.conversations.list.path],
    queryFn: async () => {
      const res = await fetch(api.conversations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return api.conversations.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Poll for new conversations
  });
}

export function useConversation(id: number) {
  return useQuery({
    queryKey: [api.conversations.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.conversations.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return api.conversations.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: 3000, // Poll for new messages
  });
}

export function useToggleBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, botStatus }: { id: number; botStatus: boolean }) => {
      const url = buildUrl(api.conversations.toggleBot.path, { id });
      const res = await fetch(url, {
        method: api.conversations.toggleBot.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botStatus }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle bot status");
      return api.conversations.toggleBot.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.conversations.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.conversations.get.path, data.id] });
    },
  });
}

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: [api.messages.list.path, conversationId],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path, { id: conversationId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!conversationId,
    refetchInterval: 2000, // Poll for real-time messages
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, content, role = "agent" }: { conversationId: number; content: string; role?: string }) => {
      // Note: role is defaulted to 'agent' for UI sent messages, backend might override or use 'agent'
      const data = { content, role };
      const url = buildUrl(api.messages.create.path, { id: conversationId });
      const res = await fetch(url, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path, variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: [api.conversations.get.path, variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: [api.conversations.list.path] }); // Update last message preview
    },
  });
}
