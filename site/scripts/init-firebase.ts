// Ejecutar UNA VEZ para crear las 23 mesas en Firebase:
// npx tsx scripts/init-firebase.ts

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function init() {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const mesasRef = ref(db, 'mesas');
  const snap = await get(mesasRef);

  if (snap.exists()) {
    console.log('✓ Las mesas ya están inicializadas en Firebase.');
    process.exit(0);
  }

  const mesas: Record<string, object> = {};

  // Mesas 1-13: interior
  for (let i = 1; i <= 13; i++) {
    mesas[`mesa-${i}`] = { numero: i, zona: 'interior', estado: 'vacia' };
  }
  // Mesas 14-23: exterior
  for (let i = 14; i <= 23; i++) {
    mesas[`mesa-${i}`] = { numero: i, zona: 'exterior', estado: 'vacia' };
  }

  await set(mesasRef, mesas);
  console.log('✓ 23 mesas creadas en Firebase (13 interior + 10 exterior).');
  process.exit(0);
}

init().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
