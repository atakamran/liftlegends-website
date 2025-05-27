import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, CreditCard, ArrowRight, Shield } from "lucide-react";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { SubscriptionPlan } from "@/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  period: 'monthly' | 'semiannual' | 'yearly';
  payment_method: string;
  user_id: string;
  timestamp: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

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

  // Parse payment data from URL if available
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam) as PaymentData;
        
        // Validate that the parsed data has the required fields
        if (!parsedData.amount || !parsedData.user_id) {
          throw new Error("Invalid payment data structure");
        }
        
        setPaymentData(parsedData);
      } catch (error) {
        console.error("Error parsing payment data:", error);
        toast({
          variant: "destructive",
          title: "خطا در پردازش اطلاعات پرداخت",
          description: "داده‌های پرداخت نامعتبر است.",
        });
      }
    }
    
    fetchUserData();
  }, [searchParams]);

  // Function to handle subscription
  const handleSubscription = async (planId: SubscriptionPlan, amount: number, period: 'monthly' | 'semiannual' | 'yearly', paymentMethod: string) => {
    try {
      const loadingKey = `${planId}-${period}`;
      setLoading(loadingKey);
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "خطا در پرداخت",
          description: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
        });
        return;
      }
      
      // Create payment data
      const data: PaymentData = {
        plan_id: planId,
        amount: amount,
        period: period,
        payment_method: 'zarinpal',
        user_id: user.id,
        timestamp: new Date().toISOString()
      };
      
      // Store payment info in localStorage for verification after callback
      localStorage.setItem('payment_info', JSON.stringify(data));
      
      // Update payment data
      setPaymentData(data);
      
      toast({
        title: "اطلاعات پرداخت ایجاد شد",
        description: "اطلاعات پرداخت با موفقیت ایجاد شد.",
      });
      
    } catch (error) {
      console.error("Error creating payment data:", error);
      toast({
        variant: "destructive",
        title: "خطا در ایجاد اطلاعات پرداخت",
        description: "مشکلی در ایجاد اطلاعات پرداخت رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(null);
    }
  };

  // Function to render subscription status
  const renderSubscriptionStatus = (plan: string, endDate: string | null) => {
    return (
      <span className="flex items-center justify-center">
        <Shield size={18} className="ml-2" />
        اشتراک فعال
      </span>
    );
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

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">صفحه پرداخت</h1>
        
        {paymentData ? (
          <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 border-gray-700 shadow-xl mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">اطلاعات پرداخت</CardTitle>
              <CardDescription className="text-gray-300">
                جزئیات پرداخت
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CreditCard size={18} className="ml-2 text-gold-500" />
                      <span className="text-gray-300">مبلغ قابل پرداخت:</span>
                    </div>
                    <p className="text-white font-medium text-lg">{paymentData.amount.toLocaleString('fa-IR')} تومان</p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CreditCard size={18} className="ml-2 text-gold-500" />
                      <span className="text-gray-300">روش پرداخت:</span>
                    </div>
                    <p className="text-white font-medium text-lg">زرین‌پال</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-700 hover:bg-gray-800 text-white py-6 rounded-xl"
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowRight size={18} className="ml-2" />
                    بازگشت به داشبورد
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-8">
            <p className="text-center text-gray-300 mb-6">
              لطفاً یکی از اشتراک‌های زیر را انتخاب کنید.
            </p>
          </div>
        )}
        
        {/* Subscription Plans Component */}
        <SubscriptionPlans 
          currentPlan={user?.profile?.subscription_plan || null}
          subscriptionEndDate={user?.profile?.subscription_end_date || null}
          onSubscribe={handleSubscription}
          loading={loading}
          renderSubscriptionStatus={renderSubscriptionStatus}
          redirectToExternalApp={true}
        />
      </div>
    </div>
  );
};

export default Payment;