
import { useState } from "react";
import { useBots, useCreateBot } from "@/hooks/use-bots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot as BotIcon, PlusCircle } from "lucide-react";
import { Bot } from "@shared/models/bot";

// --- Formulario de Creación de Bot (en un Diálogo) ---
type CreateBotDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateBotDialog = ({ isOpen, onClose }: CreateBotDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const createBot = useCreateBot();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !systemPrompt) return;

    createBot.mutate(
      { name, description, systemPrompt, model: 'gpt-3.5-turbo' }, 
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Crear un Nuevo Agente Neuronal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Bot</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Asistente de Ventas" className="bg-slate-800 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Responde preguntas sobre nuestros productos" className="bg-slate-800 border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt (Instrucciones)</Label>
            <Textarea id="system-prompt" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Eres un amigable asistente de ventas..." className="bg-slate-800 border-white/10 h-32" />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={createBot.isPending} className="bg-primary text-black font-bold">
              {createBot.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar Bot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


// --- Página Principal de Bots ---
export function BotsPage() {
  const { data: bots, isLoading, error } = useBots();
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Administración de Agentes</h1>
          <p className="text-slate-400">Crea, configura y monitoriza tus bots de chat y voz.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary text-black font-bold flex items-center gap-2">
          <PlusCircle className="w-4 h-4"/>
          Crear Nuevo Bot
        </Button>
      </div>

      {isLoading && <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      {error && <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">Error al cargar los bots: {error.message}</div>}
      
      {!isLoading && !error && (
        bots?.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-xl">
                <BotIcon className="mx-auto h-12 w-12 text-slate-500" />
                <h3 className="mt-2 text-xl font-semibold text-white">No hay bots todavía</h3>
                <p className="mt-1 text-sm text-slate-400">Empieza por crear tu primer agente neuronal.</p>
                <div className="mt-6">
                    <Button onClick={() => setDialogOpen(true)} className="bg-primary text-black font-bold">
                        <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                        Crear Bot
                    </Button>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots?.map((bot: Bot) => (
                <Card key={bot.id} className="bg-slate-900/40 border-white/5 hover:border-primary/50 transition-colors">
                    <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-white font-bold">{bot.name}</CardTitle>
                        <Badge variant={bot.id % 2 === 0 ? "default" : "secondary"} className="bg-green-500/10 text-green-400 border-green-500/20">Activo</Badge>
                    </div>
                    <CardDescription>{bot.description || "Sin descripción."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-slate-400 font-mono p-3 bg-black/20 rounded-md">
                            <p className="font-bold uppercase text-slate-500 text-[10px] mb-1">System Prompt</p>
                            <p className="truncate">{bot.systemPrompt}</p>
                        </div>
                    </CardContent>
                </Card>
                ))}
            </div>
        )
      )}

      <CreateBotDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
