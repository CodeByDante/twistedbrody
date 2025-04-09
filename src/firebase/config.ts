import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAflcrSkEVJ1sWjJjsKBsbXYvJhuxKXHVQ",
  authDomain: "twistedbrody-7911d.firebaseapp.com",
  projectId: "twistedbrody-7911d",
  storageBucket: "twistedbrody-7911d.appspot.com",
  messagingSenderId: "117662686932",
  appId: "1:117662686932:web:your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);