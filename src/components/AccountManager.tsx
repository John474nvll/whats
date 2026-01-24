import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface Account {
  id: string;
  name: string;
  platform: "instagram" | "facebook" | "whatsapp";
  email: string;
  isAdmin: boolean;
  status: "active" | "inactive";
}

const accounts: Account[] = [
  {
    id: "1",
    name: "Cuenta Principal",
    platform: "instagram",
    email: "admin@socialhub.com",
    isAdmin: true,
    status: "active",
  },
  {
    id: "2",
    name: "Facebook Business",
    platform: "facebook",
    email: "fb@socialhub.com",
    isAdmin: true,
    status: "active",
  },
  {
    id: "3",
    name: "WhatsApp Business",
    platform: "whatsapp",
    email: "whatsapp@socialhub.com",
    isAdmin: false,
    status: "active",
  },
];

export function AccountManager() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Cuentas Conectadas</h2>
        <Button size="sm" data-testid="button-add-account">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Cuenta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account, idx) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${account.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <h3 className="font-bold text-foreground">{account.name}</h3>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">{account.email}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize">
                    {account.platform}
                  </Badge>
                  {account.isAdmin && (
                    <Badge variant="default">Admin</Badge>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                data-testid={`button-manage-account-${account.id}`}
              >
                Administrar
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
