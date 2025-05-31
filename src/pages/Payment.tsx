import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { 
  Loader2, 
  CreditCard, 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  Check
} from "lucide-react";
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from "@/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  email: string;
  profile?: {
    subscription_plan: string | null;
    subscription_end_date: string | null;
  };
}

interface PaymentData {
  plan_id: SubscriptionPlan;
  amount: number;
  period: 'monthly' | 'yearly';
  payment_method: string;
  user_id: string;
  timestamp: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Get plan and cycle from URL parameters
  const planParam = searchParams.get('plan') as SubscriptionPlan | null;
  const cycleParam = searchParams.get('cycle') as 'monthly' | 'yearly' | null;

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setPageLoading(true);
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate('/login?redirect=/payment');
        return;
      }
      
      // Get user data
      const userData = sessionData.session.user;
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userData.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      // Set user data with profile
      setUser({
        ...userData,
        profile: profileData || undefined
      } as User);
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری اطلاعات",
        description: "مشکلی در دریافت اطلاعات کاربری رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setPageLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    // Validate URL parameters
    if (!planParam || !cycleParam) {
      toast({
        variant: "destructive",
        title: "خطا در پارامترهای صفحه",
        description: "اطلاعات پرداخت ناقص است. لطفاً دوباره از صفحه اشتراک‌ها اقدام کنید.",
      });
      navigate('/subscription');
      return;
    }
    
    fetchUserData();
  }, [planParam, cycleParam]);

  // Function to proceed to payment
  const proceedToPayment = async () => {
    if (!planParam || !user) {
      toast({
        variant: "destructive",
        title: "خطا در پرداخت",
        description: "اطلاعات پرداخت ناقص است. لطفاً دوباره تلاش کنید.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Calculate amount based on subscription plan and cycle
      const amount = cycleParam === 'monthly' 
        ? SUBSCRIPTION_PLANS[planParam].price.monthly 
        : SUBSCRIPTION_PLANS[planParam].price.yearly;
        
      // Create payment data for our records
      const paymentData: PaymentData = {
        plan_id: planParam,
        amount: amount,
        period: cycleParam,
        payment_method: 'zarinpal',
        user_id: user.id,
        timestamp: new Date().toISOString()
      };
      
      // Store payment info in localStorage for verification after callback
      localStorage.setItem('payment_info', JSON.stringify(paymentData));
      
      toast({
        title: "انتقال به درگاه پرداخت",
        description: "در حال اتصال به درگاه پرداخت زرین‌پال...",
      });
      
      // Prepare data for Zarinpal API
      const zarinpalData = JSON.stringify({
        "merchant_id": "89999bca-a25d-4ada-9846-62ec13a250b1",
        "amount": amount.toString(),
        "description": `اشتراک ${planParam} - ${cycleParam === 'monthly' ? 'ماهانه' : 'سالانه'}`,
        "metadata": {
          "user_id": user.id,
          "plan": planParam,
          "cycle": cycleParam
        },
        "callback_url": "https://liftlegends.ir/payment-callback"
      });
      
      // Prepare data for Zarinpal API
      const planName = planParam === 'pro' 
        ? 'پرو' 
        : planParam === 'ultimate' 
          ? 'آلتیمیت' 
          : 'رایگان';
      
      const periodName = cycleParam === 'monthly' ? 'ماهانه' : 'سالانه';
      const planDuration = cycleParam === 'monthly' ? "1" : "12";
      
      const data = {
        merchant_id: "89999bca-a25d-4ada-9846-62ec13a250b1",
        amount: amount.toString(),
        description: `اشتراک ${periodName} ${planName} - LiftLegends`,
        metadata: {
          user_id: user.id,
          email: user.email || "",
          plan_id: planParam,
          plan_period: cycleParam,
          plan_duration: planDuration
        },
        callback_url: window.location.origin + "/payment-callback"
      };
      
      try {
        // Use relative URL to work on any domain
        const response = await axios.post('/api/zarinpal/payment-request', data);
        
        if (response.data.data && response.data.data.authority) {
          // Store payment info in localStorage for verification after callback
          localStorage.setItem('payment_info', JSON.stringify({
            authority: response.data.data.authority,
            amount: amount,
            plan_id: planParam,
            plan_period: cycleParam,
            user_id: user.id,
            timestamp: new Date().toISOString()
          }));
          
          // Redirect to Zarinpal payment page
          window.location.href = `https://staging.zarinpal.com/pg/StartPay/${response.data.data.authority}`;
        } else {
          throw new Error(response.data.errors?.message || 'خطا در اتصال به درگاه پرداخت');
        }
      } catch (error) {
        console.error("Payment error:", error);
        throw new Error(error instanceof Error ? error.message : "مشکلی در پردازش پرداخت رخ داد");
      }
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        variant: "destructive",
        title: "خطا در پرداخت",
        description: error instanceof Error ? error.message : "مشکلی در پردازش پرداخت رخ داد. لطفاً دوباره تلاش کنید.",
      });
      setLoading(false);
    }
  };

  // Calculate subscription dates
  const getSubscriptionDates = () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (cycleParam === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Format dates in Persian format
    const formatPersianDate = (date: Date) => {
      return `۱۴۰۴/${date.getMonth() + 1}/${date.getDate()}`;
    };
    
    return {
      start: formatPersianDate(startDate),
      end: formatPersianDate(endDate)
    };
  };

  // Get plan details
  const getPlanDetails = () => {
    if (!planParam) return null;
    
    const planTitle = planParam === 'pro' 
      ? 'حرفه‌ای (Pro)' 
      : planParam === 'ultimate' 
        ? 'نامحدود (Ultimate)' 
        : 'پایه (Basic)';
        
    const planFeatures = SUBSCRIPTION_PLANS[planParam].features;
    
    return {
      title: planTitle,
      features: planFeatures
    };
  };

  // If loading, show loading spinner
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        <span className="mr-2 text-white">در حال بارگذاری...</span>
      </div>
    );
  }

  // If plan parameters are missing, show error
  if (!planParam || !cycleParam) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 border-gray-700 shadow-xl max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">خطا در بارگذاری</CardTitle>
            <CardDescription className="text-center">
              اطلاعات پرداخت ناقص است
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">لطفاً دوباره از صفحه اشتراک‌ها اقدام کنید.</p>
            <Button 
              onClick={() => navigate('/subscription')}
              className="w-full"
            >
              بازگشت به صفحه اشتراک‌ها
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planDetails = getPlanDetails();
  const subscriptionDates = getSubscriptionDates();
  const amount = cycleParam === 'monthly' 
    ? SUBSCRIPTION_PLANS[planParam].price.monthly 
    : SUBSCRIPTION_PLANS[planParam].price.yearly;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 mb-4">
            پرداخت اشتراک
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            تکمیل فرآیند خرید اشتراک و پرداخت
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 border-gray-700 shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-gold-500 to-amber-500"></div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">خلاصه سفارش</CardTitle>
                <CardDescription>جزئیات اشتراک انتخابی شما</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold mr-2">
                        {planDetails?.title}
                      </h3>
                    </div>
                    <div className="flex items-baseline mb-1">
                      <span className="text-2xl font-bold">
                        {amount.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-gray-400 mr-2">تومان</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      دوره: {cycleParam === 'monthly' ? 'ماهانه' : 'سالانه'}
                      {cycleParam === 'yearly' && (
                        <Badge variant="outline" className="mr-2 bg-amber-500/10 text-amber-400 border-amber-500/30">
                          20% تخفیف
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-5 w-5 text-gold-500" />
                      <h3 className="text-lg font-semibold mr-2">تاریخ اشتراک</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">تاریخ شروع:</span>
                        <span className="font-medium">{subscriptionDates.start}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">تاریخ پایان:</span>
                        <span className="font-medium">{subscriptionDates.end}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-gold-500" />
                    <h3 className="text-lg font-semibold mr-2">ویژگی‌های اشتراک</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {planDetails?.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-gold-500/20 p-1 rounded-full ml-2 mt-1">
                          <Check size={12} className="text-gold-400" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  onClick={() => navigate('/subscription')}
                  variant="outline" 
                  className="w-full border-gray-700 hover:bg-gray-800 text-white"
                >
                  <ArrowRight size={18} className="ml-2" />
                  بازگشت به انتخاب اشتراک
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Payment Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 border-gray-700 shadow-xl overflow-hidden sticky top-8">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">پرداخت</CardTitle>
                <CardDescription>تکمیل فرآیند خرید اشتراک</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300">مبلغ قابل پرداخت:</span>
                    <span className="text-xl font-bold">
                      {amount.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  
                  <Separator className="my-4 bg-gray-700" />
                  
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center mb-2">
                      <CreditCard size={18} className="ml-2 text-green-500" />
                      <span className="text-gray-300">پرداخت از طریق درگاه زرین‌پال</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      برای تکمیل خرید اشتراک، دکمه زیر را کلیک کنید.
                      پس از کلیک بر روی دکمه پرداخت، به درگاه امن زرین‌پال منتقل خواهید شد.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={proceedToPayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      در حال پردازش...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <CreditCard size={18} className="ml-2" />
                      پرداخت از طریق درگاه زرین‌پال
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;