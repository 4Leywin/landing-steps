import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./client";

const auth = getAuth(app);

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export { auth };
