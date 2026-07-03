import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuavhvaRFKnHxYcgpz7pk54XBEm_Xv3JY",
  authDomain: "junsui-8ff06.firebaseapp.com",
  projectId: "junsui-8ff06",
  storageBucket: "junsui-8ff06.firebasestorage.app",
  messagingSenderId: "278316848959",
  appId: "1:278316848959:web:6c1548df7b618c3051e58a",
  measurementId: "G-0KT5BHEDTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
