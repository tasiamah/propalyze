import React, { useEffect, useState } from "react";
import { api } from "../api/client";

interface StripeConfig {
  publishable_key?: string | null;
}

const PricingPage: React.FC = () => {
  const [config, setConfig] = useState<StripeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    api
      .get<StripeConfig>("/billing/public-config")
      .then((res) => setConfig(res.data))
      .catch((err) => {
        console.error(err);
        setError("Billing configuration is not available yet.");
      })
      .finally(() => setLoading(false));
  }, []);

  const startSubscription = async () => {
    setError(null);
    setSubscribing(true);
    try {
      const baseUrl = window.location.origin;
      const res = await api.post<{ checkout_url: string }>(
        "/billing/create-checkout-session",
        {
          success_url: `${baseUrl}/dashboard`,
          cancel_url: `${baseUrl}/pricing`
        }
      );
      window.location.href = res.data.checkout_url;
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data?.detail) {
        setError(String(err.response.data.detail));
      } else {
        setError("We couldn’t start the checkout session. Please try again.");
      }
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="layout-grid gap-12">
      <section>
        <h1 className="page-title">Pricing</h1>
        <p className="page-subtitle">
          Start free, then upgrade once Propalyze is a natural part of how you evaluate
          deals. Cancel anytime.
        </p>
      </section>

      <section className="pricing-grid">
        <div className="pricing-card secondary">
          <div className="pricing-title-row">
            <div>
              <div className="pricing-name">Free tier</div>
              <div className="pricing-price">€0</div>
            </div>
            <span className="badge">Perfect for testing on a few deals</span>
          </div>
          <div className="pricing-features">
            <div className="pricing-feature">
              <span className="pricing-feature-dot" />
              <span>2 full analyses – buy-to-let or flip</span>
            </div>
            <div className="pricing-feature">
              <span className="pricing-feature-dot" />
              <span>Save results & book consulting calls</span>
            </div>
            <div className="pricing-feature">
              <span className="pricing-feature-dot" />
              <span>Access from any device</span>
            </div>
          </div>
        </div>

        <div className="pricing-card">
          <div className="pricing-title-row">
            <div>
              <div className="pricing-name">Propalyze Pro</div>
              <div className="pricing-price">€29 / month</div>
            </div>
            <span className="pricing-tag">Designed for active buyers</span>
          </div>
          <div className="pricing-features">
            <div className="pricing-feature">
              <span className="pricing-feature-dot" />
              <span>Unlimited property analyses</span>
            </div>
            <div className="pricing-feature">
              <span className="pricing-feature-dot" />
              <span>Priority feature requests & faster support</span>
            </div>
            <div className="pricing-feature">
              <span className="pricing-feature-dot" />
              <span>Export-ready summaries for banks and partners</span>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              className="btn btn-primary w-full"
              type="button"
              onClick={startSubscription}
              disabled={subscribing}
            >
              {subscribing ? "Redirecting…" : "Subscribe with Stripe"}
            </button>
          </div>
          <p className="hero-microcopy">
            We use Stripe for payments. Your card details never touch Propalyze&apos;s
            servers.
          </p>
          {loading && <p className="text-muted" style={{ fontSize: 11 }}>Loading billing details…</p>}
          {error && <p className="field-error">{error}</p>}
          {!loading && config && !config.publishable_key && (
            <p className="field-error">
              Stripe keys are not configured on this environment. Check the backend
              environment variables before going live.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PricingPage;


