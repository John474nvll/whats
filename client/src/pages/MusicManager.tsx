import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Users, BarChart3, Sparkles, Settings, Home, GitFork, Megaphone, Music, Send, Zap, Settings as SettingsIcon } from "lucide-react";
import { SiSpotify } from "react-icons/si";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

export default function MusicManager() {
  const { toast } = useToast();
  const [showAddArtist, setShowAddArtist] = useState(false);
  const [newArtist, setNewArtist] = useState({ artistName: "", genre: "", bio: "" });

  const { data: artists, isLoading } = useQuery({
    queryKey: ["/api/artists"],
  });

  const createArtistMutation = useMutation({
    mutationFn: async (data: typeof newArtist) => {
      const res = await apiRequest("POST", "/api/artists", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
      toast({ title: "Artista Creado", description: "El perfil del artista se ha guardado correctamente." });
      setShowAddArtist(false);
      setNewArtist({ artistName: "", genre: "", bio: "" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-kiwi to-cyan-neon bg-clip-text text-transparent">
            Music Studio Pro
          </h1>
          <p className="text-muted-foreground mt-2">Gestiona tu carrera musical y lanzamientos desde un solo lugar.</p>
        </div>
        <Button onClick={() => setShowAddArtist(!showAddArtist)} className="rounded-full px-6">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Artista
        </Button>
      </div>

      {showAddArtist && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle>Crear Perfil de Artista</CardTitle>
              <CardDescription>Configura los detalles básicos para empezar a gestionar contenido.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Artista</Label>
                  <Input 
                    value={newArtist.artistName} 
                    onChange={e => setNewArtist({...newArtist, artistName: e.target.value})}
                    placeholder="Ej. DJ Neon Waves" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Género</Label>
                  <Input 
                    value={newArtist.genre} 
                    onChange={e => setNewArtist({...newArtist, genre: e.target.value})}
                    placeholder="Ej. Electronic / Synthwave" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Biografía</Label>
                <Textarea 
                  value={newArtist.bio} 
                  onChange={e => setNewArtist({...newArtist, bio: e.target.value})}
                  placeholder="Cuéntanos un poco sobre el artista..." 
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowAddArtist(false)}>Cancelar</Button>
                <Button 
                  onClick={() => createArtistMutation.mutate(newArtist)}
                  disabled={createArtistMutation.isPending}
                >
                  {createArtistMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Perfil"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists?.map((artist: any) => (
          <Card key={artist.id} className="glass-card hover-elevate transition-all group overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
              <Disc className="w-16 h-16 text-primary/40 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
                  <SiSpotify className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
                  <Youtube className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="primary" className="rounded-full w-8 h-8">
                  <SettingsIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{artist.artistName}</CardTitle>
                  <p className="text-sm text-primary">{artist.genre}</p>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-bold">Admin Mode</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-muted/20 p-2 rounded-xl text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Streams</p>
                  <p className="text-sm font-bold">12.4K</p>
                </div>
                <div className="bg-muted/20 p-2 rounded-xl text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Oyentes</p>
                  <p className="text-sm font-bold">850</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs">Analytics</Button>
                <Button variant="secondary" size="sm" className="flex-1 rounded-full text-xs">Mensajes</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {artists?.length === 0 && !showAddArtist && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-muted rounded-3xl">
            <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium">No hay artistas registrados</h3>
            <p className="text-muted-foreground">Comienza creando tu primer perfil de artista.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-kiwi" />
              Próximos Lanzamientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-white/5">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Disc className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Single: Neon Nights</p>
                    <p className="text-sm text-muted-foreground">Programado para: 15 Ene, 2026</p>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              Estado de Distribución
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center p-2">
                <span>Spotify</span>
                <span className="text-kiwi font-bold">Verificado</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span>YouTube Music</span>
                <span className="text-kiwi font-bold">Verificado</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span>Apple Music</span>
                <span className="text-pineapple font-bold">Pendiente</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span>Tidal</span>
                <span className="text-muted-foreground">No vinculado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
