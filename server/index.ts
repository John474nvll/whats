
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';

// Import individual route modules
import { usersRoutes } from './routes/users';
import { contactsRoutes } from './routes/contacts';
import { companiesRoutes } from './routes/companies';
import dealsRoutes from './routes/deals';
import interactionsRoutes from './routes/interactions';
import retellRoutes from './routes/retell';
import whatsappRoutes from './routes/whatsapp';
import { googleRoutes } from './routes/google';
import { unifiedPlatformRoutes } from './routes/unified-platforms';
import { platformsRoutes } from './routes/platforms';
import { inboxRoutes } from './routes/inbox';
import { dashboardRoutes } from './routes/dashboard'; // Import the new dashboard routes
import aiRoutes from './routes/ai';
import campaignsRoutes from './routes/campaigns';

const app = new Elysia();

// Basic middleware
app.use(cors()); // Enable CORS for frontend interactions

// Group all API routes under the '/api' prefix
app.group('/api', (app) =>
  app
    .use(usersRoutes)
    .use(contactsRoutes)
    .use(companiesRoutes)
    .use(dealsRoutes)
    .use(interactionsRoutes)
    .use(retellRoutes)
    .use(googleRoutes)
    .use(unifiedPlatformRoutes)
    .use(platformsRoutes)
    .use(inboxRoutes)
    .use(dashboardRoutes) // Register the dashboard routes
    .use(aiRoutes)
    .use(campaignsRoutes)
);

// Register webhook routes at the top level
app.use(whatsappRoutes);

// Serve static files for the frontend client
app.use(staticPlugin({
    assets: "client/dist",
    prefix: ''
}));

// Main server listener
app.listen(3000, () => {
  console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
});
