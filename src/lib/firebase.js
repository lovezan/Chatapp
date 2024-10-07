// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-bccf7.firebaseapp.com",
  projectId: "reactchat-bccf7",
  storageBucket: "reactchat-bccf7.appspot.com",
  messagingSenderId: "279548856284",
  appId: "1:279548856284:web:51c46568e9141eb9e7b119"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

export const auth = getAuth(); 
export const db = getFirestore();
export const storage = getStorage();