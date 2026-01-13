
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const RecentConversations = ({ conversations }: { conversations: any[] }) => (
  <Card className="border-border/40 bg-card/40 backdrop-blur-2xl h-full shadow-2xl">
    <CardHeader>
      <CardTitle className="text-xl">Conversaciones Recientes</CardTitle>
      <p className="text-sm text-muted-foreground">Últimas interacciones del Inbox</p>
    </CardHeader>
    <CardContent className="space-y-6">
      {conversations.slice(0, 5).map((conversation, i) => (
        <div key={i} className="flex items-center gap-4 group">
          <Avatar className="w-10 h-10">
            <AvatarImage src={conversation.contact.avatar} />
            <AvatarFallback>{conversation.contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{conversation.contact.name}</p>
            <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage.content}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);
