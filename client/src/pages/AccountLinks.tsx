import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Link2, Trash2, Send } from "lucide-react";

export default function AccountLinks() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [publishContent, setPublishContent] = useState({ platform: "", content: "", image: "" });
  const { toast } = useToast();

  const platforms = [
    { id: "instagram", name: "Instagram", color: "bg-pink-500/10 border-pink-500/20", icon: "Instagram", url: "https://www.instagram.com/replit" },
    { id: "facebook", name: "Facebook", color: "bg-blue-500/10 border-blue-500/20", icon: "Facebook", url: "https://www.facebook.com/replit" },
    { id: "whatsapp", name: "WhatsApp", color: "bg-green-500/10 border-green-500/20", icon: "MessageCircle", url: "https://wa.me/replit" },
  ];

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/social-accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setAccounts(await response.json());
    } catch {
      toast({ title: "Error", description: "Failed to load accounts" });
    } finally {
      setLoading(false);
    }
  };

  const connectAccount = async (platform: string) => {
    setConnecting(true);
    try {
      const accountId = `${platform}_${Date.now()}`;
      const accountName = `${platform} Account`;
      
      const token = localStorage.getItem("token");
      const response = await fetch("/api/social-accounts/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform,
          accountId,
          accountName,
          accessToken: `demo_token_${Date.now()}`,
        }),
      });

      if (response.ok) {
        toast({ title: "Success", description: `${platform} account connected!` });
        fetchAccounts();
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect account" });
    } finally {
      setConnecting(false);
    }
  };

  const publishContent_fn = async () => {
    if (!publishContent.platform || !publishContent.content) {
      toast({ title: "Error", description: "Platform and content required" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(publishContent),
      });

      if (response.ok) {
        toast({ title: "Success", description: "Content published!" });
        setPublishContent({ platform: "", content: "", image: "" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to publish" });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Connected Accounts</h1>
        <p className="text-muted-foreground">Manage your social media accounts and publish content</p>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const account = accounts.find((a) => a.platform === platform.id);
          return (
            <Card key={platform.id} className={`${platform.color} border`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  {platform.name}
                  {account && <div className="w-3 h-3 rounded-full bg-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {account ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      <p>Account: {account.accountName}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Connected</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(platforms.find(p => p.id === account.platform)?.url, "_blank")}
                      >
                        Ver Perfil
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setAccounts(accounts.filter((a) => a.id !== account.id));
                          toast({ title: "Disconnected", description: `${platform.name} disconnected` });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => connectAccount(platform.id)}
                    disabled={connecting}
                    className="w-full"
                  >
                    {connecting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Link2 className="h-4 w-4 mr-2" />
                    )}
                    Connect {platform.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Publish Content */}
      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Publish Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Platform</label>
              <select
                value={publishContent.platform}
                onChange={(e) => setPublishContent({ ...publishContent, platform: e.target.value })}
                className="w-full mt-2 px-3 py-2 bg-card border border-border rounded-md text-foreground"
              >
                <option value="">Choose platform...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.platform}>
                    {acc.accountName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Write your content..."
                value={publishContent.content}
                onChange={(e) => setPublishContent({ ...publishContent, content: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image URL (optional)</label>
              <Input
                placeholder="https://..."
                value={publishContent.image}
                onChange={(e) => setPublishContent({ ...publishContent, image: e.target.value })}
                className="mt-2"
              />
            </div>

            <Button onClick={publishContent_fn} className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Send className="h-4 w-4 mr-2" />
              Publish Now
            </Button>
          </CardContent>
        </Card>
      )}

      {accounts.length === 0 && (
        <Card className="bg-muted/50 text-center py-12">
          <p className="text-muted-foreground">No accounts connected yet. Connect a platform above to get started!</p>
        </Card>
      )}
    </div>
  );
}
