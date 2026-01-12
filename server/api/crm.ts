
import { Router } from 'express';
import { getAllCustomers, createCustomer } from '../modules/crm/customer.service';
import { sse } from '../core/sse';

const router = Router();

router.get('/customers', async (req, res) => {
  const customers = await getAllCustomers();
  res.json(customers);
});

router.post('/customers', async (req, res) => {
    const newCustomer = await createCustomer(req.body);
    sse.send({ type: 'CUSTOMER_CREATED', data: newCustomer });
    res.status(201).json(newCustomer);
  });

export default router;
