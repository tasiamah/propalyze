import React, { useEffect, useState } from "react";
import { Consultation, api } from "../api/client";

const ConsultationsPage: React.FC = () => {
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<Consultation[]>("/consultations")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error(err);
        setError("We couldn’t load your consultation requests.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout-grid gap-12">
      <section>
        <h1 className="page-title">Consulting calls</h1>
        <p className="page-subtitle">
          See the status of all calls you&apos;ve requested across analyses.
        </p>
      </section>

      <section className="glass-panel card">
        <div className="section-heading">
          <div>
            <div className="section-heading-title">Your requests</div>
            <div className="section-heading-subtitle">
              We&apos;ll reach back out by email using your account address.
            </div>
          </div>
        </div>

        {loading && <div className="empty-state">Loading consultations…</div>}
        {error && !loading && <div className="field-error">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="empty-state">
            No consulting calls requested yet. You can request one from any individual
            analysis.
          </div>
        )}
        {!loading && items.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Analysis ID</th>
                  <th>Preferred slot</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.analysis_id}</td>
                    <td>{c.preferred_datetime}</td>
                    <td>
                      <span
                        className={
                          c.status === "pending"
                            ? "badge-warning tag"
                            : c.status === "confirmed"
                            ? "badge-success tag"
                            : "tag"
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {c.message ?? <span className="text-muted">—</span>}
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

export default ConsultationsPage;


