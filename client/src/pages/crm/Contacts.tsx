
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getColumns } from "@/components/crm/contacts/columns";
import { DataTable } from "@/components/crm/contacts/data-table";
import { ContactForm } from "@/components/crm/contacts/contact-form";
import { type Contact } from "@/components/crm/contacts/columns";

// API fetching functions
const fetchContacts = async () => {
  const res = await fetch('/api/contacts');
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return res.json();
};

const deleteContact = async (id: number) => {
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete contact');
    return res.json();
};

export const Route = createFileRoute('/app/contacts')({
  component: ContactsComponent,
});

function ContactsComponent() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading, error } = useQuery({ 
    queryKey: ['contacts'], 
    queryFn: fetchContacts 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const handleNew = () => {
    setSelectedContact(null);
    setIsFormOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
        <ContactForm 
            isOpen={isFormOpen} 
            setIsOpen={setIsFormOpen} 
            contact={selectedContact}
        />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contactos</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Contacto
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error al cargar los contactos.</div>
      ) : (
        <DataTable columns={columns} data={contacts || []} />
      )}
    </div>
  );
}
