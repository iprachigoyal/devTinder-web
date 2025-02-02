// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6TrFs0XcYcwDAbVZMo0CbXug9FqWhvhI",
  authDomain: "devtinder-fe470.firebaseapp.com",
  projectId: "devtinder-fe470",
  storageBucket: "devtinder-fe470.firebasestorage.app",
  messagingSenderId: "685716146809",
  appId: "1:685716146809:web:b9c42fb13d836672df62a8",
  measurementId: "G-ZB2ZT1EDVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);