
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Billing() {
  const { data: invoices = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/crm/invoices"],
  });

  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Facturación</h1>
        <Button className="bg-primary text-black font-bold rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Nueva Factura
        </Button>
      </div>

      <Card className="bg-slate-900/40 border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Historial de Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400">ID</TableHead>
                <TableHead className="text-slate-400">Cliente</TableHead>
                <TableHead className="text-slate-400">Monto</TableHead>
                <TableHead className="text-slate-400">Estado</TableHead>
                <TableHead className="text-slate-400">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-mono">#{invoice.id}</TableCell>
                  <TableCell>Cliente {invoice.customerId}</TableCell>
                  <TableCell className="font-bold">${invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className={invoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}>
                      {invoice.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
