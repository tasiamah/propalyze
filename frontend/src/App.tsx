import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NewAnalysisPage from "./pages/NewAnalysisPage";
import AnalysisDetailPage from "./pages/AnalysisDetailPage";
import PricingPage from "./pages/PricingPage";
import ConsultationsPage from "./pages/ConsultationsPage";

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header style={{ borderBottom: "1px solid rgba(148,163,184,0.4)" }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 10,
                background:
                  "conic-gradient(from 220deg, #38bdf8, #a855f7, #38bdf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(56,189,248,0.9)"
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0b1220"
                }}
              >
                P
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: -0.04
                }}
              >
                Propalyze
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)"
                }}
              >
                Buy-to-let & flip intelligence
              </div>
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 13
            }}
          >
            <a className="btn btn-ghost" href="/">
              Home
            </a>
            {user && (
              <>
                <a className="btn btn-ghost" href="/dashboard">
                  Dashboard
                </a>
                <a className="btn btn-ghost" href="/pricing">
                  Pricing
                </a>
              </>
            )}
            {!user ? (
              <>
                <a className="btn btn-outline" href="/login">
                  Log in
                </a>
                <a className="btn btn-primary" href="/register">
                  Get started free
                </a>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <span className="badge">
                  {user.email}{" "}
                  {user.is_subscribed ? (
                    <span className="text-success">• Pro</span>
                  ) : (
                    <span className="text-muted">• Free</span>
                  )}
                </span>
                <button className="btn btn-outline" onClick={logout}>
                  Log out
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer
        style={{
          borderTop: "1px solid rgba(148,163,184,0.35)",
          padding: "14px 0 18px",
          marginTop: "auto"
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "0 16px",
            fontSize: 11,
            color: "var(--text-muted)",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap"
          }}
        >
          <span>© {new Date().getFullYear()} Propalyze. All rights reserved.</span>
          <span>Made for thoughtful investors, not speculators.</span>
        </div>
      </footer>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 48, color: "var(--text-muted)" }}>
        Loading…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyses/new"
            element={
              <ProtectedRoute>
                <NewAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyses/:id"
            element={
              <ProtectedRoute>
                <AnalysisDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultations"
            element={
              <ProtectedRoute>
                <ConsultationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </AuthProvider>
  );
};

export default App;


