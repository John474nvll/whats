import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oAuth2Client = new OAuth2Client(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'YOUR_REDIRECT_URI'
);

export const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

export const getGoogleUser = async (code: string) => {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
  const { data } = await oauth2.userinfo.get();
  return data;
};

export const getCalendarEvents = async () => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const { data } = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return data.items;
};

export const createCalendarEvent = async (event: any) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });
  return data;
};