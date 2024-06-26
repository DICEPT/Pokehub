// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export let app: FirebaseApp;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGIN_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

try {
  app = getApp('app');
} catch (error) {
  app = initializeApp(firebaseConfig, 'app');
}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default firebase;
