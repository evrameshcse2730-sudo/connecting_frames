// Admin login helpers.
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";

export const loginAdmin = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logoutAdmin = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);
export const watchUser = (cb) => onAuthStateChanged(auth, cb);

// An account is an admin only if /admins/{uid} exists (added by hand in the Firebase console)
export async function isAdmin(uid) {
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    return snap.exists();
  } catch {
    return false;
  }
}
