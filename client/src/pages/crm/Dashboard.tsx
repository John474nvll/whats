
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Briefcase, BarChart, PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Mock hooks for fetching data - in a real app, these would hit your API
const useDashboardStats = () => {
  // These would fetch data from /api/dashboard/stats or similar
  return useQuery({
      queryKey: ['dashboardStats'],
      queryFn: () => Promise.resolve({
          newContacts: 12,
          activeConversations: 5,
          activeCampaigns: 2,
          conversionRate: "3.5%"
      })
  });
};

const useRecentConversations = () => {
  return useQuery({
      queryKey: ['recentConversations'],
      queryFn: () => Promise.resolve([
          { id: 1, name: "Ana Garcia", lastMessage: "¡Hola! Necesito ayuda con mi pedido.", time: "2m ago" },
          { id: 2, name: "Carlos Rodriguez", lastMessage: "Gracias, todo solucionado.", time: "15m ago" },
          { id: 3, name: "Laura Fernandez", lastMessage: "¿Tienen stock de este producto?", time: "1h ago" },
      ])
  });
};

export default function Dashboard() {
  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: conversations, isLoading: loadingConversations } = useRecentConversations();

  const statCards = [
    { title: "Nuevos Contactos", value: stats?.newContacts, icon: <Users className="h-5 w-5 text-muted-foreground" />, bgColor: "bg-blue-500/10" },
    { title: "Conversaciones Activas", value: stats?.activeConversations, icon: <MessageSquare className="h-5 w-5 text-muted-foreground" />, bgColor: "bg-green-500/10" },
    { title: "Campañas Activas", value: stats?.activeCampaigns, icon: <Briefcase className="h-5 w-5 text-muted-foreground" />, bgColor: "bg-purple-500/10" },
    { title: "Tasa de Conversión", value: stats?.conversionRate, icon: <BarChart className="h-5 w-5 text-muted-foreground" />, bgColor: "bg-yellow-500/10" },
  ];

  if (loadingStats || loadingConversations) {
    return <div className="flex items-center justify-center h-full">Cargando Dashboard...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/app/campaigns/new">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Campaña
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`overflow-hidden ${card.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Conversations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations?.map((conv) => (
                  <div key={conv.id} className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{conv.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/app/inbox">Ver todas las conversaciones</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild><Link to="/app/customers/new" className="flex flex-col h-24 justify-center items-center"><Users className="h-6 w-6 mb-1" /><span className="text-center text-xs">Nuevo Cliente</span></Link></Button>
              <Button variant="outline" asChild><Link to="/app/contacts/new" className="flex flex-col h-24 justify-center items-center"><PlusCircle className="h-6 w-6 mb-1" /><span className="text-center text-xs">Nuevo Contacto</span></Link></Button>
              <Button variant="outline" asChild><Link to="/app/analytics" className="flex flex-col h-24 justify-center items-center"><BarChart className="h-6 w-6 mb-1" /><span className="text-center text-xs">Ver Analíticas</span></Link></Button>
              <Button variant="outline" asChild><Link to="/app/settings" className="flex flex-col h-24 justify-center items-center"><Briefcase className="h-6 w-6 mb-1" /><span className="text-center text-xs">Ajustes</span></Link></Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
