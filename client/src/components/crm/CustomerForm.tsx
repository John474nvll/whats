
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema, type InsertCustomer } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface CustomerFormProps {
  customer?: any;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: customer || {
      name: "",
      email: "",
      phone: "",
      platform: "whatsapp",
      status: "active",
      tags: [],
    },
  });

  const customerMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      const method = customer ? "PUT" : "POST";
      const url = customer ? `/api/customers/${customer.id}` : "/api/customers";
      const res = await queryClient.request(method, url, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Éxito", description: `Cliente ${customer ? 'actualizado' : 'creado'} correctamente` });
      setIsOpen(false);
      if (!customer) form.reset();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertCustomer) => {
    customerMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {customer ? (
            <Button size="sm" variant="outline" className="flex-1 border-slate-600 rounded-lg h-9">
                <Edit className="h-3 w-3 mr-1" /> Editar
            </Button>
        ) : (
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-bold rounded-lg gap-2 h-11">
                <Plus className="h-5 w-5" /> Nuevo Cliente
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/50 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{customer ? 'Editar' : 'Crear Nuevo'} Cliente</DialogTitle>
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
            <Button type="submit" disabled={customerMutation.isPending} className="w-full bg-primary hover:opacity-90 text-black font-bold rounded-lg h-10">
              {customerMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
