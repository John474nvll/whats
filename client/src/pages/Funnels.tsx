import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Plus, GitFork, Users, DollarSign, TrendingUp, ArrowRight, 
  Eye, Edit, Trash2, Copy, Play, Pause, BarChart3, Target,
  MessageSquare, Mail, Phone, ShoppingCart, CheckCircle, Clock,
  Zap, Filter, Search, MoreVertical, Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FunnelStage {
  id: string;
  name: string;
  type: "landing" | "optin" | "sales" | "checkout" | "upsell" | "thankyou";
  conversions: number;
  visitors: number;
}

interface Funnel {
  id: number;
  name: string;
  description: string | null;
  status: "active" | "paused" | "draft";
  type: "sales" | "leads" | "webinar" | "product";
  stages: FunnelStage[];
  totalVisitors: number;
  totalConversions: number;
  revenue: number;
  createdAt: string;
}

export default function Funnels() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);

  const [newFunnel, setNewFunnel] = useState({
    name: "",
    description: "",
    type: "sales" as const,
  });

  const { data: funnels = [], isLoading } = useQuery<Funnel[]>({
    queryKey: ["/api/funnels"],
  });

  const createFunnel = useMutation({
    mutationFn: async (data: typeof newFunnel) => {
      return await apiRequest("POST", "/api/funnels", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funnels"] });
      toast({ title: "Funnel creado", description: "Tu nuevo embudo de ventas está listo" });
      setCreateOpen(false);
      setNewFunnel({ name: "", description: "", type: "sales" });
    },
  });

  const updateFunnelStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/funnels/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funnels"] });
      toast({ title: "Estado actualizado" });
    },
  });

  const deleteFunnel = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/funnels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funnels"] });
      toast({ title: "Funnel eliminado" });
    },
  });

  const duplicateFunnel = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("POST", `/api/funnels/${id}/duplicate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funnels"] });
      toast({ title: "Funnel duplicado" });
    },
  });

  const filteredFunnels = funnels.filter((f) => {
    const searchMatch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || f.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const stats = {
    totalFunnels: funnels.length,
    active: funnels.filter((f) => f.status === "active").length,
    totalVisitors: funnels.reduce((acc, f) => acc + (f.totalVisitors || 0), 0),
    totalRevenue: funnels.reduce((acc, f) => acc + (f.revenue || 0), 0),
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      paused: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    const labels: Record<string, string> = {
      active: "Activo",
      paused: "Pausado",
      draft: "Borrador",
    };
    return (
      <Badge className={`${styles[status]} font-bold uppercase text-[10px]`}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const config: Record<string, { icon: any; label: string; color: string }> = {
      sales: { icon: ShoppingCart, label: "Ventas", color: "text-blue-400 bg-blue-500/10" },
      leads: { icon: Users, label: "Leads", color: "text-purple-400 bg-purple-500/10" },
      webinar: { icon: Play, label: "Webinar", color: "text-red-400 bg-red-500/10" },
      product: { icon: Target, label: "Producto", color: "text-green-400 bg-green-500/10" },
    };
    const { icon: Icon, label, color } = config[type] || config.sales;
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-bold">{label}</span>
      </div>
    );
  };

  const getConversionRate = (conversions: number, visitors: number): string => {
    if (!visitors) return "0";
    return ((conversions / visitors) * 100).toFixed(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stageTypes = [
    { value: "landing", label: "Landing Page", icon: Layers },
    { value: "optin", label: "Captura de Leads", icon: Mail },
    { value: "sales", label: "Página de Ventas", icon: DollarSign },
    { value: "checkout", label: "Checkout", icon: ShoppingCart },
    { value: "upsell", label: "Upsell", icon: TrendingUp },
    { value: "thankyou", label: "Gracias", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-foreground pb-20 md:pb-8 transition-colors">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white">
              Funnels de <span className="text-primary">Ventas</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Crea y gestiona embudos de conversión para tu negocio
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 px-6">
                <Plus className="h-4 w-4 mr-2" /> Nuevo Funnel
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-slate-900 dark:border-white/10">
              <DialogHeader>
                <DialogTitle className="text-xl font-black dark:text-white">Crear Nuevo Funnel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-wider">Nombre del Funnel</Label>
                  <Input
                    placeholder="Ej: Funnel de Ventas Principal"
                    value={newFunnel.name}
                    onChange={(e) => setNewFunnel({ ...newFunnel, name: e.target.value })}
                    className="dark:bg-slate-800 dark:border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-wider">Descripción</Label>
                  <Textarea
                    placeholder="Describe el objetivo de este funnel"
                    value={newFunnel.description}
                    onChange={(e) => setNewFunnel({ ...newFunnel, description: e.target.value })}
                    className="dark:bg-slate-800 dark:border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase tracking-wider">Tipo de Funnel</Label>
                  <Select value={newFunnel.type} onValueChange={(v: any) => setNewFunnel({ ...newFunnel, type: v })}>
                    <SelectTrigger className="dark:bg-slate-800 dark:border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-white/10">
                      <SelectItem value="sales">Ventas</SelectItem>
                      <SelectItem value="leads">Captura de Leads</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="product">Lanzamiento de Producto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => createFunnel.mutate(newFunnel)}
                  disabled={createFunnel.isPending || !newFunnel.name}
                  className="w-full bg-primary font-bold rounded-xl h-12"
                >
                  {createFunnel.isPending ? "Creando..." : "Crear Funnel"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="dark:bg-slate-900/40 dark:border-white/5">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <GitFork className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black dark:text-white">{stats.totalFunnels}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Funnels</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-900/40 dark:border-white/5">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-3">
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black dark:text-white">{stats.active}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Activos</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-900/40 dark:border-white/5">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black dark:text-white">{stats.totalVisitors.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Visitantes</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-slate-900/40 dark:border-white/5">
            <CardContent className="p-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Ingresos</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar funnels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 dark:bg-slate-900/50 dark:border-white/10 h-11 rounded-xl w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 dark:bg-slate-900/50 dark:border-white/10 h-11 rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-white/10">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="paused">Pausados</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Cargando funnels...</div>
        ) : filteredFunnels.length === 0 ? (
          <Card className="dark:bg-slate-900/40 dark:border-white/5">
            <CardContent className="py-16 text-center">
              <GitFork className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold dark:text-white mb-2">No hay funnels</h3>
              <p className="text-muted-foreground mb-6">Crea tu primer embudo de ventas para empezar a convertir</p>
              <Button onClick={() => setCreateOpen(true)} className="bg-primary font-bold rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Crear Primer Funnel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFunnels.map((funnel) => (
              <Card key={funnel.id} className="dark:bg-slate-900/40 dark:border-white/5 hover:dark:border-primary/30 transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-black dark:text-white">{funnel.name}</CardTitle>
                      <CardDescription className="line-clamp-1">{funnel.description || "Sin descripción"}</CardDescription>
                    </div>
                    {getStatusBadge(funnel.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getTypeBadge(funnel.type)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conversión</span>
                      <span className="font-bold text-primary">
                        {getConversionRate(funnel.totalConversions, funnel.totalVisitors)}%
                      </span>
                    </div>
                    <Progress 
                      value={parseFloat(getConversionRate(funnel.totalConversions, funnel.totalVisitors))} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg dark:bg-slate-800/50">
                      <p className="text-lg font-bold dark:text-white">{funnel.totalVisitors || 0}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Visitas</p>
                    </div>
                    <div className="p-2 rounded-lg dark:bg-slate-800/50">
                      <p className="text-lg font-bold dark:text-white">{funnel.totalConversions || 0}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Conversiones</p>
                    </div>
                    <div className="p-2 rounded-lg dark:bg-slate-800/50">
                      <p className="text-lg font-bold text-primary">{(funnel.stages?.length || 0)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Etapas</p>
                    </div>
                  </div>

                  {funnel.stages && funnel.stages.length > 0 && (
                    <div className="flex items-center gap-1 overflow-x-auto pb-2">
                      {funnel.stages.map((stage, i) => (
                        <div key={stage.id} className="flex items-center">
                          <div className="px-2 py-1 rounded-lg bg-slate-800/50 text-[10px] font-bold whitespace-nowrap">
                            {stage.name}
                          </div>
                          {i < funnel.stages.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground mx-1 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg dark:border-white/10"
                      onClick={() => setSelectedFunnel(funnel)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg dark:border-white/10"
                      onClick={() => {
                        const newStatus = funnel.status === "active" ? "paused" : "active";
                        updateFunnelStatus.mutate({ id: funnel.id, status: newStatus });
                      }}
                    >
                      {funnel.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg dark:border-white/10"
                      onClick={() => duplicateFunnel.mutate(funnel.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg dark:border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => deleteFunnel.mutate(funnel.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedFunnel && (
          <FunnelDetailModal
            funnel={selectedFunnel}
            onClose={() => setSelectedFunnel(null)}
            stageTypes={stageTypes}
          />
        )}
      </div>
    </div>
  );
}

function FunnelDetailModal({ funnel, onClose, stageTypes }: { funnel: Funnel; onClose: () => void; stageTypes: any[] }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl dark:bg-slate-900 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-black dark:text-white flex items-center gap-3">
            {funnel.name}
            <Badge className="bg-primary/20 text-primary">{funnel.type}</Badge>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg font-bold">Resumen</TabsTrigger>
            <TabsTrigger value="stages" className="rounded-lg font-bold">Etapas</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg font-bold">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="dark:bg-slate-800/50 dark:border-white/5">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto text-blue-400 mb-2" />
                  <p className="text-2xl font-black dark:text-white">{funnel.totalVisitors || 0}</p>
                  <p className="text-xs text-muted-foreground">Visitantes</p>
                </CardContent>
              </Card>
              <Card className="dark:bg-slate-800/50 dark:border-white/5">
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto text-green-400 mb-2" />
                  <p className="text-2xl font-black dark:text-white">{funnel.totalConversions || 0}</p>
                  <p className="text-xs text-muted-foreground">Conversiones</p>
                </CardContent>
              </Card>
              <Card className="dark:bg-slate-800/50 dark:border-white/5">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto text-purple-400 mb-2" />
                  <p className="text-2xl font-black dark:text-white">
                    {funnel.totalVisitors ? ((funnel.totalConversions / funnel.totalVisitors) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Tasa de Conversión</p>
                </CardContent>
              </Card>
              <Card className="dark:bg-slate-800/50 dark:border-white/5">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto text-amber-400 mb-2" />
                  <p className="text-2xl font-black dark:text-white">
                    ${((funnel.revenue || 0) / 100).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground">{funnel.description || "Sin descripción"}</p>
          </TabsContent>

          <TabsContent value="stages" className="space-y-4 mt-4">
            {funnel.stages && funnel.stages.length > 0 ? (
              <div className="space-y-3">
                {funnel.stages.map((stage, index) => {
                  const stageConfig = stageTypes.find(s => s.value === stage.type);
                  const Icon = stageConfig?.icon || Layers;
                  return (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <Card className="flex-1 dark:bg-slate-800/50 dark:border-white/5">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold dark:text-white">{stage.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{stageConfig?.label || stage.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold dark:text-white">{stage.visitors || 0}</p>
                            <p className="text-xs text-muted-foreground">visitantes</p>
                          </div>
                        </CardContent>
                      </Card>
                      {index < funnel.stages.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay etapas configuradas</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Las analíticas detalladas estarán disponibles pronto</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
