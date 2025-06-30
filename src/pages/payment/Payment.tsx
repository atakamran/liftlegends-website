import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { 
  Loader2, 
  CreditCard, 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  Check,
  AlertCircle,
  CheckCircle2,
  ShoppingCart
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
    name: string | null;
    phoneNumber: string | null;
  };
}

interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'training' | 'diet' | 'supplement';
  image_url: string | null;
}

interface PaymentData {
  plan_id?: SubscriptionPlan;
  amount: number;
  period?: 'monthly' | 'yearly';
  payment_method: string;
  user_id: string;
  timestamp: string;
  program_id?: string; // For program purchases
}

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // Get plan and cycle from URL parameters (for subscription)
  const planParam = searchParams.get('plan') as SubscriptionPlan | null;
  const cycleParam = searchParams.get('cycle') as 'monthly' | 'yearly' | null;
  
  // Get program ID from URL parameters (for program purchase)
  const programParam = searchParams.get('program');

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setPageLoading(true);
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        // Save current URL for redirect after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        navigate('/login');
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
      
      // Set phone number from profile if available
      if (profileData?.phoneNumber) {
        setPhoneNumber(profileData.phoneNumber);
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        variant: "default",
        title: "⚠️ مشکل در بارگذاری",
        description: "لطفاً صفحه را رفرش کنید و دوباره تلاش کنید.",
        className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
      });
    } finally {
      if (!programParam) {
        setPageLoading(false);
      }
    }
  };
  
  // Function to fetch program details
  const fetchProgramDetails = async (programId: string) => {
    try {
      // Fetch program details from Supabase
      const { data, error } = await supabase
        .from("programs_sale")
        .select("*")
        .eq("id", programId)
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          variant: "default",
          title: "❓ محصول یافت نشد",
          description: "محصول مورد نظر موجود نیست. به صفحه محصولات هدایت می‌شوید.",
          className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
        });
        navigate("/programs");
        return;
      }

      // Map program data
      const programData: Program = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: data.image_url,
      };
      
      setProgram(programData);
      setFinalPrice(programData.price);
    } catch (error) {
      console.error("Error fetching program details:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری",
        description: "مشکلی در دریافت اطلاعات محصول رخ داد.",
      });
      navigate("/programs");
    } finally {
      setPageLoading(false);
    }
  };

  // Function to apply discount code
  const applyDiscount = async () => {
    if (!discount.trim() || (!program && !planParam)) return;
    
    try {
      // Check if discount code is valid
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", discount.trim())
        .eq("is_active", true)
        .single();
      
      if (error || !data) {
        toast({
          variant: "destructive",
          title: "کد تخفیف نامعتبر",
          description: "کد تخفیف وارد شده معتبر نیست یا منقضی شده است.",
        });
        return;
      }
      
      // Check if discount is applicable to this program/plan
      if (program && data.program_id && data.program_id !== program.id) {
        toast({
          variant: "default",
          title: "⚠️ کد تخفیف نامعتبر",
          description: "این کد تخفیف برای محصول انتخابی شما قابل استفاده نیست. لطفاً کد صحیح را وارد کنید.",
          className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
        });
        return;
      }
      
      // Calculate discount amount
      let discountValue = 0;
      let originalPrice = 0;
      
      if (program) {
        originalPrice = program.price;
      } else if (planParam && cycleParam) {
        originalPrice = cycleParam === 'monthly' 
          ? SUBSCRIPTION_PLANS[planParam].price.monthly 
          : SUBSCRIPTION_PLANS[planParam].price.yearly;
      }
      
      if (data.discount_type === 'percentage') {
        discountValue = Math.round((originalPrice * data.discount_value) / 100);
      } else {
        discountValue = data.discount_value;
      }
      
      // Apply discount
      setDiscountAmount(discountValue);
      setFinalPrice(originalPrice - discountValue);
      setDiscountApplied(true);
      
      toast({
        title: "کد تخفیف اعمال شد",
        description: `تخفیف ${new Intl.NumberFormat('fa-IR').format(discountValue)} تومان به سبد خرید شما اعمال شد.`,
      });
    } catch (error) {
      console.error("Error applying discount:", error);
      toast({
        variant: "default",
        title: "⚠️ مشکلی پیش آمده",
        description: "در حال حاضر امکان بررسی کد تخفیف وجود ندارد. لطفاً دوباره تلاش کنید.",
        className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
      });
    }
  };

  // Initialize component
  useEffect(() => {
    // Check if we have a program ID or subscription plan
    if (programParam) {
      // Program purchase flow
      fetchUserData();
      fetchProgramDetails(programParam);
    } else if (planParam && cycleParam) {
      // Subscription purchase flow
      fetchUserData();
      
      // Set initial price for subscription
      const amount = cycleParam === 'monthly' 
        ? SUBSCRIPTION_PLANS[planParam].price.monthly 
        : SUBSCRIPTION_PLANS[planParam].price.yearly;
      setFinalPrice(amount);
    } else {
      // Invalid parameters
      toast({
        variant: "destructive",
        title: "خطا در پارامترهای صفحه",
        description: "اطلاعات پرداخت ناقص است. لطفاً دوباره تلاش کنید.",
      });
      navigate('/subscription');
    }
  }, [programParam, planParam, cycleParam]);

  // Function to proceed to payment
  const proceedToPayment = async () => {
    if ((!planParam && !program) || !user) {
      toast({
        variant: "destructive",
        title: "خطا در پرداخت",
        description: "اطلاعات پرداخت ناقص است. لطفاً دوباره تلاش کنید.",
      });
      return;
    }
    
    // Validate phone number for program purchases
    if (program && !phoneNumber.trim()) {
      toast({
        variant: "destructive",
        title: "شماره تماس الزامی است",
        description: "لطفاً شماره تماس خود را وارد کنید.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      let amount = 0;
      let description = "";
      let paymentData: PaymentData;
      
      if (program) {
        // Program purchase flow
        amount = finalPrice;
        description = `خرید ${program.title} - LiftLegends`;
        
        // Create payment data for program purchase
        paymentData = {
          amount: amount,
          payment_method: 'zarinpal',
          user_id: user.id,
          program_id: program.id,
          timestamp: new Date().toISOString()
        };
        
        // Create order in database
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            program_id: program.id,
            amount: finalPrice,
            discount_amount: discountAmount,
            status: 'pending',
            phone_number: phoneNumber,
            discount_code: discountApplied ? discount : null
          })
          .select()
          .single();
        
        if (orderError) throw orderError;
      } else {
        // Subscription purchase flow
        amount = finalPrice > 0 ? finalPrice : 
          (cycleParam === 'monthly' ? SUBSCRIPTION_PLANS[planParam!].price.monthly : SUBSCRIPTION_PLANS[planParam!].price.yearly);
        
        const planName = planParam === 'pro' 
          ? 'پرو' 
          : planParam === 'ultimate' 
            ? 'آلتیمیت' 
            : 'رایگان';
        
        const periodName = cycleParam === 'monthly' ? 'ماهانه' : 'سالانه';
        description = `اشتراک ${periodName} ${planName} - LiftLegends`;
        
        // Create payment data for subscription
        paymentData = {
          plan_id: planParam,
          amount: amount,
          period: cycleParam,
          payment_method: 'zarinpal',
          user_id: user.id,
          timestamp: new Date().toISOString()
        };
      }
      
      // Store payment info in localStorage for verification after callback
      localStorage.setItem('payment_info', JSON.stringify(paymentData));
      
      toast({
        title: "انتقال به درگاه پرداخت",
        description: "در حال اتصال به درگاه پرداخت زرین‌پال...",
      });
      
      // Prepare data for Zarinpal API
      const data = {
        merchant_id: "57fda6d5-c1e1-4325-8d2a-4bd5e18a1f6b",
        amount: amount.toString(),
        description: description,
        metadata: {
          user_id: user.id,
          email: user.email || "",
          ...(program ? { program_id: program.id } : { 
            plan_id: planParam,
            plan_period: cycleParam,
            plan_duration: cycleParam === 'monthly' ? "1" : "12"
          })
        },
        callback_url: window.location.origin + "/payment-callback"
      };
      
      try {
        // Use relative URL to work on any domain
        const response = await axios.post('/api/zarinpal/payment-request', data);
        
        if (response.data.data && response.data.data.authority) {
          // Add authority to payment info and update localStorage
          const updatedPaymentInfo = {
            ...paymentData,
            authority: response.data.data.authority
          };
          localStorage.setItem('payment_info', JSON.stringify(updatedPaymentInfo));
          
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
        variant: "default",
        title: "💳 مشکل در پرداخت",
        description: "لطفاً چند دقیقه دیگر دوباره تلاش کنید. در صورت تکرار مشکل، با پشتیبانی تماس بگیرید.",
        className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
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

  // Format price with Persian numerals and Toman
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
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

  // If parameters are missing, show error
  if ((!planParam || !cycleParam) && !program) {
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
            <p className="mb-6">لطفاً دوباره از صفحه مربوطه اقدام کنید.</p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => navigate('/subscription')}
                className="w-full"
              >
                بازگشت به صفحه اشتراک‌ها
              </Button>
              <Button 
                onClick={() => navigate('/programs')}
                variant="outline"
                className="w-full border-gray-700"
              >
                بازگشت به صفحه محصولات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render different content based on payment type
  if (program) {
    // Program purchase UI
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 mb-4">
              تکمیل خرید
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              تکمیل فرآیند خرید محصول و پرداخت
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white">اطلاعات پرداخت</CardTitle>
                  <CardDescription className="text-gray-400">
                    لطفاً اطلاعات زیر را تکمیل کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      ایمیل
                    </label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-800 border-gray-700 text-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      این ایمیل برای ارسال اطلاعات محصول استفاده خواهد شد.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      شماره تماس <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="09123456789"
                      className="bg-gray-800 border-gray-700 text-white"
                      dir="ltr"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      شماره تماس برای پیگیری سفارش استفاده می‌شود.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                      کد تخفیف
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="کد تخفیف خود را وارد کنید"
                        className="bg-gray-800 border-gray-700 text-white"
                        disabled={discountApplied}
                      />
                      <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800 text-white"
                        onClick={applyDiscount}
                        disabled={discountApplied || !discount.trim()}
                      >
                        اعمال
                      </Button>
                    </div>
                    {discountApplied && (
                      <div className="flex items-center text-green-500 text-sm mt-2">
                        <CheckCircle2 className="h-4 w-4 ml-1" />
                        <span>کد تخفیف اعمال شد: {formatPrice(discountAmount)} تخفیف</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    onClick={proceedToPayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="ml-2 h-4 w-4" />
                        پرداخت {formatPrice(finalPrice)}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                      {program.image_url ? (
                        <img 
                          src={program.image_url} 
                          alt={program.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">بدون تصویر</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{program.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-1">{program.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>قیمت محصول:</span>
                      <span>{formatPrice(program.price)}</span>
                    </div>
                    
                    {discountApplied && (
                      <div className="flex justify-between text-green-500 mb-2">
                        <span>تخفیف:</span>
                        <span>- {formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-white font-bold text-lg mt-4 pt-4 border-t border-gray-800">
                      <span>مبلغ قابل پرداخت:</span>
                      <span className="text-gold-500">{formatPrice(finalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4 bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="text-blue-400 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-medium mb-1">اطلاعات پرداخت</h4>
                    <p className="text-gray-300 text-sm">پس از تکمیل پرداخت، دسترسی به محصول به صورت خودکار برای شما فعال خواهد شد و می‌توانید از طریق داشبورد خود به آن دسترسی داشته باشید.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Subscription purchase UI
  const planDetails = getPlanDetails();
  const subscriptionDates = getSubscriptionDates();
  const amount = cycleParam === 'monthly' 
    ? SUBSCRIPTION_PLANS[planParam!].price.monthly 
    : SUBSCRIPTION_PLANS[planParam!].price.yearly;

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