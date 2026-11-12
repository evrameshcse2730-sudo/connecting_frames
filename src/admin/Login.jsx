import React, { useState } from "react";
import { login, resetPassword } from "../lib/firebase.js";

const friendly = (err) => {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Email or password is wrong.";
  if (code.includes("too-many-requests")) return "Too many attempts. Try again in a few minutes.";
  if (code.includes("network")) return "No internet connection.";
  return "Login failed. Please try again.";
};

export default function Login({ notice }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(notice || "");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await login(email.trim(), password);
    } catch (err) {
      setMsg(friendly(err));
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!email.trim()) return setMsg("Enter your email first, then click “Forgot password”.");
    try {
      await resetPassword(email.trim());
    } catch {
      // Don't reveal whether the account exists
    }
    setMsg("If this email has an admin account, a reset link has been sent.");
  };

  return (
    <div className="ad-center">
      <form className="ad-card ad-login" onSubmit={submit}>
        <img src="/logo.webp" alt="" width="72" height="72" />
        <h1>Connecting Frames</h1>
        <p className="ad-muted">Admin login</p>

        <div className="ad-field">
          <label htmlFor="ad-email">Email</label>
          <input id="ad-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="ad-field">
          <label htmlFor="ad-pass">Password</label>
          <input
            id="ad-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {msg && <p className="ad-msg">{msg}</p>}

        <button className="ad-btn ad-primary" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <button className="ad-textbtn" type="button" onClick={forgot}>
          Forgot password
        </button>
      </form>
    </div>
  );
}
