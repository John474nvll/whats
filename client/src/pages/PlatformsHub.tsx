
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, MessageCircle, Bot, Zap, Plus, Trash2, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { apiRequest } from "@/lib/queryClient";

const platformIcons: { [key: string]: React.ReactElement } = {
  instagram: <Instagram className="h-8 w-8 text-pink-500" />,
  facebook: <Facebook className="h-8 w-8 text-blue-600" />,
  whatsapp: <MessageCircle className="h-8 w-8 text-green-500" />,
};

export default function PlatformsHub() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "facebook" | null>(null);

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["platformAccounts"],
    queryFn: () => apiRequest("GET", "/api/platforms/accounts").then(res => res.json()),
  });

  const connectMutation = useMutation({
    mutationFn: (data: { platform: string; accessToken: string; accountName: string }) =>
      apiRequest("POST", "/api/platforms/connect", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platformAccounts"] });
      setToken("");
      setAccountName("");
      setSelectedPlatform(null);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/platforms/disconnect/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platformAccounts"] });
    },
  });

  const handleConnect = () => {
    if (selectedPlatform && token && accountName) {
      connectMutation.mutate({ platform: selectedPlatform, accessToken: token, accountName });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white">
      <header className="mb-12">
        <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Platforms Hub
        </h1>
        <p className="text-xl text-gray-400 mt-2">Conecta tus cuentas para automatizar la comunicación.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* --- Meta Platforms Connection --- */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Zap className="h-6 w-6 text-purple-400" />
              Conectar Plataformas de Meta
            </CardTitle>
            <CardDescription>Conecta tus cuentas de Instagram y Facebook.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              {["instagram", "facebook"].map(p => (
                <Button
                  key={p}
                  variant={selectedPlatform === p ? "default" : "outline"}
                  className={`flex-1 h-20 text-lg border-gray-600 ${selectedPlatform === p ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
                  onClick={() => setSelectedPlatform(p as any)}
                >
                  {platformIcons[p]}
                </Button>
              ))}
            </div>

            {selectedPlatform && (
              <div className="space-y-3 pt-4">
                <Input
                  placeholder="Nombre de la Cuenta (ej. MiPaginaDeVentas)"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="bg-gray-700 border-gray-600 h-11"
                />
                <Input
                  placeholder="Pega tu Access Token de Larga Duración"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-gray-700 border-gray-600 h-11"
                />
                <Button
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg font-semibold"
                  onClick={handleConnect}
                  disabled={connectMutation.isPending || !token || !accountName}
                >
                  {connectMutation.isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `Conectar ${selectedPlatform}`
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Connected Accounts --- */}
        <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl">Cuentas Conectadas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAccounts ? (
              <p>Cargando cuentas...</p>
            ) : accounts && accounts.length > 0 ? (
              <ul className="space-y-3">
                {accounts.map((acc: any) => (
                  <li key={acc.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {platformIcons[acc.platform]}
                      <div>
                        <p className="font-semibold text-lg">{acc.accountName}</p>
                        <p className="text-sm text-gray-400">ID: {acc.accountId || 'N/A'}</p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Desconectar cuenta?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará la conexión de la plataforma.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => disconnectMutation.mutate(acc.id)}>
                            Desconectar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No hay cuentas conectadas.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
