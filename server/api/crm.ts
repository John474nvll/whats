
import { Router } from 'express';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../modules/crm/customer.service';
import { sse } from '../core/sse';

const router = Router();

router.get('/customers', async (req, res) => {
  const customers = await getAllCustomers();
  res.json(customers);
});

router.get('/customers/:id', async (req, res) => {
  const customer = await getCustomerById(Number(req.params.id));
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }
  res.json(customer);
});

router.post('/customers', async (req, res) => {
    const newCustomer = await createCustomer(req.body);
    sse.send({ type: 'CUSTOMER_CREATED', data: newCustomer });
    res.status(201).json(newCustomer);
  });

router.put('/customers/:id', async (req, res) => {
  const updatedCustomer = await updateCustomer(Number(req.params.id), req.body);
  sse.send({ type: 'CUSTOMER_UPDATED', data: updatedCustomer });
  res.json(updatedCustomer);
});

router.delete('/customers/:id', async (req, res) => {
  await deleteCustomer(Number(req.params.id));
  sse.send({ type: 'CUSTOMER_DELETED', data: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
