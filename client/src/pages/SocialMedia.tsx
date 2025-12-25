import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Instagram as InstagramIcon, Facebook, MessageSquare, Share2, TrendingUp } from "lucide-react";

export default function SocialMedia() {
  const platforms = [
    {
      name: "Instagram",
      icon: InstagramIcon,
      color: "from-pink-500 to-orange-500",
      textColor: "text-pink-400",
      description: "Connect and manage your Instagram business accounts",
      status: "Not connected",
      url: "/social-media/instagram",
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "from-blue-600 to-blue-500",
      textColor: "text-blue-400",
      description: "Manage Facebook pages and engage with your audience",
      status: "Not connected",
      url: "/social-media/facebook",
    },
    {
      name: "WhatsApp",
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
      textColor: "text-green-400",
      description: "Send messages and manage WhatsApp Business conversations",
      status: "Connected",
      url: "/social-media/whatsapp",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Social Media Management</h1>
            <p className="text-slate-400">Connect and manage all your social media platforms in one place</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="platforms" className="flex-1">
        <TabsList className="bg-slate-800 border border-slate-700 mb-6">
          <TabsTrigger value="platforms" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Connected Platforms
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Cross-Platform Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            All Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-6">
          {/* Connected Platforms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isConnected = platform.status === "Connected";

              return (
                <Card
                  key={platform.name}
                  className={`bg-slate-800/50 border ${
                    isConnected ? "border-green-500/30 bg-green-500/5" : "border-slate-700"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${isConnected ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                        {platform.status}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-4">{platform.name}</CardTitle>
                    <CardDescription className="text-slate-400">{platform.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={platform.url}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        Manage
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <Share2 className="w-4 h-4" />
                <div className="text-left">
                  <p className="font-semibold">Schedule Post</p>
                  <p className="text-xs text-slate-400">Post to multiple platforms at once</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                <TrendingUp className="w-4 h-4" />
                <div className="text-left">
                  <p className="font-semibold">View Analytics</p>
                  <p className="text-xs text-slate-400">See cross-platform performance</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Followers", value: "12,450", change: "+340" },
              { label: "Engagement Rate", value: "4.2%", change: "+0.3%" },
              { label: "Posts This Month", value: "28", change: "+5" },
              { label: "Total Reach", value: "145K", change: "+23K" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-green-400 mt-2">{stat.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Available Integrations</CardTitle>
              <CardDescription className="text-slate-400">Add new social media platforms to manage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "TikTok", status: "Coming Soon" },
                  { name: "Twitter/X", status: "Coming Soon" },
                  { name: "LinkedIn", status: "Available" },
                  { name: "YouTube", status: "Available" },
                ].map((integration) => (
                  <Card key={integration.name} className="bg-slate-700/30 border-slate-600">
                    <CardContent className="pt-6 flex items-center justify-between">
                      <h4 className="font-semibold text-white">{integration.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${integration.status === "Available" ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-400"}`}>
                        {integration.status}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
