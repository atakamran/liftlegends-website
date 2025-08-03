import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { setRedirectUrl } from "@/utils/redirectUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Crown,
  User,
  Mail,
  Phone,
  Target,
  Weight,
  Ruler,
  Save,
  ShoppingBag,
  BookOpen,
  Award,
  Activity,
  Zap,
  Star,
  Download,
  Settings,
  Bell,
  Heart,
} from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string | null;
  email: string | null;
  name: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  currentWeight: number | null;
  targetWeight: number | null;
  goal: string | null;
  phoneNumber: string | null;
  is_admin: boolean | null;
  is_coach: boolean | null;
  permissions: string | null;
  subscription_plan: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface User {
  id: string;
  email: string;
  phone?: string;
  app_metadata: {
    provider?: string;
    [key: string]: unknown;
  };
  user_metadata: {
    [key: string]: unknown;
  };
  aud: string;
  created_at: string;
  profile?: UserProfile;
}

interface Purchase {
  id: string;
  user_id: string;
  program_id: string | null;
  amount: number;
  payment_status: string;
  purchase_date: string;
  expires_at: string | null;
  program?: {
    title: string;
    category: string;
    description: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    activePurchases: 0,
    totalSpent: 0,
    memberSince: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      // Check if user is logged in via localStorage
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setRedirectUrl();
        navigate("/login");
        return;
      }

      // Get current session
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        localStorage.setItem("isLoggedIn", "false");
        setRedirectUrl();
        navigate("/login");
        return;
      }

      // Set user data
      setUser(data.session.user as User);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", data.session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        setProfileData(profile);
      }

      // Fetch user purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from("user_purchases")
        .select(`
          *,
          programs_sale (
            title,
            category,
            description
          )
        `)
        .eq("user_id", data.session.user.id)
        .order("purchase_date", { ascending: false });

      if (purchasesError) {
        console.error("Error fetching purchases:", purchasesError);
      } else {
        const mappedPurchases = (purchasesData || []).map(purchase => ({
          ...purchase,
          program: purchase.programs_sale ? {
            title: purchase.programs_sale.title,
            category: purchase.programs_sale.category,
            description: purchase.programs_sale.description
          } : undefined
        }));
        setPurchases(mappedPurchases);

        // Calculate stats
        const totalPurchases = mappedPurchases.length;
        const activePurchases = mappedPurchases.filter(
          (p) => p.payment_status === "completed"
        ).length;
        const totalSpent = mappedPurchases
          .filter((p) => p.payment_status === "completed")
          .reduce((sum, p) => sum + p.amount, 0);

        setStats({
          totalPurchases,
          activePurchases,
          totalSpent,
          memberSince: new Date(data.session.user.created_at).toLocaleDateString("fa-IR"),
        });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری داده‌ها",
        description: "مشکلی در دریافت اطلاعات رخ داد.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  const getSubscriptionStatus = () => {
    if (!profileData?.subscription_plan) return "بدون اشتراک";
    if (!profileData?.subscription_end_date) return "نامشخص";

    const endDate = new Date(profileData.subscription_end_date);
    const now = new Date();

    if (endDate < now) return "منقضی شده";
    return "فعال";
  };

  const getSubscriptionProgress = () => {
    if (
      !profileData?.subscription_start_date ||
      !profileData?.subscription_end_date
    )
      return 0;

    const startDate = new Date(profileData.subscription_start_date);
    const endDate = new Date(profileData.subscription_end_date);
    const now = new Date();

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();

    const progress = Math.max(
      0,
      Math.min(100, (elapsed / totalDuration) * 100)
    );
    return Math.round(progress);
  };

  const getRemainingDays = () => {
    if (!profileData?.subscription_end_date) return 0;

    const endDate = new Date(profileData.subscription_end_date);
    const now = new Date();
    const diffInDays = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(0, diffInDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setRedirectUrl();
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              داشبورد کاربری
            </h1>
            <p className="text-gray-400">
              خوش آمدید، {profileData?.name || user.email}
            </p>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse mt-4 md:mt-0">
            <Badge
              variant={getSubscriptionStatus() === "فعال" ? "default" : "secondary"}
              className="px-4 py-2"
            >
              {getSubscriptionStatus()}
            </Badge>
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
            >
              <Settings className="h-4 w-4 ml-2" />
              تنظیمات
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800/50 hover:border-gold-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">کل خریدها</p>
                  <p className="text-2xl font-bold text-white">{stats.totalPurchases}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 hover:border-gold-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">برنامه‌های فعال</p>
                  <p className="text-2xl font-bold text-white">{stats.activePurchases}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 hover:border-gold-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">کل هزینه</p>
                  <p className="text-2xl font-bold text-white">{formatPrice(stats.totalSpent)}</p>
                </div>
                <Award className="h-8 w-8 text-gold-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800/50 hover:border-gold-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">عضو از</p>
                  <p className="text-2xl font-bold text-white">{stats.memberSince}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 p-1 rounded-xl mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              خریدها
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              اشتراک
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              فعالیت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-gold-500">دسترسی سریع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => navigate("/programs")}
                    className="w-full justify-start bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30"
                    variant="outline"
                  >
                    <BookOpen className="h-4 w-4 ml-2" />
                    مشاهده برنامه‌ها
                  </Button>
                  <Button
                    onClick={() => navigate("/subscription")}
                    className="w-full justify-start bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border-gold-500/30"
                    variant="outline"
                  >
                    <Crown className="h-4 w-4 ml-2" />
                    ارتقا اشتراک
                  </Button>
                  <Button
                    onClick={() => navigate("/download")}
                    className="w-full justify-start bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 ml-2" />
                    دانلود اپلیکیشن
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-gold-500">فعالیت اخیر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {purchases.slice(0, 3).map((purchase) => (
                      <div key={purchase.id} className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            خرید {purchase.program?.title || "محصول"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(purchase.purchase_date).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {formatPrice(purchase.amount)}
                        </Badge>
                      </div>
                    ))}
                    {purchases.length === 0 && (
                      <p className="text-gray-400 text-center py-4">
                        هنوز خریدی انجام نداده‌اید
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Status */}
            {profileData?.subscription_plan && (
              <Card className="bg-gradient-to-r from-gold-500/10 to-gold-400/5 border-gold-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-gold-400">
                    <Crown className="h-5 w-5 ml-2" />
                    وضعیت اشتراک
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        اشتراک {profileData.subscription_plan}
                      </p>
                      <p className="text-sm text-gray-400">
                        {getSubscriptionStatus() === "فعال"
                          ? `${getRemainingDays()} روز باقی‌مانده`
                          : getSubscriptionStatus()}
                      </p>
                    </div>
                    <Badge
                      variant={getSubscriptionStatus() === "فعال" ? "default" : "secondary"}
                    >
                      {getSubscriptionStatus()}
                    </Badge>
                  </div>
                  {getSubscriptionStatus() === "فعال" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">پیشرفت اشتراک</span>
                        <span className="text-gold-400">{getSubscriptionProgress()}%</span>
                      </div>
                      <Progress value={getSubscriptionProgress()} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-gold-500">تاریخچه خریدها</CardTitle>
                <CardDescription>
                  لیست کامل برنامه‌ها و محصولات خریداری شده
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchases.length > 0 ? (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gold-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-gold-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {purchase.program?.title || "محصول"}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {new Date(purchase.purchase_date).toLocaleDateString("fa-IR")}
                            </p>
                            <Badge
                              variant={
                                purchase.payment_status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="mt-1"
                            >
                              {purchase.payment_status === "completed"
                                ? "تکمیل شده"
                                : "در انتظار"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold text-gold-500">
                            {formatPrice(purchase.amount)}
                          </p>
                          {purchase.expires_at && (
                            <p className="text-xs text-gray-400">
                              انقضا: {new Date(purchase.expires_at).toLocaleDateString("fa-IR")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-400 mb-2">
                      هنوز خریدی انجام نداده‌اید
                    </h3>
                    <p className="text-gray-500 mb-4">
                      برنامه‌های تمرینی و غذایی را کشف کنید
                    </p>
                    <Button
                      onClick={() => navigate("/programs")}
                      className="bg-gold-500 hover:bg-gold-600 text-black"
                    >
                      مشاهده برنامه‌ها
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            {profileData?.subscription_plan ? (
              <Card className="bg-gradient-to-r from-gold-500/10 to-gold-400/5 border-gold-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-gold-400">
                    <Crown className="h-5 w-5 ml-2" />
                    اشتراک فعلی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        اشتراک {profileData.subscription_plan}
                      </h3>
                      <p className="text-gray-400">
                        {getSubscriptionStatus() === "فعال"
                          ? `${getRemainingDays()} روز باقی‌مانده`
                          : getSubscriptionStatus()}
                      </p>
                    </div>
                    <Badge
                      variant={getSubscriptionStatus() === "فعال" ? "default" : "secondary"}
                      className="text-lg px-4 py-2"
                    >
                      {getSubscriptionStatus()}
                    </Badge>
                  </div>

                  {getSubscriptionStatus() === "فعال" && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">پیشرفت اشتراک</span>
                        <span className="text-gold-400">{getSubscriptionProgress()}%</span>
                      </div>
                      <Progress value={getSubscriptionProgress()} className="h-3" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">تاریخ شروع</p>
                          <p className="text-white">
                            {profileData.subscription_start_date
                              ? new Date(profileData.subscription_start_date).toLocaleDateString("fa-IR")
                              : "نامشخص"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">تاریخ پایان</p>
                          <p className="text-white">
                            {profileData.subscription_end_date
                              ? new Date(profileData.subscription_end_date).toLocaleDateString("fa-IR")
                              : "نامشخص"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4 space-x-reverse">
                    <Button
                      onClick={() => navigate("/subscription")}
                      className="bg-gold-500 hover:bg-gold-600 text-black"
                    >
                      مدیریت اشتراک
                    </Button>
                    {getSubscriptionStatus() !== "فعال" && (
                      <Button
                        onClick={() => navigate("/subscription")}
                        variant="outline"
                        className="border-gold-500/50 text-gold-400"
                      >
                        تمدید اشتراک
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-8 text-center">
                  <Crown className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    اشتراک فعالی ندارید
                  </h3>
                  <p className="text-gray-500 mb-6">
                    با خرید اشتراک به امکانات ویژه دسترسی پیدا کنید
                  </p>
                  <Button
                    onClick={() => navigate("/subscription")}
                    className="bg-gold-500 hover:bg-gold-600 text-black"
                  >
                    <Crown className="h-4 w-4 ml-2" />
                    مشاهده اشتراک‌ها
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-gold-500">آمار فعالیت</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{stats.totalPurchases}</h3>
                    <p className="text-gray-400">کل خریدها</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{stats.activePurchases}</h3>
                    <p className="text-gray-400">برنامه‌های فعال</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-3">
                      <Star className="h-8 w-8 text-gold-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">4.8</h3>
                    <p className="text-gray-400">امتیاز کلی</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;