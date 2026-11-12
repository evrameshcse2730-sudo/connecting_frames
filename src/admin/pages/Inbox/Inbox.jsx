import React, { useEffect, useState } from "react";
import { watchMessages, markMessageRead, deleteMessage } from "../../../firebase/database.js";
import "./Inbox.css";

const fmt = (ts) => {
  const d = ts?.toDate ? ts.toDate() : null;
  return d ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
};

export default function Inbox({ onUnreadChange }) {
  return (
    <>
      <h1>Inbox</h1>
      <InboxList onUnreadChange={onUnreadChange} />
    </>
  );
}

function InboxList({ onUnreadChange }) {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(
    () =>
      watchMessages(
        (list) => {
          setMessages(list);
          onUnreadChange(list.filter((m) => !m.read).length);
        },
        () => setError("Could not load messages. Check that your account is in the admins collection.")
      ),
    [onUnreadChange]
  );

  const toggle = (m) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.read) markMessageRead(m.id, true).catch(() => {});
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return;
    await deleteMessage(m.id).catch(() => setError("Delete failed."));
  };

  if (error) return <p className="ad-msg">{error}</p>;
  if (!messages) return <p className="ad-muted">Loading messages…</p>;
  if (!messages.length)
    return <p className="ad-muted">No messages yet. Contact form enquiries will appear here.</p>;

  return (
    <ul className="ad-inbox">
      {messages.map((m) => (
        <li key={m.id} className={`ad-msgrow ${m.read ? "" : "is-unread"}`}>
          <button type="button" className="ad-msghead" onClick={() => toggle(m)} aria-expanded={open === m.id}>
            <span className="ad-msgname">{m.name || "(no name)"}</span>
            <span className="ad-msgservice">{m.service}</span>
            <span className="ad-msgdate">{fmt(m.createdAt)}</span>
          </button>

          {open === m.id && (
            <div className="ad-msgbody">
              <p className="ad-muted">{m.email}</p>
              <p className="ad-msgtext">{m.message}</p>
              <div className="ad-row">
                <a
                  className="ad-btn ad-primary"
                  href={`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent("Re: your project enquiry – Connecting Frames")}`}
                >
                  Reply by email
                </a>
                <button type="button" className="ad-btn" onClick={() => markMessageRead(m.id, false)}>
                  Mark unread
                </button>
                <button type="button" className="ad-btn ad-danger" onClick={() => remove(m)}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
