import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { MessageCircle, Send, Zap, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlatformsHub() {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<"whatsapp" | "instagram" | "facebook">("whatsapp");
  const [recipientId, setRecipientId] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [campaignContent, setCampaignContent] = useState("");

  // Get connected accounts
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["/api/platforms/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/platforms/accounts");
      return res.json();
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/platforms/send-message", {
        platform: selectedPlatform,
        to: recipientId,
        content: messageContent,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Mensaje enviado", description: `ID: ${data.messageId}` });
        setMessageContent("");
        setRecipientId("");
      } else {
        toast({ title: "Error", description: "No se pudo enviar el mensaje", variant: "destructive" });
      }
    },
    onError: (error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error desconocido", variant: "destructive" });
    },
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/platforms/campaigns", {
        platforms: ["whatsapp", "instagram", "facebook"],
        content: campaignContent,
        targetCustomerIds: [],
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Campaña creada", description: `ID: ${data.campaignId}` });
        setCampaignContent("");
      }
    },
  });

  const connectedPlatforms = accounts
    ?.map((acc: any) => acc.platform)
    .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
            Hub de Plataformas Unificado
          </h1>
          <p className="text-slate-400">
            Integra WhatsApp, Instagram y Facebook en una sola interfaz
          </p>
        </div>

        {/* Connected Platforms Status */}
        <Card className="bg-slate-900/40 border-cyan-neon/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-kiwi" />
              Plataformas Conectadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["whatsapp", "instagram", "facebook"].map((platform) => (
                <div
                  key={platform}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    connectedPlatforms.includes(platform)
                      ? "border-kiwi/50 bg-kiwi/5"
                      : "border-muted/30 bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold capitalize text-white">{platform}</span>
                    {connectedPlatforms.includes(platform) && (
                      <CheckCircle2 className="h-5 w-5 text-kiwi" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {accounts?.filter((a: any) => a.platform === platform).length} cuenta(s)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Send Message Section */}
        <Card className="bg-slate-900/40 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Enviar Mensaje Unificado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-300 mb-2 block">Plataforma</label>
                <div className="flex gap-2">
                  {["whatsapp", "instagram", "facebook"].map((platform) => (
                    <Button
                      key={platform}
                      variant={selectedPlatform === platform ? "default" : "outline"}
                      className="flex-1 capitalize text-xs"
                      onClick={() => setSelectedPlatform(platform as any)}
                      disabled={!connectedPlatforms.includes(platform)}
                    >
                      {platform.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-300 mb-2 block">ID Destinatario</label>
                <Input
                  placeholder="Teléfono, ID o usuario"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-300 mb-2 block">Mensaje</label>
              <Textarea
                placeholder="Escribe tu mensaje aquí..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="bg-slate-800 border-slate-700 min-h-[100px]"
              />
            </div>

            <Button
              onClick={() => sendMessageMutation.mutate()}
              disabled={
                sendMessageMutation.isPending ||
                !recipientId ||
                !messageContent ||
                !connectedPlatforms.includes(selectedPlatform)
              }
              className="w-full gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {sendMessageMutation.isPending ? "Enviando..." : "Enviar Mensaje"}
            </Button>
          </CardContent>
        </Card>

        {/* Create Campaign Section */}
        <Card className="bg-slate-900/40 border-raspberry/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-raspberry" />
              Campaña Multi-Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-300 mb-2 block">
                Contenido de Campaña
              </label>
              <Textarea
                placeholder="Contenido que será enviado a WhatsApp, Instagram y Facebook..."
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
                className="bg-slate-800 border-slate-700 min-h-[100px]"
              />
            </div>

            <div className="text-sm text-slate-400">
              <p className="font-bold mb-2">Esta campaña se enviará a:</p>
              <div className="flex gap-2 flex-wrap">
                {["whatsapp", "instagram", "facebook"]
                  .filter((p) => connectedPlatforms.includes(p))
                  .map((p) => (
                    <span key={p} className="px-2 py-1 bg-slate-800 rounded capitalize text-xs">
                      {p}
                    </span>
                  ))}
              </div>
            </div>

            <Button
              onClick={() => createCampaignMutation.mutate()}
              disabled={
                createCampaignMutation.isPending ||
                !campaignContent ||
                connectedPlatforms.length === 0
              }
              className="w-full gap-2"
              variant="secondary"
            >
              <Zap className="h-4 w-4" />
              {createCampaignMutation.isPending ? "Creando..." : "Crear Campaña"}
            </Button>
          </CardContent>
        </Card>

        {/* Connected Accounts List */}
        <Card className="bg-slate-900/40 border-slate-700/50">
          <CardHeader>
            <CardTitle>Cuentas Conectadas</CardTitle>
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <p className="text-slate-400">Cargando...</p>
            ) : accounts?.length > 0 ? (
              <div className="space-y-2">
                {accounts.map((account: any) => (
                  <div
                    key={account.id}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-white">{account.accountName}</p>
                      <p className="text-xs text-slate-400 capitalize">{account.platform}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-kiwi" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No hay cuentas conectadas</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
