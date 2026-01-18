import * as admin from 'firebase-admin';

// Reemplaza esto con tus propias credenciales de Firebase
const serviceAccount = require('../../path/to/your/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const firestore = admin.firestore();