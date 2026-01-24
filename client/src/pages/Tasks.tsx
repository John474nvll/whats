import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  Clock, 
  Plus, 
  Layout, 
  Calendar,
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  Loader2,
  Circle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  projectId?: number;
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-slate-500/20 text-slate-400", icon: Circle },
  in_progress: { label: "En Progreso", color: "bg-amber-500/20 text-amber-400", icon: Clock },
  completed: { label: "Completada", color: "bg-green-500/20 text-green-400", icon: CheckCircle2 }
};

const priorityConfig = {
  low: { label: "Baja", color: "text-slate-400" },
  medium: { label: "Media", color: "text-amber-400" },
  high: { label: "Alta", color: "text-red-400" }
};

const mockTasks: Task[] = [
  { id: 1, title: "Revisar propuesta de campana", description: "Revisar y aprobar la propuesta de marketing Q1", status: "pending", priority: "high", dueDate: "2026-01-25" },
  { id: 2, title: "Actualizar landing page", description: "Mejorar el copy y CTAs de la pagina principal", status: "in_progress", priority: "medium", dueDate: "2026-01-28" },
  { id: 3, title: "Configurar automatizacion email", description: "Setup de secuencias de bienvenida", status: "completed", priority: "low", dueDate: "2026-01-20" },
  { id: 4, title: "Analizar metricas Instagram", description: "Revisar engagement del ultimo mes", status: "pending", priority: "medium", dueDate: "2026-01-30" },
  { id: 5, title: "Preparar contenido semanal", description: "Crear 7 posts para la proxima semana", status: "in_progress", priority: "high", dueDate: "2026-01-26" },
];

export default function Tasks() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  const { data: tasks = mockTasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/crm/tasks"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/crm/tasks");
        const data = await res.json();
        return data.length > 0 ? data : mockTasks;
      } catch {
        return mockTasks;
      }
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: typeof newTask) => {
      const res = await apiRequest("POST", "/api/crm/tasks", { ...data, status: "pending" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/tasks"] });
      toast({ title: "Tarea creada", description: "La tarea se ha agregado exitosamente" });
      setIsDialogOpen(false);
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
    }
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/crm/tasks/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/tasks"] });
    }
  });

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === "pending"),
    in_progress: filteredTasks.filter(t => t.status === "in_progress"),
    completed: filteredTasks.filter(t => t.status === "completed")
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-950 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Tareas <span className="text-primary">Pendientes</span>
          </h1>
          <p className="text-slate-400 text-sm">Organiza y completa tus tareas eficientemente</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black font-bold gap-2" data-testid="button-new-task">
              <Plus className="h-4 w-4" /> Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nueva Tarea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Titulo de la tarea"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-slate-800 border-white/10"
                data-testid="input-task-title"
              />
              <Textarea
                placeholder="Descripcion"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="bg-slate-800 border-white/10"
                data-testid="input-task-description"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v })}>
                  <SelectTrigger className="bg-slate-800 border-white/10" data-testid="select-task-priority">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="bg-slate-800 border-white/10"
                  data-testid="input-task-due-date"
                />
              </div>
              <Button 
                className="w-full bg-primary text-black font-bold"
                onClick={() => createTaskMutation.mutate(newTask)}
                disabled={!newTask.title || createTaskMutation.isPending}
                data-testid="button-create-task"
              >
                {createTaskMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear Tarea"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Layout, color: "text-white" },
          { label: "Pendientes", value: stats.pending, icon: Circle, color: "text-slate-400" },
          { label: "En Progreso", value: stats.inProgress, icon: Clock, color: "text-amber-400" },
          { label: "Completadas", value: stats.completed, icon: CheckCircle2, color: "text-green-400" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-900/40 border-white/5 rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/40 border-white/10 rounded-xl"
            data-testid="input-search-tasks"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-slate-900/40 border-white/10 rounded-xl" data-testid="select-task-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="in_progress">En Progreso</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["pending", "in_progress", "completed"] as const).map((status) => {
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 px-2">
                <StatusIcon className={`h-4 w-4 ${config.color.split(' ')[1]}`} />
                <h3 className="font-bold text-white">{config.label}</h3>
                <Badge variant="outline" className="ml-auto text-[10px]">
                  {tasksByStatus[status].length}
                </Badge>
              </div>
              
              <div className="space-y-2 min-h-[200px]">
                <AnimatePresence>
                  {tasksByStatus[status].map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card 
                        className="bg-slate-900/40 border-white/5 rounded-xl hover:border-white/10 transition-all group"
                        data-testid={`card-task-${task.id}`}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={task.status === "completed"}
                              onCheckedChange={(checked) => {
                                updateTaskStatusMutation.mutate({
                                  id: task.id,
                                  status: checked ? "completed" : "pending"
                                });
                              }}
                              className="mt-1"
                              data-testid={`checkbox-task-${task.id}`}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-bold text-sm ${task.status === "completed" ? "line-through text-slate-500" : "text-white"}`}>
                                {task.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{task.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Badge className={`${priorityConfig[task.priority].color} bg-white/5 text-[9px] uppercase`}>
                                {priorityConfig[task.priority].label}
                              </Badge>
                            </div>
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {tasksByStatus[status].length === 0 && (
                  <div className="h-[100px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                    <p className="text-xs text-slate-600">Sin tareas</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
