import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./AdminLayout.css";

// Top bar + sidebar + page area
export default function AdminLayout({
  page,
  onNavigate,
  unread,
  userEmail,
  onLogout,
  dirty,
  saving,
  onSave,
  onDiscard,
  status,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (key) => {
    onNavigate(key);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="ad-layout">
      <AdminNavbar
        onMenu={() => setMenuOpen(!menuOpen)}
        dirty={dirty}
        saving={saving}
        onSave={onSave}
        onDiscard={onDiscard}
      />

      <Sidebar
        open={menuOpen}
        page={page}
        onNavigate={go}
        unread={unread}
        userEmail={userEmail}
        onLogout={onLogout}
      />

      <main className="ad-main">
        {status.text && (
          <p className={`ad-status ad-status-${status.type}`} role="status">
            {status.text}
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
