
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Plus, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@shared/schema";

export default function Tasks() {
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/crm/tasks"], // Assuming this endpoint is implemented or mapped
  });

  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Tareas</h1>
        <Button className="bg-primary text-black font-bold rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Nueva Tarea
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-slate-900/40 border-white/5 hover:border-primary/30 transition-all">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
                <Badge variant="outline" className={`uppercase text-[10px] ${
                  task.status === 'completed' ? 'border-emerald-500/50 text-emerald-500' : 'border-primary/20 text-primary'
                }`}>
                  {task.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm">{task.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-primary/20 text-primary">
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
            <Layout className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No hay tareas pendientes</p>
          </div>
        )}
      </div>
    </div>
  );
}
