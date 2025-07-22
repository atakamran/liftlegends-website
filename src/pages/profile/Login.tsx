import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { getAndClearRedirectUrl } from "@/utils/redirectUtils";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Clear password errors when switching between login and register
  const handleAuthModeChange = (mode: "login" | "register") => {
    setAuthMode(mode);
    setPasswordErrors([]);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Password validation function
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("رمز عبور باید حداقل 8 کاراکتر باشد");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("رمز عبور باید حداقل یک عدد داشته باشد");
    }
    
   
    
    return errors;
  };

  // Check if user is already logged in and handle OAuth redirects
  useEffect(() => {
    const checkLoginState = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      // Get the current session
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { user } = data.session;
        
        // User is logged in
        localStorage.setItem('isLoggedIn', 'true');
        
        // Handle Google OAuth sign-in (both first-time and returning users)
        if (user?.app_metadata?.provider === 'google') {
          // Get user's information from the Google profile
          const name = user.user_metadata?.full_name || null;
          const email = user.email;
          
          // Check if user already has a profile
          const { data: profileData, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
            
          if (profileError && !profileData) {
            // No profile exists, create a new one with Google info
            const { error: createProfileError } = await supabase
              .from("user_profiles")
              .insert({
                user_id: user.id,
                name: name,  // Set the display name from Google
                email: email, // Set the email from Google
              });
              
            if (createProfileError) {
              console.error("Error creating user profile:", createProfileError);
            }
          } else if (profileData) {
            // Profile exists, update it with the latest Google info
            // This ensures profile data stays in sync with Google account changes
            const { error: updateProfileError } = await supabase
              .from("user_profiles")
              .update({
                name: name,  // Update name from Google
                email: email, // Update email from Google
              })
              .eq("user_id", user.id);
              
            if (updateProfileError) {
              console.error("Error updating user profile:", updateProfileError);
            }
          }
        }
        
        // Dispatch a custom event to notify header component
        window.dispatchEvent(new CustomEvent('userLoggedIn', { 
          detail: { user: user }
        }));
        
        // Redirect to intended destination or home
        const redirectUrl = getAndClearRedirectUrl();
        navigate(redirectUrl || '/');
      } else if (isLoggedIn) {
        // Session expired but localStorage still shows logged in
        localStorage.removeItem('isLoggedIn');
      }
    };
    
    checkLoginState();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate password in real-time for register mode
    if (name === 'password' && authMode === 'register') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (authMode === 'login') {
        handleLogin();
      } else {
        // Only allow register if validation passes
        const passwordValidationErrors = validatePassword(formData.password);
        const passwordsMatch = formData.password === formData.confirmPassword;
        
        if (passwordValidationErrors.length === 0 && passwordsMatch && formData.confirmPassword.length > 0) {
          handleRegister();
        }
      }
    }
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
      
      // Redirect to intended destination or home
      const redirectUrl = getAndClearRedirectUrl();
      navigate(redirectUrl || '/');
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
      // Validate password
      const passwordValidationErrors = validatePassword(formData.password);
      if (passwordValidationErrors.length > 0) {
        setPasswordErrors(passwordValidationErrors);
        toast({
          variant: "destructive",
          title: "خطا در اعتبارسنجی رمز عبور",
          description: "لطفاً شرایط رمز عبور را رعایت کنید.",
        });
        setLoading(false);
        return;
      }
      
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "خطا در تایید رمز عبور",
          description: "رمز عبور و تایید آن باید یکسان باشند.",
        });
        setLoading(false);
        return;
      }
      
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
        
        // Redirect to intended destination or home if auto-confirmed
        const redirectUrl = getAndClearRedirectUrl();
        navigate(redirectUrl || '/');
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
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      
      // The redirect will happen automatically, but we need to handle the redirect 
      // back from Google in a useEffect hook
      
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "خطا در ورود با گوگل",
        description: error instanceof Error ? error.message : "مشکلی در ورود با حساب گوگل رخ داد.",
      });
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
                {/* Google Sign-in Button at the top */}
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <FcGoogle className="text-xl" />
                  ورود با گوگل
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">یا</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">ایمیل</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="ایمیل خود را وارد کنید"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
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
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "در حال ورود..." : "ورود"}
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm text-gray-400 hover:text-gold-500"
                    onClick={() => navigate('/reset-password')}
                  >
                    رمز عبور خود را فراموش کرده‌اید؟
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-4">
                {/* Google Sign-in Button at the top */}
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <FcGoogle className="text-xl" />
                  ثبت‌نام با گوگل
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">یا</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">ایمیل</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="ایمیل خود را وارد کنید"
                    className="bg-gray-800 border-gray-700 text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">رمز عبور</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    className={`bg-gray-800 border-gray-700 text-white ${passwordErrors.length > 0 ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  {/* Password requirements */}
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>شرایط رمز عبور:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li className={formData.password.length >= 8 ? 'text-green-400' : 'text-gray-400'}>
                        حداقل 8 کاراکتر
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}>
                        حداقل یک حرف بزرگ انگلیسی
                      </li>
                      <li className={/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}>
                        حداقل یک حرف کوچک انگلیسی
                      </li>
                      <li className={/[0-9]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}>
                        حداقل یک عدد
                      </li>
                    </ul>
                  </div>
                  {passwordErrors.length > 0 && (
                    <div className="text-xs text-red-400 space-y-1">
                      {passwordErrors.map((error, index) => (
                        <p key={index}>• {error}</p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">تایید رمز عبور</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="رمز عبور خود را دوباره وارد کنید"
                    className={`bg-gray-800 border-gray-700 text-white ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-400">رمز عبور و تایید آن باید یکسان باشند</p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 && (
                    <p className="text-xs text-green-400">✓ رمز عبور تایید شد</p>
                  )}
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={handleRegister}
                  disabled={loading || passwordErrors.length > 0 || (formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0)}
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