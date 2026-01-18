
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the correct API paths as simple strings
const API_BASE_PATH = '/api/inbox';

// --- Query Hooks for fetching data ---

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_PATH}/conversations`);
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
    refetchInterval: 5000, // Poll for new conversations or status changes
  });
}

export function useConversation(id: number) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_PATH}/conversations/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch conversation details");
      return res.json();
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
}

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_PATH}/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!conversationId, // Only run if a conversation ID is provided
    refetchInterval: 2000, // Poll frequently for new messages
  });
}

// --- Mutation Hooks for creating/updating data ---

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      const res = await fetch(`${API_BASE_PATH}/conversations/${conversationId}/send`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch queries to show the new message immediately
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] }); // To update the last message preview
    },
  });
}

export function useToggleBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, botStatus }: { id: number; botStatus: boolean }) => {
      const res = await fetch(`${API_BASE_PATH}/conversations/${id}/toggle-bot`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle bot status");
      return res.json();
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to reflect the bot status change
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', data.id] });
    },
  });
}
