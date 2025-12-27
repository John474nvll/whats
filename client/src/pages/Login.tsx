import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Loader2, Sparkles, Shield, Zap } from "lucide-react";
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
      toast({ title: isLogin ? "Welcome back!" : "Account created successfully!" });
      setLocation("/");
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAccess = async (user: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { username: user, password: pass });
      const result = await res.json();
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      toast({ title: "Quick access successful!" });
      setLocation("/");
      window.location.reload();
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10"
      >
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-950 backdrop-blur-xl border-r border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />

          {/* Logo & Branding */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 shadow-lg shadow-primary/50">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <img src={logoImage} alt="SocialHub" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Social<span className="text-primary">Hub</span>
                </h1>
                <p className="text-xs font-bold text-primary/60 tracking-wider uppercase mt-0.5">v3.0 Platform</p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 mb-12">
              <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
                Social Media <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Management</span>
              </h2>
              <p className="text-slate-300 font-medium max-w-sm text-lg">
                Centralized orchestration, advanced AI, and complete control of your digital assets.
              </p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 grid grid-cols-2 gap-3"
          >
            {[
              { icon: Zap, label: "Ultra Fast", desc: "Global scale optimization" },
              { icon: Shield, label: "Secure", desc: "Military-grade encryption" },
              { icon: Sparkles, label: "AI Powered", desc: "Smart automation" },
              { icon: User, label: "Multi-Account", desc: "Manage all platforms" },
            ].map((feature, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all">
                <feature.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-black text-white">{feature.label}</p>
                <p className="text-xs text-slate-400 mt-1">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 lg:p-12 flex flex-col justify-center bg-slate-950/90 backdrop-blur-sm relative"
        >
          <div className="max-w-sm w-full space-y-8">
            {/* Form Header */}
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tight">
                {isLogin ? "Sign In" : "Create Account"}
              </h3>
              <p className="text-slate-400 font-medium text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-black hover:text-primary/80 transition">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Username</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition" />
                  <Input
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-slate-500 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-slate-500 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 transition-all font-black text-white text-sm uppercase tracking-wide"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>}
              </Button>
            </form>

            {/* Quick Access */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Access</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { user: "socialadmin", pass: "SocialAdmin2026!" },
                  { user: "ventas_a", pass: "VentasA2026!" },
                  { user: "ventas_b", pass: "VentasB2026!" },
                ].map((acc, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={() => quickAccess(acc.user, acc.pass)}
                    disabled={isLoading}
                    className="rounded-lg border-white/10 hover:border-primary/50 hover:bg-primary/10 text-[10px] font-bold text-slate-300 px-1"
                  >
                    {acc.user}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
