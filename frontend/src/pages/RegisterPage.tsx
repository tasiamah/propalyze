import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, fullName || undefined);
      navigate("/dashboard");
    } catch (err) {
      setError("We couldn't create your account. Is this email already registered?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <h1 className="page-title">Create your Propalyze account</h1>
      <p className="page-subtitle">
        Start with 2 free property analyses. Upgrade only if it actually helps you close
        better deals.
      </p>

      <div className="glass-panel auth-card">
        <form onSubmit={onSubmit} className="layout-grid gap-12">
          <div>
            <label className="field-label" htmlFor="name">
              Name (optional)
            </label>
            <input
              id="name"
              type="text"
              className="field-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>
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
              minLength={8}
              autoComplete="new-password"
            />
            <p className="field-error" style={{ opacity: 0.8 }}>
              Use at least 8 characters. Avoid reusing your bank or email password.
            </p>
          </div>
          {error && <div className="field-error">{error}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
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
          Already have an account? <Link to="/login">Log in instead.</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;


