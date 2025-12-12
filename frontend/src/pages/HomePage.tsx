import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryCta = () => {
    if (user) {
      navigate("/analyses/new");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="layout-grid hero-grid">
      <section>
        <div className="pill">
          <span className="pill-dot" />
          <span>From Funda link to decision in under 60 seconds</span>
        </div>
        <h1 className="hero-title">
          Run instant buy-to-let & flip analyses on any{" "}
          <span className="hero-gradient">Funda property.</span>
        </h1>
        <p className="hero-subtitle">
          Propalyze turns rough listings into clear numbers: yields, cashflow, and flip
          ROI – so you can say yes or no with confidence.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={primaryCta}>
            {user ? "Analyze a property" : "Get started – 2 analyses free"}
          </button>
          {!user && (
            <button className="btn btn-outline" onClick={() => navigate("/login")}>
              Log in
            </button>
          )}
        </div>
        <p className="hero-microcopy">
          <strong>No card required</strong> for your first 2 analyses. Then subscribe or
          pay as you go.
        </p>

        <div style={{ marginTop: 26 }}>
          <div className="pill-row">
            <span className="chip">
              <span className="chip-dot" />
              Designed for Dutch market investors
            </span>
            <span className="badge">Works with Funda links or manual addresses</span>
            <span className="badge">Quick consulting call available after each deal</span>
          </div>
        </div>
      </section>

      <section className="hero-panel glass-panel">
        <div className="hero-panel-inner">
          <div className="hero-row">
            <div className="ribbon">
              <span className="ribbon-dot" />
              Live analysis preview
            </div>
            <span className="tag badge-success">Example deal – Amsterdam</span>
          </div>

          <div className="hero-metrics">
            <div className="small-label">Buy-to-let profile</div>
            <div className="hero-metrics-row">
              <div className="hero-metric">
                <div className="hero-metric-label">Net yield</div>
                <div className="hero-metric-value text-success">6.4%</div>
                <div className="hero-metric-pill">Above target for long-term hold</div>
              </div>
              <div className="hero-metric">
                <div className="hero-metric-label">Annual cashflow</div>
                <div className="hero-metric-value">€3,820</div>
                <div className="hero-metric-pill">After vacancy, maintenance & VvE</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="small-label">Flip potential</div>
            <div className="stat-grid" style={{ marginTop: 6 }}>
              <div className="stat">
                <div className="stat-label">Renovation budget</div>
                <div className="stat-value">€55,000</div>
                <div className="stat-pill">Including notary & transfer tax</div>
              </div>
              <div className="stat">
                <div className="stat-label">Projected flip ROI</div>
                <div className="stat-value text-success">21.8%</div>
                <div className="stat-pill">Within 9–12 months horizon</div>
              </div>
            </div>
          </div>

          <div className="hero-row">
            <p className="hero-row-text">
              We stress-test each deal with vacancy and maintenance assumptions, so you
              don&apos;t get surprised later.
            </p>
            <div className="hero-avatar-stack">
              <div className="hero-avatar" />
              <div className="hero-avatar" />
              <div className="hero-avatar" />
              <span className="hero-avatar-label">Join careful investors who run the numbers.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="layout-grid layout-grid-2">
          <div className="card">
            <div className="section-heading">
              <div>
                <div className="section-heading-title">How Propalyze fits your flow</div>
                <div className="section-heading-subtitle">
                  Built around the way you already scout properties.
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
                <strong>1. Paste a Funda link or address</strong> – we capture the basics
                and let you refine the financials.
              </li>
              <li>
                <strong>2. See instant buy-to-let & flip economics</strong> – yields,
                cashflow and ROI with simple assumptions you can understand.
              </li>
              <li>
                <strong>3. Bookmark, compare, decide</strong> – keep a history of your
                analyses instead of losing them in spreadsheets.
              </li>
              <li>
                <strong>4. Need a second set of eyes?</strong> – schedule a consulting
                call straight from any analysis.
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="section-heading">
              <div>
                <div className="section-heading-title">Pricing that respects your time</div>
                <div className="section-heading-subtitle">
                  Try it on two live deals before you commit.
                </div>
              </div>
            </div>
            <div className="pricing-grid">
              <div className="pricing-card secondary">
                <div className="pricing-title-row">
                  <div>
                    <div className="pricing-name">Free tier</div>
                    <div className="pricing-price">€0</div>
                  </div>
                  <span className="badge">Perfect for first-time users</span>
                </div>
                <div className="pricing-features">
                  <div className="pricing-feature">
                    <span className="pricing-feature-dot" />
                    <span>2 in-depth property analyses</span>
                  </div>
                  <div className="pricing-feature">
                    <span className="pricing-feature-dot" />
                    <span>Access to buy-to-let & flip metrics</span>
                  </div>
                  <div className="pricing-feature">
                    <span className="pricing-feature-dot" />
                    <span>Optional consulting call after each analysis</span>
                  </div>
                </div>
              </div>
              <div className="pricing-card">
                <div className="pricing-title-row">
                  <div>
                    <div className="pricing-name">Propalyze Pro</div>
                    <div className="pricing-price">€29 / month</div>
                  </div>
                  <span className="pricing-tag">Recommended for active buyers</span>
                </div>
                <div className="pricing-features">
                  <div className="pricing-feature">
                    <span className="pricing-feature-dot" />
                    <span>Unlimited analyses per month</span>
                  </div>
                  <div className="pricing-feature">
                    <span className="pricing-feature-dot" />
                    <span>Priority support & roadmap input</span>
                  </div>
                  <div className="pricing-feature">
                    <span className="pricing-feature-dot" />
                    <span>Export-ready numbers for banks & partners</span>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-primary w-full" onClick={() => navigate("/pricing")}>
                    See full pricing & subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


