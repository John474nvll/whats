
import { Router } from 'express';
import { getAllCustomers } from '../modules/crm/customer.service';

const router = Router();

router.get('/customers', async (req, res) => {
  const customers = await getAllCustomers();
  res.json(customers);
});

export default router;
