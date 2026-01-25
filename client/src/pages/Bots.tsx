
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BotsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Neural Agents (Bots)</h1>
        <Button>Create New Bot</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to create, configure, and monitor your voice and chat bots.</p>
          {/* Bot list will be rendered here */}
        </CardContent>
      </Card>
    </div>
  );
}
