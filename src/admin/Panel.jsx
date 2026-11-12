import React, { useEffect, useState } from "react";
import { watchUser, isAdmin, logout, loadContent, saveContent } from "../lib/firebase.js";
import defaultContent, { withDefaults } from "../content/defaultContent.js";
import sections from "./sections.js";
import validate from "./validate.js";
import { Field, ListEditor } from "./fields.jsx";
import Login from "./Login.jsx";
import Inbox from "./Inbox.jsx";

export default function Panel() {
  const [user, setUser] = useState(undefined); // undefined = checking
  const [allowed, setAllowed] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(
    () =>
      watchUser(async (u) => {
        if (u && !(await isAdmin(u.uid))) {
          setNotice("This account does not have admin access.");
          await logout();
          return;
        }
        setAllowed(Boolean(u));
        setUser(u);
      }),
    []
  );

  if (user === undefined) return <div className="ad-center">Loading…</div>;
  if (!user || !allowed) return <Login notice={notice} />;
  return <Dashboard user={user} />;
}

function Dashboard({ user }) {
  const [content, setContent] = useState(null);
  const [saved, setSaved] = useState(null);
  const [tab, setTab] = useState("inbox");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const dirty = content && JSON.stringify(content) !== saved;

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

  const signOut = () => {
    if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    logout();
  };

  const section = sections.find((s) => s.key === tab);
  const setSection = (value) => setContent((c) => ({ ...c, [tab]: value }));
  const go = (key) => {
    setTab(key);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="ad-layout">
      <header className="ad-top">
        <button className="ad-menu" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          ☰
        </button>
        <strong className="ad-brand">CF Admin</strong>
        <div className="ad-top-actions">
          {dirty && <span className="ad-dirty">Unsaved changes</span>}
          {dirty && (
            <button className="ad-btn" type="button" onClick={discard}>
              Discard
            </button>
          )}
          <button className="ad-btn ad-primary" type="button" onClick={save} disabled={!dirty || saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <nav className={`ad-side ${menuOpen ? "is-open" : ""}`}>
        <button type="button" className={tab === "inbox" ? "is-active" : ""} onClick={() => go("inbox")}>
          Inbox {unread > 0 && <span className="ad-badge">{unread}</span>}
        </button>
        <p className="ad-side-label">Website</p>
        {sections.map((s) => (
          <button type="button" key={s.key} className={tab === s.key ? "is-active" : ""} onClick={() => go(s.key)}>
            {s.title}
          </button>
        ))}
        <div className="ad-side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer">
            View website ↗
          </a>
          <span className="ad-muted">{user.email}</span>
          <button type="button" onClick={signOut}>
            Log out
          </button>
        </div>
      </nav>

      <main className="ad-main">
        {status.text && (
          <p className={`ad-status ad-status-${status.type}`} role="status">
            {status.text}
          </p>
        )}

        {tab === "inbox" ? (
          <>
            <h1>Inbox</h1>
            <Inbox onUnreadChange={setUnread} />
          </>
        ) : !content ? (
          <p className="ad-muted">Loading content…</p>
        ) : (
          <SectionEditor section={section} value={content[tab]} onChange={setSection} />
        )}
      </main>
    </div>
  );
}

function SectionEditor({ section, value, onChange }) {
  return (
    <>
      <h1>{section.title}</h1>
      {section.hint && <p className="ad-muted">{section.hint}</p>}

      {section.rootList ? (
        <ListEditor list={section.rootList} items={value} onChange={onChange} />
      ) : (
        <>
          <div className="ad-card">
            {section.fields.map((f) => (
              <Field key={f[0]} field={f} value={value[f[0]]} onChange={(v) => onChange({ ...value, [f[0]]: v })} />
            ))}
          </div>
          {section.list && (
            <>
              <h2>{section.list.itemLabel}s</h2>
              <ListEditor
                list={section.list}
                items={value[section.list.key]}
                onChange={(items) => onChange({ ...value, [section.list.key]: items })}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
