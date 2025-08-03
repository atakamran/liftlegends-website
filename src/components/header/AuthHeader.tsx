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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Dumbbell,
  Users,
  Search,
  Bell,
  Settings,
  Crown,
  Zap,
  ChevronDown,
  Home,
  BookOpen,
  Download,
  Info,
  Trophy,
} from "lucide-react";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Function to fetch cart items count
  const fetchCartItemsCount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("shopping_cart")
        .select("quantity")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching cart items:", error);
        return 0;
      }

      const totalItems =
        data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemsCount(totalItems);
      return totalItems;
    } catch (error) {
      console.error("Exception fetching cart items:", error);
      return 0;
    }
  };

  // Function to update user profile data in Supabase
  const updateUserProfile = async (
    userId: string,
    profileData: Partial<UserProfile>
  ) => {
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
      setUser((prev) => (prev ? { ...prev, profile: data } : null));

      return data;
    } catch (error) {
      console.error("Exception updating user profile:", error);
      return null;
    }
  };

  // Function to check user subscription status from profile data
  const checkSubscriptionStatus = (profileData: UserProfile | null) => {
    if (!profileData) {
      return {
        isActive: false,
        plan: null,
        endDate: null,
        daysRemaining: 0,
      };
    }

    const { subscription_plan, subscription_end_date } = profileData;

    // Check if subscription is active
    const isActive =
      subscription_plan &&
      subscription_end_date &&
      new Date(subscription_end_date) > new Date();

    // Calculate days remaining if subscription is active
    let daysRemaining = 0;
    if (isActive && subscription_end_date) {
      const endDate = new Date(subscription_end_date);
      const today = new Date();
      daysRemaining = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return {
      isActive: !!isActive,
      plan: subscription_plan,
      endDate: subscription_end_date,
      daysRemaining,
    };
  };

  // Function to fetch all user data (auth, profile, subscription) in one call - optimized
  const fetchAllUserData = async () => {
    try {
      // First check if user is logged in according to localStorage
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setUser(null); // Immediately set user to null if not logged in
        return null;
      }

      // Check if we have cached user data in localStorage
      const cachedUserDataStr = localStorage.getItem("headauth");
      if (cachedUserDataStr) {
        try {
          const cachedData = JSON.parse(cachedUserDataStr);

          // Check if the cached data is still valid (not expired)
          if (
            cachedData.expiresAt &&
            new Date(cachedData.expiresAt) > new Date()
          ) {
            // Use cached data
            setUser(cachedData.userData);
            return cachedData.userData;
          }
          // If expired, continue with fetching fresh data
        } catch (e) {
          console.error("Error parsing cached user data:", e);
          // Continue with fetching fresh data
        }
      }

      // Get current session from Supabase - do this first and fast
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Session expired but localStorage still has logged in flag
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("headauth"); // Clear cached auth data
        setUser(null); // Immediately set user to null
        return null;
      }

      // Get basic user data
      const userData = data.session.user as User;

      // Set basic user data immediately so UI can start rendering
      setUser((prev) => ({
        ...prev,
        ...userData,
      }));

      // Fetch user profile data
      const profileData = await fetchUserProfile(userData.id);

      // Fetch cart items count
      await fetchCartItemsCount(userData.id);

      // Calculate subscription status from profile data (no extra API call)
      const subscriptionStatus = checkSubscriptionStatus(profileData);

      // Combine all data
      const completeUserData = {
        ...userData,
        profile: profileData,
        subscription: subscriptionStatus,
      };

      // Update user state with complete data
      setUser((prev) => ({
        ...prev,
        ...userData,
        profile: profileData,
        subscription: subscriptionStatus,
      }));

      // Store complete user data in localStorage with 1 month expiration
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // Set expiration to 1 month from now

      localStorage.setItem(
        "headauth",
        JSON.stringify({
          userData: completeUserData,
          expiresAt: expiresAt.toISOString(),
        })
      );

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
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to check login state and refresh user data if needed
  const checkLoginState = async (refresh = false) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // If not logged in according to localStorage, immediately set user to null
      setUser(null);
      return false;
    }

    // Check if we have cached user data and it's not a forced refresh
    if (!refresh) {
      const cachedUserDataStr = localStorage.getItem("headauth");
      if (cachedUserDataStr) {
        try {
          const cachedData = JSON.parse(cachedUserDataStr);

          // Check if the cached data is still valid (not expired)
          if (
            cachedData.expiresAt &&
            new Date(cachedData.expiresAt) > new Date()
          ) {
            // Use cached data
            setUser(cachedData.userData);
            return true;
          }
        } catch (e) {
          console.error("Error parsing cached user data:", e);
        }
      }
    }

    // If refresh is true or no valid cached data, fetch fresh data from Supabase
    await fetchAllUserData();

    return true;
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    // Check if user is logged in according to localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // If not logged in, immediately set user to null and don't fetch data
    if (!isLoggedIn) {
      setUser(null);
    } else {
      // Check if we have cached user data in localStorage
      const cachedUserDataStr = localStorage.getItem("headauth");
      if (cachedUserDataStr) {
        try {
          const cachedData = JSON.parse(cachedUserDataStr);

          // Check if the cached data is still valid (not expired)
          if (
            cachedData.expiresAt &&
            new Date(cachedData.expiresAt) > new Date()
          ) {
            // Use cached data
            setUser(cachedData.userData);
            return; // Skip further API calls if we have valid cached data
          }
        } catch (e) {
          console.error("Error parsing cached user data:", e);
          // Continue with fetching fresh data
        }
      }

      // User is logged in according to localStorage, fetch session first
      const getInitialSession = async () => {
        try {
          const { data } = await supabase.auth.getSession();

          // If session exists, set basic user data immediately
          if (data.session) {
            const userData = data.session.user as User;
            setUser(userData);

            // Then fetch complete data in background
            fetchAllUserData();
          } else {
            // No valid session, update localStorage and set user to null
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("headauth"); // Clear cached auth data
            setUser(null);
          }
        } catch (error) {
          console.error("Error getting initial session:", error);
          setUser(null);
        }
      };

      getInitialSession();
    }

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // First check if localStorage says we're logged out
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (session && isLoggedIn) {
          // Check if we have valid cached user data
          const cachedUserDataStr = localStorage.getItem("headauth");
          if (cachedUserDataStr) {
            try {
              const cachedData = JSON.parse(cachedUserDataStr);

              // Check if the cached data is still valid (not expired)
              if (
                cachedData.expiresAt &&
                new Date(cachedData.expiresAt) > new Date()
              ) {
                // Use cached data
                setUser(cachedData.userData);
                return; // Skip further API calls if we have valid cached data
              }
            } catch (e) {
              console.error("Error parsing cached user data:", e);
              // Continue with fetching fresh data
            }
          }

          // User logged in and localStorage agrees - set basic user data immediately
          const userData = session.user as User;
          setUser(userData);

          // Then fetch complete data in background
          fetchAllUserData();
        } else {
          // Either no session or localStorage says we're logged out
          localStorage.removeItem("headauth"); // Clear cached auth data
          setUser(null);
        }
      }
    );

    // Add a storage event listener to detect changes to localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isLoggedIn") {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
          // If localStorage says we're logged out, immediately set user to null
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Listen for subscription update event (after payment)
    const handleUserSubscriptionUpdate = () => {
      checkLoginState(true); // Force refresh user data
    };
    window.addEventListener(
      "userSubscriptionUpdated",
      handleUserSubscriptionUpdate
    );

    // Listen for login event from Login page
    const handleUserLogin = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.user) {
        // Set basic user data immediately
        setUser(customEvent.detail.user as User);
        // Then fetch complete data in background
        fetchAllUserData();
      }
    };
    window.addEventListener("userLoggedIn", handleUserLogin);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "userSubscriptionUpdated",
        handleUserSubscriptionUpdate
      );
      window.removeEventListener("userLoggedIn", handleUserLogin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      localStorage.setItem("isLoggedIn", "true");

      // Set basic user data immediately
      if (data.user) {
        setUser(data.user as User);
      }

      // Dispatch a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: { user: data.user },
        })
      );

      // Close the dialog immediately for better UX
      (document.querySelector("[data-dialog-close]") as HTMLElement)?.click();

      // Show success message
      toast({
        title: "ورود موفقیت‌آمیز",
        description: "با موفقیت وارد شدید.",
      });

      // Fetch complete user data in background
      fetchAllUserData();
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "خطا در ورود",
        description:
          error instanceof Error
            ? error.message
            : "مشکلی در ورود به حساب رخ داد.",
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
        localStorage.setItem("isLoggedIn", "true");

        // Set basic user data immediately
        if (data.user) {
          setUser(data.user as User);
        }

        // Dispatch a custom event to notify other components
        window.dispatchEvent(
          new CustomEvent("userLoggedIn", {
            detail: { user: data.user },
          })
        );

        // Close the dialog immediately for better UX
        (document.querySelector("[data-dialog-close]") as HTMLElement)?.click();

        // Fetch complete user data in background
        fetchAllUserData();
      } else {
        // Switch to login tab after successful registration if not auto-confirmed
        setAuthMode("login");
      }

      toast({
        title: "ثبت‌نام موفقیت‌آمیز",
        description:
          "حساب کاربری شما با موفقیت ایجاد شد. لطفاً ایمیل خود را برای تأیید حساب بررسی کنید.",
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "خطا در ثبت‌نام",
        description:
          error instanceof Error
            ? error.message
            : "مشکلی در ایجاد حساب کاربری رخ داد.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Set logout state in localStorage first to ensure it's updated
      localStorage.setItem("isLoggedIn", "false");

      // Clear cached auth data
      localStorage.removeItem("headauth");

      // Force user state to null immediately
      setUser(null);

      // Show success message
      toast({
        title: "خروج موفقیت‌آمیز",
        description: "با موفقیت از حساب کاربری خود خارج شدید.",
      });

      // Redirect to home page
      navigate("/");

      // Also trigger Supabase signOut
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "خطا در خروج",
        description:
          error instanceof Error
            ? error.message
            : "مشکلی در خروج از حساب کاربری رخ داد.",
      });
    }
  };

  // Get subscription badge
  const getSubscriptionBadge = () => {
    if (!user?.profile?.subscription_plan) return null;
    
    const plan = user.profile.subscription_plan;
    const colors = {
      basic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      pro: "bg-gold-500/20 text-gold-400 border-gold-500/30",
      ultimate: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    };
    
    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[plan as keyof typeof colors] || colors.basic}`}>
        {plan === 'pro' ? 'PRO' : plan === 'ultimate' ? 'ULTIMATE' : 'BASIC'}
      </div>
    );
  };

  return (
    <header className={`bg-gray-900/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-2xl shadow-black/50 bg-gray-900/98' : ''}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section - Enhanced */}
          <Link
            to="/"
            className="flex items-center group"
            aria-label="صفحه اصلی Lift Legends"
            title="بازگشت به صفحه اصلی"
          >
            <div className="relative">
              <img
                src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
                alt="Lift Legends Logo"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                loading="eager"
                width="120"
                height="48"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </div>
            <div className="mr-3 hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Lift Legends
              </h1>
              <p className="text-xs text-gray-400 -mt-1">مربی هوشمند بدنسازی</p>
            </div>
          </Link>

          {/* Desktop Navigation - Modern Mega Menu Style */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            <div className="relative group">
              <Link
                to="/"
                className="flex items-center text-white/90 hover:text-gold-400 font-medium text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5 group"
              >
                <Home className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                خانه
              </Link>
            </div>

            <div className="relative group">
              <button className="flex items-center text-white/90 hover:text-gold-400 font-medium text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5 group">
                <Dumbbell className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                خدمات
                <ChevronDown className="h-3 w-3 mr-1 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Mega Menu */}
              <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-right">
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      to="/programs"
                      className="group/item p-4 rounded-xl hover:bg-white/5 transition-all duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                        </div>
                        <h3 className="font-medium text-white group-hover/item:text-blue-400 transition-colors">برنامه‌ها</h3>
                      </div>
                      <p className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">برنامه‌های تمرینی و غذایی</p>
                    </Link>

                    <Link
                      to="/gyms"
                      className="group/item p-4 rounded-xl hover:bg-white/5 transition-all duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                          <Dumbbell className="h-4 w-4 text-green-400" />
                        </div>
                        <h3 className="font-medium text-white group-hover/item:text-green-400 transition-colors">باشگاه‌ها</h3>
                      </div>
                      <p className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">بهترین باشگاه‌های شهر</p>
                    </Link>

                    <Link
                      to="/coaches"
                      className="group/item p-4 rounded-xl hover:bg-white/5 transition-all duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                          <Users className="h-4 w-4 text-purple-400" />
                        </div>
                        <h3 className="font-medium text-white group-hover/item:text-purple-400 transition-colors">مربی‌ها</h3>
                      </div>
                      <p className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">مربی‌های حرفه‌ای</p>
                    </Link>

                    <Link
                      to="/legends"
                      className="group/item p-4 rounded-xl hover:bg-white/5 transition-all duration-200"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center mr-3">
                          <Trophy className="h-4 w-4 text-gold-400" />
                        </div>
                        <h3 className="font-medium text-white group-hover/item:text-gold-400 transition-colors">افسانه‌ها</h3>
                      </div>
                      <p className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">برنامه‌های قهرمانان</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/blog"
              className="flex items-center text-white/90 hover:text-gold-400 font-medium text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5 group"
            >
              <BookOpen className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              بلاگ
            </Link>

            <Link
              to="/download"
              className="flex items-center text-white/90 hover:text-gold-400 font-medium text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5 group"
            >
              <Download className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              دانلود اپ
            </Link>

            <Link
              to="/about-us"
              className="flex items-center text-white/90 hover:text-gold-400 font-medium text-sm transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5 group"
            >
              <Info className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              درباره ما
            </Link>
          </nav>

          {/* Right Section - Search, Cart, User */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex items-center justify-center w-10 h-10 text-white/70 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
              title="جستجو"
            >
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            {user ? (
              <>
                {/* Shopping Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center justify-center w-10 h-10 text-white/70 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                  title="سبد خرید"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-gold-500 to-gold-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <button
                  className="relative flex items-center justify-center w-10 h-10 text-white/70 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                  title="اعلان‌ها"
                >
                  <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {notifications > 99 ? "99+" : notifications}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 space-x-reverse text-white/90 hover:text-gold-400 rounded-xl px-3 py-2 bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-gold-500/30 group">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-400/20 flex items-center justify-center text-gold-400 border border-gold-500/30 text-sm font-bold">
                        {getInitials(user.profile?.name || user.email || "")}
                      </div>
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-medium truncate max-w-[120px]">
                          {user.profile?.name || "کاربر"}
                        </p>
                        {getSubscriptionBadge()}
                      </div>
                    </div>
                    <ChevronDown className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="absolute left-0 mt-2 w-72 bg-gray-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-left">
                    <div className="p-6">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 space-x-reverse mb-4 pb-4 border-b border-white/10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-400/20 flex items-center justify-center text-gold-400 border border-gold-500/30 text-lg font-bold">
                          {getInitials(user.profile?.name || user.email || "")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {user.profile?.name || "کاربر"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                          {getSubscriptionBadge()}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2 text-sm text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                        >
                          <User className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">پروفایل</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 text-sm text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                        >
                          <Settings className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">داشبورد</span>
                        </Link>

                        <Link
                          to="/subscription"
                          className="flex items-center px-3 py-2 text-sm text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                        >
                          <Crown className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">اشتراک‌ها</span>
                        </Link>

                        <div className="border-t border-white/10 my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all duration-200 group"
                        >
                          <LogOut className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">خروج</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-black font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <User className="h-4 w-4 ml-2" />
                  ورود / ثبت‌نام
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="جستجو در برنامه‌ها، باشگاه‌ها، مربی‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-gold-500/50 focus:bg-white/10 transition-all duration-300"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gold-500 hover:bg-gold-600 text-black px-4"
            >
              جستجو
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
                />
              </form>
            </div>

            {user && (
              <div className="px-4 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-400/20 flex items-center justify-center text-gold-400 border border-gold-500/30 text-sm font-bold">
                    {getInitials(user.profile?.name || user.email || "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.profile?.name || user.email || "کاربر"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <nav className="px-4 space-y-2">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                خانه
              </Link>

              <Link
                to="/programs"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                برنامه‌ها
              </Link>

              <Link
                to="/gyms"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <Dumbbell className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                باشگاه‌ها
              </Link>

              <Link
                to="/coaches"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                مربی‌ها
              </Link>

              <Link
                to="/legends"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                افسانه‌ها
              </Link>

              <Link
                to="/blog"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                بلاگ
              </Link>

              <Link
                to="/download"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <Download className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                دانلود اپ
              </Link>

              <Link
                to="/about-us"
                className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                درباره ما
              </Link>

              {user ? (
                <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
                  <Link
                    to="/cart"
                    className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative">
                      <ShoppingCart className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </span>
                      )}
                    </div>
                    سبد خرید
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    پروفایل
                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    داشبورد
                  </Link>

                  <Link
                    to="/subscription"
                    className="flex items-center px-3 py-2 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Crown className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    اشتراک‌ها
                  </Link>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all duration-200 group"
                  >
                    <LogOut className="h-4 w-4 ml-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    خروج
                  </button>
                </div>
              ) : (
                <div className="pt-2 mt-2 border-t border-white/10">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-black font-medium rounded-xl">
                      <User className="h-4 w-4 ml-2" />
                      ورود / ثبت‌نام
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;