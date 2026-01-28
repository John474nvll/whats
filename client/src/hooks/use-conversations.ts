import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const api = {
  conversations: {
    list: { path: '/api/conversations' },
    get: { path: '/api/conversations/:id' },
    toggleBot: { path: '/api/conversations/:id/toggle-bot', method: 'POST' },
  },
  messages: {
    list: { path: '/api/conversations/:id/messages' },
    create: { path: '/api/conversations/:id/messages', method: 'POST' },
  },
};

function buildUrl(path: string, params: Record<string, any>) {
  let url = path;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, String(value));
  }
  return url;
}

export function useConversations() {
  return useQuery({
    queryKey: [api.conversations.list.path],
    queryFn: async () => {
      const res = await fetch(api.conversations.list.path, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch conversations');
      return res.json();
    },
    refetchInterval: 5000,
  });
}

export function useConversation(id: number) {
  return useQuery({
    queryKey: [api.conversations.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.conversations.get.path, { id });
      const res = await fetch(url, { credentials: 'include' });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch conversation');
      return res.json();
    },
    enabled: !!id,
    refetchInterval: 3000,
  });
}

export function useToggleBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      botStatus,
    }: {
      id: number;
      botStatus: boolean;
    }) => {
      const url = buildUrl(api.conversations.toggleBot.path, { id });
      const res = await fetch(url, {
        method: api.conversations.toggleBot.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botStatus }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to toggle bot status');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [api.conversations.list.path],
      });
      queryClient.invalidateQueries({
        queryKey: [api.conversations.get.path, data.id],
      });
    },
  });
}

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: [api.messages.list.path, conversationId],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path, { id: conversationId });
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    },
    enabled: !!conversationId,
    refetchInterval: 2000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      role = 'agent',
    }: {
      conversationId: number;
      content: string;
      role?: string;
    }) => {
      const data = { content, role };
      const url = buildUrl(api.messages.create.path, { id: conversationId });
      const res = await fetch(url, {
        method: api.messages.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to send message');
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [api.messages.list.path, variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: [api.conversations.get.path, variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: [api.conversations.list.path],
      });
    },
  });
}
