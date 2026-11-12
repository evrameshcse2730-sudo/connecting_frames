import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import Site from "./Site.jsx";

// The admin panel (and the full Firebase SDK) only downloads on /admin
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={<p style={{ padding: 24, fontFamily: "sans-serif" }}>Loading admin…</p>}>
        <AdminApp />
      </Suspense>
    ) : (
      <Site />
    )}
  </React.StrictMode>
);
