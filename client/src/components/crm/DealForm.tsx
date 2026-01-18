
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";
import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "../../lib/queryClient";
import { Deal, Contact, Company, User } from "@shared/schema";

const dealSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  value: z.number().positive("El valor debe ser positivo"),
  stage: z.enum(['lead', 'qualified', 'proposal', 'won', 'lost']),
  contactId: z.number().int().positive(),
  companyId: z.number().int().positive().optional(),
  ownerId: z.number().int().positive().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  deal?: Deal;
}

export function DealForm({ deal }: DealFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal ? {
      ...deal,
      value: Number(deal.value),
      contactId: deal.contactId,
    } : {
      name: "",
      value: 0,
      stage: 'lead',
    },
  });

  const { data: contacts } = useQuery<Contact[]>({ queryKey: ['/api/crm/contacts'], queryFn: async () => (await fetch('/api/crm/contacts')).json() });
  const { data: companies } = useQuery<Company[]>({ queryKey: ['/api/crm/companies'], queryFn: async () => (await fetch('/api/crm/companies')).json() });
  const { data: users } = useQuery<User[]>({ queryKey: ['/api/crm/users'], queryFn: async () => (await fetch('/api/crm/users')).json() });

  const dealMutation = useMutation({
    mutationFn: async (data: DealFormData) => {
      const method = deal ? "PUT" : "POST";
      const url = deal ? `/api/crm/deals/${deal.id}` : "/api/crm/deals";
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save deal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      toast({ title: "Éxito", description: `Oportunidad ${deal ? 'actualizada' : 'creada'} correctamente` });
      setIsOpen(false);
      if (!deal) form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: DealFormData) => {
    dealMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {deal ? (
            <Button size="sm" variant="outline" className="flex-1 border-slate-600 rounded-lg h-9">
                <Edit className="h-3 w-3 mr-1" /> Editar
            </Button>
        ) : (
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-bold rounded-lg gap-2 h-11">
                <Plus className="h-5 w-5" /> Nueva Oportunidad
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-slate-900/50 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{deal ? 'Editar' : 'Crear'} Oportunidad</DialogTitle>
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
                    <Input placeholder="Nuevo Proyecto de Desarrollo" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (COP) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000000" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etapa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 h-10 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="qualified">Calificado</SelectItem>
                      <SelectItem value="proposal">Propuesta</SelectItem>
                      <SelectItem value="won">Ganado</SelectItem>
                      <SelectItem value="lost">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="contactId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacto *</FormLabel>
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 h-10 rounded-lg">
                        <SelectValue placeholder="Seleccionar contacto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 h-10 rounded-lg">
                        <SelectValue placeholder="Seleccionar empresa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propietario</FormLabel>
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 h-10 rounded-lg">
                        <SelectValue placeholder="Asignar a un usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {users?.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={dealMutation.isPending} className="w-full bg-primary hover:opacity-90 text-black font-bold rounded-lg h-10">
              {dealMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
