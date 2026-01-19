import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';

import { usersRoutes } from './routes/users';
import { contactsRoutes } from './routes/contacts';
import { companiesRoutes } from './routes/companies';
import { dealsRoutes } from './routes/deals';
import { interactionsRoutes } from './routes/interactions';
import { retellRoutes } from './routes/retell';
import { whatsappRoutes } from './routes/whatsapp';
import { googleRoutes } from './routes/google';
import { unifiedPlatformRoutes } from './routes/unified-platforms';
import { platformsRoutes } from './routes/platforms';
import { inboxRoutes } from './routes/inbox';
import { dashboardRoutes } from './routes/dashboard';
import { aiRoutes } from './routes/ai';
import { campaignsRoutes } from './routes/campaigns';

const app = new Elysia({ adapter: node() });

app.use(cors());

app.use(whatsappRoutes);

app.use(staticPlugin({
    assets: "client/dist",
    prefix: ''
}));

app.group('/api', (app) =>
  app
    .use(usersRoutes)
    .use(contactsRoutes)
    .use(companiesRoutes)
    .use(dealsRoutes)
    .use(interactionsRoutes)
    .use(retellRoutes)
    .use(googleRoutes)
    .use(platformsRoutes)
    .use(inboxRoutes)
    .use(dashboardRoutes)
    .use(aiRoutes)
    .use(campaignsRoutes)
);

app.use(unifiedPlatformRoutes);

app.listen({
    port: 5001,
    hostname: '0.0.0.0'
}, () => {
  console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
});
