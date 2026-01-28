
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PurchaseOrders = () => {
  const orders = [
    { id: 'PO-001', customer: 'Acme Inc.', date: '2024-07-01', status: 'Shipped', total: '$2,500.00' },
    { id: 'PO-002', customer: 'SaaS Co.', date: '2024-07-03', status: 'Pending', total: '$1,200.00' },
    { id: 'PO-003', customer: 'Innovate LLC', date: '2024-07-05', status: 'Delivered', total: '$800.00' },
    { id: 'PO-004', customer: 'Pro Services', date: '2024-07-06', status: 'Shipped', total: '$3,100.00' },
  ];

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === 'Shipped' ? 'default' : 
                        order.status === 'Pending' ? 'secondary' : 'outline'
                      }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrders;
