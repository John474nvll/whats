import { useChannels, useUpdateChannel } from "@/hooks/use-channels";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlatformIntegration } from "@/components/PlatformIntegration";
import { AIContentGenerator } from "@/components/AIContentGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { data: channels, isLoading } = useChannels();
  const updateChannel = useUpdateChannel();
  const { toast } = useToast();

  const handleUpdate = (platform: string, data: any) => {
    updateChannel.mutate(
      { platform, ...data },
      {
        onSuccess: () => toast({ title: "Configuración guardada correctamente" }),
        onError: () => toast({ title: "Error al guardar configuración", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground mt-1">Gestiona integraciones, tokens y herramientas de IA.</p>
          </div>

          <Tabs defaultValue="platforms" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="platforms">Plataformas</TabsTrigger>
              <TabsTrigger value="ai">Herramientas IA</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
            </TabsList>

            <TabsContent value="platforms" className="space-y-6">
              <PlatformIntegration />
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <AIContentGenerator />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              {['whatsapp', 'instagram', 'facebook', 'spotify'].map((platform) => {
                const config = channels?.find(c => c.platform === platform);
                return (
                  <Card key={platform} className={`bg-card/50 backdrop-blur-sm border-border/50 border-l-4 ${
                    platform === 'whatsapp' ? 'border-l-green-500' : 
                    platform === 'instagram' ? 'border-l-pink-500' : 
                    platform === 'facebook' ? 'border-l-blue-500' : 'border-l-green-400'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="capitalize font-display text-xl">{platform} Integration</CardTitle>
                          <CardDescription>Gestiona credenciales para {platform} Business API</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${platform}`} className="text-sm">Activo</Label>
                          <Switch 
                            id={`active-${platform}`} 
                            checked={config?.isActive ?? true} 
                            onCheckedChange={(checked) => handleUpdate(platform, { isActive: checked })}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`access-${platform}`}>Access Token / API Key</Label>
                        <Input 
                          id={`access-${platform}`} 
                          type="password" 
                          defaultValue={config?.accessToken}
                          className="bg-background/50 font-mono text-xs"
                          placeholder={platform === 'spotify' ? "Ingresa tu Spotify Client Secret" : `Ingresa tu access token para ${platform}`}
                          onBlur={(e) => {
                            if (e.target.value !== config?.accessToken) {
                              handleUpdate(platform, { accessToken: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`verify-${platform}`}>{platform === 'spotify' ? 'Client ID' : 'Token de Verificación (Webhook)'}</Label>
                        <Input 
                          id={`verify-${platform}`} 
                          defaultValue={config?.verifyToken}
                          className="bg-background/50 font-mono text-xs"
                          placeholder={platform === 'spotify' ? "Tu Spotify Client ID" : "Tu token de verificación personalizado"}
                          onBlur={(e) => {
                            if (e.target.value !== config?.verifyToken) {
                              handleUpdate(platform, { verifyToken: e.target.value });
                            }
                          }}
                        />
                      </div>
                      {platform === 'whatsapp' && (
                        <div className="grid gap-2">
                          <Label htmlFor={`phone-${platform}`}>Phone Number ID</Label>
                          <Input 
                            id={`phone-${platform}`} 
                            defaultValue={config?.phoneNumberId || ''}
                            className="bg-background/50 font-mono text-xs"
                            placeholder="ID de número de teléfono de WhatsApp"
                            onBlur={(e) => {
                              if (e.target.value !== config?.phoneNumberId) {
                                updateChannel.mutate(
                                  { platform, phoneNumberId: e.target.value },
                                  {
                                    onSuccess: () => toast({ title: "Guardado" }),
                                  }
                                );
                              }
                            }}
                          />
                        </div>
                      )}
                      <div className="flex justify-end">
                        <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Guardado" })}>
                          <Save className="h-4 w-4" /> Guardar Cambios
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}
