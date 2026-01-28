import { useChannels, useUpdateChannel } from '@/hooks/use-channels';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Loader2,
  Save,
  ChevronDown,
  ChevronUp,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

const PlatformIntegration = () => (
  <Card className="bg-slate-900/40 border-white/5">
    <CardHeader>
      <CardTitle className="text-white">Integración de Plataformas</CardTitle>
      <CardDescription>Configura tus conexiones principales</CardDescription>
    </CardHeader>
    <CardContent className="text-slate-400">
      Panel de integraciones activas
    </CardContent>
  </Card>
);

const AIContentGenerator = () => (
  <Card className="bg-slate-900/40 border-white/5">
    <CardHeader>
      <CardTitle className="text-white">Generador de Contenido IA</CardTitle>
      <CardDescription>Configuración de modelos OpenAI</CardDescription>
    </CardHeader>
    <CardContent className="text-slate-400">
      Ajustes de generación neuronal
    </CardContent>
  </Card>
);

export default function Settings() {
  const { data: channels, isLoading } = useChannels();
  const updateChannel = useUpdateChannel();
  const { toast } = useToast();
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const handleUpdate = (platform: string, data: any) => {
    updateChannel.mutate(
      { platform, ...data },
      {
        onSuccess: () =>
          toast({ title: 'Configuración guardada correctamente' }),
        onError: () =>
          toast({
            title: 'Error al guardar configuración',
            variant: 'destructive',
          }),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-950 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 md:pb-8">
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Configuración
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">
            Gestiona integraciones, tokens y herramientas de IA.
          </p>
        </div>

        <Tabs defaultValue="platforms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 p-1 rounded-2xl border border-white/5">
            <TabsTrigger
              value="platforms"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold"
            >
              Canales
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold"
            >
              IA
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold"
            >
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-6">
            <PlatformIntegration />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AIContentGenerator />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-6">
              <div className="flex gap-3">
                <div className="bg-amber-500/20 p-2 rounded-xl h-fit">
                  <Link2 className="w-5 h-5 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-amber-200">
                    Gestión de Access Tokens
                  </p>
                  <p className="text-xs text-amber-200/60 leading-relaxed">
                    Para Instagram/Facebook usa Meta Developers. Para WhatsApp
                    Business Platform obtén tokens permanentes. Asegúrate de que
                    los tokens tengan permisos de lectura/escritura.
                  </p>
                </div>
              </div>
            </div>

            {['whatsapp', 'instagram', 'facebook'].map((platform) => {
              const config = (channels as any[])?.find(
                (c) => c.platform === platform,
              );
              const isExpanded = expandedPlatform === platform;

              return (
                <Card
                  key={platform}
                  className={`bg-slate-900/40 backdrop-blur-3xl border-white/5 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-primary/30' : ''}`}
                >
                  <CardHeader
                    className="cursor-pointer hover:bg-white/5 transition-colors p-4 md:p-6"
                    onClick={() =>
                      setExpandedPlatform(isExpanded ? null : platform)
                    }
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border border-white/10 ${
                            platform === 'whatsapp'
                              ? 'bg-emerald-500/20'
                              : platform === 'instagram'
                                ? 'bg-pink-500/20'
                                : platform === 'facebook'
                                  ? 'bg-blue-500/20'
                                  : 'bg-slate-800/20'
                          }`}
                        >
                          {platform === 'whatsapp' && (
                            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                          )}
                          {platform === 'instagram' && (
                            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
                          )}
                          {platform === 'facebook' && (
                            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="capitalize font-black text-lg md:text-xl text-white">
                            {platform}
                          </CardTitle>
                          <CardDescription className="text-slate-500 text-xs md:text-sm">
                            API Integration v3
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-white/5">
                          <Label
                            htmlFor={`active-${platform}`}
                            className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                          >
                            Activo
                          </Label>
                          <Switch
                            id={`active-${platform}`}
                            checked={config?.isActive ?? true}
                            onCheckedChange={(checked) =>
                              handleUpdate(platform, { isActive: checked })
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <CardContent className="space-y-6 pt-0 p-4 md:p-6 border-t border-white/5 bg-slate-950/30">
                          <div className="sm:hidden flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <Label
                              htmlFor={`active-mobile-${platform}`}
                              className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                            >
                              Estado del Canal
                            </Label>
                            <Switch
                              id={`active-mobile-${platform}`}
                              checked={config?.isActive ?? true}
                              onCheckedChange={(checked) =>
                                handleUpdate(platform, { isActive: checked })
                              }
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label
                              htmlFor={`access-${platform}`}
                              className="text-xs font-black text-slate-500 uppercase tracking-[0.15em]"
                            >
                              Access Token / API Key
                            </Label>
                            <div className="relative">
                              <Input
                                id={`access-${platform}`}
                                type="password"
                                defaultValue={config?.accessToken}
                                className="bg-slate-900/50 border-white/10 rounded-xl h-11 md:h-12 font-mono text-xs focus:ring-primary/20"
                                placeholder={`Access Token ${platform}`}
                                onBlur={(e) => {
                                  if (e.target.value !== config?.accessToken) {
                                    handleUpdate(platform, {
                                      accessToken: e.target.value,
                                    });
                                  }
                                }}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-[10px] font-black uppercase text-primary hover:bg-primary/10"
                                >
                                  Sincronizar
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label
                              htmlFor={`verify-${platform}`}
                              className="text-xs font-black text-slate-500 uppercase tracking-[0.15em]"
                            >
                              Webhook Verification Token
                            </Label>
                            <Input
                              id={`verify-${platform}`}
                              defaultValue={config?.verifyToken}
                              className="bg-slate-900/50 border-white/10 rounded-xl h-11 md:h-12 font-mono text-xs focus:ring-primary/20"
                              placeholder="Verification Token"
                              onBlur={(e) => {
                                if (e.target.value !== config?.verifyToken) {
                                  handleUpdate(platform, {
                                    verifyToken: e.target.value,
                                  });
                                }
                              }}
                            />
                          </div>

                          {platform === 'whatsapp' && (
                            <div className="grid gap-2">
                              <Label
                                htmlFor={`phone-${platform}`}
                                className="text-xs font-black text-slate-500 uppercase tracking-[0.15em]"
                              >
                                Phone Number ID
                              </Label>
                              <Input
                                id={`phone-${platform}`}
                                defaultValue={config?.phoneNumberId || ''}
                                className="bg-slate-900/50 border-white/10 rounded-xl h-11 md:h-12 font-mono text-xs focus:ring-primary/20"
                                placeholder="WhatsApp Business Phone ID"
                                onBlur={(e) => {
                                  if (
                                    e.target.value !== config?.phoneNumberId
                                  ) {
                                    handleUpdate(platform, {
                                      phoneNumberId: e.target.value,
                                    });
                                  }
                                }}
                              />
                            </div>
                          )}

                          <Button
                            className="w-full h-11 md:h-12 rounded-xl bg-primary text-black font-black hover:scale-[1.01] transition-all shadow-lg shadow-primary/10"
                            onClick={() =>
                              toast({ title: 'Configuración Actualizada' })
                            }
                          >
                            <Save className="h-4 w-4 mr-2" /> Guardar y Conectar
                          </Button>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
