
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, User, Shield } from "lucide-react";
import { UserForm } from "@/components/crm/UserForm";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";

export default function Users() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery<User[]>({ 
    queryKey: ["/api/crm/users"],
    queryFn: async () => {
      const res = await fetch('/api/crm/users');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/crm/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/users"] });
      toast({ title: "Usuario eliminado" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "admin": return { label: "Admin", color: "bg-red-500/20 text-red-400 border-red-500/30" };
      case "sales": return { label: "Ventas", color: "bg-green-500/20 text-green-400 border-green-500/30" };
      case "service": return { label: "Servicio", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
      default: return { label: role, color: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
    }
  };

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Usuarios
            </h1>
            <p className="text-muted-foreground text-lg">Administra los usuarios y roles del sistema.</p>
          </div>
          <UserForm />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-slate-800/50 border-slate-700 h-11 rounded-lg w-full"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-48 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700" />)}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 col-span-full">
            <CardContent className="pt-12 pb-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No se encontraron usuarios.</p>
              <UserForm />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <Card key={user.id} className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold truncate">{user.name}</CardTitle>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end text-sm">
                    <div className="flex items-center justify-between pt-3">
                      <Badge className={`flex items-center gap-1 rounded-full ${roleInfo.color}`}>
                          <Shield className="h-3 w-3" /> {roleInfo.label}
                      </Badge>
                      <div className="flex gap-2">
                        <UserForm user={user} />
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-red-600/30 text-red-500 hover:bg-red-500/10 rounded-lg h-9 w-9"
                          onClick={() => deleteUser.mutate(user.id)}
                          disabled={deleteUser.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
