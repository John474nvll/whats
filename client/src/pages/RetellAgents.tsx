
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RetellAgentForm } from '@/components/crm/RetellAgentForm';
import {PlusCircle, Edit, Trash2} from 'lucide-react';

const RetellAgents = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch('/api/retell/agents')
      .then((res) => res.json())
      .then((data) => setAgents(data));
  }, []);

  const handleFormSubmit = (agent) => {
    const method = agent.id ? 'PATCH' : 'POST';
    const url = agent.id ? `/api/retell/agents/${agent.id}` : '/api/retell/agents';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent),
    })
      .then((res) => res.json())
      .then((updatedAgent) => {
        if (agent.id) {
          setAgents(agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)));
        } else {
          setAgents([...agents, updatedAgent]);
        }
        setIsFormOpen(false);
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/retell/agents/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setAgents(agents.filter((a) => a.id !== id));
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Retell Agents</CardTitle>
          <Button onClick={() => {
            setSelectedAgent(null);
            setIsFormOpen(true);
          }}>
            <PlusCircle className="mr-2" />
            New Agent
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>LLM WebSocket URL</TableHead>
                <TableHead>Voice ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.llm_websocket_url}</TableCell>
                  <TableCell>{agent.voice_id}</TableCell>
                  <TableCell>{agent.status}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => {
                      setSelectedAgent(agent);
                      setIsFormOpen(true);
                    }}>
                      <Edit className="h-4 w-4"/>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(agent.id)}>
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <RetellAgentForm
          agent={selectedAgent}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default RetellAgents;
