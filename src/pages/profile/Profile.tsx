import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProfileSkeleton from "@/components/ui/profile-skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, Crown, User, Mail, Phone, Target, Weight, Ruler, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    goal: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Check if user is logged in via localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
          navigate('/');
          return;
        }

        // Get current session
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          localStorage.setItem('isLoggedIn', 'false');
          navigate('/');
          return;
        }

        // Set user data
        setUser(data.session.user as User);

        // Fetch user profile
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", data.session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (profile) {
          setProfileData(profile);
          setFormData({
            name: profile.name || "",
            age: profile.age?.toString() || "",
            gender: profile.gender || "",
            height: profile.height?.toString() || "",
            currentWeight: profile.currentWeight?.toString() || "",
            targetWeight: profile.targetWeight?.toString() || "",
            goal: profile.goal || "",
            phoneNumber: profile.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          name: formData.name || null,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null,
          height: formData.height ? parseFloat(formData.height) : null,
          currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : null,
          targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
          goal: formData.goal || null,
          phoneNumber: formData.phoneNumber || null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          name: formData.name || null,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null,
          height: formData.height ? parseFloat(formData.height) : null,
          currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : null,
          targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
          goal: formData.goal || null,
          phoneNumber: formData.phoneNumber || null,
          updated_at: new Date().toISOString(),
        });
      }

      toast({
        title: "پروفایل به‌روزرسانی شد",
        description: "اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد.",
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "خطا در به‌روزرسانی",
        description: error instanceof Error ? error.message : "مشکلی در به‌روزرسانی پروفایل رخ داد.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const getInitials = (name: string | null) => {
    if (!name) return user?.email?.substring(0, 2).toUpperCase() || "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "تعیین نشده";
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const formatDateWithTime = (dateString: string | null) => {
    if (!dateString) return {
      date: "تعیین نشده",
      time: "تعیین نشده",
      relative: "تعیین نشده"
    };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fa-IR'),
      time: date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays > 0) {
      if (diffInDays === 1) return "فردا";
      if (diffInDays < 7) return `${diffInDays} روز دیگر`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} هفته دیگر`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ماه دیگر`;
      return `${Math.floor(diffInDays / 365)} سال دیگر`;
    } else {
      const absDays = Math.abs(diffInDays);
      if (absDays === 0) return "امروز";
      if (absDays === 1) return "دیروز";
      if (absDays < 7) return `${absDays} روز پیش`;
      if (absDays < 30) return `${Math.floor(absDays / 7)} هفته پیش`;
      if (absDays < 365) return `${Math.floor(absDays / 30)} ماه پیش`;
      return `${Math.floor(absDays / 365)} سال پیش`;
    }
  };

  const getSubscriptionProgress = () => {
    if (!profileData?.subscription_start_date || !profileData?.subscription_end_date) return 0;
    
    const startDate = new Date(profileData.subscription_start_date);
    const endDate = new Date(profileData.subscription_end_date);
    const now = new Date();
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    return Math.round(progress);
  };

  const getRemainingDays = () => {
    if (!profileData?.subscription_end_date) return 0;
    
    const endDate = new Date(profileData.subscription_end_date);
    const now = new Date();
    const diffInDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffInDays);
  };

  const getSubscriptionStatus = () => {
    if (!profileData?.subscription_plan) return "بدون اشتراک";
    if (!profileData?.subscription_end_date) return "نامشخص";
    
    const endDate = new Date(profileData.subscription_end_date);
    const now = new Date();
    
    if (endDate < now) return "منقضی شده";
    return "فعال";
  };

  const getSubscriptionBadgeVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    const status = getSubscriptionStatus();
    if (status === "فعال") return "default"; // Changed from "success" to "default"
    if (status === "منقضی شده") return "destructive";
    return "secondary";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <h1 className="text-4xl lg:text-5xl font-light text-white">پروفایل کاربری</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0 rtl:space-x-reverse">
            <Badge 
              variant={getSubscriptionBadgeVariant()} 
              className="px-4 py-2 text-sm backdrop-blur-sm border-0"
            >
              {getSubscriptionStatus()}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-800/50 p-8 space-y-8">
              {/* User Avatar & Basic Info */}
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <Avatar className="h-32 w-32 border-4 border-gold-500/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-gold-500 to-amber-400 text-black text-2xl font-light">
                      {getInitials(profileData?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-950 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-light text-white">
                    {profileData?.name || "کاربر"}
                  </h2>
                  <p className="text-gray-400 flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </p>
                </div>
              </div>

              {/* User Stats */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-800/30 rounded-2xl">
                    <div className="text-2xl font-light text-gold-400">
                      {profileData?.currentWeight || '--'}
                    </div>
                    <div className="text-sm text-gray-400">وزن فعلی</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-2xl">
                    <div className="text-2xl font-light text-gold-400">
                      {profileData?.targetWeight || '--'}
                    </div>
                    <div className="text-sm text-gray-400">وزن هدف</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">عضویت از</span>
                    </div>
                    <span className="text-white font-light">{formatDate(user.created_at)}</span>
                  </div>
                  
                  {profileData?.is_coach && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Crown className="w-4 h-4 text-gold-400" />
                        <span className="text-gray-400">وضعیت</span>
                      </div>
                      <Badge className="bg-gold-500/10 text-gold-400 border-gold-500/20">مربی</Badge>
                    </div>
                  )}
                  
                  {profileData?.is_admin && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">دسترسی</span>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">ادمین</Badge>
                    </div>
                  )}
                </div>

                {/* Subscription Section */}
                {profileData?.subscription_plan && (
                  <div className="bg-gradient-to-br from-gold-500/10 to-amber-400/5 rounded-2xl p-6 border border-gold-500/20">
                    <div className="flex items-center space-x-3 mb-4 rtl:space-x-reverse">
                      <Crown className="w-6 h-6 text-gold-400" />
                      <div>
                        <h3 className="text-lg font-light text-gold-400">
                          اشتراک {profileData.subscription_plan}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {getSubscriptionStatus() === "فعال" ? "فعال و در حال استفاده" : getSubscriptionStatus()}
                        </p>
                      </div>
                    </div>

                    {getSubscriptionStatus() === "فعال" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">پیشرفت اشتراک</span>
                          <span className="text-gold-400 font-light">{getSubscriptionProgress()}%</span>
                        </div>
                        <Progress 
                          value={getSubscriptionProgress()} 
                          className="h-2 bg-gray-800/50"
                        />
                        <div className="flex items-center justify-center text-sm text-gold-400">
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{getRemainingDays()} روز باقی‌مانده</span>
                        </div>
                      </div>
                    )}

                    {/* Alerts */}
                    {getSubscriptionStatus() === "منقضی شده" && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-400">
                            اشتراک منقضی شده - تمدید کنید
                          </span>
                        </div>
                      </div>
                    )}

                    {getSubscriptionStatus() === "فعال" && getRemainingDays() <= 7 && (
                      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-sm text-amber-400">
                            اشتراک به زودی منقضی می‌شود
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-800/50 p-8 space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-light text-white">ویرایش پروفایل</h2>
                <p className="text-gray-400">اطلاعات پروفایل خود را به‌روزرسانی کنید</p>
              </div>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800/30 p-2 rounded-2xl mb-8 border border-gray-700/50">
                  <TabsTrigger 
                    value="personal" 
                    className="data-[state=active]:bg-gold-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-light"
                  >
                    <User className="w-4 h-4 ml-2" />
                    اطلاعات شخصی
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fitness" 
                    className="data-[state=active]:bg-gold-500 data-[state=active]:text-black data-[state=active]:shadow-lg rounded-xl transition-all duration-300 font-light"
                  >
                    <Target className="w-4 h-4 ml-2" />
                    اطلاعات تناسب اندام
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white font-light flex items-center space-x-2 rtl:space-x-reverse">
                        <User className="w-4 h-4" />
                        <span>نام و نام خانوادگی</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700/50 text-white rounded-xl h-12 focus:border-gold-500 transition-colors duration-300"
                        placeholder="نام کامل خود را وارد کنید"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="phoneNumber" className="text-white font-light flex items-center space-x-2 rtl:space-x-reverse">
                        <Phone className="w-4 h-4" />
                        <span>شماره تلفن</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700/50 text-white rounded-xl h-12 focus:border-gold-500 transition-colors duration-300"
                        placeholder="09123456789"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="age" className="text-white font-light">سن</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700/50 text-white rounded-xl h-12 focus:border-gold-500 transition-colors duration-300"
                        placeholder="25"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="gender" className="text-white font-light">جنسیت</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white rounded-xl h-12 focus:border-gold-500">
                          <SelectValue placeholder="انتخاب جنسیت" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white rounded-xl">
                          <SelectItem value="male">مرد</SelectItem>
                          <SelectItem value="female">زن</SelectItem>
                          <SelectItem value="other">سایر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fitness" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="height" className="text-white font-light flex items-center space-x-2 rtl:space-x-reverse">
                        <Ruler className="w-4 h-4" />
                        <span>قد (سانتی‌متر)</span>
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700/50 text-white rounded-xl h-12 focus:border-gold-500 transition-colors duration-300"
                        placeholder="175"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="currentWeight" className="text-white font-light flex items-center space-x-2 rtl:space-x-reverse">
                        <Weight className="w-4 h-4" />
                        <span>وزن فعلی (کیلوگرم)</span>
                      </Label>
                      <Input
                        id="currentWeight"
                        name="currentWeight"
                        type="number"
                        value={formData.currentWeight}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700/50 text-white rounded-xl h-12 focus:border-gold-500 transition-colors duration-300"
                        placeholder="70"
                      />
                    </div>
                    
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="targetWeight" className="text-white font-light flex items-center space-x-2 rtl:space-x-reverse">
                        <Target className="w-4 h-4" />
                        <span>وزن هدف (کیلوگرم)</span>
                      </Label>
                      <Input
                        id="targetWeight"
                        name="targetWeight"
                        type="number"
                        value={formData.targetWeight}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700/50 text-white rounded-xl h-12 focus:border-gold-500 transition-colors duration-300"
                        placeholder="65"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <Label className="text-white font-light text-lg">هدف تناسب اندام</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* کاهش وزن */}
                      <div 
                        className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-500 border-2 group hover:scale-105 ${
                          formData.goal === "lose" 
                            ? "border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/20" 
                            : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
                        }`}
                        onClick={() => handleSelectChange("goal", "lose")}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                            formData.goal === "lose" 
                              ? "bg-gold-500 text-black" 
                              : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                          }`}>
                            <TrendingUp className="w-8 h-8 rotate-180" />
                          </div>
                          <div>
                            <h3 className={`font-light text-lg ${
                              formData.goal === "lose" ? "text-gold-400" : "text-white"
                            }`}>کاهش وزن</h3>
                            <p className="text-sm text-gray-400 mt-1">Weight Loss</p>
                          </div>
                        </div>
                        {formData.goal === "lose" && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-5 h-5 text-gold-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* افزایش عضله */}
                      <div 
                        className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-500 border-2 group hover:scale-105 ${
                          formData.goal === "gain" 
                            ? "border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/20" 
                            : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
                        }`}
                        onClick={() => handleSelectChange("goal", "gain")}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                            formData.goal === "gain" 
                              ? "bg-gold-500 text-black" 
                              : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                          }`}>
                            <TrendingUp className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className={`font-light text-lg ${
                              formData.goal === "gain" ? "text-gold-400" : "text-white"
                            }`}>افزایش عضله</h3>
                            <p className="text-sm text-gray-400 mt-1">Muscle Gain</p>
                          </div>
                        </div>
                        {formData.goal === "gain" && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-5 h-5 text-gold-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* حفظ وضعیت */}
                      <div 
                        className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-500 border-2 group hover:scale-105 ${
                          formData.goal === "maintenance" 
                            ? "border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/20" 
                            : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
                        }`}
                        onClick={() => handleSelectChange("goal", "maintenance")}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                            formData.goal === "maintenance" 
                              ? "bg-gold-500 text-black" 
                              : "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                          }`}>
                            <Target className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className={`font-light text-lg ${
                              formData.goal === "maintenance" ? "text-gold-400" : "text-white"
                            }`}>حفظ وضعیت</h3>
                            <p className="text-sm text-gray-400 mt-1">Maintenance</p>
                          </div>
                        </div>
                        {formData.goal === "maintenance" && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-5 h-5 text-gold-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Save Button */}
              <div className="flex justify-end pt-8">
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="bg-gold-500 hover:bg-gold-400 text-black px-8 py-3 rounded-2xl font-light text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>در حال ذخیره...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Save className="w-5 h-5" />
                      <span>ذخیره تغییرات</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;