import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Loader2, 
  CreditCard, 
  Shield, 
  Zap, 
  Award,
  Check,
  Clock,
  Calendar
} from "lucide-react";
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  email: string;
  profile?: {
    subscription_plan: string | null;
    subscription_end_date: string | null;
  };
}

interface PlanOption {
  id: SubscriptionPlan;
  title: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  color: string;
  icon: React.ReactNode;
}

const Subscription = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setPageLoading(true);
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate('/login?redirect=/subscription');
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
    fetchUserData();
  }, []);

  // Function to handle plan selection
  const handlePlanSelect = (planId: SubscriptionPlan) => {
    // Redirect to payment page with plan and cycle parameters
    navigate(`/payment?plan=${planId}&cycle=${selectedCycle}`);
  };

  // Function to handle cycle selection
  const handleCycleChange = (cycle: 'monthly' | 'yearly') => {
    setSelectedCycle(cycle);
  };

  // Plan options
  const planOptions: PlanOption[] = [
    {
      id: 'basic',
      title: 'پایه',
      description: 'برای شروع تمرینات',
      price: SUBSCRIPTION_PLANS.basic.price,
      features: [
        'برنامه تمرینی پایه',
        'دسترسی به کتابخانه تمرین‌های محدود',
        'ثبت پیشرفت تمرینی پایه'
      ],
      color: 'blue',
      icon: <Shield className="h-6 w-6 text-blue-400" />
    },
    {
      id: 'pro',
      title: 'حرفه‌ای',
      description: 'برای ورزشکاران جدی',
      price: SUBSCRIPTION_PLANS.pro.price,
      features: [
        'تمام امکانات اشتراک پایه',
        'برنامه غذایی پیشرفته',
        'مشاوره مکمل',
        'برنامه‌ریزی هفتگی پیشرفته'
      ],
      popular: true,
      color: 'gold',
      icon: <Zap className="h-6 w-6 text-amber-400" />
    },
    {
      id: 'ultimate',
      title: 'نامحدود',
      description: 'برای قهرمانان',
      price: SUBSCRIPTION_PLANS.ultimate.price,
      features: [
        'تمام امکانات اشتراک حرفه‌ای',
        'مشاوره اختصاصی با مربی',
        'برنامه تمرینی شخصی‌سازی شده',
        'پشتیبانی ویژه',
        'آنالیز پیشرفته عملکرد'
      ],
      color: 'purple',
      icon: <Award className="h-6 w-6 text-purple-400" />
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 mb-4">
            اشتراک‌های LiftLegends
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            با اشتراک‌های ما به دنیای بی‌نظیر تمرینات حرفه‌ای و برنامه‌های تغذیه اختصاصی دسترسی پیدا کنید
          </p>
        </div>

        {/* Billing Cycle Selector */}
        <div className="flex justify-center mb-10">
          <Tabs 
            defaultValue="monthly" 
            value={selectedCycle}
            onValueChange={(value) => handleCycleChange(value as 'monthly' | 'yearly')}
            className="w-full max-w-md"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700 p-1">
              <TabsTrigger 
                value="monthly" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-500 data-[state=active]:text-black"
              >
                <Clock size={16} className="ml-2" />
                پرداخت ماهانه
              </TabsTrigger>
              <TabsTrigger 
                value="yearly" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-500 data-[state=active]:text-black"
              >
                <Calendar size={16} className="ml-2" />
                پرداخت سالانه
                <Badge variant="outline" className="mr-2 bg-amber-500/10 text-amber-400 border-amber-500/30">
                  20% تخفیف
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planOptions.map((plan) => (
            <div key={plan.id} className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-${plan.color}-500/20 to-${plan.color === 'gold' ? 'amber' : plan.color}-600/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500`}></div>
              <div className={`relative bg-gray-900 rounded-2xl overflow-hidden border border-${plan.color}-500/30 transition-all duration-300 group-hover:border-${plan.color}-400/50 group-hover:translate-y-[-5px] group-hover:shadow-[0_10px_40px_rgba(${plan.color === 'gold' ? '234,179,8' : plan.color === 'blue' ? '59,130,246' : '168,85,247'},0.3)]`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-500 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    پیشنهاد ویژه
                  </div>
                )}
                <div className={`h-1.5 w-full bg-gradient-to-r from-${plan.color}-500 to-${plan.color === 'gold' ? 'amber' : plan.color}-600`}></div>
                <div className={`p-6 ${plan.popular ? 'pb-8' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{plan.title}</h3>
                      <p className={`text-${plan.color === 'gold' ? 'amber' : plan.color}-400 text-sm font-medium`}>{plan.description}</p>
                    </div>
                    <div className={`bg-${plan.color === 'gold' ? 'amber' : plan.color}-500/10 p-2 rounded-full`}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-white">
                      {selectedCycle === 'monthly' 
                        ? plan.price.monthly.toLocaleString('fa-IR') 
                        : plan.price.yearly.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-gray-400 mr-2">تومان</span>
                    <span className="text-gray-500 mr-1 text-sm">
                      / {selectedCycle === 'monthly' ? 'ماهانه' : 'سالانه'}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`bg-${plan.color === 'gold' ? 'amber' : plan.color}-500/20 p-1 rounded-full ml-2 mt-1`}>
                          <Check size={12} className={`text-${plan.color === 'gold' ? 'amber' : plan.color}-400`} />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={user?.profile?.subscription_plan === plan.id}
                    className={`w-full bg-gradient-to-r from-${plan.color}-500 to-${plan.color === 'gold' ? 'amber' : plan.color}-600 hover:from-${plan.color}-600 hover:to-${plan.color === 'gold' ? 'amber' : plan.color}-700 ${plan.color !== 'gold' ? 'text-white' : 'text-black'} py-3 rounded-xl transition-all duration-300 shadow-lg shadow-${plan.color}-500/20 hover:shadow-${plan.color}-500/40`}
                  >
                    {user?.profile?.subscription_plan === plan.id ? (
                      <span className="flex items-center justify-center">
                        <Shield size={18} className="ml-2" />
                        اشتراک فعال
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CreditCard size={18} className="ml-2" />
                        انتخاب این طرح
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-12">چرا LiftLegends را انتخاب کنید؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="bg-blue-500/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">برنامه‌های تمرینی حرفه‌ای</h3>
              <p className="text-gray-400">برنامه‌های تمرینی طراحی شده توسط مربیان حرفه‌ای برای رسیدن به اهداف شما</p>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="bg-amber-500/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">برنامه‌های تغذیه اختصاصی</h3>
              <p className="text-gray-400">برنامه‌های غذایی متناسب با اهداف و نیازهای شما برای دستیابی به نتایج بهتر</p>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="bg-purple-500/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">پشتیبانی ویژه</h3>
              <p className="text-gray-400">دسترسی به مربیان حرفه‌ای و پشتیبانی ۲۴/۷ برای پاسخگویی به سوالات شما</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;