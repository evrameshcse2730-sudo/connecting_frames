import { useCallback, useEffect, useState } from "react";
import { watchUser, isAdmin, logoutAdmin } from "../firebase/auth.js";
import { loadContent, saveContent } from "../firebase/database.js";
import defaultContent, { withDefaults } from "../content/defaultContent.js";
import sections from "./config/sections.js";
import validate from "./utils/validate.js";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminLogin from "./pages/AdminLogin/AdminLogin.jsx";
import Inbox from "./pages/Inbox/Inbox.jsx";
import SectionEditor from "./pages/SectionEditor/SectionEditor.jsx";

// Login gate: only accounts listed in Firestore /admins get past this.
export default function AdminRoot() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [allowed, setAllowed] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(
    () =>
      watchUser(async (u) => {
        if (u && !(await isAdmin(u.uid))) {
          setNotice("This account does not have admin access.");
          await logoutAdmin();
          return;
        }
        setAllowed(Boolean(u));
        setUser(u);
      }),
    []
  );

  if (user === undefined) return <div className="ad-center">Loading…</div>;
  if (!user || !allowed) return <AdminLogin notice={notice} />;
  return <Dashboard user={user} />;
}

// Holds the content being edited, and saves it.
function Dashboard({ user }) {
  const [content, setContent] = useState(null);
  const [saved, setSaved] = useState(null);
  const [page, setPage] = useState("inbox");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    loadContent()
      .then((c) => withDefaults(c))
      .catch(() => {
        setStatus({ type: "error", text: "Could not load saved content — showing defaults." });
        return defaultContent;
      })
      .then((c) => {
        setContent(c);
        setSaved(JSON.stringify(c));
      });
  }, []);

  const dirty = Boolean(content) && JSON.stringify(content) !== saved;

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const save = async () => {
    const errors = validate(content);
    if (errors.length) {
      setStatus({ type: "error", text: errors.join(" ") });
      return;
    }
    setSaving(true);
    try {
      await saveContent(content, user.email);
      setSaved(JSON.stringify(content));
      setStatus({ type: "ok", text: "Saved! The website is updated — refresh it to see changes." });
    } catch {
      setStatus({ type: "error", text: "Save failed. Check your internet and admin access." });
    }
    setSaving(false);
  };

  const discard = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      setContent(JSON.parse(saved));
      setStatus({ type: "", text: "" });
    }
  };

  const logout = () => {
    if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    logoutAdmin();
  };

  const onUnreadChange = useCallback((n) => setUnread(n), []);
  const section = sections.find((s) => s.key === page);

  return (
    <AdminLayout
      page={page}
      onNavigate={setPage}
      unread={unread}
      userEmail={user.email}
      onLogout={logout}
      dirty={dirty}
      saving={saving}
      onSave={save}
      onDiscard={discard}
      status={status}
    >
      {page === "inbox" ? (
        <Inbox onUnreadChange={onUnreadChange} />
      ) : !content ? (
        <p className="ad-muted">Loading content…</p>
      ) : (
        <SectionEditor
          section={section}
          value={content[page]}
          onChange={(value) => setContent((c) => ({ ...c, [page]: value }))}
        />
      )}
    </AdminLayout>
  );
}
