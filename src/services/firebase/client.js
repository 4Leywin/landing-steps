import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIAamzyLHKAH-aEMwj-kv8_F3B-J5iE4c",
  authDomain: "landings-5bef0.firebaseapp.com",
  projectId: "landings-5bef0",
  storageBucket: "landings-5bef0.firebasestorage.app",
  messagingSenderId: "644664221467",
  appId: "1:644664221467:web:f7892d5a5657260364fdbe",
  measurementId: "G-SNPEDY0PXG",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
