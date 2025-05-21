import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
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
import { Loader2, Plus, Edit, Trash2, Check, X, Calendar, CreditCard } from "lucide-react";

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

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isActive: false,
    plan: null as string | null,
    endDate: null as string | null,
    daysRemaining: 0
  });
  
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
  
  // Subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "pro",
      name: "پرو",
      description: "مناسب برای افراد مبتدی و متوسط",
      price_monthly: 99000,
      price_yearly: 990000,
      features: [
        "دسترسی به تمام برنامه‌های تمرینی",
        "مشاوره آنلاین هفتگی",
        "برنامه غذایی شخصی‌سازی شده",
        "پشتیبانی ۲۴/۷"
      ]
    },
    {
      id: "ultimate",
      name: "آلتیمیت",
      description: "مناسب برای ورزشکاران حرفه‌ای",
      price_monthly: 199000,
      price_yearly: 1990000,
      features: [
        "تمام امکانات پلن پرو",
        "مشاوره آنلاین روزانه",
        "برنامه تمرینی اختصاصی",
        "آنالیز پیشرفت هفتگی",
        "جلسات مشاوره تصویری با مربیان حرفه‌ای"
      ]
    }
  ];
  
  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
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
      
      // Check subscription status
      if (profileData) {
        const { subscription_plan, subscription_end_date, is_admin } = profileData;
        
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
        
        setSubscriptionStatus({
          isActive: !!isActive,
          plan: subscription_plan,
          endDate: subscription_end_date,
          daysRemaining
        });
        
        // If user is admin, set active tab to blog
        if (is_admin) {
          setActiveTab("blog");
        }
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری اطلاعات",
        description: "مشکلی در دریافت اطلاعات کاربری رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(false);
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
      
      setLoading(true);
      
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
      setLoading(false);
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
      
      setLoading(true);
      
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
      setLoading(false);
    }
  };
  
  // Function to delete a blog post
  const deleteBlogPost = async (id: string) => {
    try {
      setLoading(true);
      
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
      setLoading(false);
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
      
      setLoading(true);
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
      setLoading(false);
    }
  };
  
  // State for dialog open/close
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  
  // Function to delete category
  const deleteCategory = async (id: string) => {
    try {
      console.log("Deleting category with ID:", id);
      setLoading(true);
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
      setLoading(false);
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
  
  // Function to handle subscription purchase
  const handleSubscriptionPurchase = (planId: string, isYearly: boolean) => {
    // This would typically redirect to a payment gateway
    // For now, we'll just show a toast message
    toast({
      title: "درخواست خرید اشتراک",
      description: `درخواست خرید اشتراک ${planId} ${isYearly ? 'سالانه' : 'ماهانه'} ثبت شد. بزودی به درگاه پرداخت منتقل خواهید شد.`,
    });
  };
  
  // Load user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);
  
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
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        <span className="mr-2 text-white">در حال بارگذاری...</span>
      </div>
    );
  }
  
  // If user is not logged in, redirect to home
  if (!user && !loading) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">داشبورد کاربری</h1>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid ${user?.profile?.is_admin ? 'grid-cols-3' : 'grid-cols-2'} mb-8 bg-gray-800/50 p-1 rounded-lg`}>
            {!user?.profile?.is_admin && (
              <>
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                  خلاصه وضعیت
                </TabsTrigger>
                <TabsTrigger value="subscription" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                  اشتراک
                </TabsTrigger>
              </>
            )}
            {user?.profile?.is_admin && (
              <>
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                  خلاصه وضعیت
                </TabsTrigger>
                <TabsTrigger value="subscription" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                  اشتراک
                </TabsTrigger>
                <TabsTrigger value="blog" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500 data-[state=active]:to-amber-400 data-[state=active]:text-black data-[state=active]:font-medium rounded-md transition-all duration-300">
                  مدیریت بلاگ
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-gold-500">خوش آمدید، {user?.profile?.name || user?.email}</CardTitle>
                <CardDescription className="text-gray-400">
                  خلاصه وضعیت حساب کاربری شما
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subscription Status */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Calendar className="h-5 w-5 ml-2 text-gold-500" />
                    وضعیت اشتراک
                  </h3>
                  {subscriptionStatus.isActive ? (
                    <div className="space-y-2">
                      <p className="text-green-400 flex items-center">
                        <Check className="h-4 w-4 ml-1" />
                        اشتراک فعال: {subscriptionStatus.plan}
                      </p>
                      <p className="text-sm text-gray-400">
                        تاریخ پایان: {subscriptionStatus.endDate ? formatDate(subscriptionStatus.endDate) : 'نامشخص'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {subscriptionStatus.daysRemaining} روز باقی‌مانده
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                        onClick={() => setActiveTab("subscription")}
                      >
                        مدیریت اشتراک
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-amber-400 flex items-center">
                        <X className="h-4 w-4 ml-1" />
                        بدون اشتراک فعال
                      </p>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="mt-2 bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black"
                        onClick={() => setActiveTab("subscription")}
                      >
                        خرید اشتراک
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2">وضعیت پروفایل</h3>
                    <p className="text-sm text-gray-400">
                      {user?.profile?.name ? 'تکمیل شده' : 'ناقص - لطفاً پروفایل خود را تکمیل کنید'}
                    </p>
                    {!user?.profile?.name && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2 text-gold-500 p-0"
                        onClick={() => navigate("/profile")}
                      >
                        تکمیل پروفایل
                      </Button>
                    )}
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2">هدف تناسب اندام</h3>
                    <p className="text-sm text-gray-400">
                      {user?.profile?.goal || 'تعیین نشده'}
                    </p>
                    {!user?.profile?.goal && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2 text-gold-500 p-0"
                        onClick={() => navigate("/profile")}
                      >
                        تعیین هدف
                      </Button>
                    )}
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2">تاریخ عضویت</h3>
                    <p className="text-sm text-gray-400">
                      {user?.created_at ? formatDate(user.created_at) : 'نامشخص'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-gold-500">مدیریت اشتراک</CardTitle>
                <CardDescription className="text-gray-400">
                  اشتراک خود را مدیریت کنید یا اشتراک جدید خریداری کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Subscription */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-700 mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <CreditCard className="h-5 w-5 ml-2 text-gold-500" />
                    اشتراک فعلی
                  </h3>
                  {subscriptionStatus.isActive ? (
                    <div className="space-y-2">
                      <p className="text-green-400 flex items-center">
                        <Check className="h-4 w-4 ml-1" />
                        اشتراک فعال: {subscriptionStatus.plan}
                      </p>
                      <p className="text-sm text-gray-400">
                        تاریخ پایان: {subscriptionStatus.endDate ? formatDate(subscriptionStatus.endDate) : 'نامشخص'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {subscriptionStatus.daysRemaining} روز باقی‌مانده
                      </p>
                    </div>
                  ) : (
                    <p className="text-amber-400 flex items-center">
                      <X className="h-4 w-4 ml-1" />
                      بدون اشتراک فعال
                    </p>
                  )}
                </div>
                
                {/* Subscription Plans */}
                <h3 className="text-lg font-medium mb-4">پلن‌های اشتراک</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-gold-500/20 to-amber-400/20 p-1"></div>
                      <CardHeader>
                        <CardTitle className="text-xl text-gold-500">{plan.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">ماهانه:</span>
                            <span className="text-lg font-bold text-white">{plan.price_monthly.toLocaleString()} تومان</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">سالانه:</span>
                            <span className="text-lg font-bold text-white">{plan.price_yearly.toLocaleString()} تومان</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-700">
                          <h4 className="text-sm font-medium mb-2">ویژگی‌ها:</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-4 w-4 ml-2 text-green-500 mt-0.5" />
                                <span className="text-sm text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col space-y-2">
                        <Button 
                          className="w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black"
                          onClick={() => handleSubscriptionPurchase(plan.id, false)}
                        >
                          خرید اشتراک ماهانه
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full border-gold-500/30 text-gold-500 hover:bg-gold-500/10"
                          onClick={() => handleSubscriptionPurchase(plan.id, true)}
                        >
                          خرید اشتراک سالانه (۱۰٪ تخفیف)
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Blog Management Tab - Only visible to admins */}
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
                          disabled={loading}
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
                      disabled={loading}
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
                              disabled={loading}
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
          
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;