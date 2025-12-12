import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnalysisListItem, api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<AnalysisListItem[]>("/analyses")
      .then((res) => setAnalyses(res.data))
      .catch((err) => {
        console.error(err);
        setError("We couldn't load your analyses. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout-grid gap-12">
      <section>
        <h1 className="page-title">Your deal pipeline</h1>
        <p className="page-subtitle">
          Each row is a decision you&apos;ve already run the numbers on. Add a new
          property from Funda or from your agent.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10
          }}
        >
          <div className="pill">
            <span className="pill-dot" />
            <span>
              {user?.is_subscribed
                ? "You are on Propalyze Pro – unlimited analyses."
                : `Free tier – ${Math.max(0, 2 - (user?.analysis_count ?? 0))} analyses left.`}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!user?.is_subscribed && (
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => navigate("/pricing")}
              >
                Upgrade to unlimited
              </button>
            )}
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigate("/analyses/new")}
            >
              New analysis
            </button>
          </div>
        </div>
      </section>

      <section className="glass-panel card">
        <div className="section-heading">
          <div>
            <div className="section-heading-title">Recent analyses</div>
            <div className="section-heading-subtitle">
              Click any row to see full details, metrics, and consulting options.
            </div>
          </div>
        </div>

        {loading && (
          <div className="empty-state">Loading your analyses...</div>
        )}
        {error && !loading && <div className="field-error">{error}</div>}
        {!loading && !error && analyses.length === 0 && (
          <div className="empty-state">
            You don&apos;t have any analyses yet.{" "}
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => navigate("/analyses/new")}
            >
              Analyze your first property
            </button>
          </div>
        )}
        {!loading && analyses.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Strategy</th>
                  <th>Key metric</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link to={`/analyses/${a.id}`} className="inline-link">
                        {a.title}
                      </Link>
                      {a.city && (
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          {a.city}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="table-badge">
                        {a.analysis_type === "buy_to_let"
                          ? "Buy-to-let"
                          : a.analysis_type === "flip"
                          ? "Flip"
                          : "Hybrid"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {a.gross_rental_yield != null && a.gross_rental_yield > 0 && (
                        <div>
                          Net yield target:{" "}
                          <strong>{a.gross_rental_yield.toFixed(1)}%</strong>
                        </div>
                      )}
                      {a.flip_roi != null && a.flip_roi > 0 && (
                        <div>
                          Flip ROI: <strong>{a.flip_roi.toFixed(1)}%</strong>
                        </div>
                      )}
                      {a.gross_rental_yield == null && a.flip_roi == null && (
                        <span className="text-muted">No metrics calculated</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;


