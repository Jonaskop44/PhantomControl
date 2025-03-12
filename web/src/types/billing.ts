export interface BillingProps {
  amount_paid: number;
  status: "paid" | "unpaid" | "trial";
  createdAt: number;
}

export type Filter = "all" | "paid" | "open" | "trial";
