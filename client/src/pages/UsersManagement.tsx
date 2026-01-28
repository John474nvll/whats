import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Mail,
  Phone,
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { User as UserType } from '@shared/schema';
import { Link } from 'wouter';

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-500 border-red-500/30',
  manager: 'bg-primary/20 text-primary border-primary/30',
  agent: 'bg-kiwi/20 text-kiwi border-kiwi/30',
};

const roleIcons: Record<string, any> = {
  admin: ShieldAlert,
  manager: ShieldCheck,
  agent: Shield,
};

export default function UsersManagement() {
  const { data: users = [], isLoading } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      // Note: This endpoint should be implemented or use the existing storage
      const res = await apiRequest('GET', '/api/users');
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight">
              Gestión de Acceso
            </h1>
            <p className="text-muted-foreground text-sm">
              Administra usuarios, roles y permisos del sistema.
            </p>
          </div>
          <Button className="rounded-xl font-bold">Invitar Usuario</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="col-span-full text-center py-12 text-muted-foreground animate-pulse">
              Cargando usuarios...
            </p>
          ) : users.length === 0 ? (
            <p className="col-span-full text-center py-12 text-muted-foreground">
              No se encontraron usuarios activos.
            </p>
          ) : (
            users.map((user) => {
              const RoleIcon = roleIcons[user.role] || User;
              return (
                <Card
                  key={user.id}
                  className="bg-card/50 border-border backdrop-blur-sm rounded-3xl overflow-hidden hover:border-primary/50 transition-all group"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center border border-border">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`uppercase text-[9px] font-black tracking-widest ${roleColors[user.role]}`}
                      >
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">
                      {user.username}
                    </CardTitle>
                    <CardDescription>ID de Sistema: #{user.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{user.username}@softgan.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>+57 300 000 0000</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-10 rounded-xl text-xs font-bold"
                        asChild
                      >
                        <Link href={`/settings?user=${user.id}`}>
                          Configurar <ExternalLink className="h-3 w-3 ml-2" />
                        </Link>
                      </Button>
                      <Button
                        className="h-10 w-10 rounded-xl p-0"
                        variant="secondary"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
