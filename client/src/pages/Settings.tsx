
import { useChannels, useUpdateChannel } from "@/hooks/use-channels";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, ChevronDown, ChevronUp, Link2, RefreshCw, User, Bell, Palette } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

// --- Componente para la Configuración de Integraciones ---
const IntegrationsSettings = () => {
  const { data: channels, isLoading } = useChannels();
  const updateChannel = useUpdateChannel();
  const { toast } = useToast();
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

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
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Card className="bg-slate-900/40 border-white/5">
      <CardHeader>
        <CardTitle className="text-white">Integraciones de Canales</CardTitle>
        <CardDescription>Gestiona tus tokens de acceso y la configuración de webhooks para cada plataforma.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
          <div className="flex gap-3">
            <div className="bg-amber-500/20 p-2 rounded-xl h-fit"><Link2 className="w-5 h-5 text-amber-500" /></div>
            <div className="space-y-1">
              <p className="font-bold text-amber-200">Gestión de Access Tokens</p>
              <p className="text-xs text-amber-200/60 leading-relaxed">
                Asegúrate de que tus tokens tengan los permisos correctos para leer y enviar mensajes. Los tokens de WhatsApp Business Platform deben ser permanentes.
              </p>
            </div>
          </div>
        </div>

        {['whatsapp', 'instagram', 'facebook'].map((platform) => {
          const config = (channels as any[])?.find(c => c.platform === platform);
          const isExpanded = expandedPlatform === platform;

          return (
            <Card key={platform} className={`bg-slate-900/40 backdrop-blur-3xl border-white/5 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-primary/30' : ''}`}>
              <CardHeader 
                className="cursor-pointer hover:bg-white/5 transition-colors p-4"
                onClick={() => setExpandedPlatform(isExpanded ? null : platform)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 ${
                      platform === 'whatsapp' ? 'bg-emerald-500/20' : 
                      platform === 'instagram' ? 'bg-pink-500/20' : 'bg-blue-500/20'
                    }`}>
                       {platform === 'whatsapp' && <RefreshCw className="w-5 h-5 text-emerald-500" />}
                       {platform === 'instagram' && <RefreshCw className="w-5 h-5 text-pink-500" />}
                       {platform === 'facebook' && <RefreshCw className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div>
                      <CardTitle className="capitalize font-black text-base text-white">{platform}</CardTitle>
                      <CardDescription className="text-slate-500 text-xs">API Integration</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-white/5">
                      <Label htmlFor={`active-${platform}`} className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activo</Label>
                      <Switch id={`active-${platform}`} checked={config?.isActive ?? true} onCheckedChange={(c) => handleUpdate(platform, { isActive: c })} onClick={(e) => e.stopPropagation()} />
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                  </div>
                </div>
              </CardHeader>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <CardContent className="space-y-4 pt-4 p-4 border-t border-white/5 bg-slate-950/30">
                      <div className="grid gap-2">
                        <Label htmlFor={`access-${platform}`} className="text-xs font-black text-slate-500 uppercase tracking-widest">Access Token</Label>
                        <Input id={`access-${platform}`} type="password" defaultValue={config?.accessToken} className="bg-slate-900/50 border-white/10" placeholder={`Token de ${platform}`} onBlur={(e) => handleUpdate(platform, { accessToken: e.target.value })} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`verify-${platform}`} className="text-xs font-black text-slate-500 uppercase tracking-widest">Verify Token</Label>
                        <Input id={`verify-${platform}`} defaultValue={config?.verifyToken} className="bg-slate-900/50 border-white/10" placeholder="Token de Verificación" onBlur={(e) => handleUpdate(platform, { verifyToken: e.target.value })} />
                      </div>
                      {platform === 'whatsapp' && (
                        <div className="grid gap-2">
                          <Label htmlFor={`phone-${platform}`} className="text-xs font-black text-slate-500 uppercase tracking-widest">Phone Number ID</Label>
                          <Input id={`phone-${platform}`} defaultValue={config?.phoneNumberId || ''} className="bg-slate-900/50 border-white/10" placeholder="ID de número de teléfono" onBlur={(e) => handleUpdate(platform, { phoneNumberId: e.target.value })} />
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

// --- Componente para la Configuración de Perfil ---
const ProfileSettings = () => (
  <Card className="bg-slate-900/40 border-white/5">
    <CardHeader>
      <CardTitle className="text-white">Perfil de Usuario</CardTitle>
      <CardDescription>Gestiona los detalles de tu cuenta.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Nombre de Usuario</Label>
        <Input defaultValue="Admin" className="bg-slate-900/50 border-white/10" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input type="email" defaultValue="admin@socialhub.com" className="bg-slate-900/50 border-white/10" />
      </div>
      <Button className="bg-primary text-black font-bold">Actualizar Perfil</Button>
    </CardContent>
  </Card>
);

// --- Componente para la Configuración de Notificaciones ---
const NotificationsSettings = () => (
  <Card className="bg-slate-900/40 border-white/5">
    <CardHeader>
      <CardTitle className="text-white">Notificaciones</CardTitle>
      <CardDescription>Elige cómo quieres recibir las alertas.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-white/10">
        <Label htmlFor="email-notifications">Notificaciones por Email</Label>
        <Switch id="email-notifications" defaultChecked />
      </div>
      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-white/10">
        <Label htmlFor="push-notifications">Notificaciones Push</Label>
        <Switch id="push-notifications" />
      </div>
    </CardContent>
  </Card>
);

// --- Componente para la Configuración de Apariencia ---
const AppearanceSettings = () => (
  <Card className="bg-slate-900/40 border-white/5">
    <CardHeader>
      <CardTitle className="text-white">Apariencia</CardTitle>
      <CardDescription>Personaliza el look & feel de la aplicación.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-white/10">
            <div className="space-y-1">
                <Label>Tema de la Interfaz</Label>
                <p className="text-xs text-slate-400">Selecciona entre el modo claro y oscuro.</p>
            </div>
            <ThemeToggle />
        </div>
    </CardContent>
  </Card>
);

// --- Página Principal de Configuración ---
export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 md:pb-8">
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Configuración</h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">Gestiona tu perfil, canales, notificaciones y apariencia.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-900/50 p-1 h-auto rounded-2xl border-white/5">
            <TabsTrigger value="profile" className="rounded-xl font-bold flex items-center gap-2"><User className="w-4 h-4"/>Perfil</TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-xl font-bold flex items-center gap-2"><Link2 className="w-4 h-4"/>Integraciones</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl font-bold flex items-center gap-2"><Bell className="w-4 h-4"/>Notificaciones</TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl font-bold flex items-center gap-2"><Palette className="w-4 h-4"/>Apariencia</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileSettings /></TabsContent>
          <TabsContent value="integrations"><IntegrationsSettings /></TabsContent>
          <TabsContent value="notifications"><NotificationsSettings /></TabsContent>
          <TabsContent value="appearance"><AppearanceSettings /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
