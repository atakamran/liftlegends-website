export type SubscriptionPlan = 'basic' | 'pro' | 'ultimate';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  goal: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  currentWeight: number | null;
  targetWeight: number | null;
  permissions: string | null;
  user_id: string | null;
  is_admin: boolean;
  is_coach: boolean;
}

export interface SubscriptionPlanDetails {
  name: SubscriptionPlan;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPlanDetails> = {
  basic: {
    name: 'basic',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: [
      'Basic workout plans',
      'Limited exercise library',
      'Basic progress tracking'
    ]
  },
  pro: {
    name: 'pro',
    price: {
      monthly: 99000,
      yearly: 990000
    },
    features: [
      'Advanced workout plans',
      'Full exercise library',
      'Detailed progress tracking',
      'Nutrition guidance'
    ]
  },
  ultimate: {
    name: 'ultimate',
    price: {
      monthly: 199000,
      yearly: 1990000
    },
    features: [
      'Premium workout plans',
      'Complete exercise library',
      'Advanced progress analytics',
      'Personalized nutrition plans',
      'Priority support'
    ]
  }
};