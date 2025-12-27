import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Rocket, User, Lock, ArrowRight, Loader2, Users, TrendingUp } from "lucide-react";
import logoImage from "@assets/generated_images/socialhub_app_logo_design.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", isLogin ? "/api/auth/login" : "/api/auth/register", formData);
      const result = await res.json();
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      toast({ title: isLogin ? "Bienvenido de nuevo" : "Cuenta creada con éxito" });
      setLocation("/");
      window.location.reload();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Fallo en la autenticación",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAccess = (user: string, pass: string) => {
    setFormData({ username: user, password: pass });
    // We can't easily requestSubmit here because the state update is async, 
    // but the user can click the button. Or we can just perform the login directly.
    const directLogin = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest("POST", "/api/auth/login", { username: user, password: pass });
        const result = await res.json();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast({ title: "Acceso rápido exitoso" });
        setLocation("/");
        window.location.reload();
      } catch (error) {
        toast({ title: "Error", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    directLogin();
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 dark:bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#000000 1px, transparent 1px)", backgroundSize: "40px 40px" }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden border border-white/5 dark:border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white dark:bg-slate-950/50 dark:backdrop-blur-3xl backdrop-blur-sm relative z-10"
      >
        {/* Visual Section */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-100 dark:from-slate-900 to-white dark:to-black relative overflow-hidden border-r border-slate-200 dark:border-white/5">
           <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
           </div>
           
           <div className="relative z-10">
             <div className="flex items-center gap-4 mb-12">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                 <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                    <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
                 </div>
               </div>
               <div>
                 <h2 className="text-3xl font-black text-white dark:text-white tracking-tighter uppercase">Social<span className="text-kiwi">Hub</span></h2>
                 <p className="text-xs font-bold text-kiwi/70 dark:text-kiwi/70 tracking-[0.3em] uppercase">v3.0 PWA Edition</p>
               </div>
             </div>

             <div className="space-y-8">
               <h1 className="text-6xl font-black text-white dark:text-white leading-[0.9] tracking-tighter">
                 LA PRÓXIMA <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-kiwi via-cyan-neon to-raspberry">REVOLUCIÓN</span> <br />
                 SOCIAL.
               </h1>
               <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-sm">
                 Orquestación centralizada, inteligencia artificial avanzada y control total de tus activos digitales.
               </p>
             </div>
           </div>

           <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/5 backdrop-blur-xl">
                 <Zap className="h-6 w-6 text-kiwi mb-2" />
                 <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Ultra Rápido</p>
                 <p className="text-xs text-slate-600 dark:text-slate-500">Optimizado para escala global</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/5 backdrop-blur-xl">
                 <ShieldCheck className="h-6 w-6 text-cyan-neon mb-2" />
                 <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Seguridad Pro</p>
                 <p className="text-xs text-slate-600 dark:text-slate-500">Encriptación de grado militar</p>
              </div>
           </div>
        </div>

        {/* Form Section */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-slate-950/80">
          <div className="max-w-md mx-auto w-full space-y-10">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tight">
                {isLogin ? "Inicia Sesión" : "Crea tu Cuenta"}
              </h3>
              <p className="text-slate-400 font-medium">
                {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-kiwi font-black hover:underline"
                >
                  {isLogin ? "Regístrate aquí" : "Inicia sesión"}
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Usuario</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-kiwi transition-colors" />
                    <Input 
                      name="username" 
                      placeholder="Tu nombre de usuario" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="h-14 pl-12 rounded-2xl bg-white/5 border-white/5 focus:border-kiwi/50 focus:ring-kiwi/20 text-white font-bold transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Contraseña</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-kiwi transition-colors" />
                    <Input 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="h-14 pl-12 rounded-2xl bg-white/5 border-white/5 focus:border-kiwi/50 focus:ring-kiwi/20 text-white font-bold transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 rounded-2xl bg-kiwi text-black font-black text-lg hover:bg-kiwi/90 shadow-[0_15px_30px_rgba(34,197,94,0.2)] transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "ENTRAR AHORA" : "COMENZAR AVENTURA"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <AnimatePresence>
              {isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-8 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Acceso Rápido Demo</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => quickAccess("socialadmin", "SocialPass2025")}
                      className="h-12 rounded-xl border-white/5 bg-white/5 hover:bg-kiwi/10 hover:border-kiwi/30 text-slate-400 hover:text-white transition-all text-xs font-black no-default-hover-elevate"
                    >
                      MASTER ADMIN
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => quickAccess("ventas_a", "VentasA2025")}
                      className="h-12 rounded-xl border-white/5 bg-white/5 hover:bg-cyan-neon/10 hover:border-cyan-neon/30 text-slate-400 hover:text-white transition-all text-xs font-black no-default-hover-elevate"
                    >
                      TEAM SALES
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
