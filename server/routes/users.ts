
import { Elysia } from 'elysia';
import { registerUser, loginUser, generateToken } from '../services/auth';

export const usersRoutes = new Elysia()
  .post('/register', async ({ body }: { body: any }) => {
    try {
      const { username, password, name } = body;
      if (!username || !password) {
        return new Response('Username and password are required', { status: 400 });
      }
      const user = await registerUser(username, password, name);
      return { message: 'User registered successfully', userId: user.id };
    } catch (error: any) {
      return new Response(error.message, { status: 409 }); // Conflict
    }
  })
  .post('/login', async ({ body }: { body: any }) => {
    try {
      const { username, password } = body;
      if (!username || !password) {
        return new Response('Username and password are required', { status: 400 });
      }
      const user = await loginUser(username, password);
      const token = generateToken({ userId: user.id, username: user.username! });
      return { message: 'Login successful', token };
    } catch (error: any) {
      return new Response(error.message, { status: 401 }); // Unauthorized
    }
  });
