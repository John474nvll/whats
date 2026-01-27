import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useChannels() {
  return useQuery({
    queryKey: ["/api/channels"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/channels");
      return res.json();
    },
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ platform, ...updates }: { platform: string } & any) => {
      const res = await apiRequest("PATCH", `/api/channels/${platform}`, updates);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/channels"] }),
  });
}
