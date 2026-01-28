import express from 'express';
import ViteExpress from 'vite-express';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import { setupAuth } from './middleware/auth';
import { setupRoutes } from './routes';
import { setupMiddleware } from './middleware';
import http from 'http';

const app = express();
const MemoryStore = memorystore(session);
const httpServer = http.createServer(app);

//
// Express-session configuration
//
app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

//
// Passport configuration
//
app.use(passport.initialize());
app.use(passport.session());
setupAuth(passport);

//
// Middleware and routes
//
setupMiddleware(app);
setupRoutes(app, httpServer);

//
// Vite and server startup
//
ViteExpress.listen(app, 4002, () =>
  console.log("Server is listening on port 4002...")
);
