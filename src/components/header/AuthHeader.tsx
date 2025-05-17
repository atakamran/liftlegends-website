import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Menu, X, User, LogOut } from "lucide-react";

const AuthHeader = () => {
  // Create a ref for the dialog close button
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Add a function to check localStorage login state
  const checkLoginState = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // If not logged in according to localStorage, immediately set user to null
      setUser(null);
      return false;
    }
    return true;
  };

  useEffect(() => {
    // Check localStorage first for login state
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // If not logged in according to localStorage, immediately set user to null
    if (!isLoggedIn) {
      setUser(null);
      return;
    }
    
    // Check for existing session only if localStorage says we're logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user as User);
        // Fetch user profile data if needed
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", data.session.user.id)
          .single();
          
        if (profileData) {
          setUser(prev => ({ ...prev, profile: profileData }));
        }
      } else {
        // Session expired but localStorage still has logged in flag
        localStorage.setItem('isLoggedIn', 'false');
        setUser(null);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // First check if localStorage says we're logged out
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (session && isLoggedIn) {
          // User logged in and localStorage agrees
          setUser(session.user as User);
          // Fetch profile on auth change
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
            
          if (profileData) {
            setUser(prev => ({ ...prev, profile: profileData }));
          }
        } else {
          // Either no session or localStorage says we're logged out
          setUser(null);
        }
      }
    );

    // Add a storage event listener to detect changes to localStorage
    const handleStorageChange = (event) => {
      if (event.key === 'isLoggedIn') {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
          // If localStorage says we're logged out, immediately set user to null
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
      
      // Immediately update the user state
      if (data.user) {
        setUser(data.user as User);
        
        // Fetch user profile data
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();
          
        if (profileData) {
          setUser(prev => ({ ...prev, profile: profileData }));
        }
      }

      toast({
        title: "ورود موفقیت‌آمیز",
        description: "با موفقیت وارد شدید.",
      });
      
      // Close the dialog
      (document.querySelector('[data-dialog-close]') as HTMLElement)?.click();
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
        
        // Immediately update the user state if auto-confirmed
        if (data.user) {
          setUser(data.user as User);
          
          // Add the profile data to the user state
          const profileData: UserProfile = {
            id: '', // Generate or fetch a proper ID
            user_id: data.user.id,
            email: formData.email,
            name: null,
            age: null,
            gender: null,
            height: null,
            currentWeight: null,
            targetWeight: null,
            goal: null,
            phoneNumber: null,
            is_admin: null,
            is_coach: null,
            permissions: null,
            subscription_plan: null,
            subscription_start_date: null,
            subscription_end_date: null,
            created_at: null,
            updated_at: null
          };
          
          setUser(prev => ({ ...prev, profile: profileData }));
        }
      }

      toast({
        title: "ثبت‌نام موفقیت‌آمیز",
        description: "حساب کاربری شما با موفقیت ایجاد شد. لطفاً ایمیل خود را برای تأیید حساب بررسی کنید.",
      });
      
      // If auto-confirmed, close the dialog
      if (data.session) {
        (document.querySelector('[data-dialog-close]') as HTMLElement)?.click();
      } else {
        // Switch to login tab after successful registration if not auto-confirmed
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

  const handleLogout = () => {
    try {
      // Set logout state in localStorage first to ensure it's updated
      localStorage.setItem('isLoggedIn', 'false');
      
      // Force user state to null immediately
      setUser(null);
      
      // Show success message
      toast({
        title: "خروج موفقیت‌آمیز",
        description: "با موفقیت از حساب کاربری خود خارج شدید.",
      });
      
      // Redirect to home page
      navigate('/');
      
      // Also trigger Supabase signOut in the background
      supabase.auth.signOut().catch(error => {
        console.error("Error during Supabase signOut:", error);
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطا در خروج",
        description: error instanceof Error ? error.message : "مشکلی در خروج از حساب کاربری رخ داد.",
      });
    }
  };

  return (
    <header className="bg-gray-900/90 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 dir-ltr shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between flex-row-reverse h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" 
              alt="LiftLegends Logo" 
              className="h-10 w-auto"
              loading="eager"
              width="80"
              height="40"
            />
          </Link>

          {/* Desktop Navigation - Simplified */}
          <nav className="hidden md:flex items-center space-x-6 mr-6">
            <Link to="/" className="text-white/90 hover:text-gold-500 transition-colors px-2 py-1 text-sm font-medium relative group">
              صفحه اصلی
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"></span>
            </Link>
            <Link to="/services" className="text-white/90 hover:text-gold-500 transition-colors px-2 py-1 text-sm font-medium relative group">
              خدمات
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"></span>
            </Link>
            <Link to="/coaches" className="text-white/90 hover:text-gold-500 transition-colors px-2 py-1 text-sm font-medium relative group">
              مربیان
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"></span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center">
                <div className="relative group">
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-white/90 hover:text-gold-500 rounded-lg px-3 py-1.5 bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-200 border border-white/5 hover:border-gold-500/30"
                  >
                    <User className="h-4 w-4 ml-2 text-gold-500" />
                    <span className="text-sm font-medium truncate max-w-[100px]">{user.profile?.name || user.email}</span>
                  </Button>
                  <div className="absolute left-0 mt-1 w-44 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-2xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-700/50 scale-95 group-hover:scale-100 origin-top-left">
                    <Link to="/profile" className="flex items-center px-3 py-1.5 text-sm text-white/90 hover:text-gold-500 hover:bg-gray-700/30 text-left transition-colors duration-150 mx-1 rounded-md">
                      <User className="h-3.5 w-3.5 ml-2 text-gold-500/70" />
                      پروفایل
                    </Link>
                    <Link to="/dashboard" className="flex items-center px-3 py-1.5 text-sm text-white/90 hover:text-gold-500 hover:bg-gray-700/30 text-left transition-colors duration-150 mx-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 text-gold-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                      داشبورد
                    </Link>
                    <div className="mx-1 my-1 border-t border-gray-700/30"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 mx-1 rounded-md transition-colors duration-150"
                    >
                      <LogOut className="h-3.5 w-3.5 ml-2 opacity-70" />
                      خروج
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium text-sm px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gold-400/30">
                    ورود / ثبت‌نام
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-2xl">
                  <DialogClose className="hidden" />
                  <DialogHeader>
                    <DialogTitle className="text-lg text-center text-white font-bold">
                      حساب کاربری
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-400 mt-1 text-sm">
                      برای استفاده از امکانات ویژه وارد حساب کاربری خود شوید
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setAuthMode(value as "login" | "register")}>
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
                        <Button
                          className="w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium rounded-lg py-5 shadow-md hover:shadow-lg transition-all duration-300"
                          onClick={handleLogin}
                          disabled={loading}
                        >
                          {loading ? "در حال ورود..." : "ورود"}
                        </Button>
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
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/90 hover:text-gold-500 bg-gray-800/40 hover:bg-gray-800/60 p-1.5 rounded-md transition-all duration-200 border border-white/5 hover:border-gold-500/30"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu - Modern Slide Down */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <div className="py-2 border-t border-white/5 text-left bg-gray-800/50 backdrop-blur-md rounded-lg px-3 shadow-lg">
            <nav className="flex flex-col space-y-1">
              <Link to="/" className="text-white/90 hover:text-gold-500 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-700/30 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 text-gold-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="text-sm">صفحه اصلی</span>
              </Link>
              <Link to="/services" className="text-white/90 hover:text-gold-500 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-700/30 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 text-gold-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span className="text-sm">خدمات</span>
              </Link>
              <Link to="/coaches" className="text-white/90 hover:text-gold-500 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-700/30 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 text-gold-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className="text-sm">مربیان</span>
              </Link>

              
              {user ? (
                <div className="border-t border-white/10 mt-1 pt-1 mx-1">
                  <div className="flex items-center px-3 py-1.5 mb-1">
                    <User className="h-3.5 w-3.5 ml-2 text-gold-500" />
                    <span className="text-sm font-medium text-white/90 truncate">{user.profile?.name || user.email}</span>
                  </div>
                  <Link to="/profile" className="text-white/90 hover:text-gold-500 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-700/30 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 text-gold-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="text-sm">پروفایل</span>
                  </Link>
                  <Link to="/dashboard" className="text-white/90 hover:text-gold-500 transition-colors py-1.5 px-3 rounded-md hover:bg-gray-700/30 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-2 text-gold-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    <span className="text-sm">داشبورد</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left text-red-400 hover:text-red-300 transition-colors py-1.5 px-3 rounded-md hover:bg-red-900/10 flex items-center mt-1"
                  >
                    <LogOut className="h-3.5 w-3.5 ml-2 opacity-70" />
                    <span className="text-sm">خروج</span>
                  </button>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium text-sm mx-1 mt-2 rounded-md shadow-md">
                      ورود / ثبت‌نام
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-2xl">
                    <DialogClose className="hidden" />
                    <DialogHeader>
                      <DialogTitle className="text-lg text-center text-white font-bold">
                        حساب کاربری
                      </DialogTitle>
                      <DialogDescription className="text-center text-gray-400 text-sm mt-1">
                        برای استفاده از امکانات ویژه وارد حساب کاربری خود شوید
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="login" className="w-full" onValueChange={(value) => setAuthMode(value as "login" | "register")}>
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">ورود</TabsTrigger>
                        <TabsTrigger value="register">ثبت‌نام</TabsTrigger>
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
                          <Button
                            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium"
                            onClick={handleLogin}
                            disabled={loading}
                          >
                            {loading ? "در حال ورود..." : "ورود"}
                          </Button>
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
                            className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium"
                            onClick={handleRegister}
                            disabled={loading}
                          >
                            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;