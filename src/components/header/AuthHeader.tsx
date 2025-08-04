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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      // Shopping cart table doesn't exist yet, return 0
      setCartItemsCount(0);
      return 0;
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
    if (
      !user?.profile?.subscription_plan ||
      user.profile.subscription_plan === "basic"
    )
      return null;

    const plan = user.profile.subscription_plan;
    const colors = {
      pro: "bg-gold-500/20 text-gold-400 border-gold-500/30",
      ultimate: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };

    return (
      <div
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          colors[plan as keyof typeof colors]
        }`}
      >
        {plan === "pro" ? "PRO" : plan === "ultimate" ? "ULTIMATE" : ""}
      </div>
    );
  };

  return (
    <header
      className={`bg-black/95 backdrop-blur-xl border-b border-gold-500/20 fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isScrolled ? "shadow-2xl shadow-gold-500/10 bg-black/98" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-4">
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
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-lg"
                loading="eager"
                width="120"
                height="56"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </div>
            <div className="mr-4 hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent drop-shadow-sm">
                Lift Legends
              </h1>
              <p className="text-sm text-gray-300 -mt-1 font-medium">
                مربی هوشمند بدنسازی
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Modern Style */}
          <nav className="hidden lg:flex items-center space-x-6 space-x-reverse">
            <div className="relative group">
              <Link
                to="/"
                className="flex items-center text-white hover:text-gold-400 font-semibold text-sm transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gold-500/10 hover:to-gold-400/10 border border-transparent hover:border-gold-500/30 group"
              >
                <Home className="h-4 w-4 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                خانه
              </Link>
            </div>

            <div className="relative group">
              <button className="flex items-center text-white hover:text-gold-400 font-semibold text-sm transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gold-500/10 hover:to-gold-400/10 border border-transparent hover:border-gold-500/30 group">
                <Dumbbell className="h-4 w-4 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                خدمات
                <ChevronDown className="h-3 w-3 mr-1 opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
              </button>

              {/* Modern Dropdown Menu */}
              <div className="absolute top-full right-0 mt-3 w-96 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gold-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-right overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/programs"
                      className="group/item p-4 rounded-xl bg-gradient-to-br from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-xl group-hover/item:shadow-gold-500/25 transition-all duration-300">
                          <BookOpen className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-bold text-lg text-white group-hover/item:text-gold-300 transition-colors">
                          برنامه‌ها
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300 group-hover/item:text-gray-200 transition-colors leading-relaxed mr-2">
                        برنامه‌های تمرینی و غذایی
                      </p>
                    </Link>

                    <Link
                      to="/gyms"
                      className="group/item p-4 rounded-xl bg-gradient-to-br from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-xl group-hover/item:shadow-gold-500/25 transition-all duration-300">
                          <Dumbbell className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-bold text-lg text-white group-hover/item:text-gold-300 transition-colors">
                          باشگاه‌ها
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300 group-hover/item:text-gray-200 transition-colors leading-relaxed mr-2">
                        بهترین باشگاه‌های شهر
                      </p>
                    </Link>

                    <Link
                      to="/coaches"
                      className="group/item p-4 rounded-xl bg-gradient-to-br from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-xl group-hover/item:shadow-gold-500/25 transition-all duration-300">
                          <Users className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-bold text-lg text-white group-hover/item:text-gold-300 transition-colors">
                          مربی‌ها
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300 group-hover/item:text-gray-200 transition-colors leading-relaxed mr-2">
                        مربی‌های حرفه‌ای
                      </p>
                    </Link>

                    <Link
                      to="/legends"
                      className="group/item p-4 rounded-xl bg-gradient-to-br from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-xl group-hover/item:shadow-gold-500/25 transition-all duration-300">
                          <Trophy className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-bold text-lg text-white group-hover/item:text-gold-300 transition-colors">
                          افسانه‌ها
                        </h3>
                      </div>
                      <p className="text-sm text-gray-300 group-hover/item:text-gray-200 transition-colors leading-relaxed mr-2">
                        برنامه‌های قهرمانان
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/blog"
              className="flex items-center text-white hover:text-gold-400 font-semibold text-sm transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gold-500/10 hover:to-gold-400/10 border border-transparent hover:border-gold-500/30 group"
            >
              <BookOpen className="h-4 w-4 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />
              بلاگ
            </Link>

            <Link
              to="/download"
              className="flex items-center text-white hover:text-gold-400 font-semibold text-sm transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gold-500/10 hover:to-gold-400/10 border border-transparent hover:border-gold-500/30 group"
            >
              <Download className="h-4 w-4 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />
              دانلود اپ
            </Link>

            <Link
              to="/about-us"
              className="flex items-center text-white hover:text-gold-400 font-semibold text-sm transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gold-500/10 hover:to-gold-400/10 border border-transparent hover:border-gold-500/30 group"
            >
              <Info className="h-4 w-4 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />
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
                  <div className="absolute left-0 mt-3 w-80 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gold-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100 origin-top-left overflow-hidden">
                    <div className="p-6">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 space-x-reverse mb-6 pb-4 border-b border-gold-500/20">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                          {getInitials(user.profile?.name || user.email || "")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-white truncate">
                            {user.profile?.name || "کاربر"}
                          </p>
                          <p className="text-sm text-gray-300 truncate mb-2">
                            {user.email}
                          </p>
                          {getSubscriptionBadge()}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-3">
                        <Link
                          to="/profile"
                          className="flex items-center px-5 py-4 text-sm text-white hover:text-gold-300 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                            <User className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-semibold text-base group-hover:translate-x-1 transition-transform duration-200">
                            پروفایل
                          </span>
                        </Link>

                        <Link
                          to="/dashboard"
                          className="flex items-center px-5 py-4 text-sm text-white hover:text-gold-300 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                            <Settings className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-semibold text-base group-hover:translate-x-1 transition-transform duration-200">
                            داشبورد
                          </span>
                        </Link>

                        <div className="border-t border-gold-500/20 my-3"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-5 py-4 text-sm text-white hover:text-gold-300 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                            <LogOut className="h-5 w-5 text-black" />
                          </div>
                          <span className="font-semibold text-base group-hover:translate-x-1 transition-transform duration-200">
                            خروج
                          </span>
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

        {/* Mobile Menu - Enhanced Responsive Design */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[800px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-6 bg-black/95 backdrop-blur-xl rounded-2xl border border-gold-500/20 shadow-2xl">
            {/* Mobile Search */}
            <div className="px-6 mb-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="جستجو در برنامه‌ها، باشگاه‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-black/50 border border-gold-500/20 rounded-xl text-white placeholder-gray-400 focus:border-gold-400/50 focus:ring-2 focus:ring-gold-500/20"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black px-3 py-1 rounded-lg"
                >
                  جستجو
                </Button>
              </form>
            </div>

            {user && (
              <div className="px-6 mb-6 pb-6 border-b border-gold-500/20">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white text-base font-bold shadow-lg">
                    {getInitials(user.profile?.name || user.email || "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white truncate">
                      {user.profile?.name || user.email || "کاربر"}
                    </p>
                    <p className="text-sm text-gray-300 truncate mb-2">
                      {user.email}
                    </p>
                    {getSubscriptionBadge()}
                  </div>
                </div>
              </div>
            )}

            <nav className="px-6 space-y-3">
              {/* Main Navigation */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link
                  to="/"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border border-blue-500/20 hover:border-blue-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-2 shadow-lg">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    خانه
                  </span>
                </Link>

                <Link
                  to="/programs"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-2 shadow-lg">
                    <BookOpen className="h-5 w-5 text-black" />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">
                    برنامه‌ها
                  </span>
                </Link>

                <Link
                  to="/gyms"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-2 shadow-lg">
                    <Dumbbell className="h-5 w-5 text-black" />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">
                    باشگاه‌ها
                  </span>
                </Link>

                <Link
                  to="/coaches"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-2 shadow-lg">
                    <Users className="h-5 w-5 text-black" />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">
                    مربی‌ها
                  </span>
                </Link>
              </div>

              {/* Secondary Navigation */}
              <div className="space-y-3">
                <Link
                  to="/legends"
                  className="flex items-center px-5 py-4 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                    <Trophy className="h-5 w-5 text-black" />
                  </div>
                  <span className="font-semibold text-base text-white group-hover:text-gold-300 transition-colors">
                    افسانه‌ها
                  </span>
                </Link>

                <Link
                  to="/blog"
                  className="flex items-center px-5 py-4 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                    <BookOpen className="h-5 w-5 text-black" />
                  </div>
                  <span className="font-semibold text-base text-white group-hover:text-gold-300 transition-colors">
                    بلاگ
                  </span>
                </Link>

                <Link
                  to="/download"
                  className="flex items-center px-5 py-4 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                    <Download className="h-5 w-5 text-black" />
                  </div>
                  <span className="font-semibold text-base text-white group-hover:text-gold-300 transition-colors">
                    دانلود اپ
                  </span>
                </Link>

                <Link
                  to="/about-us"
                  className="flex items-center px-5 py-4 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                    <Info className="h-5 w-5 text-black" />
                  </div>
                  <span className="font-semibold text-base text-white group-hover:text-gold-300 transition-colors">
                    درباره ما
                  </span>
                </Link>
              </div>

              {user ? (
                <div className="pt-4 mt-4 border-t border-gold-500/20 space-y-3">
                  <Link
                    to="/cart"
                    className="flex items-center px-5 py-4 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                      <ShoppingCart className="h-5 w-5 text-black" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                          {cartItemsCount > 9 ? "9+" : cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-base text-white group-hover:text-gold-300 transition-colors">
                      سبد خرید
                    </span>
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center px-5 py-4 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center ml-4 shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                      <User className="h-5 w-5 text-black" />
                    </div>
                    <span className="font-semibold text-base text-white group-hover:text-gold-300 transition-colors">
                      پروفایل
                    </span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-3 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mr-3 shadow-md">
                      <Settings className="h-4 w-4 text-black" />
                    </div>
                    <span className="font-semibold text-white group-hover:text-gold-300 transition-colors">
                      داشبورد
                    </span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-3 bg-gradient-to-r from-gold-500/10 to-gold-600/5 hover:from-gold-500/20 hover:to-gold-600/10 border border-gold-500/20 hover:border-gold-400/40 rounded-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mr-3 shadow-md">
                      <LogOut className="h-4 w-4 text-black" />
                    </div>
                    <span className="font-semibold text-white group-hover:text-gold-300 transition-colors">
                      خروج
                    </span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gold-500/20">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-black font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <User className="h-5 w-5 ml-2" />
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
