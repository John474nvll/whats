import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Filter, Trash2, Edit2, MessageCircle, Instagram, Facebook, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema, type InsertCustomer } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Customers() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: customers, isLoading } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const createCustomer = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      const res = await apiRequest("POST", "/api/customers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Éxito", description: "Cliente creado correctamente" });
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Error al crear cliente", variant: "destructive" });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Cliente eliminado" });
    },
  });

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      platform: "whatsapp",
      status: "active",
      tags: [],
    },
  });

  const onSubmit = (data: InsertCustomer) => {
    createCustomer.mutate(data);
  };

  const filteredCustomers = customers?.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  ) || [];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "inactive":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "blocked":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-600 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Clientes
            </h1>
            <p className="text-muted-foreground text-lg">Administra tu base de datos de clientes y contactos</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-bold rounded-lg gap-2 h-11">
                <Plus className="h-5 w-5" /> Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900/50 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Crear Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="juan@example.com" type="email" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plataforma</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "whatsapp"}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 h-10 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "active"}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 h-10 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                            <SelectItem value="blocked">Bloqueado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createCustomer.isPending} className="w-full bg-primary hover:opacity-90 text-black font-bold rounded-lg h-10">
                    {createCustomer.isPending ? "Creando..." : "Crear Cliente"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-700 h-11 rounded-lg"
            />
          </div>
          <Button variant="outline" className="gap-2 rounded-lg border-slate-700">
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{customers?.length || 0}</p>
                <p className="text-sm text-muted-foreground mt-2">Total de Clientes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">{customers?.filter(c => c.status === 'active').length || 0}</p>
                <p className="text-sm text-muted-foreground mt-2">Clientes Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{customers?.filter(c => c.platform === 'whatsapp').length || 0}</p>
                <p className="text-sm text-muted-foreground mt-2">WhatsApp</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{customers?.filter(c => c.platform === 'instagram').length || 0}</p>
                <p className="text-sm text-muted-foreground mt-2">Instagram</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700" />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-12 pb-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No hay clientes registrados</p>
              <Button onClick={() => setIsOpen(true)} className="bg-primary hover:opacity-90 text-black font-bold rounded-lg">
                Crear Primer Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        {getPlatformIcon(customer.platform)}
                        {customer.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{customer.email || "Sin email"}</p>
                    </div>
                    <Badge className={`rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.phone && (
                    <p className="text-sm text-slate-400">📱 {customer.phone}</p>
                  )}
                  {customer.tags && customer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-slate-600 rounded-lg h-9"
                      onClick={() => toast({ title: "Coming soon", description: "Edit functionality" })}
                    >
                      <Edit2 className="h-3 w-3 mr-1" /> Editar
                    </Button>
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
