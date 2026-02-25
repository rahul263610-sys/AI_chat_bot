export type SubscriptionPlan = "null" | "free" | "premium";

export type SubscriptionStatus =
  | "pending"
  | "active"
  | "cancelled"
  | "expired";

export interface Subscription {
  _id: string;
  user: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}