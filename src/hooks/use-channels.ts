import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertChannelConfig } from "@shared/routes";

export function useChannels() {
  return useQuery({
    queryKey: [api.channels.list.path],
    queryFn: async () => {
      const res = await fetch(api.channels.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch channels");
      return api.channels.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ platform, ...updates }: { platform: string } & Partial<InsertChannelConfig>) => {
      const url = buildUrl(api.channels.update.path, { platform });
      const res = await fetch(url, {
        method: api.channels.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update channel");
      return api.channels.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.channels.list.path] }),
  });
}
