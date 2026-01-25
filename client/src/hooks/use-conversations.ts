
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// --- Fetching Data ---

export const useConversations = () => useQuery({
  queryKey: ['conversations'],
  queryFn: () => apiRequest('GET', '/api/conversations').then(res => res.json()),
});

export const useConversation = (id: number) => useQuery({
  queryKey: ['conversation', id],
  queryFn: () => apiRequest('GET', `/api/conversations/${id}`).then(res => res.json()),
  enabled: !!id,
});

export const useMessages = (conversationId: number) => useQuery({
  queryKey: ['messages', conversationId],
  queryFn: () => apiRequest('GET', `/api/conversations/${conversationId}/messages`).then(res => res.json()),
  enabled: !!conversationId,
});

// --- Mutations ---

export const useToggleBot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: number; botStatus: boolean }) =>
      apiRequest('PUT', `/api/conversations/${variables.id}/toggle-bot`, { enabled: variables.botStatus }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { conversationId: number; content: string }) =>
      apiRequest('POST', `/api/conversations/${variables.conversationId}/messages`, { content: variables.content }),
    onSuccess: (data, variables) => {
      // Instantly update the message list with the new message
      queryClient.setQueryData(['messages', variables.conversationId], (oldData: any) => 
        oldData ? [...oldData, data] : [data]
      );
      // Invalidate conversation list to update the last message preview
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useFindOrCreateConversation = () => {
  return useMutation({
    mutationFn: (contactId: number) => 
      apiRequest('POST', '/api/crm/conversations/find-or-create', { contactId })
      .then(res => res.json()),
  });
};
