import { useQuery, useMutation } from '@tanstack/react-query';
import { type InsertContact, type UpdateContact } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

export function useContacts() {
  return useQuery<any[]>({
    queryKey: ['/api/contacts'],
    queryFn: () => queryClient.get('/api/contacts'),
  });
}

export function useCreateContact() {
  return useMutation({
    mutationFn: async (data: InsertContact) => {
      return queryClient.post('/api/contacts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
  });
}

export function useUpdateContact() {
  return useMutation({
    mutationFn: async (data: UpdateContact & { id: number }) => {
      return queryClient.put(`/api/contacts/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
  });
}

export function useDeleteContact() {
  return useMutation({
    mutationFn: async (id: number) => {
      return queryClient.delete(`/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
  });
}
