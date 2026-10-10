import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const response = await registerUser(name, email, password);

        alert(response.message);

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
        setError(errorData.error || "Authentication failed");
      } catch {
        setError(err.message || "Authentication failed");
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
  }

  if (loggedIn) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
      <div>
        <div className="auth-user-bar">
          <span>Welcome, {user.name || "User"}</span>

          <button onClick={logout}>
            Logout
          </button>
        </div>

        {children}
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">🛍️</div>

        <h1>ShopEase</h1>

        <p className="auth-subtitle">
          {mode === "login"
            ? "Login to continue shopping"
            : "Create your account"}
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {mode === "register" && (
            <div className="auth-field">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        <div className="auth-switch">

          {mode === "login" ? (
            <>
              <span>Don't have an account?</span>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Login
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default Auth;