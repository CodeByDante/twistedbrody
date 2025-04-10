import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAflcrSkEVJ1sWjJjsKBsbXYvJhuxKXHVQ",
  projectId: "twistedbrody-7911d",
  authDomain: "twistedbrody-7911d.firebaseapp.com",
  storageBucket: "twistedbrody-7911d.appspot.com",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);