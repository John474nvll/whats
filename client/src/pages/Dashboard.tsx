import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  MessageSquare,
  Zap,
  Plus,
  RefreshCw,
  Activity,
  ShoppingCart,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as ReBarChart,
  Bar,
  Cell,
} from 'recharts';

const activityData = [
  { name: 'Lun', mensajes: 120, ventas: 8 },
  { name: 'Mar', mensajes: 150, ventas: 12 },
  { name: 'Mié', mensajes: 180, ventas: 15 },
  { name: 'Jue', mensajes: 140, ventas: 10 },
  { name: 'Vie', mensajes: 210, ventas: 18 },
  { name: 'Sáb', mensajes: 160, ventas: 14 },
  { name: 'Dom', mensajes: 130, ventas: 6 },
];

const pipelineData = [
  { name: 'Nuevos', value: 12, color: '#3b82f6' },
  { name: 'Contactando', value: 8, color: '#8b5cf6' },
  { name: 'Cualificados', value: 5, color: '#10b981' },
  { name: 'Ganados', value: 3, color: '#f59e0b' },
];

export default function Dashboard() {
  const { toast } = useToast();

  const { data: syncStatus = [] } = useQuery({
    queryKey: ['/api/sync/status'],
    onError: (error) => {
      console.error('Error fetching sync status:', error);
    },
    onSuccess: (data) => {
      console.log('Sync status fetched successfully:', data);
    },
  });

  const { data: purchaseOrders = [] } = useQuery({
    queryKey: ['/api/orders'],
    onError: (error) => {
      console.error('Error fetching purchase orders:', error);
    },
    onSuccess: (data) => {
      console.log('Purchase orders fetched successfully:', data);
    },
  });

  const { data: funnels = [] } = useQuery({
    queryKey: ['/api/funnels'],
    onError: (error) => {
      console.error('Error fetching funnels:', error);
    },
    onSuccess: (data) => {
      console.log('Funnels fetched successfully:', data);
    },
  });

  const handleSync = async () => {
    try {
      await apiRequest('POST', '/api/sync/github', {});
      queryClient.invalidateQueries({ queryKey: ['/api/sync/status'] });
      toast({
        title: 'Sincronización Iniciada',
        description: 'Actualizando a la versión v12.0...',
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'No se pudo sincronizar con GitHub',
        variant: 'destructive',
      });
    }
  };

  const stats = [
    { title: 'Contactos Hoy', value: '124', icon: Users, color: 'text-kiwi' },
    {
      title: 'Mensajes IA',
      value: '1.2k',
      icon: MessageSquare,
      color: 'text-blue-500',
    },
    {
      title: 'Conversión',
      value: '68%',
      icon: BarChart3,
      color: 'text-cyan-neon',
    },
    {
      title: 'Automatización',
      value: '85%',
      icon: Zap,
      color: 'text-yellow-500',
    },
  ];

  const pendingOrders = purchaseOrders.filter(
    (o: any) => o.status === 'pendiente',
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Escritorio <span className="text-kiwi">v12.0</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Panel de control omnicanal Softgan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSync}
            variant="outline"
            className="rounded-full border-white/10 hover:bg-white/5 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Sincronizar v12
          </Button>
          <Button className="rounded-full bg-kiwi hover:bg-kiwi/90 gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Widget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="bg-slate-900/50 border-white/5 backdrop-blur-xl hover-elevate"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-black text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8 bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-kiwi" />
                Actividad Semanal
              </CardTitle>
              <CardDescription>Mensajes y conversiones v12</CardDescription>
            </div>
            <Badge variant="outline" className="border-kiwi/30 text-kiwi">
              En Vivo
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient
                      id="colorMensajes"
                      x1="0"
                      y1="0"
                      y2="1"
                      x2="0"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeOpacity={0.05} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mensajes"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorMensajes)"
                    strokeWidth={3}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-4 bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">
              Estado de Sincronización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {syncStatus.length > 0 ? (
              syncStatus.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-kiwi' : 'bg-red-500'}`}
                    />
                    <div>
                      <p className="text-xs font-bold text-white">
                        {log.message}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase">
                    {log.platform}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">
                  Sin registros recientes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              Órdenes de Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-xl font-black text-orange-500">
                  {pendingOrders}
                </p>
                <p className="text-[10px] text-slate-400">Pendientes</p>
              </div>
              <div className="p-3 rounded-xl bg-kiwi/10 border border-kiwi/20">
                <p className="text-xl font-black text-kiwi">
                  {purchaseOrders.length}
                </p>
                <p className="text-[10px] text-slate-400">Totales</p>
              </div>
            </div>
            <Link href="/orders">
              <Button
                variant="outline"
                className="w-full rounded-xl border-white/10"
              >
                Ver Órdenes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-500" />
              Funnels Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={pipelineData}>
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
            <Link href="/funnels">
              <Button
                variant="outline"
                className="w-full rounded-xl border-white/10"
              >
                Gestionar Funnels
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-12 md:col-span-12 lg:col-span-4 bg-slate-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-neon" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm font-bold text-white">WhatsApp API</span>
              <Badge className="bg-kiwi/20 text-kiwi border-none">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm font-bold text-white">IA Provider</span>
              <Badge className="bg-kiwi/20 text-kiwi border-none">Online</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}