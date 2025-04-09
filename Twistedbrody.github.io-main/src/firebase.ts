import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAflcrSkEVJ1sWjJjsKBsbXYvJhuxKXHVQ",
  authDomain: "twistedbrody-7911d.firebaseapp.com",
  projectId: "twistedbrody-7911d",
  storageBucket: "twistedbrody-7911d.appspot.com",
  messagingSenderId: "117662686932",
  appId: "1:117662686932:web:ab5b91535b0791d1d0b98a",
  measurementId: "G-SC7R1F2F68",
  databaseURL: "https://twistedbrody-7911d.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);