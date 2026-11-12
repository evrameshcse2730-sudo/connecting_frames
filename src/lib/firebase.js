// Full Firebase SDK — only loaded by the /admin panel.

import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);
export const watchUser = (cb) => onAuthStateChanged(auth, cb);

export async function isAdmin(uid) {
  try {
    const snap = await getDoc(doc(db, "admins", uid));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function loadContent() {
  const snap = await getDoc(doc(db, "site", "content"));
  return snap.exists() ? JSON.parse(snap.data().json) : null;
}

export function saveContent(content, userEmail) {
  return setDoc(doc(db, "site", "content"), {
    json: JSON.stringify(content),
    updatedAt: serverTimestamp(),
    updatedBy: userEmail || "",
  });
}

export function watchMessages(cb, onError) {
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export const markMessageRead = (id, read) => updateDoc(doc(db, "messages", id), { read });
export const deleteMessage = (id) => deleteDoc(doc(db, "messages", id));
