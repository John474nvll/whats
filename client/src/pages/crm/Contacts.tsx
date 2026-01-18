
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, Users } from "lucide-react";
import { ContactForm } from "@/components/crm/ContactForm";
import { queryClient } from "@/lib/queryClient";
import { Contact, Company, User } from "@shared/schema";

export default function Contacts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: contacts, isLoading } = useQuery<Contact[]>({ 
    queryKey: ["/api/crm/contacts"],
    queryFn: async () => {
      const res = await fetch('/api/crm/contacts');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const { data: companies } = useQuery<Company[]>({ queryKey: ['/api/crm/companies'], queryFn: async () => (await fetch('/api/crm/companies')).json() });
  const { data: users } = useQuery<User[]>({ queryKey: ['/api/crm/users'], queryFn: async () => (await fetch('/api/crm/users')).json() });

  const deleteContact = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/crm/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete contact');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/contacts"] });
      toast({ title: "Contacto eliminado" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getCompanyName = (companyId?: number) => companies?.find(c => c.id === companyId)?.name || "Sin empresa";
  const getOwnerName = (ownerId?: number) => users?.find(u => u.id === ownerId)?.name || "Sin propietario";

  const filteredContacts = contacts?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Contactos
            </h1>
            <p className="text-muted-foreground text-lg">Administra tus contactos y su información.</p>
          </div>
          <ContactForm />
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
        ) : filteredContacts.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 col-span-full">
            <CardContent className="pt-12 pb-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No se encontraron contactos.</p>
              <ContactForm />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContacts.map(contact => (
              <Card key={contact.id} className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold truncate">{contact.name}</CardTitle>
                  <p className="text-xs text-muted-foreground truncate">{contact.email || "Sin email"}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end text-sm space-y-2">
                  <p><span className="font-semibold">Teléfono:</span> {contact.phone}</p>
                  <p><span className="font-semibold">Empresa:</span> {getCompanyName(contact.companyId)}</p>
                  <p><span className="font-semibold">Propietario:</span> {getOwnerName(contact.ownerId)}</p>
                </CardContent>
                <CardContent className="flex justify-end gap-2 pt-4">
                  <ContactForm contact={contact} />
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-red-600/30 text-red-500 hover:bg-red-500/10 rounded-lg h-9 w-9"
                    onClick={() => deleteContact.mutate(contact.id)}
                    disabled={deleteContact.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
