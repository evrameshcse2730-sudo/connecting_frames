import sections from "../config/sections.js";
import "./Sidebar.css";

export default function Sidebar({ open, page, onNavigate, unread, userEmail, onLogout }) {
  const item = (key, label, extra) => (
    <button type="button" key={key} className={page === key ? "is-active" : ""} onClick={() => onNavigate(key)}>
      {label} {extra}
    </button>
  );

  return (
    <nav className={`ad-side ${open ? "is-open" : ""}`}>
      {item("inbox", "Inbox", unread > 0 && <span className="ad-badge">{unread}</span>)}

      <p className="ad-side-label">Website</p>
      {sections.map((s) => item(s.key, s.title))}

      <div className="ad-side-foot">
        <a href="/" target="_blank" rel="noopener noreferrer">
          View website ↗
        </a>
        <span className="ad-muted">{userEmail}</span>
        <button type="button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
