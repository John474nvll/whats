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

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Authentication failed";
        
        if (Array.isArray(errorData)) {
          // Handle Zod validation errors from backend
          errorMessage = errorData.map(err => err.message).join(", ");
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        throw new Error(errorMessage);
      }

      const { token, user } = await response.json();
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
    setFormData({ username: "admin", password: "password123" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center space-y-4">
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

        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700 text-center text-sm text-slate-400">
          <p className="font-semibold mb-2">Demo Credentials</p>
          <p>Username: <code className="bg-slate-900 px-2 py-1 rounded">admin</code></p>
          <p>Password: <code className="bg-slate-900 px-2 py-1 rounded">password123</code></p>
        </div>
      </div>
    </div>
  );
}
