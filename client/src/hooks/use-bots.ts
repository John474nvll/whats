
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { api } from '@shared/routes';
import { Bot } from '@shared/models/bot';
import { useToast } from '@/hooks/use-toast';

type CreateBotInput = Omit<Bot, 'id' | 'createdAt'>;

// Hook para obtener la lista de bots
export const useBots = () => {
  return useQuery<Bot[]>({
    queryKey: ['bots'],
    queryFn: async () => {
      const response = await apiRequest(api.bots.list.method, api.bots.list.path);
      return response.json();
    },
  });
};

// Hook para crear un nuevo bot
export const useCreateBot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newBot: CreateBotInput) => {
      const response = await apiRequest(api.bots.create.method, api.bots.create.path, newBot);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      toast({ title: 'Éxito', description: 'El bot ha sido creado correctamente.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'No se pudo crear el bot. ' + error.message, variant: 'destructive' });
    },
  });
};
