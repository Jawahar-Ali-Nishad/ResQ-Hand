// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // We are using Firestore!
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5T9kP6oBDXEnNLb6GYRplEOSs0Ox-_i4",
  authDomain: "resq-hand-abda4.firebaseapp.com",
  projectId: "resq-hand-abda4",
  storageBucket: "resq-hand-abda4.firebasestorage.app",
  messagingSenderId: "980684504026",
  appId: "1:980684504026:web:4228513ee65fbca6c41ee3",
  measurementId: "G-1LVNMVCLNS"
};

const app = initializeApp(firebaseConfig);

// Export the tools
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);