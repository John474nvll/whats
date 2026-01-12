
import { Router } from 'express';
import { createUser } from '../modules/user/user.service';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

export default router;
