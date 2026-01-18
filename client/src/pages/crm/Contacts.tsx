
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { columns } from "@/components/crm/contacts/columns";
import { DataTable } from "@/components/crm/contacts/data-table";

// API fetching function
const fetchContacts = async () => {
  const res = await fetch('/api/contacts');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const Route = createFileRoute('/app/contacts')({
  component: ContactsComponent,
});

function ContactsComponent() {
  const { data: contacts, isLoading, error } = useQuery({ 
    queryKey: ['contacts'], 
    queryFn: fetchContacts 
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contactos</h2>
        <div className="flex items-center space-x-2">
          <Button>
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
