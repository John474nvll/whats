
import axios from 'axios';

const SNOW_INSTANCE = process.env.SNOW_INSTANCE;
const SNOW_USERNAME = process.env.SNOW_USERNAME;
const SNOW_PASSWORD = process.env.SNOW_PASSWORD;

if (!SNOW_INSTANCE || !SNOW_USERNAME || !SNOW_PASSWORD) {
  console.warn('ServiceNow credentials are not fully set in environment variables. Integration will be disabled.');
}

const snowApi = axios.create({
  baseURL: `https://${SNOW_INSTANCE}.service-now.com/api/now`,
  auth: {
    username: SNOW_USERNAME!,
    password: SNOW_PASSWORD!,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Creates an incident in ServiceNow.
 * @param short_description A brief summary of the incident.
 * @param description A detailed description of the incident.
 * @returns The created incident data.
 */
export async function createIncident(short_description: string, description: string) {
  if (!SNOW_INSTANCE) return null;

  try {
    const response = await snowApi.post('/table/incident', {
      short_description,
      description,
      caller_id: 'System API' // Or map to a user
    });
    console.log('Successfully created incident in ServiceNow:', response.data.result.number);
    return response.data.result;
  } catch (error: any) {
    console.error('Failed to create ServiceNow incident:', error.response?.data || error.message);
    throw error;
  }
}
