import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { setRedirectUrl } from "@/utils/redirectUtils";
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

interface Bundle {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_percentage: number | null;
  image_url: string | null;
  is_active: boolean;
  is_legend: boolean;
  created_at: string | null;
  updated_at: string | null;
  bundle_items: {
    program_id: string;
    program_title: string;
    program_category: 'training' | 'diet' | 'supplement';
    program_price: number;
  }[];
}

interface PaymentData {
  plan_id?: SubscriptionPlan;
  amount: number;
  period?: 'monthly' | 'yearly';
  payment_method: string;
  user_id: string;
  timestamp: string;
  program_id?: string; // For program purchases
  bundle_id?: string; // For bundle purchases
}

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [bundle, setBundle] = useState<Bundle | null>(null);
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
  
  // Get bundle ID from URL parameters (for bundle purchase)
  const bundleParam = searchParams.get('bundle');

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setPageLoading(true);
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        // Save current URL for redirect after login
        setRedirectUrl();
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
      // Only set loading to false if we're not fetching program or bundle details
      // The program/bundle fetch functions will handle setting pageLoading to false
      if (!programParam && !bundleParam) {
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

  // Function to fetch bundle details
  const fetchBundleDetails = async (bundleId: string) => {
    console.log('Fetching bundle details for ID:', bundleId);
    try {
      // Fetch bundle details from Supabase using the bundle_details view
      const { data, error } = await supabase
        .from("bundle_details")
        .select("*")
        .eq("id", bundleId)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error('Bundle fetch error:', error);
        throw error;
      }

      console.log('Bundle data received:', data);

      if (!data) {
        console.log('No bundle data found');
        toast({
          variant: "default",
          title: "⚠️ پک یافت نشد",
          description: "پک مورد نظر یافت نشد یا غیرفعال است.",
          className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
        });
        navigate("/legends");
        return;
      }

      // Map bundle data
      const bundleData: Bundle = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        discount_percentage: data.discount_percentage,
        image_url: data.image_url,
        is_active: data.is_active,
        is_legend: data.is_legend,
        created_at: data.created_at,
        updated_at: data.updated_at,
        bundle_items: data.bundle_items || [],
      };
      
      console.log('Bundle data mapped:', bundleData);
      setBundle(bundleData);
      setFinalPrice(bundleData.price);
      console.log('Bundle state set successfully');
    } catch (error) {
      console.error("Error fetching bundle details:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری",
        description: "مشکلی در دریافت اطلاعات پک رخ داد.",
      });
      navigate("/legends");
    } finally {
      setPageLoading(false);
    }
  };

  // Function to apply discount code
  const applyDiscount = async () => {
    if (!discount.trim() || (!program && !bundle && !planParam)) return;
    
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
      
      // Check if discount is applicable to this program/bundle/plan
      if (program && data.program_id && data.program_id !== program.id) {
        toast({
          variant: "default",
          title: "⚠️ کد تخفیف نامعتبر",
          description: "این کد تخفیف برای محصول انتخابی شما قابل استفاده نیست. لطفاً کد صحیح را وارد کنید.",
          className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
        });
        return;
      }
      
      if (bundle && data.bundle_id && data.bundle_id !== bundle.id) {
        toast({
          variant: "default",
          title: "⚠️ کد تخفیف نامعتبر",
          description: "این کد تخفیف برای پک انتخابی شما قابل استفاده نیست. لطفاً کد صحیح را وارد کنید.",
          className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
        });
        return;
      }
      
      // Calculate discount amount
      let discountValue = 0;
      let originalPrice = 0;
      
      if (program) {
        originalPrice = program.price;
      } else if (bundle) {
        originalPrice = bundle.price;
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
    console.log('Payment useEffect - Parameters:', { programParam, bundleParam, planParam, cycleParam });
    
    // Check if we have a program ID, bundle ID, or subscription plan
    if (programParam) {
      // Program purchase flow
      console.log('Starting program fetch...');
      fetchUserData();
      fetchProgramDetails(programParam);
    } else if (bundleParam) {
      // Bundle purchase flow
      console.log('Starting bundle fetch...');
      fetchUserData();
      fetchBundleDetails(bundleParam);
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
      console.log('Invalid payment parameters:', { programParam, bundleParam, planParam, cycleParam });
      toast({
        variant: "destructive",
        title: "خطا در پارامترهای صفحه",
        description: "اطلاعات پرداخت ناقص است. لطفاً دوباره تلاش کنید.",
      });
      // Redirect based on what type of purchase was attempted
      if (window.location.search.includes('bundle')) {
        navigate('/legends');
      } else if (window.location.search.includes('program')) {
        navigate('/programs');
      } else {
        navigate('/subscription');
      }
    }
  }, [programParam, bundleParam, planParam, cycleParam]);

  // Function to handle free product
  const handleFreeProduct = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      if (program) {
        // Add free program to user's purchases
        const { error: purchaseError } = await supabase
          .from("user_purchases")
          .insert({
            user_id: user.id,
            program_id: program.id,
            amount: 0,
            payment_status: 'completed',
            purchase_date: new Date().toISOString(),
          });
        
        if (purchaseError) throw purchaseError;
        
        // Create order record for tracking
        const { error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            program_id: program.id,
            amount: 0,
            discount_amount: discountAmount,
            status: 'completed',
            phone_number: phoneNumber,
            discount_code: discountApplied ? discount : null
          });
        
        if (orderError) throw orderError;
        
        toast({
          title: "✅ محصول رایگان اضافه شد",
          description: "محصول با موفقیت به داشبورد شما اضافه شد.",
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/profile?tab=purchases');
        }, 2000);
        
      } else if (bundle) {
        // Add free bundle to user's purchases
        const { data: purchaseData, error: purchaseError } = await supabase
          .from("user_purchases")
          .insert({
            user_id: user.id,
            amount: 0,
            payment_status: 'completed',
            purchase_date: new Date().toISOString(),
            program_id: null
          })
          .select()
          .single();

        if (purchaseError) throw purchaseError;
        
        toast({
          title: "✅ پک رایگان اضافه شد",
          description: "پک با موفقیت به داشبورد شما اضافه شد.",
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/profile?tab=purchases');
        }, 2000);
      }
      
    } catch (error) {
      console.error("Error adding free product:", error);
      toast({
        variant: "destructive",
        title: "خطا در اضافه کردن محصول",
        description: "مشکلی در اضافه کردن محصول رایگان رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to proceed to payment
  const proceedToPayment = async () => {
    if ((!planParam && !program && !bundle) || !user) {
      toast({
        variant: "destructive",
        title: "خطا در پرداخت",
        description: "اطلاعات پرداخت ناقص است. لطفاً دوباره تلاش کنید.",
      });
      return;
    }
    
    // Validate phone number for program and bundle purchases
    if ((program || bundle) && !phoneNumber.trim()) {
      toast({
        variant: "destructive",
        title: "شماره تماس الزامی است",
        description: "لطفاً شماره تماس خود را وارد کنید.",
      });
      return;
    }
    
    // Check if product is free
    if ((program && finalPrice === 0) || (bundle && finalPrice === 0)) {
      await handleFreeProduct();
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
      } else if (bundle) {
        // Bundle purchase flow
        amount = finalPrice;
        description = `خرید پک ${bundle.title} - LiftLegends`;
        
        // Create payment data for bundle purchase
        paymentData = {
          amount: amount,
          payment_method: 'zarinpal',
          user_id: user.id,
          bundle_id: bundle.id,
          timestamp: new Date().toISOString()
        };
        
        // For bundle purchases, we'll store the order information differently
        // since the orders table is designed for individual programs only
        // We'll create a record in user_purchases table instead
        const { data: purchaseData, error: purchaseError } = await supabase
          .from("user_purchases")
          .insert({
            user_id: user.id,
            amount: finalPrice,
            payment_status: 'pending',
            purchase_date: new Date().toISOString(),
            // Note: program_id is optional in user_purchases, so we can leave it null for bundles
            program_id: null
          })
          .select()
          .single();

        if (purchaseError) throw purchaseError;
        
        // Store bundle information in localStorage for payment verification
        localStorage.setItem('bundle_purchase_info', JSON.stringify({
          bundle_id: bundle.id,
          purchase_id: purchaseData.id,
          phone_number: phoneNumber,
          discount_code: discountApplied ? discount : null,
          discount_amount: discountAmount
        }));
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
          window.location.href = `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`;
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-foreground">در حال بارگذاری...</span>
      </div>
    );
  }

  // If parameters are missing, show error
  if ((!planParam || !cycleParam) && !program && !bundle) {
    return (
      <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="bg-gradient-to-b from-secondary/80 to-background/90 border-border shadow-xl max-w-md w-full">
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
                className="w-full"
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
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-300 to-primary mb-4">
              تکمیل خرید
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              تکمیل فرآیند خرید محصول و پرداخت
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">اطلاعات پرداخت</CardTitle>
                  <CardDescription>
                    لطفاً اطلاعات زیر را تکمیل کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      ایمیل
                    </label>
                    <Input
                      value={user?.email || ""}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      این ایمیل برای ارسال اطلاعات محصول استفاده خواهد شد.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      شماره تماس <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="09123456789"
                      dir="ltr"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      شماره تماس برای پیگیری سفارش استفاده می‌شود.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      کد تخفیف
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="کد تخفیف خود را وارد کنید"
                        disabled={discountApplied}
                      />
                      <Button
                        variant="outline"
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
                    className="w-full"
                    onClick={proceedToPayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        در حال پردازش...
                      </>
                    ) : finalPrice === 0 ? (
                      <>
                        <CheckCircle className="ml-2 h-4 w-4" />
                        دریافت رایگان
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                      {program.image_url ? (
                        <img 
                          src={program.image_url} 
                          alt={program.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">بدون تصویر</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">{program.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-1">{program.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-muted-foreground mb-2">
                      <span>قیمت محصول:</span>
                      <span>{formatPrice(program.price)}</span>
                    </div>
                    
                    {discountApplied && (
                      <div className="flex justify-between text-green-500 mb-2">
                        <span>تخفیف:</span>
                        <span>- {formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-foreground font-bold text-lg mt-4 pt-4 border-t border-border">
                      <span>مبلغ قابل پرداخت:</span>
                      <span className="text-primary">{formatPrice(finalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="text-accent mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  </div>
                  <div>
                    <h4 className="text-accent font-medium mb-1">اطلاعات پرداخت</h4>
                    <p className="text-muted-foreground text-sm">پس از تکمیل پرداخت، دسترسی به محصول به صورت خودکار برای شما فعال خواهد شد و می‌توانید از طریق داشبورد خود به آن دسترسی داشته باشید.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bundle purchase UI
  if (bundle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-300 to-primary mb-4">
              تکمیل خرید پک
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              در حال خرید پک {bundle.title}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Bundle Details */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-b from-secondary/80 to-background/90 border-border shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-bold">جزئیات پک</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    {bundle.image_url && (
                      <img 
                        src={bundle.image_url} 
                        alt={bundle.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground">{bundle.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{bundle.description}</p>
                    </div>
                  </div>

                  {/* Bundle Items */}
                  {bundle.bundle_items && bundle.bundle_items.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">محصولات شامل:</h4>
                      <div className="space-y-2">
                        {bundle.bundle_items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-foreground">{item.program_title}</span>
                              <Badge variant="secondary">
                                {item.program_category === 'training' ? 'تمرین' : 
                                 item.program_category === 'diet' ? 'رژیم' : 'مکمل'}
                              </Badge>
                            </div>
                            <span className="text-muted-foreground text-sm">
                              {formatPrice(item.program_price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />
                  
                  {/* Price Summary */}
                  <div className="space-y-3">
                    {bundle.discount_percentage && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">قیمت اصلی:</span>
                        <span className="text-muted-foreground line-through">
                          {formatPrice(Math.round(bundle.price / (1 - bundle.discount_percentage / 100)))}
                        </span>
                      </div>
                    )}
                    
                    {discountApplied && (
                      <div className="flex justify-between items-center text-green-500">
                        <span>تخفیف کد:</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>مبلغ نهایی:</span>
                      <span className="text-primary">{formatPrice(finalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-b from-secondary/80 to-background/90 border-border shadow-xl">
                <CardHeader>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-bold">اطلاعات پرداخت</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      ایمیل
                    </label>
                    <Input
                      value={user?.email || ""}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      این ایمیل برای ارسال اطلاعات پک استفاده خواهد شد.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      شماره تماس <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="09123456789"
                      dir="ltr"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      شماره تماس برای پیگیری سفارش استفاده می‌شود.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      کد تخفیف
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="کد تخفیف خود را وارد کنید"
                        disabled={discountApplied}
                      />
                      <Button
                        variant="outline"
                        onClick={applyDiscount}
                        disabled={discountApplied || !discount.trim()}
                      >
                        اعمال
                      </Button>
                    </div>
                    {discountApplied && (
                      <div className="flex items-center text-green-500 text-sm mt-2">
                        <CheckCircle2 className="h-4 w-4 ml-1" />
                        کد تخفیف با موفقیت اعمال شد
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={proceedToPayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-yellow-600 hover:from-primary/90 hover:to-yellow-600/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        در حال پردازش...
                      </>
                    ) : finalPrice === 0 ? (
                      <>
                        <CheckCircle className="ml-2 h-4 w-4" />
                        دریافت رایگان
                      </>
                    ) : (
                      <>
                        پرداخت {formatPrice(finalPrice)}
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-medium mb-1">اطلاعات پرداخت</h4>
                    <p className="text-muted-foreground text-sm">پس از تکمیل پرداخت، دسترسی به تمام محصولات پک به صورت خودکار برای شما فعال خواهد شد و می‌توانید از طریق داشبورد خود به آن‌ها دسترسی داشته باشید.</p>
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-300 to-primary mb-4">
            پرداخت اشتراک
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            تکمیل فرآیند خرید اشتراک و پرداخت
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-b from-secondary/80 to-background/90 border-border shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-yellow-500"></div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">خلاصه سفارش</CardTitle>
                <CardDescription>جزئیات اشتراک انتخابی شما</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary/50 p-5 rounded-xl border border-border">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold mr-2">
                        {planDetails?.title}
                      </h3>
                    </div>
                    <div className="flex items-baseline mb-1">
                      <span className="text-2xl font-bold">
                        {amount.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-muted-foreground mr-2">تومان</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      دوره: {cycleParam === 'monthly' ? 'ماهانه' : 'سالانه'}
                      {cycleParam === 'yearly' && (
                        <Badge variant="outline" className="mr-2 bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                          20% تخفیف
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-5 rounded-xl border border-border">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold mr-2">تاریخ اشتراک</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاریخ شروع:</span>
                        <span className="font-medium">{subscriptionDates.start}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاریخ پایان:</span>
                        <span className="font-medium">{subscriptionDates.end}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/50 p-5 rounded-xl border border-border">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold mr-2">ویژگی‌های اشتراک</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {planDetails?.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full ml-2 mt-1">
                          <Check size={12} className="text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  onClick={() => navigate('/subscription')}
                  variant="outline" 
                  className="w-full"
                >
                  <ArrowRight size={18} className="ml-2" />
                  بازگشت به انتخاب اشتراک
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Payment Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-b from-secondary/80 to-background/90 border-border shadow-xl overflow-hidden sticky top-8">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">پرداخت</CardTitle>
                <CardDescription>تکمیل فرآیند خرید اشتراک</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-secondary/50 p-5 rounded-xl border border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">مبلغ قابل پرداخت:</span>
                    <span className="text-xl font-bold">
                      {amount.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center mb-2">
                      <CreditCard size={18} className="ml-2 text-green-500" />
                      <span className="text-muted-foreground">پرداخت از طریق درگاه زرین‌پال</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
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