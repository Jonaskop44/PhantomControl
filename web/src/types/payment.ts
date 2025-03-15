export interface BillingProps {
  amount_paid: number;
  status: "paid" | "unpaid" | "trial";
  createdAt: number;
}

export type Filter = "all" | "paid" | "open" | "trial";

export type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export interface Plan {
  id: string;
  object: "plan";
  active: boolean;
  aggregate_usage: string | null;
  amount: number;
  amount_decimal: string;
  billing_scheme: "per_unit" | "tiered";
  created: number;
  currency: string;
  interval: "day" | "week" | "month" | "year";
  interval_count: number;
  livemode: boolean;
  metadata: Record<string, string>;
  meter: string | null;
  nickname: string | null;
  product: string;
  tiers_mode: string | null;
  transform_usage: string | null;
  trial_period_days: number | null;
  usage_type: "licensed" | "metered";
}

export interface Subscription {
  id: string;
  object: "subscription";
  application: string | null;
  application_fee_percent: number | null;
  billing_cycle_anchor: number;
  billing_cycle_anchor_config: string | null;
  billing_thresholds: string | null;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  collection_method: "charge_automatically" | "send_invoice";
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due: number | null;
  default_payment_method: string | null;
  default_source: string | null;
  default_tax_rates: string[];
  description: string | null;
  discount: string | null;
  discounts: string[];
  ended_at: number | null;
  latest_invoice: string;
  livemode: boolean;
  metadata: Record<string, string>;
  next_pending_invoice_item_invoice: string | null;
  on_behalf_of: string | null;
  pause_collection: string | null;
  pending_invoice_item_interval: string | null;
  pending_setup_intent: string | null;
  pending_update: string | null;
  plan: Plan;
  quantity: number;
  schedule: string | null;
  start_date: number;
  status: SubscriptionStatus;
}

export interface Product {
  id: string;
  object: "product";
  active: boolean;
  attributes: string[];
  created: number;
  default_price: string;
  description: string | null;
  images: string[];
  livemode: boolean;
  marketing_features: string[];
  metadata: Record<string, string>;
  name: string;
  package_dimensions: string | null;
  shippable: boolean | null;
  statement_descriptor: string | null;
  tax_code: string;
  type: "service" | "good";
  unit_label: string | null;
  updated: number;
  url: string | null;
}

export interface StripeResponse {
  subscription: Subscription;
  product: Product;
}
