
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DealForm } from '@/components/crm/DealForm';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch('/api/crm/deals')
      .then((res) => res.json())
      .then((data) => setDeals(data));
  }, []);

  const handleFormSubmit = (deal) => {
    const method = deal.id ? 'PUT' : 'POST';
    const url = deal.id ? `/api/crm/deals/${deal.id}` : '/api/crm/deals';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deal),
    })
      .then((res) => res.json())
      .then((updatedDeal) => {
        if (deal.id) {
          setDeals(deals.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
        } else {
          setDeals([...deals, updatedDeal]);
        }
        setIsFormOpen(false);
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/crm/deals/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setDeals(deals.filter((d) => d.id !== id));
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Deals</CardTitle>
          <Button onClick={() => {
            setSelectedDeal(null);
            setIsFormOpen(true);
          }}>New Deal</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>{deal.title}</TableCell>
                  <TableCell>{deal.value}</TableCell>
                  <TableCell>{deal.stage}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      setSelectedDeal(deal);
                      setIsFormOpen(true);
                    }}>Edit</Button>
                    <Button onClick={() => handleDelete(deal.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isFormOpen && (
        <DealForm
          deal={selectedDeal}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Deals;
