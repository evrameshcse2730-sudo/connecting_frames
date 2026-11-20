// Paste your Firebase web app config here.
// Firebase console → Project settings → General → Your apps → Web app → "SDK setup and configuration" → Config.
// These values are public by design; your data is protected by firestore.rules, not by hiding this.

const firebaseConfig = {
  apiKey: "AIzaSyCcavTXfS3bRU33ZhnaaiKxMh4UF6JICBk",
  authDomain: "connecting-frames.firebaseapp.com",
  projectId: "connecting-frames",
  storageBucket: "connecting-frames.firebasestorage.app",
  messagingSenderId: "414161880378",
  appId: "1:414161880378:web:fc9c448c2d03a930e0fc03",
};

export default firebaseConfig;

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
