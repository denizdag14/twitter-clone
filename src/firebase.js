// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "twitter-clone-427016.firebaseapp.com",
  projectId: "twitter-clone-427016",
  storageBucket: "twitter-clone-427016.appspot.com",
  messagingSenderId: "111975466351",
  appId: "1:111975466351:web:6c06454c84f23c7209549a",
  measurementId: "G-DHE4K28RC6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);