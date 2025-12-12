import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnalysisDetail, Consultation, api } from "../api/client";

const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consultDate, setConsultDate] = useState("");
  const [consultMessage, setConsultMessage] = useState("");
  const [consultError, setConsultError] = useState<string | null>(null);
  const [consultLoading, setConsultLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get<AnalysisDetail>(`/analyses/${id}`),
      api.get<Consultation[]>("/consultations")
    ])
      .then(([aRes, cRes]) => {
        setAnalysis(aRes.data);
        setConsultations(
          cRes.data.filter((c) => String(c.analysis_id) === String(id))
        );
      })
      .catch((err) => {
        console.error(err);
        setError("We couldn't load this analysis.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const submitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setConsultError(null);
    if (!consultDate) {
      setConsultError("Choose a preferred date & time for your call.");
      return;
    }
    setConsultLoading(true);
    try {
      const res = await api.post<Consultation>("/consultations", {
        analysis_id: Number(id),
        preferred_datetime: consultDate,
        message: consultMessage || undefined
      });
      setConsultations((prev) => [res.data, ...prev]);
      setConsultDate("");
      setConsultMessage("");
    } catch (err: any) {
      if (err?.response?.status === 400) {
        setConsultError("You already requested a consultation for this analysis.");
      } else {
        setConsultError("We couldn’t submit your request. Please try again.");
      }
      console.error(err);
    } finally {
      setConsultLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">Loading analysis…</div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="layout-grid gap-12">
        <p className="field-error">{error ?? "Analysis not found."}</p>
        <button className="btn btn-outline" onClick={() => navigate("/dashboard")}>
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="layout-grid gap-12">
      <section>
        <h1 className="page-title">{analysis.title}</h1>
        <p className="page-subtitle">
          Full view of this property&apos;s economics and follow-up actions.
        </p>
        <div className="pill-row">
          <span className="pill pill-blue">
            <span className="pill-dot" />
            {analysis.analysis_type === "buy_to_let"
              ? "Buy-to-let"
              : analysis.analysis_type === "flip"
              ? "Flip"
              : "Hybrid strategy"}
          </span>
          {analysis.city && (
            <span className="badge">
              {analysis.address_line ? `${analysis.address_line}, ` : ""}
              {analysis.postal_code ? `${analysis.postal_code} ` : ""}
              {analysis.city}
            </span>
          )}
          {analysis.funda_url && (
            <a
              className="badge"
              href={analysis.funda_url}
              target="_blank"
              rel="noreferrer"
            >
              View listing on Funda ↗
            </a>
          )}
        </div>
      </section>

      <section className="layout-grid layout-grid-2">
        <div className="glass-panel card">
          <div className="section-heading">
            <div>
              <div className="section-heading-title">Key metrics</div>
              <div className="section-heading-subtitle">
                These are based on your inputs plus conservative vacancy & maintenance.
              </div>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-label">Net rental yield</div>
              <div className="stat-value">
                {analysis.net_rental_yield != null
                  ? `${analysis.net_rental_yield.toFixed(1)}%`
                  : "—"}
              </div>
              <div className="stat-pill">
                After vacancy, maintenance and service costs.
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Annual cashflow</div>
              <div className="stat-value">
                {analysis.annual_cashflow != null
                  ? `€${analysis.annual_cashflow.toLocaleString("nl-NL", {
                      maximumFractionDigits: 0
                    })}`
                  : "—"}
              </div>
              <div className="stat-pill">Before income tax and financing costs.</div>
            </div>
            <div className="stat">
              <div className="stat-label">Total investment</div>
              <div className="stat-value">
                {analysis.asking_price != null
                  ? `€${(
                      (analysis.asking_price || 0) +
                      (analysis.renovation_cost || 0) +
                      (analysis.purchase_costs || 0)
                    ).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`
                  : "—"}
              </div>
              <div className="stat-pill">
                Purchase price + renovation + purchase costs.
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Flip ROI</div>
              <div className="stat-value">
                {analysis.flip_roi != null ? `${analysis.flip_roi.toFixed(1)}%` : "—"}
              </div>
              <div className="stat-pill">
                Based on your expected sale price & cost budget.
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="section-heading">
              <div>
                <div className="section-heading-title">Recommendation</div>
                <div className="section-heading-subtitle">
                  A quick summary to help you decide what to do next.
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {analysis.summary ?? analysis.recommendation ?? "No summary generated."}
            </p>
          </div>
        </div>

        <aside className="card">
          <div className="section-heading">
            <div>
              <div className="section-heading-title">Consulting call</div>
              <div className="section-heading-subtitle">
                Want a second set of eyes on this deal? Request a call.
              </div>
            </div>
          </div>

          {consultations.length > 0 && (
            <div className="card" style={{ marginTop: 0, marginBottom: 12 }}>
              <div className="small-label">Existing requests</div>
              {consultations.map((c) => (
                <div
                  key={c.id}
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    paddingTop: 4,
                    borderTop: "1px solid rgba(148,163,184,0.35)"
                  }}
                >
                  <div>
                    Preferred: <strong>{c.preferred_datetime}</strong>
                  </div>
                  <div className="text-muted">
                    Status:{" "}
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
                  </div>
                  {c.message && (
                    <div style={{ marginTop: 2 }}>{c.message}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submitConsultation} className="layout-grid gap-12">
            <div>
              <label className="field-label" htmlFor="when">
                Preferred date & time
              </label>
              <input
                id="when"
                className="field-input"
                placeholder="e.g. Thursday 19:30, CET"
                value={consultDate}
                onChange={(e) => setConsultDate(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="message">
                Context for the call (optional)
              </label>
              <textarea
                id="message"
                className="field-textarea"
                value={consultMessage}
                onChange={(e) => setConsultMessage(e.target.value)}
                placeholder="Tell us what you’re unsure about: rent level, renovation budget, comp sales, regulations..."
              />
            </div>
            {consultError && <div className="field-error">{consultError}</div>}
            <button className="btn btn-primary" type="submit" disabled={consultLoading}>
              {consultLoading ? "Requesting..." : "Request consulting call"}
            </button>
          </form>
        </aside>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <div className="section-heading-title">Inputs recap</div>
            <div className="section-heading-subtitle">
              Quick reminder of the numbers this analysis is based on.
            </div>
          </div>
        </div>
        <div className="layout-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div style={{ fontSize: 13 }}>
            <div className="small-label">Purchase</div>
            <div>
              Price:{" "}
              <strong>
                {analysis.asking_price != null
                  ? `€${analysis.asking_price.toLocaleString("nl-NL", {
                      maximumFractionDigits: 0
                    })}`
                  : "—"}
              </strong>
            </div>
            <div>
              Purchase costs:{" "}
              <strong>
                {analysis.purchase_costs != null
                  ? `€${analysis.purchase_costs.toLocaleString("nl-NL", {
                      maximumFractionDigits: 0
                    })}`
                  : "—"}
              </strong>
            </div>
          </div>
          <div style={{ fontSize: 13 }}>
            <div className="small-label">Renovation & rent</div>
            <div>
              Renovation:{" "}
              <strong>
                {analysis.renovation_cost != null
                  ? `€${analysis.renovation_cost.toLocaleString("nl-NL", {
                      maximumFractionDigits: 0
                    })}`
                  : "—"}
              </strong>
            </div>
            <div>
              Expected rent:{" "}
              <strong>
                {analysis.expected_rent != null
                  ? `€${analysis.expected_rent.toLocaleString("nl-NL", {
                      maximumFractionDigits: 0
                    })}/mo`
                  : "—"}
              </strong>
            </div>
          </div>
          <div style={{ fontSize: 13 }}>
            <div className="small-label">Flip assumptions</div>
            <div>
              Target sale price:{" "}
              <strong>
                {analysis.expected_sale_price != null
                  ? `€${analysis.expected_sale_price.toLocaleString("nl-NL", {
                      maximumFractionDigits: 0
                    })}`
                  : "—"}
              </strong>
            </div>
            <div>
              VvE / service:{" "}
              <strong>
                {analysis.service_costs_monthly != null
                  ? `€${analysis.service_costs_monthly.toLocaleString("nl-NL", {
                      maximumFractionDigits: 0
                    })}/mo`
                  : "—"}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalysisDetailPage;


