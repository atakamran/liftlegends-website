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
  
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://wagixhjktcodkdkgtgdj.supabase.co/auth/v1/callback',
        },
      });
      
      if (error) throw error;
      
      // The user will be redirected to Google for authentication
      // After successful authentication, they will be redirected back to the callback URL
      
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "خطا در ورود با گوگل",
        description: error instanceof Error ? error.message : "مشکلی در ورود با حساب گوگل رخ داد.",
      });
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black dir-rtl">
        <div className="container mx-auto px-4 py-2">
          <div className="max-w-md w-full mx-auto space-y-8 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 shadow-2xl text-right">
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
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-gray-900 px-2 text-gray-400">یا</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={handleGoogleLogin}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    <span>ورود با گوگل</span>
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
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-gray-900 px-2 text-gray-400">یا</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  <span>ثبت‌نام با گوگل</span>
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