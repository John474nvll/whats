import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FolderOpen, 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2,
  Search,
  Filter,
  LayoutGrid,
  List,
  TrendingUp,
  Loader2
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "paused" | "planning";
  progress: number;
  dueDate: string;
  priority: "low" | "medium" | "high";
  teamSize: number;
  tasksCompleted: number;
  totalTasks: number;
}

const statusColors: Record<string, string> = {
  active: "bg-primary/20 text-primary border-primary/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  paused: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  planning: "bg-blue-500/20 text-blue-400 border-blue-500/30"
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-500/20 text-slate-400",
  medium: "bg-amber-500/20 text-amber-400",
  high: "bg-red-500/20 text-red-400"
};

const mockProjects: Project[] = [
  { id: 1, name: "Campana Q1 2026", description: "Lanzamiento de nuevos productos", status: "active", progress: 65, dueDate: "2026-03-31", priority: "high", teamSize: 5, tasksCompleted: 13, totalTasks: 20 },
  { id: 2, name: "Rediseno Web", description: "Modernizacion del sitio corporativo", status: "planning", progress: 15, dueDate: "2026-02-28", priority: "medium", teamSize: 3, tasksCompleted: 3, totalTasks: 20 },
  { id: 3, name: "Integracion CRM", description: "Conectar sistemas de ventas", status: "active", progress: 80, dueDate: "2026-01-30", priority: "high", teamSize: 4, tasksCompleted: 16, totalTasks: 20 },
  { id: 4, name: "Automatizacion Marketing", description: "Flujos automaticos de email", status: "completed", progress: 100, dueDate: "2025-12-15", priority: "medium", teamSize: 2, tasksCompleted: 12, totalTasks: 12 },
];

export default function Projects() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  const { data: projects = mockProjects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/crm/projects"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/crm/projects");
        const data = await res.json();
        return data.length > 0 ? data : mockProjects;
      } catch {
        return mockProjects;
      }
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: typeof newProject) => {
      const res = await apiRequest("POST", "/api/crm/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/projects"] });
      toast({ title: "Proyecto creado", description: "El proyecto se ha creado exitosamente" });
      setIsDialogOpen(false);
      setNewProject({ name: "", description: "", priority: "medium", dueDate: "" });
    }
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    completed: projects.filter(p => p.status === "completed").length,
    avgProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) || 0
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-950 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Proyectos <span className="text-primary">Activos</span>
          </h1>
          <p className="text-slate-400 text-sm">Gestiona todos tus proyectos en un solo lugar</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black font-bold gap-2" data-testid="button-new-project">
              <Plus className="h-4 w-4" /> Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Nombre del proyecto"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="bg-slate-800 border-white/10"
                data-testid="input-project-name"
              />
              <Textarea
                placeholder="Descripcion"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-slate-800 border-white/10"
                data-testid="input-project-description"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={newProject.priority} onValueChange={(v) => setNewProject({ ...newProject, priority: v })}>
                  <SelectTrigger className="bg-slate-800 border-white/10" data-testid="select-priority">
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
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  className="bg-slate-800 border-white/10"
                  data-testid="input-due-date"
                />
              </div>
              <Button 
                className="w-full bg-primary text-black font-bold"
                onClick={() => createProjectMutation.mutate(newProject)}
                disabled={!newProject.name || createProjectMutation.isPending}
                data-testid="button-create-project"
              >
                {createProjectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear Proyecto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: FolderOpen, color: "text-white" },
          { label: "Activos", value: stats.active, icon: Clock, color: "text-primary" },
          { label: "Completados", value: stats.completed, icon: CheckCircle2, color: "text-green-400" },
          { label: "Progreso Prom.", value: `${stats.avgProgress}%`, icon: TrendingUp, color: "text-cyan-400" },
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

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full md:w-auto">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/40 border-white/10 rounded-xl"
              data-testid="input-search-projects"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-900/40 border-white/10 rounded-xl" data-testid="select-status-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="planning">Planificando</SelectItem>
              <SelectItem value="paused">Pausados</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="rounded-lg"
            data-testid="button-view-grid"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="rounded-lg"
            data-testid="button-view-list"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
        {filteredProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-slate-900/40 border-white/5 rounded-2xl hover:border-white/10 transition-all group" data-testid={`card-project-${project.id}`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
                  </div>
                  <Badge className={`${statusColors[project.status]} border uppercase text-[9px] font-black`}>
                    {project.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Progreso</span>
                    <span className="text-primary font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {project.teamSize}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {project.tasksCompleted}/{project.totalTasks}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Badge className={priorityColors[project.priority]}>
                    {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Media" : "Baja"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No se encontraron proyectos</p>
        </div>
      )}
    </div>
  );
}
