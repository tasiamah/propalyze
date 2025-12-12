import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnalysisInput, api } from "../api/client";

const initialState: AnalysisInput = {
  title: "",
  analysis_type: "buy_to_let",
  funda_url: "",
  address_line: "",
  postal_code: "",
  city: "",
  asking_price: undefined,
  expected_rent: undefined,
  expected_sale_price: undefined,
  renovation_cost: 0,
  purchase_costs: 0,
  service_costs_monthly: 0
};

const NewAnalysisPage: React.FC = () => {
  const [form, setForm] = useState<AnalysisInput>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateNumber =
    (field: keyof AnalysisInput) =>
    (value: string): void => {
      const cleaned = value.trim();
      setForm((prev) => ({
        ...prev,
        [field]: cleaned === "" ? undefined : Number(cleaned)
      }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title) {
      setError("Give this analysis a short, descriptive title.");
      return;
    }
    setLoading(true);
    try {
      const payload: AnalysisInput = {
        ...form,
        funda_url: form.funda_url || undefined,
        address_line: form.address_line || undefined,
        postal_code: form.postal_code || undefined,
        city: form.city || undefined
      };
      const res = await api.post("/analyses", payload);
      navigate(`/analyses/${res.data.id}`);
    } catch (err: any) {
      if (err?.response?.status === 402) {
        setError(
          "You’ve used your free analyses. Subscribe on the pricing page to unlock unlimited analyses."
        );
      } else {
        setError("We couldn’t create this analysis. Please try again in a moment.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-grid gap-12">
      <section>
        <h1 className="page-title">New property analysis</h1>
        <p className="page-subtitle">
          Paste a Funda link or fill in the address, then add basic financials. We&apos;ll
          calculate yields, cashflow, and flip ROI for you.
        </p>
      </section>

      <section className="layout-grid layout-grid-2">
        <form onSubmit={onSubmit} className="glass-panel card layout-grid gap-12">
          <div>
            <div className="section-heading">
              <div>
                <div className="section-heading-title">Deal basics</div>
                <div className="section-heading-subtitle">
                  This keeps your analyses searchable and understandable later.
                </div>
              </div>
            </div>
            <div className="layout-grid gap-12">
              <div>
                <label className="field-label" htmlFor="title">
                  Analysis title
                </label>
                <input
                  id="title"
                  className="field-input"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. 2-bed, De Pijp, asking €475k"
                  required
                />
              </div>
              <div>
                <label className="field-label" htmlFor="funda">
                  Funda URL (optional)
                </label>
                <input
                  id="funda"
                  className="field-input"
                  value={form.funda_url}
                  onChange={(e) => setForm((p) => ({ ...p, funda_url: e.target.value }))}
                  placeholder="https://www.funda.nl/koop/..."
                />
              </div>
              <div className="layout-grid gap-8">
                <div>
                  <label className="field-label" htmlFor="address">
                    Street & number
                  </label>
                  <input
                    id="address"
                    className="field-input"
                    value={form.address_line}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address_line: e.target.value }))
                    }
                    placeholder="e.g. Albert Cuypstraat 112-3"
                  />
                </div>
                <div className="layout-grid" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
                  <div>
                    <label className="field-label" htmlFor="postal">
                      Postal code
                    </label>
                    <input
                      id="postal"
                      className="field-input"
                      value={form.postal_code}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, postal_code: e.target.value }))
                      }
                      placeholder="e.g. 1073 BC"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      className="field-input"
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="e.g. Amsterdam"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="field-label">Strategy</label>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap"
                  }}
                >
                  <button
                    type="button"
                    className={`btn ${
                      form.analysis_type === "buy_to_let" ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() =>
                      setForm((p) => ({ ...p, analysis_type: "buy_to_let" }))
                    }
                  >
                    Buy-to-let
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      form.analysis_type === "flip" ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setForm((p) => ({ ...p, analysis_type: "flip" }))}
                  >
                    Flip
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      form.analysis_type === "hybrid" ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setForm((p) => ({ ...p, analysis_type: "hybrid" }))}
                  >
                    Hybrid
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-heading">
              <div>
                <div className="section-heading-title">Financial assumptions</div>
                <div className="section-heading-subtitle">
                  The more you fill in, the sharper the outputs become.
                </div>
              </div>
            </div>
            <div className="layout-grid gap-12">
              <div className="layout-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <label className="field-label" htmlFor="price">
                    Asking / purchase price (€)
                  </label>
                  <input
                    id="price"
                    className="field-input"
                    inputMode="decimal"
                    onChange={(e) => updateNumber("asking_price")(e.target.value)}
                    placeholder="e.g. 475000"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="rent">
                    Expected monthly rent (€)
                  </label>
                  <input
                    id="rent"
                    className="field-input"
                    inputMode="decimal"
                    onChange={(e) => updateNumber("expected_rent")(e.target.value)}
                    placeholder="e.g. 2150"
                  />
                </div>
              </div>

              <div className="layout-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <label className="field-label" htmlFor="renovation">
                    Renovation budget (€)
                  </label>
                  <input
                    id="renovation"
                    className="field-input"
                    inputMode="decimal"
                    defaultValue={0}
                    onChange={(e) => updateNumber("renovation_cost")(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="purchase-costs">
                    Purchase & transaction costs (€)
                  </label>
                  <input
                    id="purchase-costs"
                    className="field-input"
                    inputMode="decimal"
                    defaultValue={0}
                    onChange={(e) => updateNumber("purchase_costs")(e.target.value)}
                  />
                </div>
              </div>

              <div className="layout-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <label className="field-label" htmlFor="service">
                    VvE / service costs per month (€)
                  </label>
                  <input
                    id="service"
                    className="field-input"
                    inputMode="decimal"
                    defaultValue={0}
                    onChange={(e) => updateNumber("service_costs_monthly")(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="sale-price">
                    Expected sale price (€ – for flips)
                  </label>
                  <input
                    id="sale-price"
                    className="field-input"
                    inputMode="decimal"
                    onChange={(e) => updateNumber("expected_sale_price")(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <div className="field-error">{error}</div>}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12
            }}
          >
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Running analysis..." : "Run analysis"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>

        <aside className="card">
          <div className="section-heading">
            <div>
              <div className="section-heading-title">What we&apos;ll show you</div>
              <div className="section-heading-subtitle">
                Each analysis is stored and can be revisited anytime.
              </div>
            </div>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: 13,
              color: "var(--text-muted)",
              display: "grid",
              gap: 6
            }}
          >
            <li>
              • <strong>Gross & net rental yield</strong> based on your rent assumptions
              and conservative vacancy / maintenance.
            </li>
            <li>
              • <strong>Annual cashflow</strong> after service charges and maintenance.
            </li>
            <li>
              • <strong>Flip ROI</strong> based on renovation + transaction cost budget
              and expected sale price.
            </li>
            <li>
              • A simple <strong>recommendation & summary</strong> to help you say yes /
              no faster.
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
};

export default NewAnalysisPage;


