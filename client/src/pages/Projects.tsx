
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitFork, Plus, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const { data: projects = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/crm/projects"],
  });

  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Proyectos</h1>
        <Button className="bg-primary text-black font-bold rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-slate-900/40 border-white/5 hover:border-primary/30 transition-all">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
                <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[10px]">
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm">{project.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Sin fecha'}
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Normal
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
