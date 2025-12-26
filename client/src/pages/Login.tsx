import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
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

      toast({ title: "Success", description: isLogin ? "Login successful!" : "Account created!" });
      navigate("/");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Auth failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = () => {
    setFormData({ username: "socialadmin", password: "SocialPass2025" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <CardHeader className="text-center space-y-4 pt-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                <img src={logoImage} alt="SocialHub" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">SocialHub</CardTitle>
              <CardDescription className="text-slate-400">
                {isLogin ? "Welcome back" : "Create your account"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Username</label>
                <Input
                  type="text"
                  placeholder="admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-2 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-2 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={demoCredentials}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Try Demo Credentials
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center text-sm text-slate-300 shadow-xl">
          <p className="font-bold text-white mb-3 uppercase tracking-widest text-xs">V2 Access Credentials</p>
          <div className="space-y-2">
            <p className="flex justify-between items-center px-4 py-2 bg-black/20 rounded-lg">
              <span className="text-slate-400">User:</span>
              <code className="text-blue-400 font-mono">socialadmin</code>
            </p>
            <p className="flex justify-between items-center px-4 py-2 bg-black/20 rounded-lg">
              <span className="text-slate-400">Pass:</span>
              <code className="text-purple-400 font-mono">SocialPass2025</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
