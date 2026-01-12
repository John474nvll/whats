
import { Router } from 'express';
import { authenticateUser } from '../modules/auth/auth.service';

const router = Router();

router.post('/login', async (req, res) => {
  const token = await authenticateUser(req.body);
  if (!token) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ token });
});

export default router;
