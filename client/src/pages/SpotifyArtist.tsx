import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Music, TrendingUp, Users, Share2, Play, Trash2, Edit2, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";

const artistSchema = z.object({
  artistName: z.string().min(2, "Name required"),
  genre: z.string().optional(),
  bio: z.string().optional(),
  spotifyArtistId: z.string().optional(),
});

type ArtistFormData = z.infer<typeof artistSchema>;

export default function SpotifyArtist() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ["/api/spotify/artists"],
  });

  const { data: spotifyStats } = useQuery({
    queryKey: ["/api/spotify/stats"],
  });

  const createArtist = useMutation({
    mutationFn: async (data: ArtistFormData) => {
      const res = await apiRequest("POST", "/api/spotify/artists", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spotify/artists"] });
      toast({ title: "Artist created successfully" });
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create artist",
        variant: "destructive",
      });
    },
  });

  const deleteArtist = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/spotify/artists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spotify/artists"] });
      toast({ title: "Artist deleted" });
    },
  });

  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      artistName: "",
      genre: "",
      bio: "",
      spotifyArtistId: "",
    },
  });

  const onSubmit = (data: ArtistFormData) => {
    createArtist.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent">
              <Music className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Spotify Artist Studio
              </h1>
              <p className="text-muted-foreground text-lg">Manage your artist profile and music distribution</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-700 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">Total Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{artists.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">Total Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{spotifyStats?.totalFollowers || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">Total Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{spotifyStats?.totalStreams || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-400">Top Track</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold text-primary truncate">{spotifyStats?.topTrack || "N/A"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-bold rounded-lg gap-2 h-11">
              <Plus className="h-5 w-5" /> Register New Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-slate-900/50 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Register Artist Profile</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="artistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your artist name"
                          {...field}
                          className="bg-slate-800/50 border-slate-700 h-10 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Pop, Hip-Hop, Electronic"
                          {...field}
                          value={field.value || ""}
                          className="bg-slate-800/50 border-slate-700 h-10 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Tell us about your music..."
                          {...field}
                          value={field.value || ""}
                          className="bg-slate-800/50 border-slate-700 rounded-lg p-3 w-full min-h-24 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spotifyArtistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spotify Artist ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Spotify Artist ID"
                          {...field}
                          value={field.value || ""}
                          className="bg-slate-800/50 border-slate-700 h-10 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={createArtist.isPending}
                  className="w-full bg-primary hover:opacity-90 text-black font-bold rounded-lg h-10"
                >
                  {createArtist.isPending ? "Creating..." : "Create Artist"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Artists Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700"
              />
            ))}
          </div>
        ) : artists.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-12 pb-12 text-center">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No artists registered</p>
              <Button
                onClick={() => setIsOpen(true)}
                className="bg-primary hover:opacity-90 text-black font-bold rounded-lg"
              >
                Register Your First Artist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((artist) => (
              <Card
                key={artist.id}
                className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700 hover:border-primary/50 transition-all group overflow-hidden"
              >
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toast({ title: "Coming soon", description: "Edit functionality" })}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteArtist.mutate(artist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                        <Music className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-foreground">
                          {artist.artistName}
                        </CardTitle>
                        {artist.genre && (
                          <Badge variant="secondary" className="mt-2 rounded-full text-xs">
                            {artist.genre}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {artist.bio && (
                    <p className="text-sm text-slate-400 line-clamp-2">{artist.bio}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-700">
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Followers</p>
                      <p className="text-lg font-bold text-primary">
                        {artist.metadata?.followers || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Streams</p>
                      <p className="text-lg font-bold text-secondary">
                        {artist.metadata?.streams || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 rounded-lg h-9 gap-2"
                      onClick={() =>
                        window.open(`https://open.spotify.com/artist/${artist.spotifyArtistId}`, "_blank")
                      }
                    >
                      <Play className="h-4 w-4" /> Play
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 rounded-lg h-9 gap-2"
                      onClick={() => toast({ title: "Coming soon" })}
                    >
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
