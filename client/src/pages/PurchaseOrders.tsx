import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Search, Filter, Eye, Edit, Trash2, 
  Package, ShoppingCart, DollarSign, Clock,
  FileText, Download, Send, CheckCircle, XCircle,
  Truck, CreditCard, User, Calendar
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface PurchaseOrder {
  id: number;
  orderNumber: string;
  customerId: number | null;
  status: string;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  currency: string | null;
  notes: string | null;
  shippingAddress: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  items: OrderItem[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  customer?: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
  };
}

export default function PurchaseOrders() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery<PurchaseOrder[]>({
    queryKey: ["/api/orders"],
  });

  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const createOrder = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/orders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Orden creada exitosamente" });
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Estado actualizado" });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Orden eliminada" });
    },
  });

  const filteredOrders = orders.filter((o) => {
    const searchMatch =
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || o.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pendiente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      procesando: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      enviado: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      entregado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      procesando: "Procesando",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return (
      <Badge className={`${styles[status] || styles.pendiente} font-bold uppercase text-[10px] tracking-wider`}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string | null) => {
    if (!status) return null;
    const styles: Record<string, string> = {
      pendiente: "bg-amber-500/10 text-amber-400",
      pagado: "bg-emerald-500/10 text-emerald-400",
      reembolsado: "bg-red-500/10 text-red-400",
    };
    return (
      <Badge variant="outline" className={`${styles[status] || ""} text-[9px]`}>
        {status === "pagado" ? "Pagado" : status === "reembolsado" ? "Reembolsado" : "Pendiente Pago"}
      </Badge>
    );
  };

  const stats = {
    total: orders.length,
    pendientes: orders.filter((o) => o.status === "pendiente").length,
    procesando: orders.filter((o) => o.status === "procesando").length,
    entregados: orders.filter((o) => o.status === "entregado").length,
    valorTotal: orders.reduce((acc, o) => acc + (o.total || 0), 0),
  };

  const formatCurrency = (amount: number | null, currency: string | null = "USD") => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 text-foreground pb-20 md:pb-8 transition-colors">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white">
              Órdenes de Compra
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base">
              Gestiona las órdenes de compra de tus clientes Softgan
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 px-6">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Orden
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-white/10">
              <DialogHeader>
                <DialogTitle className="text-xl font-black dark:text-white">Crear Nueva Orden</DialogTitle>
              </DialogHeader>
              <OrderForm 
                customers={customers} 
                onSubmit={(data) => createOrder.mutate(data)} 
                isLoading={createOrder.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <StatCard icon={ShoppingCart} label="Total Órdenes" value={stats.total} color="blue" />
          <StatCard icon={Clock} label="Pendientes" value={stats.pendientes} color="amber" />
          <StatCard icon={Package} label="Procesando" value={stats.procesando} color="purple" />
          <StatCard icon={CheckCircle} label="Entregados" value={stats.entregados} color="emerald" />
          <StatCard icon={DollarSign} label="Valor Total" value={formatCurrency(stats.valorTotal)} color="green" />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de orden o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 dark:bg-slate-900/50 dark:border-white/10 h-11 rounded-xl w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 dark:bg-slate-900/50 dark:border-white/10 h-11 rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-white/10">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="procesando">Procesando</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList className="dark:bg-slate-900/50 p-1 rounded-xl border dark:border-white/5">
            <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              Tarjetas
            </TabsTrigger>
            <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Cargando órdenes...</div>
            ) : filteredOrders.length === 0 ? (
              <Card className="dark:bg-slate-900/40 dark:border-white/5">
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay órdenes que mostrar</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="dark:bg-slate-900/40 dark:border-white/5 hover:dark:border-primary/30 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-black dark:text-white">
                          #{order.orderNumber}
                        </CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {order.customer?.name || "Cliente no asignado"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-primary">
                          {formatCurrency(order.total, order.currency)}
                        </span>
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-ES") : "N/A"}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 rounded-lg dark:border-white/10"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-3 w-3 mr-1" /> Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg dark:border-white/10"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg dark:border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => deleteOrder.mutate(order.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-2">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="dark:bg-slate-900/40 dark:border-white/5">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customer?.name}</p>
                    </div>
                  </div>
                  <div className="hidden md:block">{getStatusBadge(order.status)}</div>
                  <div className="hidden md:block text-right">
                    <p className="font-bold text-primary">{formatCurrency(order.total, order.currency)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-ES") : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {selectedOrder && (
          <OrderDetailModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={(status) => {
              updateOrderStatus.mutate({ id: selectedOrder.id, status });
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400",
    amber: "bg-amber-500/10 text-amber-400",
    purple: "bg-purple-500/10 text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    green: "bg-green-500/10 text-green-400",
  };
  return (
    <Card className="dark:bg-slate-900/40 dark:border-white/5">
      <CardContent className="p-4">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-2xl font-black dark:text-white">{value}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{label}</p>
      </CardContent>
    </Card>
  );
}

function OrderForm({ customers, onSubmit, isLoading }: { customers: any[]; onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    customerId: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    notes: "",
    shippingAddress: "",
    paymentMethod: "transferencia",
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = formData.items.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    }));
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = Math.round(subtotal * 0.16);
    const total = subtotal + tax;

    onSubmit({
      customerId: formData.customerId ? parseInt(formData.customerId) : null,
      items,
      subtotal,
      tax,
      total,
      notes: formData.notes,
      shippingAddress: formData.shippingAddress,
      paymentMethod: formData.paymentMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="font-bold text-xs uppercase tracking-wider">Cliente</Label>
        <Select value={formData.customerId} onValueChange={(v) => setFormData({ ...formData, customerId: v })}>
          <SelectTrigger className="dark:bg-slate-800 dark:border-white/10">
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-900 dark:border-white/10">
            {customers.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-xs uppercase tracking-wider">Productos</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Agregar
          </Button>
        </div>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <Input
              placeholder="Producto"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              className="col-span-6 dark:bg-slate-800 dark:border-white/10"
            />
            <Input
              type="number"
              placeholder="Cant"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
              className="col-span-2 dark:bg-slate-800 dark:border-white/10"
            />
            <Input
              type="number"
              placeholder="Precio"
              value={item.price}
              onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
              className="col-span-4 dark:bg-slate-800 dark:border-white/10"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="font-bold text-xs uppercase tracking-wider">Dirección de Envío</Label>
        <Input
          placeholder="Dirección completa"
          value={formData.shippingAddress}
          onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
          className="dark:bg-slate-800 dark:border-white/10"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-bold text-xs uppercase tracking-wider">Método de Pago</Label>
        <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
          <SelectTrigger className="dark:bg-slate-800 dark:border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-900 dark:border-white/10">
            <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
            <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
            <SelectItem value="efectivo">Efectivo</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="font-bold text-xs uppercase tracking-wider">Notas</Label>
        <Input
          placeholder="Notas adicionales"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="dark:bg-slate-800 dark:border-white/10"
        />
      </div>

      <Button type="submit" className="w-full h-12 font-bold rounded-xl" disabled={isLoading}>
        {isLoading ? "Creando..." : "Crear Orden"}
      </Button>
    </form>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus }: { order: PurchaseOrder; onClose: () => void; onUpdateStatus: (status: string) => void }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-black dark:text-white flex items-center gap-3">
            Orden #{order.orderNumber}
            <Badge className="bg-primary/20 text-primary">{order.status}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cliente</p>
              <p className="font-bold dark:text-white">{order.customer?.name || "No asignado"}</p>
              {order.customer?.email && <p className="text-sm text-muted-foreground">{order.customer.email}</p>}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirección de Envío</p>
              <p className="text-sm dark:text-white">{order.shippingAddress || "No especificada"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Productos</p>
            <div className="space-y-2">
              {(order.items as OrderItem[] || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg dark:bg-slate-800/50">
                  <div>
                    <p className="font-bold dark:text-white">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-primary">${(item.total / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t dark:border-white/10 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="dark:text-white">${((order.subtotal || 0) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (16%)</span>
              <span className="dark:text-white">${((order.tax || 0) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-black">
              <span className="dark:text-white">Total</span>
              <span className="text-primary">${((order.total || 0) / 100).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Select defaultValue={order.status} onValueChange={onUpdateStatus}>
              <SelectTrigger className="flex-1 dark:bg-slate-800 dark:border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-white/10">
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="procesando">Procesando</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="dark:border-white/10">
              <Download className="h-4 w-4 mr-2" /> Descargar PDF
            </Button>
            <Button className="bg-primary">
              <Send className="h-4 w-4 mr-2" /> Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
