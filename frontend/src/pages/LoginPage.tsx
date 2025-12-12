import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Could not log you in. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <h1 className="page-title">Welcome back</h1>
      <p className="page-subtitle">
        Log in to access your saved analyses and continue evaluating properties.
      </p>

      <div className="glass-panel auth-card">
        <form onSubmit={onSubmit} className="layout-grid gap-12">
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="field-error">{error}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/")}
            >
              Back to landing
            </button>
          </div>
        </form>

        <p className="auth-cta">
          No account yet? <Link to="/register">Create one in 30 seconds.</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


