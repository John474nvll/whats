import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Plus,
  Shield,
  UserCheck,
  TrendingUp,
  Target,
  DollarSign,
  Crown,
  Loader2,
  MoreVertical,
  Search,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface SalesGroup {
  id: number;
  name: string;
  managerId: string;
  managerName: string;
  memberCount: number;
  monthlyTarget: number;
  currentSales: number;
  performance: number;
}

const mockGroups: SalesGroup[] = [
  {
    id: 1,
    name: 'Equipo Alpha',
    managerId: '1',
    managerName: 'Carlos Rodriguez',
    memberCount: 5,
    monthlyTarget: 50000,
    currentSales: 42500,
    performance: 85,
  },
  {
    id: 2,
    name: 'Equipo Beta',
    managerId: '2',
    managerName: 'Maria Garcia',
    memberCount: 4,
    monthlyTarget: 40000,
    currentSales: 38000,
    performance: 95,
  },
  {
    id: 3,
    name: 'Equipo Gamma',
    managerId: '3',
    managerName: 'Juan Martinez',
    memberCount: 6,
    monthlyTarget: 60000,
    currentSales: 45000,
    performance: 75,
  },
  {
    id: 4,
    name: 'Equipo Delta',
    managerId: '4',
    managerName: 'Ana Lopez',
    memberCount: 3,
    monthlyTarget: 30000,
    currentSales: 32000,
    performance: 107,
  },
];

export default function SalesGroups() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    managerName: '',
    monthlyTarget: '',
  });

  const { data: groups = mockGroups, isLoading } = useQuery<SalesGroup[]>({
    queryKey: ['/api/crm/sales-groups'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/crm/sales-groups');
        const data = await res.json();
        return data.length > 0 ? data : mockGroups;
      } catch {
        return mockGroups;
      }
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: typeof newGroup) => {
      const res = await apiRequest('POST', '/api/crm/sales-groups', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/sales-groups'] });
      toast({
        title: 'Grupo creado',
        description: 'El grupo de ventas se ha creado exitosamente',
      });
      setIsDialogOpen(false);
      setNewGroup({ name: '', managerName: '', monthlyTarget: '' });
    },
  });

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.managerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalStats = {
    groups: groups.length,
    members: groups.reduce((sum, g) => sum + g.memberCount, 0),
    target: groups.reduce((sum, g) => sum + g.monthlyTarget, 0),
    sales: groups.reduce((sum, g) => sum + g.currentSales, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-950 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Grupos de <span className="text-primary">Ventas</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Administra y monitorea el rendimiento de tus equipos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-black font-bold gap-2"
              data-testid="button-new-group"
            >
              <Plus className="h-4 w-4" /> Nuevo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                Crear Nuevo Grupo
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Nombre del grupo"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                className="bg-slate-800 border-white/10"
                data-testid="input-group-name"
              />
              <Input
                placeholder="Nombre del manager"
                value={newGroup.managerName}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, managerName: e.target.value })
                }
                className="bg-slate-800 border-white/10"
                data-testid="input-manager-name"
              />
              <Input
                type="number"
                placeholder="Meta mensual"
                value={newGroup.monthlyTarget}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, monthlyTarget: e.target.value })
                }
                className="bg-slate-800 border-white/10"
                data-testid="input-monthly-target"
              />
              <Button
                className="w-full bg-primary text-black font-bold"
                onClick={() => createGroupMutation.mutate(newGroup)}
                disabled={!newGroup.name || createGroupMutation.isPending}
                data-testid="button-create-group"
              >
                {createGroupMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Crear Grupo'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Equipos',
            value: totalStats.groups,
            icon: Shield,
            color: 'text-primary',
          },
          {
            label: 'Miembros',
            value: totalStats.members,
            icon: Users,
            color: 'text-cyan-400',
          },
          {
            label: 'Meta Total',
            value: formatCurrency(totalStats.target),
            icon: Target,
            color: 'text-amber-400',
            small: true,
          },
          {
            label: 'Ventas',
            value: formatCurrency(totalStats.sales),
            icon: DollarSign,
            color: 'text-green-400',
            small: true,
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="bg-slate-900/40 border-white/5 rounded-2xl"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p
                  className={`font-black text-white ${stat.small ? 'text-lg' : 'text-2xl'}`}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Buscar grupos o managers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-900/40 border-white/10 rounded-xl"
          data-testid="input-search-groups"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group, i) => {
          const progressPercent = Math.min(
            (group.currentSales / group.monthlyTarget) * 100,
            100,
          );
          const isOverTarget = group.performance > 100;

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="bg-slate-900/40 border-white/5 rounded-2xl hover:border-white/10 transition-all group"
                data-testid={`card-group-${group.id}`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Users className="h-3 w-3" />
                          {group.memberCount} miembros
                        </div>
                      </div>
                    </div>
                    {isOverTarget && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-none">
                        <Crown className="h-3 w-3 mr-1" />
                        Top
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {group.managerName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {group.managerName}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Manager
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progreso Mensual</span>
                      <span
                        className={`font-bold ${isOverTarget ? 'text-green-400' : 'text-primary'}`}
                      >
                        {group.performance}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isOverTarget ? 'bg-green-500' : 'bg-primary'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{formatCurrency(group.currentSales)}</span>
                      <span>{formatCurrency(group.monthlyTarget)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-9 rounded-xl border-white/10 text-xs font-bold"
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No se encontraron grupos de ventas</p>
        </div>
      )}
    </div>
  );
}
