import React, { useEffect } from "react";
import "./AdminApp.css";
import { isFirebaseConfigured } from "../firebase/firebaseConfig.js";
import SetupNotice from "./pages/Setup/SetupNotice.jsx";

// Firebase SDK is only downloaded once we know it's configured
const AdminRoot = React.lazy(() => import("./AdminRoot.jsx"));

export default function AdminApp() {
  useEffect(() => {
    document.title = "Admin | Connecting Frames";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
  }, []);

  return (
    <div className="admin">
      {isFirebaseConfigured ? (
        <React.Suspense fallback={<div className="ad-center">Loading…</div>}>
          <AdminRoot />
        </React.Suspense>
      ) : (
        <SetupNotice />
      )}
    </div>
  );
}
