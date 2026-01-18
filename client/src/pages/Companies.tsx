
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, Building, Phone, Globe } from "lucide-react";
import { CompanyForm } from "@/components/crm/CompanyForm";
import { queryClient } from "@/lib/queryClient";
import { Company } from "@shared/schema";

export default function Companies() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: companies, isLoading } = useQuery<Company[]>({ 
    queryKey: ["/api/crm/companies"],
    queryFn: async () => {
      const res = await fetch('/api/crm/companies');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/crm/companies/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete company');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/companies"] });
      toast({ title: "Empresa eliminada" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredCompanies = companies?.filter(c => {
    const searchMatch = 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Gestión de Empresas
            </h1>
            <p className="text-muted-foreground text-lg">Administra tus empresas y sus datos.</p>
          </div>
          <CompanyForm />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, sitio web o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-slate-800/50 border-slate-700 h-11 rounded-lg w-full"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-56 rounded-lg bg-slate-800/50 animate-pulse border border-slate-700" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 col-span-full">
            <CardContent className="pt-12 pb-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No se encontraron empresas.</p>
              <CompanyForm />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold truncate">{company.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-between text-sm">
                    <div className="flex-1 space-y-2 text-slate-400">
                        {company.website && (
                            <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> {company.website}</p>
                        )}
                        {company.phone && (
                            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {company.phone}</p>
                        )}
                         {company.address && (
                            <p className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" /> {company.address}</p>
                        )}
                    </div>
                  <div className="flex gap-2 pt-3">
                    <CompanyForm company={company} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-600/30 text-red-500 hover:bg-red-500/10 rounded-lg h-9"
                      onClick={() => deleteCompany.mutate(company.id)}
                      disabled={deleteCompany.isPending}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
