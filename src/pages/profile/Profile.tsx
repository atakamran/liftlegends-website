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
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-[250px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-white">پروفایل کاربری</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Badge variant={getSubscriptionBadgeVariant()} className="px-3 py-1">
              {getSubscriptionStatus()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="md:col-span-1">
            <Card className="bg-gray-900/90 border-gray-800 text-white shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">اطلاعات کاربر</CardTitle>
                <CardDescription className="text-gray-400">مشخصات حساب کاربری شما</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center py-4">
                  <Avatar className="h-24 w-24 mb-4 border-2 border-gold-500">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gray-800 text-gold-500 text-xl">
                      {getInitials(profileData?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-medium">{profileData?.name || "کاربر"}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">عضویت از</span>
                    <span className="text-sm">{formatDate(user.created_at)}</span>
                  </div>
                  
                  {profileData?.subscription_plan && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">نوع اشتراک</span>
                        <span className="text-sm">{profileData.subscription_plan}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">تاریخ شروع</span>
                        <span className="text-sm">{formatDate(profileData.subscription_start_date)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">تاریخ پایان</span>
                        <span className="text-sm">{formatDate(profileData.subscription_end_date)}</span>
                      </div>
                    </>
                  )}
                  
                  {profileData?.is_coach && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">وضعیت</span>
                      <Badge variant="outline" className="bg-gold-500/10 text-gold-500 border-gold-500/20">مربی</Badge>
                    </div>
                  )}
                  
                  {profileData?.is_admin && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">دسترسی</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">ادمین</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Edit Tabs */}
          <div className="md:col-span-2">
            <Card className="bg-gray-900/90 border-gray-800 text-white shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">ویرایش پروفایل</CardTitle>
                <CardDescription className="text-gray-400">اطلاعات پروفایل خود را به‌روزرسانی کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 p-1 rounded-lg mb-6">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                      اطلاعات شخصی
                    </TabsTrigger>
                    <TabsTrigger value="fitness" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                      اطلاعات تناسب اندام
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">نام و نام خانوادگی</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">شماره تلفن</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="age">سن</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">جنسیت</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="انتخاب جنسیت" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="male">مرد</SelectItem>
                            <SelectItem value="female">زن</SelectItem>
                            <SelectItem value="other">سایر</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="fitness" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">قد (سانتی‌متر)</Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentWeight">وزن فعلی (کیلوگرم)</Label>
                        <Input
                          id="currentWeight"
                          name="currentWeight"
                          type="number"
                          value={formData.currentWeight}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="targetWeight">وزن هدف (کیلوگرم)</Label>
                        <Input
                          id="targetWeight"
                          name="targetWeight"
                          type="number"
                          value={formData.targetWeight}
                          onChange={handleInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="goal" className="block mb-3 text-base">هدف تناسب اندام</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* کاهش وزن */}
                          <div 
                            className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
                              formData.goal === "lose" 
                                ? "border-gold-500 bg-gold-500/10" 
                                : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                            }`}
                            onClick={() => handleSelectChange("goal", "lose")}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                formData.goal === "lose" 
                                  ? "bg-gold-500 text-black" 
                                  : "bg-gray-700 text-gray-300"
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m19 14-7-7-7 7"/>
                                  <path d="M12 21V7"/>
                                </svg>
                              </div>
                              <h3 className={`font-bold text-base ${
                                formData.goal === "lose" ? "text-gold-500" : "text-white"
                              }`}>کاهش وزن</h3>
                              <p className="text-xs mt-1 text-gray-400">Lose</p>
                            </div>
                            {formData.goal === "lose" && (
                              <div className="absolute top-2 right-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                                  <path d="M20 6 9 17l-5-5"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* افزایش عضله */}
                          <div 
                            className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
                              formData.goal === "gain" 
                                ? "border-gold-500 bg-gold-500/10" 
                                : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                            }`}
                            onClick={() => handleSelectChange("goal", "gain")}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                formData.goal === "gain" 
                                  ? "bg-gold-500 text-black" 
                                  : "bg-gray-700 text-gray-300"
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 3v4"/>
                                  <path d="M19 21v-4"/>
                                  <path d="M5 7h14"/>
                                  <path d="M5 17h14"/>
                                </svg>
                              </div>
                              <h3 className={`font-bold text-base ${
                                formData.goal === "gain" ? "text-gold-500" : "text-white"
                              }`}>افزایش عضله</h3>
                              <p className="text-xs mt-1 text-gray-400">Gain</p>
                            </div>
                            {formData.goal === "gain" && (
                              <div className="absolute top-2 right-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                                  <path d="M20 6 9 17l-5-5"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* حفظ وضعیت */}
                          <div 
                            className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
                              formData.goal === "maintenance" 
                                ? "border-gold-500 bg-gold-500/10" 
                                : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                            }`}
                            onClick={() => handleSelectChange("goal", "maintenance")}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                formData.goal === "maintenance" 
                                  ? "bg-gold-500 text-black" 
                                  : "bg-gray-700 text-gray-300"
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                                  <path d="M16 3v3a2 2 0 0 0 2 2h3"/>
                                  <path d="M8 21v-3a2 2 0 0 0-2-2H3"/>
                                  <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                                </svg>
                              </div>
                              <h3 className={`font-bold text-base ${
                                formData.goal === "maintenance" ? "text-gold-500" : "text-white"
                              }`}>حفظ وضعیت</h3>
                              <p className="text-xs mt-1 text-gray-400">Maintenance</p>
                            </div>
                            {formData.goal === "maintenance" && (
                              <div className="absolute top-2 right-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                                  <path d="M20 6 9 17l-5-5"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <input type="hidden" name="goal" value={formData.goal} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium"
                >
                  {updating ? "در حال به‌روزرسانی..." : "ذخیره تغییرات"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;