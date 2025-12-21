import { useChannels, useUpdateChannel } from "@/hooks/use-channels";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { data: channels, isLoading } = useChannels();
  const updateChannel = useUpdateChannel();
  const { toast } = useToast();

  const handleUpdate = (platform: string, data: any) => {
    updateChannel.mutate(
      { platform, ...data },
      {
        onSuccess: () => toast({ title: "Settings saved successfully" }),
        onError: () => toast({ title: "Failed to save settings", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Channel Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your integration tokens and credentials.</p>
          </div>

          <div className="space-y-6">
            {['whatsapp', 'instagram'].map((platform) => {
              const config = channels?.find(c => c.platform === platform);
              return (
                <Card key={platform} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="capitalize font-display text-xl">{platform} Integration</CardTitle>
                        <CardDescription>Manage credentials for {platform} Business API</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${platform}`} className="text-sm">Active</Label>
                        <Switch 
                          id={`active-${platform}`} 
                          checked={config?.isActive ?? true} 
                          onCheckedChange={(checked) => handleUpdate(platform, { isActive: checked })}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`access-${platform}`}>Access Token</Label>
                      <Input 
                        id={`access-${platform}`} 
                        type="password" 
                        defaultValue={config?.accessToken}
                        className="bg-background/50 font-mono text-xs"
                        placeholder={`Enter ${platform} access token`}
                        onBlur={(e) => {
                          if (e.target.value !== config?.accessToken) {
                            handleUpdate(platform, { accessToken: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`verify-${platform}`}>Verify Token (Webhook)</Label>
                      <Input 
                        id={`verify-${platform}`} 
                        defaultValue={config?.verifyToken}
                        className="bg-background/50 font-mono text-xs"
                        placeholder="Your custom verify token"
                        onBlur={(e) => {
                          if (e.target.value !== config?.verifyToken) {
                            handleUpdate(platform, { verifyToken: e.target.value });
                          }
                        }}
                      />
                    </div>
                    {platform === 'whatsapp' && (
                      <div className="grid gap-2">
                        <Label htmlFor={`phone-${platform}`}>Phone Number ID</Label>
                        <Input 
                          id={`phone-${platform}`} 
                          defaultValue={config?.phoneNumberId || ''}
                          className="bg-background/50 font-mono text-xs"
                          placeholder="WhatsApp Phone Number ID"
                          onBlur={(e) => {
                            if (e.target.value !== config?.phoneNumberId) {
                              handleUpdate(platform, { phoneNumberId: e.target.value });
                            }
                          }}
                        />
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Saved" })}>
                        <Save className="h-4 w-4" /> Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
      </div>
    </div>
  );
}
