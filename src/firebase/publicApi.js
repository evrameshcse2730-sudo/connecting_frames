// Lightweight Firestore access for the public site, using the REST API
// so visitors don't download the full Firebase SDK.

import firebaseConfig, { isFirebaseConfigured } from "./firebaseConfig.js";

const base = () =>
  `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

// Saved content lives in site/content as a single JSON string field.
export async function fetchSiteContent() {
  if (!isFirebaseConfigured) return null;
  const res = await withTimeout(
    fetch(`${base()}/site/content?key=${firebaseConfig.apiKey}`),
    4000
  );
  if (!res.ok) return null;
  const doc = await res.json();
  const json = doc?.fields?.json?.stringValue;
  return json ? JSON.parse(json) : null;
}

// Store a contact form message so it shows in the admin inbox.
export async function saveMessage({ name, email, service, message }) {
  if (!isFirebaseConfigured) return;
  const str = (v, max) => ({ stringValue: String(v || "").slice(0, max) });
  await withTimeout(
    fetch(`${base()}/messages?key=${firebaseConfig.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          name: str(name, 100),
          email: str(email, 200),
          service: str(service, 100),
          message: str(message, 5000),
          read: { booleanValue: false },
          createdAt: { timestampValue: new Date().toISOString() },
        },
      }),
    }),
    3000
  );
}
