import { Router } from 'express';
import { PythonShell } from 'python-shell';
import path from 'path';

const router = Router();

router.get('/hello', async (req, res) => {
  const name = req.query.name || 'World';

  const options = {
    scriptPath: path.join(__dirname, '../python'),
    args: [name as string],
  };

  try {
    const results = await PythonShell.run('hello.py', options);
    res.json({ message: results[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to execute Python script' });
  }
});

export default router;
