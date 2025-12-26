import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Youtube, Plus, Trash2, Disc, Radio, ExternalLink, Sparkles } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ArtistProfile, MusicContent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function MusicManager() {
  const { toast } = useToast();
  const { data: artists, isLoading: artistsLoading } = useQuery<ArtistProfile[]>({
    queryKey: ["/api/artists"],
  });

  const createArtist = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/artists", {
        artistName: "Nuevo Artista Neon",
        genre: "Synthwave / Electronic",
        bio: "Explorando sonidos del futuro.",
        metadata: {}
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
      toast({ title: "Perfil de Artista creado" });
    },
  });

  if (artistsLoading) return <div className="p-8">Cargando gestión musical...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-cyan-neon">Music Studio</h1>
          <p className="text-muted-foreground font-medium text-lg">Manejo integral de artistas, Spotify y YouTube.</p>
        </div>
        <Button onClick={() => createArtist.mutate()} className="gap-2 bg-cyan-neon text-black hover:bg-cyan-neon/90 rounded-2xl h-12 px-6">
          <Plus className="h-5 w-5" /> Registrar Artista
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spotify Section */}
        <Card className="glass-card rounded-[2.5rem] border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <Music className="h-6 w-6 text-primary" />
              Spotify Connect
            </CardTitle>
            <Badge className="bg-primary text-black">Live</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Disc className="h-8 w-8 text-primary animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Neon Artist</h3>
                  <p className="text-sm text-muted-foreground">45.2K Oyentes mensuales</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 rounded-2xl bg-white/5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Streams</p>
                  <p className="text-lg font-black">1.2M</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-white/5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Saves</p>
                  <p className="text-lg font-black">89K</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-2xl border-primary/30 text-primary hover:bg-primary/10 h-12">
              Ver en Spotify <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* YouTube Section */}
        <Card className="glass-card rounded-[2.5rem] border-raspberry/20 bg-raspberry/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <Youtube className="h-6 w-6 text-raspberry" />
              YouTube Studio
            </CardTitle>
            <Badge className="bg-raspberry text-white">Connected</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-raspberry/20 flex items-center justify-center">
                  <Radio className="h-8 w-8 text-raspberry" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Neon VEVO</h3>
                  <p className="text-sm text-muted-foreground">120K Subs</p>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>VIEWS (LAST 30 DAYS)</span>
                  <span className="text-raspberry">+22%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-raspberry w-[75%]" />
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-2xl border-raspberry/30 text-raspberry hover:bg-raspberry/10 h-12">
              Manejar Canal <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card className="glass-card rounded-[2.5rem] border-cyan-neon/20 bg-cyan-neon/5 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Disc className="h-6 w-6 text-cyan-neon" />
              Últimos Lanzamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Electric Night", type: "Single", status: "Published" },
                { title: "Neon Dreams LP", type: "Album", status: "Scheduled" },
                { title: "Future Love", type: "Video", status: "Draft" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/5">
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-cyan-neon/30 text-cyan-neon text-[10px]">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
