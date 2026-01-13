
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter, Trash2, Edit, MessageCircle, Instagram, Facebook, User } from "lucide-react";
import { CustomerForm } from "@/components/crm/CustomerForm";
import { queryClient } from "@/lib/queryClient";

export default function Customers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: customers, isLoading } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: number) => {
      await queryClient.delete(`/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Cliente eliminado" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredCustomers = customers?.filter(c => {
    const searchMatch = 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm);
    const statusMatch = statusFilter === "all" || c.status === statusFilter;
    return searchMatch && statusMatch;
  }) || [];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp": return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "instagram": return <Instagram className="h-4 w-4 text-pink-500" />;
      case "facebook": return <Facebook className="h-4 w-4 text-blue-500" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-600 border-green-500/30";
      case "inactive": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "blocked": return "bg-red-500/20 text-red-600 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-600 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Clientes
            </h1>
            <p className="text-muted-foreground text-lg">Administra tu base de datos de clientes y contactos</p>
          </div>
          <CustomerForm />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-700 h-11 rounded-lg w-full"
            />
          </div>
          <div className="flex items-center gap-2">
             <Filter className="h-4 w-4 text-muted-foreground" />
             <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-800/50 border-slate-700 h-11 rounded-lg text-sm pl-3 pr-8 w-full md:w-auto"
             >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="blocked">Bloqueado</option>
             </select>
          </div>
        </div>

        {/* Customers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700" />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 col-span-full">
            <CardContent className="pt-12 pb-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No se encontraron clientes.</p>
              <CustomerForm />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold flex items-center gap-2 truncate">
                        {getPlatformIcon(customer.platform)}
                        <span className="truncate">{customer.name}</span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground truncate">{customer.email || "Sin email"}</p>
                    </div>
                    <Badge className={`rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="flex-1">
                    {customer.phone && (
                      <p className="text-sm text-slate-400">📱 {customer.phone}</p>
                    )}
                    {customer.tags && customer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {customer.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <CustomerForm customer={customer} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-600/30 text-red-500 hover:bg-red-500/10 rounded-lg h-9"
                      onClick={() => deleteCustomer.mutate(customer.id)}
                      disabled={deleteCustomer.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
