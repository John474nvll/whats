
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building, Handshake } from "lucide-react";

export default function CRMDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                    CRM Dashboard
                </h1>
                <p className="text-muted-foreground text-lg mt-2">Una vista general de tus actividades de CRM.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Oportunidades</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nuevos Contactos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+235</div>
                        <p className="text-xs text-muted-foreground">+180.1% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nuevas Empresas</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+52</div>
                        <p className="text-xs text-muted-foreground">+19% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-700 hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Oportunidades Ganadas</CardTitle>
                        <Handshake className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground">+5 desde la semana pasada</p>
                    </CardContent>
                </Card>
            </div>

            {/* Aquí puedes añadir más componentes y gráficos */}
        </div>
    </div>
  );
}
