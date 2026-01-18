
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "../../lib/queryClient";
import { Company } from "@shared/schema";

const companySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  website: z.string().url("URL inválida").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  company?: Company;
}

export function CompanyForm({ company }: CompanyFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: company ? company : {
      name: "",
      website: "",
      phone: "",
      address: "",
    },
  });

  const companyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const method = company ? "PUT" : "POST";
      const url = company ? `/api/crm/companies/${company.id}` : "/api/crm/companies";
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save company');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/companies"] });
      toast({ title: "Éxito", description: `Empresa ${company ? 'actualizada' : 'creada'} correctamente` });
      setIsOpen(false);
      if (!company) form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: CompanyFormData) => {
    companyMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {company ? (
            <Button size="sm" variant="outline" className="flex-1 border-slate-600 rounded-lg h-9">
                <Edit className="h-3 w-3 mr-1" /> Editar
            </Button>
        ) : (
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-bold rounded-lg gap-2 h-11">
                <Plus className="h-5 w-5" /> Nueva Empresa
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-slate-900/50 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{company ? 'Editar' : 'Crear'} Empresa</DialogTitle>
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
                    <Input placeholder="Mi Empresa S.A.S." {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio Web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://miempresa.com" type="url" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
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
                    <Input placeholder="+57 300 123 4567" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle 123, Ciudad" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={companyMutation.isPending} className="w-full bg-primary hover:opacity-90 text-black font-bold rounded-lg h-10">
              {companyMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
