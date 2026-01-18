
import { Elysia } from 'elysia';
import { verifyToken, AuthPayload } from '../services/auth';

// Extiende el contexto de Elysia para incluir el usuario actual
export interface AuthenticatedContext {
  user: AuthPayload;
}

export const authMiddleware = new Elysia()
  .derive(({ headers }) => {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    return {
      user: user as AuthPayload
    };
  });
