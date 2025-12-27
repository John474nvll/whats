import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Plus, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function Products() {
  const { toast } = useToast();
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const addProduct = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Producto añadido" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Producto eliminado" });
    },
  });

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-kiwi">Catálogo</h1>
          <p className="text-muted-foreground font-medium">Gestiona tus productos para campañas.</p>
        </div>
        <Button onClick={() => {
          const name = prompt("Nombre del producto:");
          const price = prompt("Precio (en centavos):");
          if (name && price) {
            addProduct.mutate({ name, price: parseInt(price), stock: 10 });
          }
        }} className="rounded-full gap-2">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="glass-card hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
              <Package className="h-5 w-5 text-kiwi" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-black text-kiwi">${(product.price / 100).toFixed(2)}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                <Button variant="ghost" size="icon" onClick={() => deleteProduct.mutate(product.id)}>
                  <Trash2 className="h-4 w-4 text-raspberry" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
