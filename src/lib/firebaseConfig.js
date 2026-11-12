// Paste your Firebase web app config here.
// Firebase console → Project settings → General → Your apps → Web app → "SDK setup and configuration" → Config.
// These values are public by design; your data is protected by firestore.rules, not by hiding this.

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export default firebaseConfig;

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
