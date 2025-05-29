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

// Define interfaces outside the component
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

const AuthHeader = () => {
  // Create a ref for the dialog close button
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  
  // Function to fetch user profile data directly from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return profileData;
    } catch (error) {
      console.error("Exception fetching user profile:", error);
      return null;
    }
  };
  
  // Function to update user profile data in Supabase
  const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update(profileData)
        .eq("user_id", userId)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating user profile:", error);
        return null;
      }
      
      // Update local user state with the updated profile
      setUser(prev => prev ? ({ ...prev, profile: data }) : null);
      
      return data;
    } catch (error) {
      console.error("Exception updating user profile:", error);
      return null;
    }
  };
  
  // Function to check user subscription status
  const checkSubscriptionStatus = async (userId: string) => {
    try {
      // Fetch the user profile which contains subscription information
      const profileData = await fetchUserProfile(userId);
      
      if (!profileData) {
        return {
          isActive: false,
          plan: null,
          endDate: null,
          daysRemaining: 0
        };
      }
      
      const { subscription_plan, subscription_end_date } = profileData;
      
      // Check if subscription is active
      const isActive = subscription_plan && subscription_end_date && 
                      new Date(subscription_end_date) > new Date();
      
      // Calculate days remaining if subscription is active
      let daysRemaining = 0;
      if (isActive && subscription_end_date) {
        const endDate = new Date(subscription_end_date);
        const today = new Date();
        daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      return {
        isActive: !!isActive,
        plan: subscription_plan,
        endDate: subscription_end_date,
        daysRemaining
      };
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return {
        isActive: false,
        plan: null,
        endDate: null,
        daysRemaining: 0
      };
    }
  };
  
  // Function to fetch all user data (auth, profile, subscription) in one call
  const fetchAllUserData = async () => {
    try {
      // First check if user is logged in according to localStorage
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        return null;
      }
      
      // Get current session from Supabase
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Session expired but localStorage still has logged in flag
        localStorage.setItem('isLoggedIn', 'false');
        return null;
      }
      
      // Get basic user data
      const userData = data.session.user as User;
      
      // Fetch user profile data
      const profileData = await fetchUserProfile(userData.id);
      
      // Fetch subscription status
      const subscriptionStatus = await checkSubscriptionStatus(userData.id);
      
      // Combine all data
      const completeUserData = {
        ...userData,
        profile: profileData,
        subscription: subscriptionStatus
      };
      
      // Update user state with complete data
      setUser(prev => ({
        ...prev,
        ...userData,
        profile: profileData
      }));
      
      return completeUserData;
    } catch (error) {
      console.error("Error fetching all user data:", error);
      return null;
    }
  };
  
  // Helper function to get user initials for avatar
  const getInitials = (text: string): string => {
    if (!text) return "U";
    
    return text
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to check login state and refresh user data if needed
  const checkLoginState = async (refresh = false) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // If not logged in according to localStorage, immediately set user to null
      setUser(null);
      return false;
    }
    
    // If refresh is true, fetch fresh data from Supabase
    if (refresh) {
      await fetchAllUserData();
    }
    
    return true;
  };

  useEffect(() => {
    // Fetch all user data on component mount
    fetchAllUserData();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // First check if localStorage says we're logged out
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (session && isLoggedIn) {
          // User logged in and localStorage agrees - fetch all user data
          fetchAllUserData();
        } else {
          // Either no session or localStorage says we're logged out
          setUser(null);
        }
      }
    );

    // Add a storage event listener to detect changes to localStorage
    const handleStorageChange = (event: StorageEvent) => {
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
      
      // Fetch all user data from Supabase
      await fetchAllUserData();

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
        
        // Fetch all user data from Supabase
        await fetchAllUserData();
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

  const handleLogout = async () => {
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
      
      // Also trigger Supabase signOut
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
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
          <Link 
            to="/" 
            className="flex items-center"
            aria-label="صفحه اصلی LiftLegends"
            title="بازگشت به صفحه اصلی"
          >
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
            {/* Navigation links removed temporarily as requested */}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center">
                <div className="relative group">
                  <Button 
                    variant="ghost" 
                    className="flex items-center text-white/90 hover:text-gold-500 rounded-lg px-3 py-1.5 bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-200 border border-white/5 hover:border-gold-500/30 relative after:content-[''] after:absolute after:right-0 after:left-0 after:bottom-0 after:h-0.5 after:bg-gold-500 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
                  >
                    <User className="h-4 w-4 ml-2 text-gold-500" />
                    <span className="text-sm font-medium truncate max-w-[100px]">{user.profile?.name || user.email}</span>
                  </Button>
                  <div className="absolute right-0 mt-2 w-52 bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-700/50 scale-95 group-hover:scale-100 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-700/30 mb-1">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20">
                          {getInitials(user.profile?.name || user.email || "")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{user.profile?.name || "کاربر"}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-white/90 hover:text-gold-500 hover:bg-gray-700/30 text-right transition-all duration-150 mx-1 rounded-md group"
                        title="مشاهده و ویرایش پروفایل"
                        aria-label="پروفایل کاربری"
                      >
                        <div className="flex items-center">
                          <User className="h-4 w-4 ml-2 text-gold-500/70 group-hover:text-gold-500 transition-colors" />
                          <span className="group-hover:translate-x-0.5 transition-transform duration-150">پروفایل</span>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-sm text-white/90 hover:text-gold-500 hover:bg-gray-700/30 text-right transition-all duration-150 mx-1 rounded-md group"
                        title="مشاهده داشبورد کاربری"
                        aria-label="داشبورد کاربری"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gold-500/70 group-hover:text-gold-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                          </svg>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-150">داشبورد</span>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/subscription" 
                        className="flex items-center px-4 py-2 text-sm text-white/90 hover:text-gold-500 hover:bg-gray-700/30 text-right transition-all duration-150 mx-1 rounded-md group"
                        title="اشتراک‌های LiftLegends"
                        aria-label="اشتراک‌ها"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gold-500/70 group-hover:text-gold-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                          </svg>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-150">اشتراک‌ها</span>
                        </div>
                      </Link>
                    </div>
                    
                    <div className="px-3 pt-1 pb-2 border-t border-gray-700/30 mt-1">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-right px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 mx-1 rounded-md transition-all duration-150 group"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-0.5 transition-transform duration-150">خروج</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium text-sm px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gold-400/30"
                >
                  ورود / ثبت‌نام
                </Button>
              </Link>
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
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <div className="py-3 border-t border-white/5 text-right bg-gray-800/80 backdrop-blur-md rounded-xl px-4 shadow-xl">
            {user && (
              <div className="mb-3 pb-3 border-b border-gray-700/30">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20 text-sm font-bold">
                    {getInitials(user.profile?.name || user.email || "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.profile?.name || "کاربر"}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            <nav className="flex flex-col space-y-1.5">
              {/* Mobile navigation links removed temporarily as requested */}

              
              {user ? (
                <div className="mt-2 pt-2 border-t border-gray-700/30">
                  <Link to="/profile" className="text-white/90 hover:text-gold-500 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-700/30 flex items-center group">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center ml-3 group-hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold-500/80 group-hover:text-gold-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-200">پروفایل</span>
                  </Link>
                  
                  <Link to="/dashboard" className="text-white/90 hover:text-gold-500 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-700/30 flex items-center group">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center ml-3 group-hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold-500/80 group-hover:text-gold-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
                    </div>
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-200">داشبورد</span>
                  </Link>
                  
                  <Link to="/subscription" className="text-white/90 hover:text-gold-500 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-700/30 flex items-center group">
                    <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center ml-3 group-hover:bg-gray-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold-500/80 group-hover:text-gold-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-200">اشتراک‌ها</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-right text-red-400 hover:text-red-300 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-red-900/10 flex items-center mt-1 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center ml-3 group-hover:bg-red-900/30 transition-colors">
                      <LogOut className="h-4 w-4 text-red-400/80 group-hover:text-red-400 transition-colors" />
                    </div>
                    <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-200">خروج</span>
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <Button 
                    className="mt-3 w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black font-medium text-sm rounded-lg shadow-md"
                  >
                    ورود / ثبت‌نام
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;