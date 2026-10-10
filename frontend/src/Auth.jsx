import React, { useState } from "react";
import { registerUser, loginUser } from "./services/api";

function Auth({ children }) {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "register") {
        const response = await registerUser(name, email, password);
        setSuccessMsg(response.message || "Registration successful! You can now log in.");
        setMode("login");
        setName("");
        setPassword("");
      } else {
        const response = await loginUser(email, password);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("user", JSON.stringify(response));
        localStorage.setItem("token", response.token);
        setLoggedIn(true);
      }
    } catch (err) {
      try {
        const errorData = JSON.parse(err.message);
        setError(errorData.error || "Authentication failed. Please verify your credentials.");
      } catch {
        setError(err.message || "Authentication failed. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setError("");
    setSuccessMsg("");
  }

  if (loggedIn) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Pass onLogout and currentUser to child App component
    if (React.isValidElement(children)) {
      return React.cloneElement(children, { onLogout: logout, currentUser: user });
    }
    return children;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-icon-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h1>ShopEase</h1>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Sign in to manage your orders and hardware catalog"
              : "Create an account to begin shopping"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setError("");
              setSuccessMsg("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => {
              setMode("register");
              setError("");
              setSuccessMsg("");
            }}
          >
            Register
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="auth-feedback error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-feedback success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="e.g. Sri Pavani"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            className="auth-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-wrap">
                <span className="auth-spinner"></span>
                Processing...
              </span>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Security badge footer */}
        <div className="auth-footer-notice">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>End-to-End Encrypted Session</span>
        </div>
      </div>
    </div>
  );
}

export default Auth;