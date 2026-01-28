import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertContactSchema, type InsertContact } from '@shared/schema';
import { useCreateContact, useUpdateContact } from '@/hooks/use-contacts';

interface ContactFormProps {
  contact?: any;
}

export function ContactForm({ contact }: ContactFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: contact || {
      name: '',
      phone: '',
      platform: 'whatsapp',
    },
  });

  const onSubmit = (data: InsertContact) => {
    const mutation = contact ? updateContact : createContact;
    mutation.mutate(contact ? { ...data, id: contact.id } : data, {
      onSuccess: () => {
        toast({
          title: 'Éxito',
          description: `Contacto ${contact ? 'actualizado' : 'creado'} correctamente`,
        });
        setIsOpen(false);
        if (!contact) form.reset();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {contact ? (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-slate-600 rounded-lg h-9"
          >
            <Edit className="h-3 w-3 mr-1" /> Editar
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-black font-bold rounded-lg gap-2 h-11">
            <Plus className="h-5 w-5" /> Nuevo Contacto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/50 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {contact ? 'Editar' : 'Crear Nuevo'} Contacto
          </DialogTitle>
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
                    <Input
                      placeholder="Juan Pérez"
                      {...field}
                      className="bg-slate-800/50 border-slate-700 h-10 rounded-lg"
                    />
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
                    <Input
                      placeholder="+1234567890"
                      {...field}
                      className="bg-slate-800/50 border-slate-700 h-10 rounded-lg"
                      value={field.value || ''}
                    />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || 'whatsapp'}
                  >
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
            <Button
              type="submit"
              disabled={createContact.isPending || updateContact.isPending}
              className="w-full bg-primary hover:opacity-90 text-black font-bold rounded-lg h-10"
            >
              {createContact.isPending || updateContact.isPending
                ? 'Guardando...'
                : 'Guardar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
