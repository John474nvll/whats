import { Elysia } from 'elysia';
import {
  getGoogleAuthUrl,
  getGoogleUser,
  getCalendarEvents,
  createCalendarEvent,
} from '../services/google';

export const googleRoutes = new Elysia()
  .get('/google/auth-url', () => {
    return { url: getGoogleAuthUrl() };
  })
  .get('/google/callback', async ({ query }) => {
    const user = await getGoogleUser(query.code as string);
    // Aquí puedes guardar el usuario en tu base de datos
    return user;
  })
  .get('/google/calendar/events', async () => {
    const events = await getCalendarEvents();
    return events;
  })
  .post('/google/calendar/events', async ({ body }) => {
    const event = await createCalendarEvent(body);
    return event;
  });