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
      'دسترسی به کتابخانه تمرین‌های محدود',
      'ثبت پیشرفت تمرینی پایه',
      'امکان خرید برنامه‌های تمرینی به صورت جداگانه',
      'امکان خرید برنامه‌های غذایی به صورت جداگانه',
      'امکان خرید برنامه‌های مکمل به صورت جداگانه'
    ]
  },
  pro: {
    name: 'pro',
    price: {
      monthly: 99000,
      yearly: 990000
    },
    features: [
      'دسترسی نامحدود به تمام برنامه‌های تمرینی',
      'کتابخانه کامل تمرینات',
      'پیگیری دقیق پیشرفت',
      'برنامه‌ریزی هفتگی پیشرفته',
      'امکان خرید برنامه‌های غذایی به صورت جداگانه',
      'امکان خرید برنامه‌های مکمل به صورت جداگانه'
    ]
  },
  ultimate: {
    name: 'ultimate',
    price: {
      monthly: 199000,
      yearly: 1990000
    },
    features: [
      'دسترسی نامحدود به تمام برنامه‌های تمرینی',
      'دسترسی نامحدود به تمام برنامه‌های غذایی',
      'دسترسی نامحدود به تمام برنامه‌های مکمل',
      'مربی هوش مصنوعی اختصاصی',
      'برنامه‌ریزی پیشرفته تمرینات',
      'پشتیبانی ویژه ۲۴ ساعته'
    ]
  }
};