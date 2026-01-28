import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

export interface AuthRequest extends Request {
  userId?: string;
  username?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = payload.userId;
  req.username = payload.username;
  next();
}

export function setupAuth(passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Replace with your actual authentication logic
      if (username === 'admin' && password === 'password') {
        return done(null, { id: '1', username: 'admin' });
      } else {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // Replace with your actual user lookup logic
    done(null, { id: '1', username: 'admin' });
  });
}
