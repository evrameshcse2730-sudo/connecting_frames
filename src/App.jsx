import { Suspense, lazy } from "react";
import Home from "./pages/Home/Home.jsx";

// The admin panel (and the full Firebase SDK) only downloads on /admin
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

const isAdminRoute = () => window.location.pathname.replace(/\/+$/, "") === "/admin";

export default function App() {
  if (!isAdminRoute()) return <Home />;

  return (
    <Suspense fallback={<p style={{ padding: 24, fontFamily: "sans-serif" }}>Loading admin…</p>}>
      <AdminApp />
    </Suspense>
  );
}
