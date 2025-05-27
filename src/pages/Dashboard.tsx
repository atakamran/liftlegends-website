import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from "@/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2, Check, X, Calendar, CreditCard, Shield, Zap } from "lucide-react";
import SubscriptionPlans from "@/components/SubscriptionPlans";

// Define interfaces
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

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  cover_image: string | null;
  published: boolean;
  author_id: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  coach_id: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}



const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [activeTab, setActiveTab] = useState(user?.profile?.is_admin ? "blog" : "");
  
  // Blog form state
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    cover_image: "",
    published: false,
    category: "none"
  });
  
  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: ""
  });
  
  // Category search state
  const [categorySearch, setCategorySearch] = useState("");
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(null);
  

  
  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setPageLoading(true);
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate('/');
        return;
      }
      
      // Get user data
      const userData = sessionData.session.user;
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userData.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
      
      // Set user data with profile
      setUser({
        ...userData,
        profile: profileData || undefined
      } as User);
      
      // Check if subscription has expired and update it directly in the database
      if (profileData && 
          (profileData.subscription_plan === "pro" || profileData.subscription_plan === "ultimate") && 
          profileData.subscription_end_date) {
        
        const endDate = new Date(profileData.subscription_end_date);
        const today = new Date();
        
        // Reset time part to compare only dates
        endDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        // If subscription has expired, update it to basic directly in the database
        if (today > endDate) {
          console.log("Expired subscription detected during data fetch, updating to basic plan...");
          
          // Update user profile with basic subscription
          const { data: updatedProfile, error: updateError } = await supabase
            .from("user_profiles")
            .update({
              subscription_plan: "basic",
              subscription_end_date: null, // Basic plan doesn't expire
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userData.id)
            .select();
            
          if (updateError) {
            console.error("Error updating expired subscription:", updateError);
          } else {
            console.log("Subscription successfully updated to basic plan:", updatedProfile);
            
            // Update the local user state with the updated profile
            setUser({
              ...userData,
              profile: updatedProfile[0] || undefined
            } as User);
            
            toast({
              title: "اشتراک منقضی شده",
              description: "اشتراک شما به پایان رسیده و به پلن پایه تغییر یافت.",
              variant: "default"
            });
          }
        }
      }
      
      // Check if user is admin
      if (profileData) {
        const { is_admin } = profileData;
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری اطلاعات",
        description: "مشکلی در دریافت اطلاعات کاربری رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setPageLoading(false);
    }
  };
  
  // Function to fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری مقالات",
        description: "مشکلی در دریافت لیست مقالات رخ داد. لطفاً دوباره تلاش کنید.",
      });
    }
  };
  
  // Function to fetch blog categories
  const fetchBlogCategories = async () => {
    try {
      console.log("Fetching blog categories...");
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name", { ascending: true });
        
      if (error) {
        console.error("Error from Supabase when fetching categories:", error);
        throw error;
      }
      
      console.log("Categories fetched:", data?.length || 0);
      setBlogCategories(data || []);
      return data;
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری دسته‌بندی‌ها",
        description: "مشکلی در دریافت لیست دسته‌بندی‌ها رخ داد. لطفاً دوباره تلاش کنید.",
      });
      return [];
    }
  };
  
  // Function to create a new blog post
  const createBlogPost = async () => {
    try {
      if (!user) return;
      
      // Validate form data
      if (!blogFormData.title || !blogFormData.content || !blogFormData.slug) {
        toast({
          variant: "destructive",
          title: "خطا در ثبت مقاله",
          description: "لطفاً عنوان، محتوا و نامک مقاله را وارد کنید.",
        });
        return;
      }
      
      setPageLoading(true);
      
      // Create new blog post
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: blogFormData.title || "",
          content: blogFormData.content || "",
          excerpt: blogFormData.excerpt || null,
          slug: blogFormData.slug || "",
          cover_image: blogFormData.cover_image || null,
          published: blogFormData.published || false,
          category: blogFormData.category || null,
          author_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh blog posts
      fetchBlogPosts();
      
      // Reset form
      setBlogFormData({
        title: "",
        content: "",
        excerpt: "",
        slug: "",
        cover_image: "",
        published: false,
        category: "none"
      });
      
      toast({
        title: "مقاله جدید ایجاد شد",
        description: "مقاله جدید با موفقیت ایجاد شد.",
      });
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        variant: "destructive",
        title: "خطا در ایجاد مقاله",
        description: "مشکلی در ایجاد مقاله جدید رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setPageLoading(false);
    }
  };
  
  // Function to update a blog post
  const updateBlogPost = async () => {
    try {
      if (!currentBlogId) return;
      
      // Validate form data
      if (!blogFormData.title || !blogFormData.content || !blogFormData.slug) {
        toast({
          variant: "destructive",
          title: "خطا در بروزرسانی مقاله",
          description: "لطفاً عنوان، محتوا و نامک مقاله را وارد کنید.",
        });
        return;
      }
      
      setPageLoading(true);
      
      // Update blog post
      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          title: blogFormData.title || "",
          content: blogFormData.content || "",
          excerpt: blogFormData.excerpt || null,
          slug: blogFormData.slug || "",
          cover_image: blogFormData.cover_image || null,
          published: blogFormData.published || false,
          category: blogFormData.category || null
        })
        .eq("id", currentBlogId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh blog posts
      fetchBlogPosts();
      
      // Reset form and editing state
      setBlogFormData({
        title: "",
        content: "",
        excerpt: "",
        slug: "",
        cover_image: "",
        published: false,
        category: "none"
      });
      setIsEditing(false);
      setCurrentBlogId(null);
      
      toast({
        title: "مقاله بروزرسانی شد",
        description: "مقاله با موفقیت بروزرسانی شد.",
      });
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast({
        variant: "destructive",
        title: "خطا در بروزرسانی مقاله",
        description: "مشکلی در بروزرسانی مقاله رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setPageLoading(false);
    }
  };
  
  // Function to delete a blog post
  const deleteBlogPost = async (id: string) => {
    try {
      setPageLoading(true);
      
      // Delete blog post
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Refresh blog posts
      fetchBlogPosts();
      
      toast({
        title: "مقاله حذف شد",
        description: "مقاله با موفقیت حذف شد.",
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        variant: "destructive",
        title: "خطا در حذف مقاله",
        description: "مشکلی در حذف مقاله رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setPageLoading(false);
    }
  };
  
  // Function to create a new category
  const createCategory = async () => {
    try {
      // Validate form data
      if (!categoryFormData.name || !categoryFormData.slug) {
        toast({
          variant: "destructive",
          title: "خطا در ثبت دسته‌بندی",
          description: "لطفاً نام و نامک دسته‌بندی را وارد کنید.",
        });
        return;
      }
      
      setPageLoading(true);
      console.log("Creating new category:", categoryFormData);
      
      // Create new category
      const { data, error } = await supabase
        .from("blog_categories")
        .insert(categoryFormData)
        .select()
        .single();
        
      if (error) {
        console.error("Error from Supabase when creating category:", error);
        throw error;
      }
      
      console.log("Category created successfully:", data);
      
      // Refresh categories
      await fetchBlogCategories();
      
      // Reset form
      setCategoryFormData({
        name: "",
        slug: ""
      });
      
      toast({
        title: "دسته‌بندی جدید ایجاد شد",
        description: "دسته‌بندی جدید با موفقیت ایجاد شد.",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        variant: "destructive",
        title: "خطا در ایجاد دسته‌بندی",
        description: "مشکلی در ایجاد دسته‌بندی جدید رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setPageLoading(false);
    }
  };
  
  // State for dialog open/close
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  
  // State for subscription loading
  const [loading, setLoading] = useState<string | null>(null);
  
  // Function to calculate remaining days of subscription
  const calculateRemainingDays = (endDateStr: string | null): number | null => {
    if (!endDateStr) return null;
    
    try {
      const endDate = new Date(endDateStr);
      const today = new Date();
      
      // Reset time part to compare only dates
      endDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      // Calculate difference in milliseconds and convert to days
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("Error calculating remaining days:", error);
      return null;
    }
  };
  
  // Function to check and handle expired subscriptions
  const checkExpiredSubscription = async () => {
    if (!user?.profile) return;
    
    // Only check for paid plans (pro or ultimate)
    if (user.profile.subscription_plan !== "pro" && user.profile.subscription_plan !== "ultimate") return;
    
    // Check if subscription has an end date
    if (!user.profile.subscription_end_date) return;
    
    // Calculate remaining days
    const remainingDays = calculateRemainingDays(user.profile.subscription_end_date);
    
    // If subscription has expired (0 days remaining), revert to basic plan
    if (remainingDays !== null && remainingDays <= 0) {
      try {
        console.log("Subscription expired, reverting to basic plan");
        console.log("Current subscription plan:", user.profile.subscription_plan);
        console.log("Subscription end date:", user.profile.subscription_end_date);
        
        // Update user profile with basic subscription
        const { data, error } = await supabase
          .from("user_profiles")
          .update({
            subscription_plan: "basic",
            subscription_end_date: null, // Basic plan doesn't expire
            updated_at: new Date().toISOString()
            // Keep the original subscription_start_date for record
          })
          .eq("user_id", user.id)
          .select();
          
        if (error) {
          console.error("Supabase error when reverting to basic plan:", error);
          throw error;
        }
        
        console.log("Database update successful:", data);
        
        // Update local user state
        if (user && user.profile) {
          setUser({
            ...user,
            profile: {
              ...user.profile,
              subscription_plan: "basic",
              subscription_end_date: null,
              updated_at: new Date().toISOString()
            }
          });
          
          console.log("Local user state updated to basic plan");
        }
        
        toast({
          title: "اشتراک منقضی شده",
          description: "اشتراک شما به پایان رسیده و به پلن پایه تغییر یافت.",
          variant: "default"
        });
        
      } catch (error) {
        console.error("Error reverting to basic plan:", error);
        
        toast({
          title: "خطا در بروزرسانی اشتراک",
          description: "مشکلی در تغییر اشتراک به پلن پایه رخ داد. لطفاً با پشتیبانی تماس بگیرید.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Function to format date to Persian format
  const formatDateToPersian = (dateStr: string | null): string => {
    if (!dateStr) return "تعیین نشده";
    
    try {
      const date = new Date(dateStr);
      // Format: YYYY/MM/DD
      return date.toLocaleDateString('fa-IR');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "تاریخ نامعتبر";
    }
  };
  
  // Function to render subscription status with remaining days
  const renderSubscriptionStatus = (plan: string | null, endDate: string | null): JSX.Element => {
    if (!plan || plan === "basic") {
      return (
        <span className="flex items-center justify-center">
          <Shield size={18} className="ml-2" />
          اشتراک فعال
        </span>
      );
    }
    
    const remainingDays = calculateRemainingDays(endDate);
    
    // Determine color based on plan type
    const colorClass = plan === "pro" 
      ? "from-amber-500/20 to-gold-500/20 text-amber-400" 
      : "from-purple-500/20 to-indigo-500/20 text-purple-400";
    
    const dotColor = plan === "pro" ? "bg-amber-400" : "bg-purple-400";
    
    return (
      <span className="flex items-center justify-center">
        <Shield size={18} className="ml-2" />
        اشتراک فعال
        {remainingDays !== null && (
          <span className={`mr-2 text-xs bg-gradient-to-r ${colorClass} px-2 py-1 rounded-full flex items-center`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1`}></span>
            {remainingDays} روز
          </span>
        )}
      </span>
    );
  };
  
  // Function to handle subscription payment
  const handleSubscription = async (planId: SubscriptionPlan, amount: number, period: 'monthly' | 'semiannual' | 'yearly') => {
    try {
      const loadingKey = `${planId}-${period}`;
      setLoading(loadingKey);
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "خطا در پرداخت",
          description: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
        });
        return;
      }
      
      // Handle basic plan activation without payment
      if (planId === "basic") {
        try {
          setPageLoading(true);
          
          // Update user profile with basic subscription
          const { error } = await supabase
            .from("user_profiles")
            .update({
              subscription_plan: "basic",
              subscription_start_date: new Date().toISOString(),
              subscription_end_date: null, // Basic plan doesn't expire
              updated_at: new Date().toISOString()
            })
            .eq("user_id", user.id);
            
          if (error) throw error;
          
          // Refresh user data
          await fetchUserData();
          
          toast({
            title: "اشتراک رایگان فعال شد",
            description: "اشتراک رایگان با موفقیت فعال شد.",
          });
          
          setLoading(null);
          return;
        } catch (error) {
          console.error("Error activating basic plan:", error);
          toast({
            variant: "destructive",
            title: "خطا در فعال‌سازی اشتراک رایگان",
            description: "مشکلی در فعال‌سازی اشتراک رایگان رخ داد. لطفاً دوباره تلاش کنید.",
          });
          setLoading(null);
          return;
        } finally {
          setPageLoading(false);
        }
      }
      
      // For paid plans, proceed with payment
      let planDuration = "1";
      if (period === 'yearly') {
        planDuration = "12";
      } else if (period === 'semiannual') {
        planDuration = "6";
      }
      
      const planName = planId === "pro" ? "پرو" : "آلتیمیت";
      const periodName = period === 'monthly' ? 'ماهانه' : (period === 'yearly' ? 'سالانه' : 'شش ماهه');
      
      const data = {
        merchant_id: "89999bca-a25d-4ada-9846-62ec13a250b1",
        amount: amount.toString(),
        description: `اشتراک ${periodName} ${planName} - LiftLegends`,
        metadata: {
          user_id: user.id,
          email: user.email || "",
          plan_id: planId,
          plan_period: period,
          plan_duration: planDuration
        },
        callback_url: window.location.origin + "/payment-callback"
      };
      
      const response = await axios.post('/api/zarinpal/payment-request', data);
      
      if (response.data.data && response.data.data.authority) {
        // Store payment info in localStorage for verification after callback
        localStorage.setItem('payment_info', JSON.stringify({
          authority: response.data.data.authority,
          amount: amount,
          plan_id: planId,
          user_id: user.id,
          timestamp: new Date().toISOString()
        }));
        
        // Redirect to Zarinpal payment page
        window.location.href = `https://staging.zarinpal.com/pg/StartPay/${response.data.data.authority}`;
      } else {
        throw new Error(response.data.errors?.message || 'خطا در اتصال به درگاه پرداخت');
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "خطا در پرداخت",
        description: error instanceof Error ? error.message : "مشکلی در پردازش پرداخت رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(null);
    }
  };
  
  // Function to update user subscription
  const updateUserSubscription = async (planId: SubscriptionPlan, userId: string, period: 'monthly' | 'yearly') => {
    try {
      setPageLoading(true);
      
      // Calculate subscription end date based on plan and period
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      // Set end date based on subscription period
      if (period === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (period === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      // Update user profile with new subscription details
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          subscription_plan: planId,
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local user state
      if (user && user.profile) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            subscription_plan: planId,
            subscription_start_date: startDate.toISOString(),
            subscription_end_date: endDate.toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
      
      // Show success message
      toast({
        title: "اشتراک با موفقیت فعال شد",
        description: `اشتراک ${period === 'monthly' ? 'ماهانه' : 'سالانه'} ${planId === 'pro' ? 'پرو' : 'آلتیمیت'} با موفقیت فعال شد.`,
      });
      
      return data;
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        variant: "destructive",
        title: "خطا در بروزرسانی اشتراک",
        description: "مشکلی در بروزرسانی اشتراک رخ داد. لطفاً با پشتیبانی تماس بگیرید.",
      });
      return null;
    } finally {
      setPageLoading(false);
    }
  };

  // Function to delete category
  const deleteCategory = async (id: string) => {
    try {
      console.log("Deleting category with ID:", id);
      setPageLoading(true);
      setDeletingCategoryId(id);
      
      // Delete category directly
      const { error } = await supabase
        .from("blog_categories")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Error from Supabase:", error);
        throw error;
      }
      
      console.log("Category deleted successfully");
      
      // Refresh categories
      await fetchBlogCategories();
      
      toast({
        title: "دسته‌بندی حذف شد",
        description: "دسته‌بندی با موفقیت حذف شد.",
      });
      
      // Close dialog
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "خطا در حذف دسته‌بندی",
        description: "مشکلی در حذف دسته‌بندی رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(null);
      setDeletingCategoryId(null);
    }
  };
  
  // Function to edit a blog post
  const editBlogPost = (post: BlogPost) => {
    setBlogFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      slug: post.slug,
      cover_image: post.cover_image || "",
      published: post.published,
      category: post.category || "none"
    });
    setIsEditing(true);
    setCurrentBlogId(post.id);
  };
  
  // Function to cancel editing
  const cancelEditing = () => {
    setBlogFormData({
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      cover_image: "",
      published: false,
      category: "none"
    });
    setIsEditing(false);
    setCurrentBlogId(null);
  };
  
  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };
  
  // Handle title change and auto-generate slug if not editing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setBlogFormData({
      ...blogFormData,
      title,
      slug: isEditing ? blogFormData.slug : generateSlug(title)
    });
  };
  
  // Handle blog form input changes
  const handleBlogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBlogFormData({
      ...blogFormData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle category form input changes
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFormData({
      ...categoryFormData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle category name change and auto-generate slug
  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCategoryFormData({
      ...categoryFormData,
      name,
      slug: generateSlug(name)
    });
  };
  
  // Handle category search
  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategorySearch(e.target.value);
  };
  
  // Filter categories based on search
  const filteredCategories = categorySearch.trim() === "" 
    ? blogCategories 
    : blogCategories.filter(category => 
        category.name.toLowerCase().includes(categorySearch.toLowerCase()) || 
        category.slug.toLowerCase().includes(categorySearch.toLowerCase())
      );
  
  // Handle published switch change
  const handlePublishedChange = (checked: boolean) => {
    setBlogFormData({
      ...blogFormData,
      published: checked
    });
  };
  
  // Handle category select change
  const handleCategoryChange = (value: string) => {
    setBlogFormData({
      ...blogFormData,
      category: value === "none" ? "" : value
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  

  
  // Load user data on component mount
  useEffect(() => {
    fetchUserData().then(() => {
      // Set active tab based on user role
      if (user?.profile?.is_admin) {
        setActiveTab("blog");
      }
    });
  }, []);
  
  // Check for expired subscriptions when user data is loaded
  useEffect(() => {
    if (user?.profile) {
      console.log("Checking subscription status...");
      checkExpiredSubscription();
      
      // Also set up an interval to check every minute while the user is on the page
      const intervalId = setInterval(() => {
        console.log("Periodic subscription check...");
        checkExpiredSubscription();
      }, 60000); // Check every minute
      
      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [user?.profile]);
  
  // Load blog data when blog tab is active and user is admin
  useEffect(() => {
    if (activeTab === "blog" && user?.profile?.is_admin) {
      fetchBlogPosts();
      fetchBlogCategories();
    }
  }, [activeTab, user?.profile?.is_admin]);
  
  // Fetch blog categories when component mounts
  useEffect(() => {
    if (user?.profile?.is_admin) {
      fetchBlogCategories();
    }
  }, [user?.profile?.is_admin]);
  
  // If loading, show loading spinner
  if (pageLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        <span className="mr-2 text-white">در حال بارگذاری...</span>
      </div>
    );
  }
  
  // If user is not logged in, redirect to home
  if (!user && !pageLoading) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">داشبورد کاربری</h1>
        
        <Tabs defaultValue="blog" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 mb-8 bg-gray-800/50 p-1 rounded-lg">
            {user?.profile?.is_admin && (
              <TabsTrigger value="blog" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                <Edit size={16} className="ml-2" />
                مدیریت بلاگ
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Blog Management Tab - Only visible to admins */}
          {user?.profile?.is_admin && (
            <TabsContent value="blog" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-gold-500">مدیریت بلاگ</CardTitle>
                  <CardDescription className="text-gray-400">
                    مقالات بلاگ را مدیریت کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Blog Post Form */}
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-4">
                      {isEditing ? "ویرایش مقاله" : "ایجاد مقاله جدید"}
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">عنوان مقاله</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="عنوان مقاله را وارد کنید"
                            value={blogFormData.title}
                            onChange={handleTitleChange}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="slug">نامک (URL)</Label>
                          <Input
                            id="slug"
                            name="slug"
                            placeholder="نامک مقاله را وارد کنید"
                            value={blogFormData.slug}
                            onChange={handleBlogInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="excerpt">خلاصه مقاله</Label>
                        <Textarea
                          id="excerpt"
                          name="excerpt"
                          placeholder="خلاصه مقاله را وارد کنید"
                          value={blogFormData.excerpt || ""}
                          onChange={handleBlogInputChange}
                          className="bg-gray-800 border-gray-700 text-white h-20"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content">محتوای مقاله</Label>
                        <Textarea
                          id="content"
                          name="content"
                          placeholder="محتوای مقاله را وارد کنید"
                          value={blogFormData.content}
                          onChange={handleBlogInputChange}
                          className="bg-gray-800 border-gray-700 text-white h-40"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cover_image">آدرس تصویر کاور</Label>
                          <Input
                            id="cover_image"
                            name="cover_image"
                            placeholder="آدرس تصویر کاور را وارد کنید"
                            value={blogFormData.cover_image || ""}
                            onChange={handleBlogInputChange}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">دسته‌بندی</Label>
                          <Select
                            value={blogFormData.category || "none"}
                            onValueChange={handleCategoryChange}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="none">بدون دسته‌بندی</SelectItem>
                              {blogCategories.map((category) => (
                                <SelectItem key={category.id} value={category.slug}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Switch
                          id="published"
                          checked={blogFormData.published}
                          onCheckedChange={handlePublishedChange}
                        />
                        <Label htmlFor="published">انتشار مقاله</Label>
                      </div>
                      
                      <div className="flex justify-end space-x-2 space-x-reverse">
                        {isEditing && (
                          <Button
                            variant="outline"
                            onClick={cancelEditing}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            انصراف
                          </Button>
                        )}
                        <Button
                          onClick={isEditing ? updateBlogPost : createBlogPost}
                          disabled={!!loading}
                          className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              در حال پردازش...
                            </>
                          ) : isEditing ? (
                            "بروزرسانی مقاله"
                          ) : (
                            "ایجاد مقاله"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Blog Categories */}
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-4">مدیریت دسته‌بندی‌ها</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="category_name">نام دسته‌بندی</Label>
                        <Input
                          id="category_name"
                          name="name"
                          placeholder="نام دسته‌بندی را وارد کنید"
                          value={categoryFormData.name}
                          onChange={handleCategoryNameChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category_slug">نامک دسته‌بندی</Label>
                        <Input
                          id="category_slug"
                          name="slug"
                          placeholder="نامک دسته‌بندی را وارد کنید"
                          value={categoryFormData.slug}
                          onChange={handleCategoryInputChange}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={createCategory}
                      disabled={!!loading}
                      className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          در حال پردازش...
                        </>
                      ) : (
                        "ایجاد دسته‌بندی"
                      )}
                    </Button>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">دسته‌بندی‌های موجود:</h4>
                        <span className="text-xs text-gray-400">{blogCategories.length} دسته‌بندی</span>
                      </div>
                      
                      <div className="relative mb-3">
                        <Input
                          placeholder="جستجوی دسته‌بندی..."
                          value={categorySearch}
                          onChange={handleCategorySearch}
                          className="bg-gray-800 border-gray-700 text-white pr-9"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {filteredCategories.map((category) => (
                          <div 
                            key={category.id} 
                            className="group relative flex items-center bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-full px-3 py-1.5 text-sm transition-all duration-200 hover:shadow-md"
                          >
                            <span className="font-medium text-white">{category.name}</span>
                            <span className="mr-2 text-xs text-gray-400 opacity-70">({category.slug})</span>
                            
                            <button 
                              className="mr-2 ml-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`آیا از حذف دسته‌بندی "${category.name}" اطمینان دارید؟`)) {
                                  console.log("Confirmed delete for category:", category.id);
                                  deleteCategory(category.id);
                                }
                              }}
                              disabled={!!loading}
                            >
                              {loading && deletingCategoryId === category.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </button>
                            
                            <div className="absolute inset-0 rounded-full ring-1 ring-white/10 transition-opacity group-hover:ring-white/20"></div>
                          </div>
                        ))}
                        {filteredCategories.length === 0 && (
                          <div className="w-full text-center py-6 text-gray-500 text-sm bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                            {categorySearch.trim() !== "" 
                              ? "هیچ دسته‌بندی‌ای با این عبارت یافت نشد" 
                              : "هنوز دسته‌بندی‌ای ایجاد نشده است"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Blog Posts List */}
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-4">لیست مقالات</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>لیست مقالات بلاگ</TableCaption>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-white">عنوان</TableHead>
                            <TableHead className="text-white">وضعیت</TableHead>
                            <TableHead className="text-white">دسته‌بندی</TableHead>
                            <TableHead className="text-white">تاریخ ایجاد</TableHead>
                            <TableHead className="text-white">عملیات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.length === 0 ? (
                            <TableRow className="border-gray-700">
                              <TableCell colSpan={5} className="text-center text-gray-400">
                                هیچ مقاله‌ای یافت نشد
                              </TableCell>
                            </TableRow>
                          ) : (
                            blogPosts.map((post) => (
                              <TableRow key={post.id} className="border-gray-700">
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell>
                                  {post.published ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/30 text-green-400">
                                      منتشر شده
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-400">
                                      پیش‌نویس
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>{post.category || "بدون دسته‌بندی"}</TableCell>
                                <TableCell>{formatDate(post.created_at)}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2 space-x-reverse">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => editBlogPost(post)}
                                      className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="bg-gray-800 border-gray-700">
                                        <DialogHeader>
                                          <DialogTitle>حذف مقاله</DialogTitle>
                                          <DialogDescription className="text-gray-400">
                                            آیا از حذف مقاله "{post.title}" اطمینان دارید؟
                                          </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="flex space-x-2 space-x-reverse">
                                          <DialogClose asChild>
                                            <Button variant="outline" className="border-gray-600">
                                              انصراف
                                            </Button>
                                          </DialogClose>
                                          <Button
                                            variant="destructive"
                                            onClick={() => deleteBlogPost(post.id)}
                                          >
                                            حذف
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;