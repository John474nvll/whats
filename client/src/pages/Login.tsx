import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Users, Sparkles, TrendingUp } from "lucide-react";
import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Authentication failed";
        if (Array.isArray(data)) {
          errorMessage = data.map(err => err.message).join(", ");
        } else if (data.error) {
          errorMessage = data.error;
        }
        throw new Error(errorMessage);
      }

      const { token, user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast({ title: "Success", description: isLogin ? "Welcome back!" : "Account created!" });
      window.location.href = "/";
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Auth failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = (user: string = "socialadmin") => {
    const creds: Record<string, { username: string; password: string }> = {
      socialadmin: { username: "socialadmin", password: "SocialPass2025" },
      ventas_a: { username: "ventas_a", password: "VentasA2025" },
      ventas_b: { username: "ventas_b", password: "VentasB2025" }
    };
    setFormData(creds[user] || creds.socialadmin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-10" />

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                SocialHub v2.0
              </h1>
              <p className="text-xl text-muted-foreground font-semibold">
                Gestiona todas tus redes sociales desde un único lugar
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Automatización Inteligente</h3>
                  <p className="text-sm text-muted-foreground">Publica, programa y gestiona todo con IA</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-secondary/20 text-secondary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Gestión de Clientes</h3>
                  <p className="text-sm text-muted-foreground">Manejo completo de contactos y segmentación</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-accent/20 text-accent">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Analítica Avanzada</h3>
                  <p className="text-sm text-muted-foreground">Métricas detalladas y reportes en tiempo real</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Generación con IA</h3>
                  <p className="text-sm text-muted-foreground">Crea contenido automático con OpenAI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              
              <CardHeader className="text-center space-y-4 pt-8">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden shadow-lg shadow-primary/50">
                    <img src={logoImage} alt="SocialHub" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-3xl font-black">SocialHub</CardTitle>
                  <CardDescription className="text-slate-400 text-base">
                    {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu nueva cuenta"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Usuario</label>
                    <Input
                      type="text"
                      placeholder="socialadmin o manager"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Contraseña</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12 rounded-lg"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-black font-bold h-12 rounded-lg transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isLogin ? "Entrando..." : "Creando cuenta..."}
                      </>
                    ) : (
                      isLogin ? "Iniciar Sesión" : "Crear Cuenta"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-400">o acceso rápido</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    onClick={() => demoCredentials("socialadmin")}
                    className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-bold rounded-lg h-11"
                  >
                    👨‍💼 Admin
                  </Button>
                  <Button
                    type="button"
                    onClick={() => demoCredentials("ventas_a")}
                    className="bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 text-secondary font-bold rounded-lg h-11"
                  >
                    💰 Ventas A
                  </Button>
                  <Button
                    type="button"
                    onClick={() => demoCredentials("ventas_b")}
                    className="bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent font-bold rounded-lg h-11"
                  >
                    📈 Ventas B
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Credentials Info Card */}
            <Card className="bg-slate-900/30 border-primary/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Credenciales de Prueba
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-primary/20">
                  <p className="font-bold text-primary mb-1">Admin Account</p>
                  <p className="text-slate-400">Usuario: <code className="text-primary font-mono">socialadmin</code></p>
                  <p className="text-slate-400">Pass: <code className="text-primary font-mono">SocialPass2025</code></p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-secondary/20">
                  <p className="font-bold text-secondary mb-1">Cuentas de Ventas</p>
                  <p className="text-slate-400">Ventas A: <code className="text-secondary font-mono">ventas_a</code> / <code className="text-secondary font-mono">VentasA2025</code></p>
                  <p className="text-slate-400">Ventas B: <code className="text-accent font-mono">ventas_b</code> / <code className="text-accent font-mono">VentasB2025</code></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
