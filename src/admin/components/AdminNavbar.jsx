import "./AdminNavbar.css";

export default function AdminNavbar({ onMenu, dirty, saving, onSave, onDiscard }) {
  return (
    <header className="ad-top">
      <button className="ad-menu" type="button" onClick={onMenu} aria-label="Menu">
        ☰
      </button>
      <strong className="ad-brand">CF Admin</strong>
      <div className="ad-top-actions">
        {dirty && <span className="ad-dirty">Unsaved changes</span>}
        {dirty && (
          <button className="ad-btn" type="button" onClick={onDiscard}>
            Discard
          </button>
        )}
        <button className="ad-btn ad-primary" type="button" onClick={onSave} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </header>
  );
}
