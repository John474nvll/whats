
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CorporateClients = () => {
  const clients = [
    { id: 'C-001', name: 'Global Corp', industry: 'Technology', contact: 'ceo@globalcorp.com', logo: 'https://robohash.org/globalcorp' },
    { id: 'C-002', name: 'Finance Inc.', industry: 'Finance', contact: 'cfo@financeinc.com', logo: 'https://robohash.org/financeinc' },
    { id: 'C-003', name: 'HealthFirst', industry: 'Healthcare', contact: 'coo@healthfirst.com', logo: 'https://robohash.org/healthfirst' },
  ];

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Corporate Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={client.logo} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>{client.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorporateClients;
