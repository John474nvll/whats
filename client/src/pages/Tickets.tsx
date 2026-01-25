
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TicketsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bandeja de Entrada de Soporte</h1>
        <Button>Nuevo Ticket</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Tickets de Soporte</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aquí podrás ver, responder y gestionar todos los tickets de soporte de tus clientes.</p>
          {/* La lista de tickets se renderizará aquí */}
        </CardContent>
      </Card>
    </div>
  );
}
