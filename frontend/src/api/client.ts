import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("propalyze_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  is_subscribed: boolean;
  analysis_count: number;
  created_at: string;
}

export interface AnalysisInput {
  title: string;
  analysis_type: "buy_to_let" | "flip" | "hybrid";
  funda_url?: string;
  address_line?: string;
  postal_code?: string;
  city?: string;
  asking_price?: number;
  expected_rent?: number;
  expected_sale_price?: number;
  renovation_cost?: number;
  purchase_costs?: number;
  service_costs_monthly?: number;
}

export interface AnalysisListItem {
  id: number;
  title: string;
  city?: string | null;
  analysis_type: string;
  gross_rental_yield?: number | null;
  flip_roi?: number | null;
  created_at: string;
}

export interface AnalysisDetail extends AnalysisListItem {
  funda_url?: string | null;
  address_line?: string | null;
  postal_code?: string | null;
  asking_price?: number | null;
  expected_rent?: number | null;
  expected_sale_price?: number | null;
  renovation_cost?: number | null;
  purchase_costs?: number | null;
  service_costs_monthly?: number | null;
  net_rental_yield?: number | null;
  annual_cashflow?: number | null;
  recommendation?: string | null;
  summary?: string | null;
}

export interface Consultation {
  id: number;
  analysis_id: number;
  preferred_datetime: string;
  message?: string | null;
  status: string;
  created_at: string;
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("propalyze_token", token);
  } else {
    localStorage.removeItem("propalyze_token");
  }
}


