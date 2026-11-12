// Firestore reads/writes used by the admin panel.
import {
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
import { db } from "./firebase.js";

// ---------- Website content (site/content) ----------

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

// ---------- Contact messages (messages/*) ----------

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
