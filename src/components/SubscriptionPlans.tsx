import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from "@/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Shield, CreditCard, Zap, Check } from "lucide-react";

interface SubscriptionPlansProps {
  currentPlan: string | null;
  subscriptionEndDate: string | null;
  onSubscribe: (planId: SubscriptionPlan, amount: number, period: 'monthly' | 'semiannual' | 'yearly', paymentMethod: string) => void;
  loading: string | null;
  renderSubscriptionStatus?: (plan: string, endDate: string | null) => React.ReactNode;
  redirectToExternalApp?: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  currentPlan,
  subscriptionEndDate,
  onSubscribe,
  loading,
  renderSubscriptionStatus,
  redirectToExternalApp = false,
}) => {
  // Function to generate payment links for external apps
  const getPaymentLink = (planId: SubscriptionPlan, amount: number, period: 'monthly' | 'semiannual' | 'yearly') => {
    const baseUrl = window.location.origin;
    const paymentData = {
      plan_id: planId,
      amount: amount,
      period: period,
      payment_method: 'zarinpal',
      timestamp: new Date().toISOString()
    };
    
    // Create a URL with query parameters for external app
    const queryParams = new URLSearchParams();
    queryParams.append('data', JSON.stringify(paymentData));
    
    return `${baseUrl}/payment?${queryParams.toString()}`;
  };

  // Handle subscription button click
  const handleSubscriptionClick = (planId: SubscriptionPlan, amount: number, period: 'monthly' | 'semiannual' | 'yearly') => {
    if (redirectToExternalApp) {
      // Generate payment link and copy to clipboard
      const paymentLink = getPaymentLink(planId, amount, period);
      navigator.clipboard.writeText(paymentLink)
        .then(() => {
          toast({
            title: "لینک پرداخت کپی شد",
            description: "لینک پرداخت با موفقیت در کلیپ‌بورد کپی شد.",
          });
        })
        .catch(err => {
          console.error('Failed to copy payment link: ', err);
          toast({
            variant: "destructive",
            title: "خطا در کپی لینک",
            description: "لطفاً به صورت دستی لینک را کپی کنید.",
          });
        });
    } else {
      // Process subscription normally
      onSubscribe(planId, amount, period, 'zarinpal');
    }
  };

  return (
    <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 border-gray-700 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">اشتراک‌های LiftLegends</CardTitle>
        <CardDescription className="text-gray-300">
          با خرید اشتراک به تمامی امکانات پیشرفته دسترسی پیدا کنید
        </CardDescription>
        <div className="mt-4 p-2 bg-gray-800/70 rounded-lg border border-gray-700 flex items-center">
          <div className="p-1.5 rounded-full mr-2 bg-gold-500/20">
            <CreditCard className="h-4 w-4 text-gold-500" />
          </div>
          <span className="text-sm text-gray-300">
            درگاه پرداخت: <span className="font-medium text-gold-500">زرین‌پال</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-blue-500/30 transition-all duration-300 group-hover:border-blue-400/50 group-hover:translate-y-[-5px] group-hover:shadow-[0_10px_40px_rgba(59,130,246,0.3)]">
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Basic</h3>
                    <p className="text-blue-400 text-sm font-medium">رایگان</p>
                  </div>
                  <div className="bg-blue-500/10 p-2 rounded-full">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                
                <div className="flex items-center text-gray-400 mb-6">
                  <span className="text-3xl font-bold text-white">0</span>
                  <span className="ml-2">دسترسی محدود</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="bg-blue-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-blue-400" />
                    </div>
                    <span className="text-gray-300">برنامه تمرینی پایه</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-blue-400" />
                    </div>
                    <span className="text-gray-300">دسترسی به کتابخانه تمرین‌های محدود</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-blue-400" />
                    </div>
                    <span className="text-gray-300">ثبت پیشرفت تمرینی پایه</span>
                  </li>
                </ul>
                
                <Button
                  onClick={() => handleSubscriptionClick("basic", 0, 'monthly')}
                  disabled={loading === "basic-monthly" || currentPlan === "basic" || currentPlan === "pro" || currentPlan === "ultimate"}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  {loading === "basic-monthly" ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      در حال پردازش...
                    </span>
                  ) : currentPlan === "basic" ? (
                    <span className="flex items-center justify-center">
                      <Shield size={18} className="ml-2" />
                      اشتراک فعال
                    </span>
                  ) : currentPlan === "pro" || currentPlan === "ultimate" ? (
                    <span className="flex items-center justify-center">
                      <Shield size={18} className="ml-2" />
                      اشتراک بالاتر فعال است
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <CreditCard size={18} className="ml-2" />
                      فعال‌سازی رایگان
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gold-500/30 transition-all duration-300 group-hover:border-gold-400/50 group-hover:translate-y-[-5px] group-hover:shadow-[0_10px_40px_rgba(234,179,8,0.3)]">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-500 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                پیشنهاد ویژه
              </div>
              <div className="h-1.5 w-full bg-gradient-to-r from-gold-500 to-amber-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                    <p className="text-amber-400 text-sm font-medium">پیشنهاد محبوب</p>
                  </div>
                  <div className="bg-amber-500/10 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-amber-400" />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-6 mb-6">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-400">اشتراک ماهانه</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{SUBSCRIPTION_PLANS.pro.price.monthly.toLocaleString('fa-IR')}</span>
                      <span className="text-gray-400 mr-2">تومان</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-400">اشتراک سالانه</span>
                      <span className="mr-2 text-xs bg-gradient-to-r from-gold-500 to-amber-500 text-black px-2 py-0.5 rounded-full">20% تخفیف</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{SUBSCRIPTION_PLANS.pro.price.yearly.toLocaleString('fa-IR')}</span>
                      <span className="text-gray-400 mr-2">تومان</span>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="bg-amber-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-amber-400" />
                    </div>
                    <span className="text-gray-300">تمام امکانات اشتراک پایه</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-amber-400" />
                    </div>
                    <span className="text-gray-300">برنامه غذایی پیشرفته</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-amber-400" />
                    </div>
                    <span className="text-gray-300">مشاوره مکمل</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-amber-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-amber-400" />
                    </div>
                    <span className="text-gray-300">برنامه‌ریزی هفتگی پیشرفته</span>
                  </li>
                </ul>
                
                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => handleSubscriptionClick("pro", SUBSCRIPTION_PLANS.pro.price.monthly, 'monthly')}
                    disabled={loading === "pro-monthly" || currentPlan === "pro" || currentPlan === "ultimate"}
                    className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-medium py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                  >
                    {loading === "pro-monthly" ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        در حال پردازش...
                      </span>
                    ) : currentPlan === "pro" && renderSubscriptionStatus ? (
                      renderSubscriptionStatus("pro", subscriptionEndDate)
                    ) : currentPlan === "ultimate" ? (
                      <span className="flex items-center justify-center">
                        <Shield size={18} className="ml-2" />
                        اشتراک بالاتر فعال است
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CreditCard size={18} className="ml-2" />
                        اشتراک ماهانه
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleSubscriptionClick("pro", SUBSCRIPTION_PLANS.pro.price.yearly, 'yearly')}
                    disabled={loading === "pro-yearly" || currentPlan === "pro" || currentPlan === "ultimate"}
                    className="w-full bg-gradient-to-r from-amber-400 to-gold-500 hover:from-amber-500 hover:to-gold-600 text-black font-medium py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                  >
                    {loading === "pro-yearly" ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        در حال پردازش...
                      </span>
                    ) : currentPlan === "pro" ? (
                      <span className="flex items-center justify-center">
                        <Shield size={18} className="ml-2" />
                        اشتراک فعال
                      </span>
                    ) : currentPlan === "ultimate" ? (
                      <span className="flex items-center justify-center">
                        <Shield size={18} className="ml-2" />
                        اشتراک بالاتر فعال است
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CreditCard size={18} className="ml-2" />
                        اشتراک سالانه (با تخفیف)
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ultimate Plan */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-purple-500/30 transition-all duration-300 group-hover:border-purple-400/50 group-hover:translate-y-[-5px] group-hover:shadow-[0_10px_40px_rgba(168,85,247,0.3)]">
              <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Ultimate</h3>
                    <p className="text-purple-400 text-sm font-medium">تجربه حرفه‌ای</p>
                  </div>
                  <div className="bg-purple-500/10 p-2 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-6 mb-6">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-400">اشتراک ماهانه</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{SUBSCRIPTION_PLANS.ultimate.price.monthly.toLocaleString('fa-IR')}</span>
                      <span className="text-gray-400 mr-2">تومان</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-400">اشتراک سالانه</span>
                      <span className="mr-2 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full">20% تخفیف</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">{SUBSCRIPTION_PLANS.ultimate.price.yearly.toLocaleString('fa-IR')}</span>
                      <span className="text-gray-400 mr-2">تومان</span>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="bg-purple-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-purple-400" />
                    </div>
                    <span className="text-gray-300">تمام امکانات اشتراک Pro</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-purple-400" />
                    </div>
                    <span className="text-gray-300">برنامه استرویید شخصی‌سازی شده</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-purple-400" />
                    </div>
                    <span className="text-gray-300">مشاوره تخصصی تغذیه</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-500/20 p-1 rounded-full ml-2 mt-1">
                      <Check size={12} className="text-purple-400" />
                    </div>
                    <span className="text-gray-300">برنامه‌های تمرینی ویژه</span>
                  </li>
                </ul>
                
                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => handleSubscriptionClick("ultimate", SUBSCRIPTION_PLANS.ultimate.price.monthly, 'monthly')}
                    disabled={loading === "ultimate-monthly" || currentPlan === "ultimate"}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                  >
                    {loading === "ultimate-monthly" ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        در حال پردازش...
                      </span>
                    ) : currentPlan === "ultimate" && renderSubscriptionStatus ? (
                      renderSubscriptionStatus("ultimate", subscriptionEndDate)
                    ) : (
                      <span className="flex items-center justify-center">
                        <CreditCard size={18} className="ml-2" />
                        اشتراک ماهانه
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleSubscriptionClick("ultimate", SUBSCRIPTION_PLANS.ultimate.price.yearly, 'yearly')}
                    disabled={loading === "ultimate-yearly" || currentPlan === "ultimate"}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                  >
                    {loading === "ultimate-yearly" ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        در حال پردازش...
                      </span>
                    ) : currentPlan === "ultimate" ? (
                      <span className="flex items-center justify-center">
                        <Shield size={18} className="ml-2" />
                        اشتراک فعال
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CreditCard size={18} className="ml-2" />
                        اشتراک سالانه (با تخفیف)
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-gold-500 to-amber-500 p-2 rounded-full mr-4">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <h4 className="text-white font-medium">پرداخت امن و مطمئن</h4>
                <p className="text-gray-400 text-sm">پرداخت از طریق درگاه امن زرین‌پال انجام می‌شود</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-gold-500 to-amber-500 p-2 rounded-full mr-4">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <div>
                <h4 className="text-white font-medium">فعال‌سازی آنی</h4>
                <p className="text-gray-400 text-sm">پس از تکمیل پرداخت، اشتراک شما بلافاصله فعال خواهد شد</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlans;