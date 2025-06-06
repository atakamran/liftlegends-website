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
import { Loader2, Plus, Edit, Trash2, Check, X, Calendar, CreditCard, Shield, Zap, LogOut, Menu } from "lucide-react";
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

interface UserPurchase {
  id: string;
  user_id: string;
  plan_id: string;
  purchase_date: string;
  amount: number;
  payment_id: string | null;
  payment_status: string;
  expires_at: string | null;
  program_id?: string | null;
  plan?: {
    name: string;
    description: string;
  };
  program?: {
    title: string;
    description: string;
    program_url?: string | null;
  };
}

interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'training' | 'diet' | 'supplement';
  image_url: string | null;
  created_at: string;
  updated_at: string;
  program_url: string | null;
}

interface ProgramDetail {
  id: string;
  program_id: string;
  title: string;
  description: string;
  details: any | null;
  weeks: any | null;
  created_at: string;
  updated_at: string;
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [userPurchases, setUserPurchases] = useState<UserPurchase[]>([]);
  const [activeTab, setActiveTab] = useState("training");
  
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
  
  // State for products
  const [products, setProducts] = useState<Program[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<Program[]>([]);
  const [dietPrograms, setDietPrograms] = useState<Program[]>([]);
  const [supplementPrograms, setSupplementPrograms] = useState<Program[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productFormData, setProductFormData] = useState<Partial<Program>>({
    title: "",
    description: "",
    price: 0,
    category: "training",
    image_url: "",
    program_url: ""
  });
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  // Program details management state
  const [programDetails, setProgramDetails] = useState<ProgramDetail[]>([]);
  const [programDetailsLoading, setProgramDetailsLoading] = useState(false);
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<ProgramDetail | null>(null);
  const [programDetailFormData, setProgramDetailFormData] = useState<Partial<ProgramDetail>>({
    title: "",
    description: "",
    details: null,
    weeks: null
  });
  const [isEditingProgramDetail, setIsEditingProgramDetail] = useState(false);
  const [currentProgramDetailId, setCurrentProgramDetailId] = useState<string | null>(null);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      
      const { data, error } = await supabase
        .from("programs_sale")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Map programs_sale data to Program interface
      const programsData = data ? data.map(program => ({
        id: program.id,
        title: program.title,
        description: program.description,
        price: program.price,
        category: program.category as 'training' | 'diet' | 'supplement',
        image_url: program.image_url,
        created_at: program.created_at || new Date().toISOString(),
        updated_at: program.updated_at || new Date().toISOString(),
        program_url: program.program_url || null
      } as Program)) : [];
      
      setProducts(programsData);
      
      // Categorize programs
      setTrainingPrograms(programsData.filter(program => program.category === 'training'));
      setDietPrograms(programsData.filter(program => program.category === 'diet'));
      setSupplementPrograms(programsData.filter(program => program.category === 'supplement'));
      
      console.log("Programs fetched:", programsData.length);
      console.log("Training programs:", programsData.filter(program => program.category === 'training').length);
      console.log("Diet programs:", programsData.filter(program => program.category === 'diet').length);
      console.log("Supplement programs:", programsData.filter(program => program.category === 'supplement').length);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری محصولات",
        description: "مشکلی در دریافت لیست محصولات رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setProductLoading(false);
    }
  };

  // Function to create a new product
  const createProduct = async () => {
    try {
      // Validate form data
      if (!productFormData.title || !productFormData.description || productFormData.price <= 0) {
        toast({
          variant: "destructive",
          title: "خطا در ثبت محصول",
          description: "لطفاً عنوان، توضیحات و قیمت محصول را وارد کنید.",
        });
        return;
      }
      
      setProductLoading(true);
      
      // Create new product
      const { data: productData, error: productError } = await supabase
        .from("programs_sale")
        .insert({
          title: productFormData.title || "",
          description: productFormData.description || "",
          price: productFormData.price || 0,
          category: productFormData.category || "training",
          image_url: productFormData.image_url || null,
          program_url: productFormData.program_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (productError) throw productError;
      
      // Create corresponding program details
      const { error: detailsError } = await supabase
        .from("program_details")
        .insert({
          program_id: productData.id,
          title: productFormData.title || "",
          description: productFormData.description || "",
          details: null,
          weeks: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (detailsError) {
        console.error("Error creating program details:", detailsError);
        // Don't throw error here, just log it as the main product was created successfully
      }
      
      // Refresh products
      fetchProducts();
      
      // Reset form
      setProductFormData({
        title: "",
        description: "",
        price: 0,
        category: "training",
        image_url: "",
        program_url: ""
      });
      
      toast({
        title: "محصول جدید ایجاد شد",
        description: "محصول جدید و جزئیات برنامه با موفقیت ایجاد شد.",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        variant: "destructive",
        title: "خطا در ایجاد محصول",
        description: "مشکلی در ایجاد محصول جدید رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setProductLoading(false);
    }
  };

  // Function to update a product
  const updateProduct = async () => {
    try {
      if (!currentProductId) return;
      
      // Validate form data
      if (!productFormData.title || !productFormData.description || productFormData.price <= 0) {
        toast({
          variant: "destructive",
          title: "خطا در بروزرسانی محصول",
          description: "لطفاً عنوان، توضیحات و قیمت محصول را وارد کنید.",
        });
        return;
      }
      
      setProductLoading(true);
      
      // Update product
      const { data, error } = await supabase
        .from("programs_sale")
        .update({
          title: productFormData.title,
          description: productFormData.description,
          price: productFormData.price,
          category: productFormData.category,
          image_url: productFormData.image_url,
          program_url: productFormData.program_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", currentProductId)
        .select();
        
      if (error) throw error;
      
      // Refresh products
      fetchProducts();
      
      // Reset form and editing state
      setProductFormData({
        title: "",
        description: "",
        price: 0,
        category: "training",
        image_url: "",
        program_url: ""
      });
      setIsEditingProduct(false);
      setCurrentProductId(null);
      
      toast({
        title: "محصول بروزرسانی شد",
        description: "محصول با موفقیت بروزرسانی شد.",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "خطا در بروزرسانی محصول",
        description: "مشکلی در بروزرسانی محصول رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setProductLoading(false);
    }
  };

  // Function to delete a product
  const deleteProduct = async (id: string) => {
    try {
      setProductLoading(true);
      
      // Delete product
      const { error } = await supabase
        .from("programs_sale")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Refresh products
      fetchProducts();
      
      toast({
        title: "محصول حذف شد",
        description: "محصول با موفقیت حذف شد.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "خطا در حذف محصول",
        description: "مشکلی در حذف محصول رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setProductLoading(false);
    }
  };

  // Function to edit a product
  const editProduct = (product: Program) => {
    setProductFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      program_url: product.program_url
    });
    setIsEditingProduct(true);
    setCurrentProductId(product.id);
  };

  // Function to cancel editing
  const cancelEditProduct = () => {
    setProductFormData({
      title: "",
      description: "",
      price: 0,
      category: "training",
      image_url: "",
      program_url: ""
    });
    setIsEditingProduct(false);
    setCurrentProductId(null);
  };

  // Function to fetch program details
  const fetchProgramDetails = async () => {
    try {
      setProgramDetailsLoading(true);
      
      const { data, error } = await supabase
        .from("program_details")
        .select(`
          *,
          programs_sale!inner(title, category)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setProgramDetails(data || []);
      console.log("Program details fetched:", data?.length || 0);
    } catch (error) {
      console.error("Error fetching program details:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری جزئیات برنامه‌ها",
        description: "مشکلی در دریافت لیست جزئیات برنامه‌ها رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setProgramDetailsLoading(false);
    }
  };

  // Function to update program details
  const updateProgramDetail = async () => {
    try {
      if (!currentProgramDetailId) return;
      
      // Validate form data
      if (!programDetailFormData.title || !programDetailFormData.description) {
        toast({
          variant: "destructive",
          title: "خطا در بروزرسانی جزئیات برنامه",
          description: "لطفاً عنوان و توضیحات برنامه را وارد کنید.",
        });
        return;
      }
      
      setProgramDetailsLoading(true);
      
      // Update program details
      const { data, error } = await supabase
        .from("program_details")
        .update({
          title: programDetailFormData.title,
          description: programDetailFormData.description,
          details: programDetailFormData.details,
          weeks: programDetailFormData.weeks,
          updated_at: new Date().toISOString()
        })
        .eq("id", currentProgramDetailId)
        .select();
        
      if (error) throw error;
      
      // Refresh program details
      fetchProgramDetails();
      
      // Reset form
      setProgramDetailFormData({
        title: "",
        description: "",
        details: null,
        weeks: null
      });
      setIsEditingProgramDetail(false);
      setCurrentProgramDetailId(null);
      
      toast({
        title: "جزئیات برنامه بروزرسانی شد",
        description: "جزئیات برنامه با موفقیت بروزرسانی شد.",
      });
    } catch (error) {
      console.error("Error updating program detail:", error);
      toast({
        variant: "destructive",
        title: "خطا در بروزرسانی جزئیات برنامه",
        description: "مشکلی در بروزرسانی جزئیات برنامه رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setProgramDetailsLoading(false);
    }
  };

  // Function to edit program details
  const editProgramDetail = (programDetail: ProgramDetail) => {
    setProgramDetailFormData({
      title: programDetail.title,
      description: programDetail.description,
      details: programDetail.details,
      weeks: programDetail.weeks
    });
    setCurrentProgramDetailId(programDetail.id);
    setIsEditingProgramDetail(true);
  };

  // Function to cancel edit program details
  const cancelEditProgramDetail = () => {
    setProgramDetailFormData({
      title: "",
      description: "",
      details: null,
      weeks: null
    });
    setCurrentProgramDetailId(null);
    setIsEditingProgramDetail(false);
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
  
  // Helper function to check if user has purchased a specific program
  const hasPurchasedProgram = (programId: string): boolean => {
    if (!userPurchases || userPurchases.length === 0) return false;
    
    return userPurchases.some(
      purchase => purchase.program_id === programId && purchase.payment_status === 'completed'
    );
  };

  // Function to fetch user purchases
  const fetchUserPurchases = async () => {
    try {
      if (!user) return;
      
      // First, let's get the purchases without the join to ensure we have the basic data
      const { data, error } = await supabase
        .from("user_purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("purchase_date", { ascending: false });
        
      if (error) {
        console.error("Error fetching user purchases:", error);
        throw error;
      }
      
      // Now, for each purchase, let's get the plan or program details
      const purchasesWithDetails = await Promise.all(
        (data || []).map(async (purchase) => {
          // Create a properly typed UserPurchase object from the database result
          const typedPurchase: UserPurchase = {
            id: purchase.id as string,
            user_id: purchase.user_id as string,
            plan_id: 'plan_id' in purchase ? purchase.plan_id as string : "", // Check if property exists
            purchase_date: purchase.purchase_date as string,
            amount: Number(purchase.amount),
            payment_id: purchase.payment_id as string | null,
            payment_status: 'payment_status' in purchase ? purchase.payment_status as string : "pending",
            expires_at: purchase.expires_at as string | null,
            program_id: purchase.program_id as string | null
          };
          
          try {
            // Check if this is a program purchase
            if (typedPurchase.program_id) {
              // Get the program details
              const { data: programData, error: programError } = await supabase
                .from("programs_sale")
                .select("title, description, image_url, category, program_url")
                .eq("id", typedPurchase.program_id)
                .single();
                
              if (programError) {
                console.error("Error fetching program details:", programError);
                return {
                  ...typedPurchase,
                  plan: { name: "برنامه نامشخص", description: "" },
                  program: { title: "برنامه نامشخص", description: "", program_url: null, category: null }
                };
              }
              
              // Create a properly typed program object with the program_url field
              const program = {
                title: programData.title,
                description: programData.description,
                program_url: programData.program_url, // Use the actual program_url from the database
                category: programData.category
              };
              
              return {
                ...typedPurchase,
                program: program,
                plan: { name: "خرید برنامه", description: program.title }
              };
            } else {
              // Get the plan details
              const { data: planData, error: planError } = await supabase
                .from("fitness_plans")
                .select("name, description")
                .eq("id", typedPurchase.plan_id)
                .single();
                
              if (planError) {
                console.error("Error fetching plan details:", planError);
                return {
                  ...typedPurchase,
                  plan: { name: "برنامه نامشخص", description: "" }
                };
              }
              
              return {
                ...typedPurchase,
                plan: planData
              };
            }
          } catch (err) {
            console.error("Error processing purchase data:", err);
            return {
              ...typedPurchase,
              plan: { name: "برنامه نامشخص", description: "" }
            };
          }
        })
      );
      
      console.log("User purchases fetched:", purchasesWithDetails.length);
      setUserPurchases(purchasesWithDetails as UserPurchase[]);
    } catch (error) {
      console.error("Error fetching user purchases:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری تاریخچه پرداخت‌ها",
        description: "مشکلی در دریافت تاریخچه پرداخت‌ها رخ داد. لطفاً دوباره تلاش کنید.",
      });
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
  
  // Function to check if user has purchased a specific program is defined above
  

  
  // Load user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // Check for expired subscriptions when user data is loaded
  useEffect(() => {
    if (user?.profile) {
      console.log("Checking subscription status...");
      checkExpiredSubscription();
      
      // Fetch user purchases
      fetchUserPurchases();
      
      // Also set up an interval to check every minute while the user is on the page
      const intervalId = setInterval(() => {
        console.log("Periodic subscription check...");
        checkExpiredSubscription();
        // Also periodically refresh user purchases
        fetchUserPurchases();
      }, 60000); // Check every minute
      
      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [user?.profile]);
  
  // Load products data when products tab is active and user is admin
  // Also load programs data for training, meals, and supplements tabs
  useEffect(() => {
    if ((activeTab === "products" && user?.profile?.is_admin) || 
        activeTab === "training" || 
        activeTab === "meals" || 
        activeTab === "supplements") {
      fetchProducts();
    }
  }, [activeTab, user?.profile?.is_admin]);

  // Load blog data when blog tab is active and user is admin
  useEffect(() => {
    if (activeTab === "blog" && user?.profile?.is_admin) {
      fetchBlogPosts();
      fetchBlogCategories();
    }
    
    // Load user purchases when payments tab is active
    if (activeTab === "payments" && user) {
      fetchUserPurchases();
    }
    
    // Load program details when program management tab is active and user is admin
    if (activeTab === "program-management" && user?.profile?.is_admin) {
      fetchProgramDetails();
    }
  }, [activeTab, user?.profile?.is_admin, user]);
  
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pb-20 lg:pb-0">
      {/* Mobile Header Removed */}
      
      {/* Main Dashboard Layout */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar - Hidden on Mobile */}
        <div className="hidden lg:flex lg:w-64 bg-gray-800/50 backdrop-blur-md border-l border-gray-700/30 h-screen sticky top-0 flex-col">
          <div className="p-6">
            <div className="relative">
              <h1 className="text-2xl font-bold text-gold-500 mb-24"></h1>
              <p className="text-sm text-gray-400 mb-6"></p>
            </div>
            
            {/* Removed User Profile Summary */}
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-col w-full space-y-2 bg-transparent">
                {/* User Profile Section */}
                <div className="mb-6 px-2">
                  <div className="flex items-center space-x-3 space-x-reverse mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-gold-500/20">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{user?.profile?.name || user?.email?.split('@')[0] || "کاربر"}</h3>
                      <p className="text-xs text-gray-400">{user?.email || ""}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">اشتراک فعال</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400">
                        {user?.profile?.subscription_plan === "basic" && "پایه"}
                        {user?.profile?.subscription_plan === "pro" && "پرو"}
                        {user?.profile?.subscription_plan === "ultimate" && "آلتیمیت"}
                      </span>
                    </div>
                    
                    {user?.profile?.subscription_plan !== "basic" && user?.profile?.subscription_end_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">زمان باقیمانده</span>
                        <span className="text-xs font-medium">
                          {calculateRemainingDays(user?.profile?.subscription_end_date)} روز
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-2 mb-2">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">منوی اصلی</h4>
                </div>
                
                {/* Main Navigation Items */}
                <TabsTrigger 
                  value="training" 
                  className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                    data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                    hover:bg-gray-700/30"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                      <Zap size={18} className="text-gold-500" />
                    </div>
                    <span>برنامه‌های تمرینی</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="meals" 
                  className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                    data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                    hover:bg-gray-700/30"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                        <path d="M7 2v20"></path>
                        <path d="M21 15V2"></path>
                        <path d="M18 15V2"></path>
                        <path d="M21 15a3 3 0 1 1-6 0"></path>
                      </svg>
                    </div>
                    <span>برنامه‌های غذایی</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="supplements" 
                  className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                    data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                    hover:bg-gray-700/30"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                        <path d="m8 21 8-9"></path>
                        <path d="M12 21a9 9 0 0 0 0-18C7.5 3 4 7.5 4 11c0 2 1 4 2 6"></path>
                        <path d="M19.8 17.8a9 9 0 0 0 .2-2c0-2.8-1-5.5-2.8-7.4"></path>
                        <path d="M13.5 8.5A5 5 0 0 0 12 8a5 5 0 0 0-5 5c0 1.1.4 2.2 1 3"></path>
                      </svg>
                    </div>
                    <span>برنامه‌های مکمل</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="orders" 
                  className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                    data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                    hover:bg-gray-700/30"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                        <path d="M3 6h18"></path>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    </div>
                    <span>سفارش‌ها</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="payments" 
                  className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                    data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                    hover:bg-gray-700/30"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                      <CreditCard size={18} className="text-gold-500" />
                    </div>
                    <span>پرداخت‌ها</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="profile" 
                  className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                    data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                    hover:bg-gray-700/30"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span>پروفایل</span>
                  </div>
                </TabsTrigger>
                
                {user?.profile?.is_admin && (
                  <>
                    <div className="px-2 mt-6 mb-2">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">مدیریت</h4>
                    </div>
                    
                    <TabsTrigger 
                      value="products" 
                      className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                        data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                        hover:bg-gray-700/30"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                            <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                            <line x1="2" x2="22" y1="10" y2="10"></line>
                          </svg>
                        </div>
                        <span>مدیریت محصولات</span>
                      </div>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="blog" 
                      className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                        data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                        hover:bg-gray-700/30"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                          <Edit size={18} className="text-gold-500" />
                        </div>
                        <span>مدیریت بلاگ</span>
                      </div>
                    </TabsTrigger>
                    
                    <TabsTrigger 
                      value="program-management" 
                      className="group w-full justify-start px-4 py-3 text-right rounded-lg transition-all duration-300
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-500/20 data-[state=active]:to-transparent 
                        data-[state=active]:border-r-4 data-[state=active]:border-gold-500 data-[state=active]:text-white
                        hover:bg-gray-700/30"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold-500/10 to-amber-600/10 flex items-center justify-center mr-3 ml-3 group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-gold-500/20 group-data-[state=active]:to-amber-600/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                          </svg>
                        </div>
                        <span>مدیریت برنامه‌ها</span>
                      </div>
                    </TabsTrigger>
                  </>
                )}
                
                {/* Logout Button */}
                <div className="mt-auto pt-6 px-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-700 hover:border-red-500 hover:bg-red-500/10 text-gray-400 hover:text-red-400 flex items-center justify-center"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate('/');
                    }}
                  >
                    <LogOut size={16} className="ml-2" />
                    خروج از حساب
                  </Button>
                </div>
              </TabsList>
            </Tabs>
          </nav>
          

        </div>
        
        {/* Modern Mobile Footer Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/30 rounded-t-xl shadow-lg">
            <div className="px-2 pt-2 pb-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex w-full bg-transparent justify-between p-1">
                  <TabsTrigger value="training" className="flex-1 flex flex-col items-center py-2 text-xs rounded-lg data-[state=active]:bg-gray-800 data-[state=active]:text-gold-500 transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-800/70 flex items-center justify-center mb-1 data-[state=active]:bg-gold-500/20">
                      <Zap size={18} className="data-[state=active]:text-gold-500" />
                    </div>
                    <span>تمرین</span>
                  </TabsTrigger>
                  
                  <TabsTrigger value="meals" className="flex-1 flex flex-col items-center py-2 text-xs rounded-lg data-[state=active]:bg-gray-800 data-[state=active]:text-gold-500 transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-800/70 flex items-center justify-center mb-1 data-[state=active]:bg-gold-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2"></path><path d="M18 15V2"></path><path d="M21 15a3 3 0 1 1-6 0"></path></svg>
                    </div>
                    <span>غذا</span>
                  </TabsTrigger>
                  
                  <TabsTrigger value="supplements" className="flex-1 flex flex-col items-center py-2 text-xs rounded-lg data-[state=active]:bg-gray-800 data-[state=active]:text-gold-500 transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-800/70 flex items-center justify-center mb-1 data-[state=active]:bg-gold-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 21 8-9"></path><path d="M12 21a9 9 0 0 0 0-18C7.5 3 4 7.5 4 11c0 2 1 4 2 6"></path><path d="M19.8 17.8a9 9 0 0 0 .2-2c0-2.8-1-5.5-2.8-7.4"></path><path d="M13.5 8.5A5 5 0 0 0 12 8a5 5 0 0 0-5 5c0 1.1.4 2.2 1 3"></path></svg>
                    </div>
                    <span>مکمل</span>
                  </TabsTrigger>
                  
                  <TabsTrigger value="orders" className="flex-1 flex flex-col items-center py-2 text-xs rounded-lg data-[state=active]:bg-gray-800 data-[state=active]:text-gold-500 transition-all duration-200">
                    <div className="w-10 h-10 rounded-full bg-gray-800/70 flex items-center justify-center mb-1 data-[state=active]:bg-gold-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    </div>
                    <span>سفارش</span>
                  </TabsTrigger>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex-1 flex flex-col items-center py-2 text-xs rounded-lg hover:bg-gray-800 transition-all duration-200">
                        <div className="w-10 h-10 rounded-full bg-gray-800/70 flex items-center justify-center mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </div>
                        <span>بیشتر</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-gold-500">گزینه‌های بیشتر</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col space-y-2 py-4">
                        <Button 
                          variant="ghost" 
                          className="justify-start text-white hover:bg-gray-700/50"
                          onClick={() => setActiveTab("payments")}
                        >
                          <CreditCard size={18} className="ml-3 text-gold-500" />
                          پرداخت‌ها
                        </Button>
                        {user?.profile?.is_admin && (
                          <Button 
                            variant="ghost" 
                            className="justify-start text-white hover:bg-gray-700/50"
                            onClick={() => setActiveTab("blog")}
                          >
                            <Edit size={18} className="ml-3 text-gold-500" />
                            مدیریت بلاگ
                          </Button>
                        )}
                        <div className="border-t border-gray-700 my-2 pt-2">
                          <Button 
                            variant="ghost" 
                            className="justify-start text-gray-400 hover:text-white hover:bg-gray-700/50 w-full"
                            onClick={async () => {
                              await supabase.auth.signOut();
                              localStorage.setItem('isLoggedIn', 'false');
                              localStorage.removeItem('headauth'); // Clear cached auth data
                              navigate('/');
                            }}
                          >
                            <LogOut size={18} className="ml-2" />
                            خروج از حساب
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-8 lg:mt-0 mb-28 lg:mb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Training Programs Tab */}
            <TabsContent value="training" className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">برنامه‌های تمرینی</h2>
                <Button 
                  className="bg-gold-500 hover:bg-gold-600 text-black"
                  onClick={() => navigate('/programs')}
                >
                  <Plus size={16} className="ml-2" />
                  برنامه جدید
                </Button>
              </div>

              
              {/* Training Programs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productLoading ? (
                  <div className="col-span-3 flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
                    <span className="mr-2 text-gray-400">در حال بارگذاری برنامه‌ها...</span>
                  </div>
                ) : trainingPrograms.length > 0 ? (
                  trainingPrograms.map((program) => (
                    <Card key={program.id} className="bg-gray-800/50 border-gray-700 hover:border-gold-500/50 transition-all duration-300 overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-gold-500/20 to-amber-500/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {program.image_url ? (
                            <img 
                              src={program.image_url} 
                              alt={program.title} 
                              className="object-cover w-full h-full opacity-60"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-400 opacity-50"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <span className="bg-gold-500/20 text-gold-300 text-xs font-medium px-2.5 py-1 rounded-full">تمرینی</span>
                          {hasPurchasedProgram(program.id) && (
                            <span className="bg-gold-500/20 text-gold-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                              <Check size={12} className="ml-1" />
                              خریداری شده
                            </span>
                          )}
                          {user?.profile?.is_admin && !hasPurchasedProgram(program.id) && (
                            <span className="bg-blue-500/20 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                              <Shield size={12} className="ml-1" />
                              دسترسی ادمین
                            </span>
                          )}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">قیمت: {program.price.toLocaleString()} تومان</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-700 hover:border-gold-500 hover:bg-gold-500/10"
                          onClick={() => {
                            if (hasPurchasedProgram(program.id) || user?.profile?.is_admin) {
                              // Navigate to program details page
                              navigate(`/programs/${program.id}/details`);
                            } else {
                              // Navigate to purchase page
                              navigate(`/product/${program.id}`);
                            }
                          }}
                        >
                          {(hasPurchasedProgram(program.id) || user?.profile?.is_admin) ? "مشاهده برنامه" : "خرید برنامه"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-400">هیچ برنامه تمرینی یافت نشد.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Meal Plans Tab */}
            <TabsContent value="meals" className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">برنامه‌های غذایی</h2>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => navigate('/programs')}
                >
                  <Plus size={16} className="ml-2" />
                  برنامه جدید
                </Button>
              </div>

              
              {/* Meal Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productLoading ? (
                  <div className="col-span-3 flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    <span className="mr-2 text-gray-400">در حال بارگذاری برنامه‌ها...</span>
                  </div>
                ) : dietPrograms.length > 0 ? (
                  dietPrograms.map((program) => (
                    <Card key={program.id} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-green-500/20 to-teal-500/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {program.image_url ? (
                            <img 
                              src={program.image_url} 
                              alt={program.title} 
                              className="object-cover w-full h-full opacity-60"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 opacity-50"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2"></path><path d="M18 15V2"></path><path d="M21 15a3 3 0 1 1-6 0"></path></svg>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <span className="bg-green-500/20 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">غذایی</span>
                          {hasPurchasedProgram(program.id) && (
                            <span className="bg-gold-500/20 text-gold-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                              <Check size={12} className="ml-1" />
                              خریداری شده
                            </span>
                          )}
                          {user?.profile?.is_admin && !hasPurchasedProgram(program.id) && (
                            <span className="bg-blue-500/20 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                              <Shield size={12} className="ml-1" />
                              دسترسی ادمین
                            </span>
                          )}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">قیمت: {program.price.toLocaleString()} تومان</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-700 hover:border-green-500 hover:bg-green-500/10"
                          onClick={() => {
                            if (hasPurchasedProgram(program.id) || user?.profile?.is_admin) {
                              // Navigate to program details page
                              navigate(`/programs/${program.id}/details`);
                            } else {
                              // Navigate to purchase page
                              navigate(`/product/${program.id}`);
                            }
                          }}
                        >
                          {(hasPurchasedProgram(program.id) || user?.profile?.is_admin) ? "مشاهده برنامه" : "خرید برنامه"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-400">هیچ برنامه غذایی یافت نشد.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Supplement Plans Tab */}
            <TabsContent value="supplements" className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">برنامه‌های مکمل</h2>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => navigate('/programs')}
                >
                  <Plus size={16} className="ml-2" />
                  برنامه جدید
                </Button>
              </div>
              
              
              {/* Supplement Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productLoading ? (
                  <div className="col-span-3 flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <span className="mr-2 text-gray-400">در حال بارگذاری برنامه‌ها...</span>
                  </div>
                ) : supplementPrograms.length > 0 ? (
                  supplementPrograms.map((program) => (
                    <Card key={program.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {program.image_url ? (
                            <img 
                              src={program.image_url} 
                              alt={program.title} 
                              className="object-cover w-full h-full opacity-60"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 opacity-50"><path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"></path><rect x="3" y="14" width="7" height="7" rx="1"></rect><circle cx="17.5" cy="17.5" r="3.5"></circle></svg>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <span className="bg-purple-500/20 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">مکمل</span>
                          {hasPurchasedProgram(program.id) && (
                            <span className="bg-gold-500/20 text-gold-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                              <Check size={12} className="ml-1" />
                              خریداری شده
                            </span>
                          )}
                          {user?.profile?.is_admin && !hasPurchasedProgram(program.id) && (
                            <span className="bg-blue-500/20 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                              <Shield size={12} className="ml-1" />
                              دسترسی ادمین
                            </span>
                          )}
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">قیمت: {program.price.toLocaleString()} تومان</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-700 hover:border-purple-500 hover:bg-purple-500/10"
                          onClick={() => {
                            if (hasPurchasedProgram(program.id) || user?.profile?.is_admin) {
                              // Navigate to program details page
                              navigate(`/programs/${program.id}/details`);
                            } else {
                              // Navigate to purchase page
                              navigate(`/product/${program.id}`);
                            }
                          }}
                        >
                          {(hasPurchasedProgram(program.id) || user?.profile?.is_admin) ? "مشاهده برنامه" : "خرید برنامه"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-400">هیچ برنامه مکملی یافت نشد.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">سفارش‌ها</h2>
              </div>
              
              {/* Empty Orders Tab */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 py-8">این بخش در حال حاضر خالی است.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">پرداخت‌ها</h2>
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:border-blue-500 hover:bg-blue-500/10"
                  onClick={fetchUserPurchases}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  بروزرسانی
                </Button>
              </div>
              
              {/* Payment Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-400">مجموع پرداخت‌ها</CardDescription>
                    <CardTitle className="text-2xl text-white">
                      {userPurchases.reduce((total, purchase) => total + (purchase.amount || 0), 0).toLocaleString('fa-IR')} تومان
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M12 20v-6"></path><path d="M18 20V10"></path><path d="M6 20v-3"></path></svg>
                      تعداد کل پرداخت‌ها: {userPurchases.length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-400">آخرین پرداخت</CardDescription>
                    <CardTitle className="text-2xl text-white">
                      {userPurchases.length > 0 
                        ? new Intl.NumberFormat('fa-IR').format(userPurchases[0]?.amount || 0) + ' تومان'
                        : 'بدون پرداخت'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      {userPurchases.length > 0 && userPurchases[0]?.purchase_date
                        ? formatDate(userPurchases[0].purchase_date)
                        : 'بدون تاریخ'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-400">وضعیت اشتراک</CardDescription>
                    <CardTitle className="text-2xl text-white">
                      {user?.profile?.subscription_plan === 'basic' ? 'پایه' : 
                       user?.profile?.subscription_plan === 'pro' ? 'حرفه‌ای' : 
                       user?.profile?.subscription_plan === 'ultimate' ? 'نامحدود' : 'نامشخص'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-amber-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      {user?.profile?.subscription_end_date 
                        ? `تا تاریخ ${formatDate(user.profile.subscription_end_date)}`
                        : 'بدون محدودیت زمانی'}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Purchased Programs */}
              {userPurchases.some(purchase => purchase.program_id) && (
                <Card className="bg-gray-800/50 border-gray-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl">برنامه‌های خریداری شده</CardTitle>
                    <CardDescription>برنامه‌هایی که خریداری کرده‌اید</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userPurchases
                      .filter(purchase => purchase.program_id && purchase.program)
                      .map((purchase) => (
                        <Card key={purchase.id} className="bg-gray-900 border-gray-700 overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{purchase.program?.title || 'برنامه نامشخص'}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {purchase.program?.description || 'بدون توضیحات'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-xs text-gray-400 mb-3">
                              تاریخ خرید: {purchase.purchase_date ? formatDate(purchase.purchase_date) : 'نامشخص'}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            {purchase.program_id ? (
                              <div className="flex flex-col gap-2 w-full">
                                <Button 
                                  className="w-full" 
                                  onClick={() => {
                                    navigate(`/programs/${purchase.program_id}/details`);
                                  }}
                                >
                                  مشاهده برنامه
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="w-full" 
                                  onClick={() => {
                                    navigate(`/product/${purchase.program_id}`);
                                  }}
                                >
                                  صفحه محصول
                                </Button>
                              </div>
                            ) : (
                              <Button className="w-full" disabled>
                                برنامه در دسترس نیست
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                  </CardContent>
                </Card>
              )}
              
              {/* Payments Table */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800/50">
                        <TableHead className="text-gray-400">شناسه پرداخت</TableHead>
                        <TableHead className="text-gray-400">تاریخ</TableHead>
                        <TableHead className="text-gray-400">برنامه</TableHead>
                        <TableHead className="text-gray-400">مبلغ</TableHead>
                        <TableHead className="text-gray-400">وضعیت</TableHead>
                        <TableHead className="text-gray-400">تاریخ انقضا</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userPurchases.length > 0 ? (
                        userPurchases.map((purchase) => (
                          <TableRow key={purchase.id} className="border-gray-700 hover:bg-gray-800/50">
                            <TableCell className="font-medium">
                              {purchase.payment_id ? purchase.payment_id.substring(0, 8) : 'نامشخص'}
                            </TableCell>
                            <TableCell>
                              {purchase.purchase_date ? formatDate(purchase.purchase_date) : 'نامشخص'}
                            </TableCell>
                            <TableCell>
                              {purchase.program_id ? (
                                <a 
                                  href={`/product/${purchase.program_id}`}
                                  className="text-gold-400 hover:text-gold-300 hover:underline"
                                >
                                  {purchase.plan?.name || 'برنامه نامشخص'}
                                </a>
                              ) : (
                                purchase.plan?.name || 'برنامه نامشخص'
                              )}
                            </TableCell>
                            <TableCell>
                              {new Intl.NumberFormat('fa-IR').format(purchase.amount)} تومان
                            </TableCell>
                            <TableCell>
                              <span className={`${
                                purchase.payment_status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                                purchase.payment_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                'bg-red-500/20 text-red-400'
                              } text-xs font-medium px-2.5 py-1 rounded-full`}>
                                {purchase.payment_status === 'completed' ? 'موفق' : 
                                 purchase.payment_status === 'pending' ? 'در انتظار' : 'ناموفق'}
                              </span>
                            </TableCell>
                            <TableCell>
                              {purchase.expires_at ? formatDate(purchase.expires_at) : 'نامحدود'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                            هیچ پرداختی یافت نشد
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Products Management Tab - Only visible to admins */}
            {user?.profile?.is_admin && (
              <TabsContent value="products" className="space-y-6 animate-in fade-in-50 duration-300">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold-500">مدیریت محصولات</CardTitle>
                    <CardDescription>
                      در این بخش می‌توانید محصولات سایت را مدیریت کنید.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Product Form */}
                      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-medium mb-4">
                          {isEditingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-title">عنوان محصول</Label>
                            <Input
                              id="product-title"
                              value={productFormData.title}
                              onChange={(e) => setProductFormData({...productFormData, title: e.target.value})}
                              placeholder="عنوان محصول را وارد کنید"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-price">قیمت (تومان)</Label>
                            <Input
                              id="product-price"
                              type="number"
                              value={productFormData.price}
                              onChange={(e) => setProductFormData({...productFormData, price: parseInt(e.target.value) || 0})}
                              placeholder="قیمت محصول را وارد کنید"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-category">دسته‌بندی</Label>
                            <Select
                              value={productFormData.category}
                              onValueChange={(value) => setProductFormData({...productFormData, category: value as 'training' | 'diet' | 'supplement'})}
                            >
                              <SelectTrigger id="product-category">
                                <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="training">برنامه تمرینی</SelectItem>
                                <SelectItem value="diet">برنامه غذایی</SelectItem>
                                <SelectItem value="supplement">مکمل</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-image">آدرس تصویر</Label>
                            <Input
                              id="product-image"
                              value={productFormData.image_url || ""}
                              onChange={(e) => setProductFormData({...productFormData, image_url: e.target.value})}
                              placeholder="آدرس تصویر محصول را وارد کنید"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-url">آدرس برنامه</Label>
                            <Input
                              id="product-url"
                              value={productFormData.program_url || ""}
                              onChange={(e) => setProductFormData({...productFormData, program_url: e.target.value})}
                              placeholder="آدرس برنامه را وارد کنید"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <Label htmlFor="product-description">توضیحات محصول</Label>
                          <Textarea
                            id="product-description"
                            value={productFormData.description}
                            onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                            placeholder="توضیحات محصول را وارد کنید"
                            rows={5}
                          />
                        </div>
                        <div className="flex justify-end space-x-2 space-x-reverse">
                          {isEditingProduct ? (
                            <>
                              <Button
                                variant="outline"
                                onClick={cancelEditProduct}
                                disabled={productLoading}
                              >
                                انصراف
                              </Button>
                              <Button
                                onClick={updateProduct}
                                disabled={productLoading}
                              >
                                {productLoading ? (
                                  <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    در حال بروزرسانی...
                                  </>
                                ) : (
                                  "بروزرسانی محصول"
                                )}
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={createProduct}
                              disabled={productLoading}
                            >
                              {productLoading ? (
                                <>
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                  در حال ثبت...
                                </>
                              ) : (
                                "افزودن محصول"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Products List */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">لیست محصولات</h3>
                        {productLoading && products.length === 0 ? (
                          <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableCaption>لیست محصولات موجود</TableCaption>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>عنوان</TableHead>
                                  <TableHead>دسته‌بندی</TableHead>
                                  <TableHead>قیمت (تومان)</TableHead>
                                  <TableHead>تاریخ ایجاد</TableHead>
                                  <TableHead>عملیات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {products.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                      محصولی یافت نشد
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  products.map((product) => (
                                    <TableRow key={product.id}>
                                      <TableCell className="font-medium">{product.title}</TableCell>
                                      <TableCell>
                                        {product.category === 'training' && 'برنامه تمرینی'}
                                        {product.category === 'diet' && 'برنامه غذایی'}
                                        {product.category === 'supplement' && 'مکمل'}
                                      </TableCell>
                                      <TableCell>{new Intl.NumberFormat('fa-IR').format(product.price)}</TableCell>
                                      <TableCell>{new Date(product.created_at).toLocaleDateString('fa-IR')}</TableCell>
                                      <TableCell>
                                        <div className="flex space-x-2 space-x-reverse">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => editProduct(product)}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="destructive"
                                                size="sm"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>حذف محصول</DialogTitle>
                                                <DialogDescription>
                                                  آیا از حذف محصول "{product.title}" اطمینان دارید؟
                                                  این عمل غیرقابل بازگشت است.
                                                </DialogDescription>
                                              </DialogHeader>
                                              <DialogFooter>
                                                <DialogClose asChild>
                                                  <Button variant="outline">انصراف</Button>
                                                </DialogClose>
                                                <Button
                                                  variant="destructive"
                                                  onClick={() => deleteProduct(product.id)}
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
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {/* Program Management Tab - Only visible to admins */}
            {user?.profile?.is_admin && (
              <TabsContent value="program-management" className="space-y-6 animate-in fade-in-50 duration-300">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold-500">مدیریت برنامه‌ها</CardTitle>
                    <CardDescription>
                      در این بخش می‌توانید جزئیات برنامه‌ها را مدیریت کنید.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Program Detail Form */}
                      {isEditingProgramDetail && (
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                          <h3 className="text-lg font-medium mb-4">ویرایش جزئیات برنامه</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="program-detail-title">عنوان برنامه</Label>
                              <Input
                                id="program-detail-title"
                                value={programDetailFormData.title}
                                onChange={(e) => setProgramDetailFormData({...programDetailFormData, title: e.target.value})}
                                placeholder="عنوان برنامه را وارد کنید"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="program-detail-description">توضیحات برنامه</Label>
                              <Textarea
                                id="program-detail-description"
                                value={programDetailFormData.description}
                                onChange={(e) => setProgramDetailFormData({...programDetailFormData, description: e.target.value})}
                                placeholder="توضیحات برنامه را وارد کنید"
                                rows={4}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="program-detail-details">جزئیات برنامه (JSON)</Label>
                              <Textarea
                                id="program-detail-details"
                                value={programDetailFormData.details ? JSON.stringify(programDetailFormData.details, null, 2) : ""}
                                onChange={(e) => {
                                  try {
                                    const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                                    setProgramDetailFormData({...programDetailFormData, details: parsed});
                                  } catch (error) {
                                    // Invalid JSON, keep the string value for editing
                                    setProgramDetailFormData({...programDetailFormData, details: e.target.value});
                                  }
                                }}
                                placeholder='{"exercises": [], "instructions": ""}'
                                rows={6}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="program-detail-weeks">هفته‌های برنامه (JSON)</Label>
                              <Textarea
                                id="program-detail-weeks"
                                value={programDetailFormData.weeks ? JSON.stringify(programDetailFormData.weeks, null, 2) : ""}
                                onChange={(e) => {
                                  try {
                                    const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                                    setProgramDetailFormData({...programDetailFormData, weeks: parsed});
                                  } catch (error) {
                                    // Invalid JSON, keep the string value for editing
                                    setProgramDetailFormData({...programDetailFormData, weeks: e.target.value});
                                  }
                                }}
                                placeholder='{"week1": {}, "week2": {}}'
                                rows={6}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 space-x-reverse mt-4">
                            <Button
                              variant="outline"
                              onClick={cancelEditProgramDetail}
                              disabled={programDetailsLoading}
                            >
                              انصراف
                            </Button>
                            <Button
                              onClick={updateProgramDetail}
                              disabled={programDetailsLoading}
                            >
                              {programDetailsLoading ? (
                                <>
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                  در حال بروزرسانی...
                                </>
                              ) : (
                                "بروزرسانی برنامه"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Program Details List */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">لیست برنامه‌ها</h3>
                        {programDetailsLoading && programDetails.length === 0 ? (
                          <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableCaption>لیست جزئیات برنامه‌های موجود</TableCaption>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>عنوان برنامه</TableHead>
                                  <TableHead>محصول مرتبط</TableHead>
                                  <TableHead>دسته‌بندی</TableHead>
                                  <TableHead>تاریخ ایجاد</TableHead>
                                  <TableHead>عملیات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {programDetails.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                      برنامه‌ای یافت نشد
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  programDetails.map((programDetail: any) => (
                                    <TableRow key={programDetail.id}>
                                      <TableCell className="font-medium">{programDetail.title}</TableCell>
                                      <TableCell>{programDetail.programs_sale?.title || "نامشخص"}</TableCell>
                                      <TableCell>
                                        {programDetail.programs_sale?.category === 'training' && 'برنامه تمرینی'}
                                        {programDetail.programs_sale?.category === 'diet' && 'برنامه غذایی'}
                                        {programDetail.programs_sale?.category === 'supplement' && 'مکمل'}
                                      </TableCell>
                                      <TableCell>{new Date(programDetail.created_at).toLocaleDateString('fa-IR')}</TableCell>
                                      <TableCell>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => editProgramDetail(programDetail)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {/* Blog Management Tab - Only visible to admins */}
            {user?.profile?.is_admin && (
              <TabsContent value="blog" className="space-y-6 animate-in fade-in-50 duration-300">
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
                              onClick={() => {
                                setIsEditing(false);
                                setCurrentBlogId(null);
                                setBlogFormData({
                                  title: "",
                                  content: "",
                                  excerpt: "",
                                  slug: "",
                                  cover_image: "",
                                  published: false,
                                  category: "none"
                                });
                              }}
                              className="border-gray-600"
                            >
                              انصراف
                            </Button>
                          )}
                          
                          <Button
                            onClick={isEditing ? updateBlogPost : createBlogPost}
                            disabled={pageLoading}
                            className="bg-gold-500 hover:bg-gold-600 text-black"
                          >
                            {pageLoading ? (
                              <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                در حال پردازش...
                              </>
                            ) : isEditing ? (
                              <>
                                <Edit className="ml-2 h-4 w-4" />
                                بروزرسانی مقاله
                              </>
                            ) : (
                              <>
                                <Plus className="ml-2 h-4 w-4" />
                                ایجاد مقاله
                              </>
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
                            <TableRow className="border-gray-700 hover:bg-gray-800/50">
                              <TableHead className="text-gray-400">عنوان</TableHead>
                              <TableHead className="text-gray-400">نامک</TableHead>
                              <TableHead className="text-gray-400">وضعیت</TableHead>
                              <TableHead className="text-gray-400">تاریخ ایجاد</TableHead>
                              <TableHead className="text-gray-400 text-left">عملیات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {blogPosts.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                  هنوز مقاله‌ای ایجاد نشده است
                                </TableCell>
                              </TableRow>
                            ) : (
                              blogPosts.map((post) => (
                                <TableRow key={post.id} className="border-gray-700 hover:bg-gray-800/50">
                                  <TableCell className="font-medium">{post.title}</TableCell>
                                  <TableCell>{post.slug}</TableCell>
                                  <TableCell>
                                    {post.published ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                                        منتشر شده
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
                                        پیش‌نویس
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {new Date(post.created_at).toLocaleDateString('fa-IR')}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setIsEditing(true);
                                          setCurrentBlogId(post.id);
                                          setBlogFormData({
                                            title: post.title,
                                            content: post.content,
                                            excerpt: post.excerpt,
                                            slug: post.slug,
                                            cover_image: post.cover_image,
                                            published: post.published,
                                            category: post.category || "none"
                                          });
                                        }}
                                        className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
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
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">پروفایل کاربری</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information Card */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold-500">اطلاعات کاربری</CardTitle>
                    <CardDescription className="text-gray-400">
                      اطلاعات شخصی حساب کاربری شما
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-400">ایمیل</span>
                      <span className="text-white font-medium">{user?.email || "ثبت نشده"}</span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-400">نام</span>
                      <span className="text-white font-medium">{user?.profile?.name || "ثبت نشده"}</span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-400">شماره تماس</span>
                      <span className="text-white font-medium">{user?.profile?.phoneNumber || "ثبت نشده"}</span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-400">تاریخ عضویت</span>
                      <span className="text-white font-medium">{formatDateToPersian(user?.created_at) || "نامشخص"}</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-gray-700 hover:border-gold-500 hover:bg-gold-500/10"
                      onClick={() => navigate('/profile')}
                    >
                      ویرایش اطلاعات
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Subscription Information Card */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold-500">اطلاعات اشتراک</CardTitle>
                    <CardDescription className="text-gray-400">
                      وضعیت اشتراک فعلی شما
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-400">نوع اشتراک</span>
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gold-500 mr-2" />
                        <span className="text-white font-medium">
                          {user?.profile?.subscription_plan === "basic" && "اشتراک پایه"}
                          {user?.profile?.subscription_plan === "pro" && "اشتراک پرو"}
                          {user?.profile?.subscription_plan === "ultimate" && "اشتراک آلتیمیت"}
                          {!user?.profile?.subscription_plan && "بدون اشتراک"}
                        </span>
                      </div>
                    </div>
                    
                    {user?.profile?.subscription_plan !== "basic" && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-400">تاریخ شروع</span>
                        <span className="text-white font-medium">
                          {formatDateToPersian(user?.profile?.subscription_start_date) || "نامشخص"}
                        </span>
                      </div>
                    )}
                    
                    {user?.profile?.subscription_plan !== "basic" && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-400">تاریخ پایان</span>
                        <span className="text-white font-medium">
                          {formatDateToPersian(user?.profile?.subscription_end_date) || "نامشخص"}
                        </span>
                      </div>
                    )}
                    
                    {user?.profile?.subscription_plan !== "basic" && user?.profile?.subscription_end_date && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-400">روزهای باقیمانده</span>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gold-500 mr-2" />
                          <span className="text-white font-medium">
                            {calculateRemainingDays(user?.profile?.subscription_end_date)} روز
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Account Actions Card */}
                <Card className="bg-gray-800/50 border-gray-700 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold-500">عملیات حساب کاربری</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="border-gray-700 hover:border-amber-500 hover:bg-amber-500/10 flex items-center justify-center"
                        onClick={() => navigate('/change-password')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-amber-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        تغییر رمز عبور
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="border-gray-700 hover:border-red-500 hover:bg-red-500/10 flex items-center justify-center"
                        onClick={async () => {
                          await supabase.auth.signOut();
                          navigate('/');
                        }}
                      >
                        <LogOut className="ml-2 h-5 w-5 text-red-500" />
                        خروج از حساب کاربری
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Mobile Footer Navigation - Visible only on mobile and tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gray-800/95 backdrop-blur-md border-t border-gray-700/30 shadow-lg shadow-black/50">
          {/* Main Navigation */}
          <nav className="flex justify-around items-center h-16">
            <button 
              onClick={() => setActiveTab("training")}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                activeTab === "training" 
                  ? "text-gold-500" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Zap size={20} className={`mb-1 ${activeTab === "training" ? "text-gold-500" : ""}`} />
              <span className="text-xs font-medium">تمرینی</span>
              {activeTab === "training" && (
                <div className="absolute top-0 h-0.5 left-0 right-0 bg-gradient-to-r from-gold-500 to-amber-500 transform scale-x-25"></div>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab("meals")}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                activeTab === "meals" 
                  ? "text-gold-500" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mb-1 ${activeTab === "meals" ? "text-gold-500" : ""}`}>
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                <path d="M7 2v20"></path>
                <path d="M21 15V2"></path>
                <path d="M18 15V2"></path>
                <path d="M21 15a3 3 0 1 1-6 0"></path>
              </svg>
              <span className="text-xs font-medium">غذایی</span>
              {activeTab === "meals" && (
                <div className="absolute top-0 h-0.5 left-0 right-0 bg-gradient-to-r from-gold-500 to-amber-500 transform scale-x-25"></div>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab("supplements")}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                activeTab === "supplements" 
                  ? "text-gold-500" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mb-1 ${activeTab === "supplements" ? "text-gold-500" : ""}`}>
                <path d="m8 21 8-9"></path>
                <path d="M12 21a9 9 0 0 0 0-18C7.5 3 4 7.5 4 11c0 2 1 4 2 6"></path>
                <path d="M19.8 17.8a9 9 0 0 0 .2-2c0-2.8-1-5.5-2.8-7.4"></path>
                <path d="M13.5 8.5A5 5 0 0 0 12 8a5 5 0 0 0-5 5c0 1.1.4 2.2 1 3"></path>
              </svg>
              <span className="text-xs font-medium">مکمل</span>
              {activeTab === "supplements" && (
                <div className="absolute top-0 h-0.5 left-0 right-0 bg-gradient-to-r from-gold-500 to-amber-500 transform scale-x-25"></div>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab("payments")}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                activeTab === "payments" 
                  ? "text-gold-500" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <CreditCard size={20} className={`mb-1 ${activeTab === "payments" ? "text-gold-500" : ""}`} />
              <span className="text-xs font-medium">پرداخت‌ها</span>
              {activeTab === "payments" && (
                <div className="absolute top-0 h-0.5 left-0 right-0 bg-gradient-to-r from-gold-500 to-amber-500 transform scale-x-25"></div>
              )}
            </button>
            
            <button 
              onClick={() => {
                // Toggle the more menu
                const moreMenu = document.getElementById('mobile-more-menu');
                if (moreMenu) {
                  moreMenu.classList.toggle('hidden');
                }
              }}
              className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-300 transition-all duration-300"
            >
              <Menu size={20} className="mb-1" />
              <span className="text-xs font-medium">بیشتر</span>
            </button>
          </nav>
          
          {/* Extended Menu (Hidden by default) */}
          <div id="mobile-more-menu" className="hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700/30 py-4 px-2 animate-in slide-in-from-bottom duration-300">
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => {
                  setActiveTab("profile");
                  document.getElementById('mobile-more-menu')?.classList.add('hidden');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                  activeTab === "profile" 
                    ? "bg-gray-700/50 text-gold-500" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-xs font-medium mt-2">پروفایل</span>
              </button>
              
              <button 
                onClick={() => {
                  setActiveTab("orders");
                  document.getElementById('mobile-more-menu')?.classList.add('hidden');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                  activeTab === "orders" 
                    ? "bg-gray-700/50 text-gold-500" 
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="text-xs font-medium mt-2">سفارش‌ها</span>
              </button>
              
              <button 
                onClick={() => {
                  navigate('/subscription');
                  document.getElementById('mobile-more-menu')?.classList.add('hidden');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 transition-all duration-300"
              >
                <Shield size={24} className="text-gold-500" />
                <span className="text-xs font-medium mt-2">ارتقاء اشتراک</span>
              </button>
              
              {user?.profile?.is_admin && (
                <>
                  <button 
                    onClick={() => {
                      setActiveTab("products");
                      document.getElementById('mobile-more-menu')?.classList.add('hidden');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                      activeTab === "products" 
                        ? "bg-gray-700/50 text-gold-500" 
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                    <span className="text-xs font-medium mt-2">مدیریت محصولات</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setActiveTab("blog");
                      document.getElementById('mobile-more-menu')?.classList.add('hidden');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                      activeTab === "blog" 
                        ? "bg-gray-700/50 text-gold-500" 
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                      <path d="M18 14h-8"></path>
                      <path d="M15 18h-5"></path>
                      <path d="M10 6h8v4h-8V6Z"></path>
                    </svg>
                    <span className="text-xs font-medium mt-2">مدیریت بلاگ</span>
                  </button>
                </>
              )}
              
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
              >
                <LogOut size={24} className="text-red-400" />
                <span className="text-xs font-medium mt-2">خروج</span>
              </button>
            </div>
          </div>
          
          {/* Glowing effect at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
