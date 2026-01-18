
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
import { Contact, Company, User } from "@shared/schema";

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal('')),
  phone: z.string().min(1, "El teléfono es requerido"),
  companyId: z.number().int().positive().optional(),
  ownerId: z.number().int().positive().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contact?: Contact;
}

export function ContactForm({ contact }: ContactFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact ? {
      ...contact,
      companyId: contact.companyId || undefined,
      ownerId: contact.ownerId || undefined,
    } : {
      name: "",
      email: "",
      phone: "",
    },
  });

  const { data: companies } = useQuery<Company[]>({ queryKey: ['/api/crm/companies'], queryFn: async () => (await fetch('/api/crm/companies')).json() });
  const { data: users } = useQuery<User[]>({ queryKey: ['/api/crm/users'], queryFn: async () => (await fetch('/api/crm/users')).json() });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const method = contact ? "PUT" : "POST";
      const url = contact ? `/api/crm/contacts/${contact.id}` : "/api/crm/contacts";
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save contact');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts"] });
      toast({ title: "Éxito", description: `Contacto ${contact ? 'actualizado' : 'creado'} correctamente` });
      setIsOpen(false);
      if (!contact) form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {contact ? (
            <Button size="sm" variant="outline" className="flex-1 border-slate-600 rounded-lg h-9">
                <Edit className="h-3 w-3 mr-1" /> Editar
            </Button>
        ) : (
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-bold rounded-lg gap-2 h-11">
                <Plus className="h-5 w-5" /> Nuevo Contacto
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-slate-900/50 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{contact ? 'Editar' : 'Crear'} Contacto</DialogTitle>
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
                    <Input placeholder="Ana García" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
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
                    <Input placeholder="ana@correo.com" type="email" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
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
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <Input placeholder="+57 300 123 4567" {...field} className="bg-slate-800/50 border-slate-700 h-10 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyId"
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
            <Button type="submit" disabled={contactMutation.isPending} className="w-full bg-primary hover:opacity-90 text-black font-bold rounded-lg h-10">
              {contactMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
