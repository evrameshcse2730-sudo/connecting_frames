import React, { useEffect } from "react";
import "./admin.css";
import { isFirebaseConfigured } from "../lib/firebaseConfig.js";
import SetupNotice from "./SetupNotice.jsx";

// Firebase SDK is only downloaded once we know it's configured
const Panel = React.lazy(() => import("./Panel.jsx"));

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
          <Panel />
        </React.Suspense>
      ) : (
        <SetupNotice />
      )}
    </div>
  );
}
