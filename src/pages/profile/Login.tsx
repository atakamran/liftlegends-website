import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginState = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // User is already logged in, redirect to dashboard
          navigate('/');
        }
      }
    };
    
    checkLoginState();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Set login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      // Dispatch a custom event to notify header component
      window.dispatchEvent(new CustomEvent('userLoggedIn', { 
        detail: { user: data.user }
      }));
      
      toast({
        title: "ورود موفقیت‌آمیز",
        description: "با موفقیت وارد شدید.",
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "خطا در ورود",
        description: error instanceof Error ? error.message : "مشکلی در ورود به حساب رخ داد.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: data.user.id,
            email: formData.email,
          });

        if (profileError) throw profileError;
      }

      // Set login state in localStorage if auto-confirmed
      if (data.session) {
        localStorage.setItem('isLoggedIn', 'true');
        
        // Dispatch a custom event to notify header component
        window.dispatchEvent(new CustomEvent('userLoggedIn', { 
          detail: { user: data.user }
        }));
        
        // Redirect to dashboard if auto-confirmed
        navigate('/');
      }

      toast({
        title: "ثبت‌نام موفقیت‌آمیز",
        description: "حساب کاربری شما با موفقیت ایجاد شد. لطفاً ایمیل خود را برای تأیید حساب بررسی کنید.",
      });
      
      // If not auto-confirmed, switch to login tab
      if (!data.session) {
        setAuthMode("login");
      }
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "خطا در ثبت‌نام",
        description: error instanceof Error ? error.message : "مشکلی در ایجاد حساب کاربری رخ داد.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black dir-rtl">
        <div className="w-full max-w-md mx-auto">
          <div className="w-full mx-auto space-y-6 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl p-5 sm:p-8 shadow-2xl text-right form-container">
          <div>
            <div className="flex justify-center">
              <img 
                src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" 
                alt="LiftLegends Logo" 
                className="h-16 w-auto"
                loading="eager"
                width="160"
                height="80"
              />
            </div>
            <h2 className="mt-6 text-center text-2xl font-extrabold text-white">
              حساب کاربری
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              برای استفاده از امکانات ویژه وارد حساب کاربری خود شوید
            </p>
          </div>
          
          <Tabs defaultValue={authMode} className="w-full" onValueChange={(value) => setAuthMode(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50 p-1 rounded-lg">
              <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">ورود</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">ثبت‌نام</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">ایمیل</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="ایمیل خود را وارد کنید"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">رمز عبور</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "در حال ورود..." : "ورود"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Button 
                      variant="link" 
                      className="text-sm text-gray-400 hover:text-gold-500"
                      onClick={() => navigate('/reset-password')}
                    >
                      رمز عبور خود را فراموش کرده‌اید؟
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">ایمیل</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="ایمیل خود را وارد کنید"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">رمز عبور</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              با ورود یا ثبت‌نام، شما 
              <Link to="/terms-of-use" className="text-gold-500 hover:text-gold-400 mx-1">شرایط و قوانین</Link>
              و
              <Link to="/privacy-policy" className="text-gold-500 hover:text-gold-400 mx-1">سیاست حفظ حریم خصوصی</Link>
              ما را می‌پذیرید.
            </p>
          </div>
          </div>
        </div>
      </div>
  );
};

export default Login;