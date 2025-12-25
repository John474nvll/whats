import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Instagram as InstagramIcon, Plus } from "lucide-react";

export default function Instagram() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connectionUrl, setConnectionUrl] = useState("");

  const connectAccount = async () => {
    setLoading(true);
    try {
      toast({
        title: "Instagram Connection",
        description: "Redirecting to Instagram login...",
      });
      // In a real app, this would redirect to Instagram OAuth
      window.location.href = connectionUrl || "https://www.instagram.com/accounts/login/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect Instagram account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
            <InstagramIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Instagram</h1>
            <p className="text-slate-400 text-sm">Manage your Instagram accounts and posts</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Connect Account Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Add New Account</CardTitle>
            <CardDescription className="text-slate-400">Connect your Instagram account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Instagram Business Account</label>
              <Input
                placeholder="Your Instagram handle"
                className="bg-slate-700/50 border-slate-600 text-white"
                onChange={(e) => setConnectionUrl(e.target.value)}
              />
            </div>
            <Button
              onClick={connectAccount}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
            <p className="text-xs text-slate-500 text-center">
              You'll be redirected to Instagram to authorize access
            </p>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        {accounts.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 border-dashed col-span-1 md:col-span-2 flex items-center justify-center">
            <div className="text-center py-12">
              <InstagramIcon className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No Connected Accounts</h3>
              <p className="text-slate-500 mb-4">Connect your Instagram business account to get started</p>
            </div>
          </Card>
        ) : (
          <div className="col-span-1 md:col-span-2 space-y-4">
            {accounts.map((account) => (
              <Card key={account.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <CardDescription className="text-slate-400">@{account.handle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-400 border-red-400/30">
                      Disconnect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <Tabs defaultValue="features" className="mt-6">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="features">Available Features</TabsTrigger>
          <TabsTrigger value="guide">Quick Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">Schedule Posts</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-400">
                Schedule your Instagram posts and reels for optimal engagement times
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-400">
                Track engagement, reach, and performance of your posts
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">DM Management</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-400">
                Respond to Instagram Direct Messages from one centralized dashboard
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-base">Content Library</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-400">
                Organize and reuse your best-performing content templates
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="guide" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">How to Connect Your Instagram Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <ol className="list-decimal list-inside space-y-2">
                <li>Click "Connect Account" to authorize SocialHub</li>
                <li>Log in with your Instagram business account</li>
                <li>Grant the necessary permissions for posting and analytics</li>
                <li>Your account will appear in the accounts list</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
