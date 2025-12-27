import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, ExternalLink, Copy, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CustomLink } from "@shared/schema";

export default function CustomLinks() {
  const { toast } = useToast();
  const { data: links, isLoading } = useQuery<CustomLink[]>({
    queryKey: ["/api/links"],
  });

  const createLink = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Link generado" });
    },
  });

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-cyan-neon">Links Tracking</h1>
          <p className="text-muted-foreground font-medium">Mide el impacto de tus publicaciones.</p>
        </div>
        <Button onClick={() => {
          const url = prompt("URL original:");
          const platform = prompt("Plataforma (whatsapp/instagram/facebook):");
          if (url) {
            createLink.mutate({ originalUrl: url, platform });
          }
        }} className="rounded-full gap-2 bg-cyan-neon text-black">
          <Link2 className="h-4 w-4" /> Generar Link
        </Button>
      </div>

      <div className="space-y-4">
        {links?.map((link) => (
          <Card key={link.id} className="glass-card flex items-center p-6 gap-6">
            <div className="p-4 rounded-2xl bg-cyan-neon/10">
              <TrendingUp className="h-6 w-6 text-cyan-neon" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{link.platform || "General"}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-md">{link.originalUrl}</p>
            </div>
            <div className="text-center px-8 border-x border-border/50">
              <p className="text-2xl font-black text-cyan-neon">{link.clicks}</p>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Clicks</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => {
                const shortUrl = `${window.location.origin}/l/${link.shortCode}`;
                navigator.clipboard.writeText(shortUrl);
                toast({ title: "Copiado al portapapeles" });
              }}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" asChild>
                <a href={`/l/${link.shortCode}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
