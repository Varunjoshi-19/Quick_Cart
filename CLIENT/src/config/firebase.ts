import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7GWnYDEwr5_uJPfGZE3a7XtOxDrCcj8s",
  authDomain: "quick-cart-814b3.firebaseapp.com",
  projectId: "quick-cart-814b3",
  storageBucket: "quick-cart-814b3.firebasestorage.app",
  messagingSenderId: "347361811712",
  appId: "1:347361811712:web:dcd733f84f344c6f3ee7e5",
  measurementId: "G-GCWLSES0NF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };