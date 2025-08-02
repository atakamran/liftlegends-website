import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { setRedirectUrl } from "@/utils/redirectUtils";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/ui/optimized-image";
import ProductSkeleton from "@/components/ui/product-skeleton";
import PriceDisplay from "@/components/ui/price-display";
import CategoryBadge from "@/components/ui/category-badge";
import FeatureList from "@/components/ui/feature-list";
import ProductSpecs from "@/components/ui/product-specs";
import {
  Loader2,
  ArrowRight,
  ShoppingCart,
  Share2,
  CheckCircle,
  Clock,
  Shield,
  Download,
  Heart,
} from "lucide-react";

// Define interfaces
interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "training" | "diet" | "supplement";
  image_url: string | null;
  program_url: string | null;
  created_at: string;
  updated_at: string;
}

interface RelatedProgram {
  id: string;
  title: string;
  price: number;
  category: "training" | "diet" | "supplement";
  image_url: string | null;
}

const ProductPage = () => {
  // Handle both ID-based and slug-based URLs
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [relatedPrograms, setRelatedPrograms] = useState<RelatedProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  // Function to fetch program details
  const fetchProgramDetails = async () => {
    try {
      setLoading(true);

      // If neither id nor slug is provided, redirect to programs page
      if (!id && !slug) {
        navigate("/programs");
        return;
      }

      let query = supabase.from("programs_sale").select("*");

      // If we have an ID, use it for the query
      if (id) {
        query = query.eq("id", id);
      }
      // Otherwise use the slug (program_url)
      else if (slug) {
        query = query.eq("program_url", slug);
      }

      const { data, error } = await query.single();

      if (error) throw error;

      if (!data) {
        // Set proper 404 status for SEO
        if (typeof window !== "undefined" && window.history) {
          // For client-side routing, we can't set HTTP status, but we can show 404 content
          setProgram(null);
          setLoading(false);
          return;
        }
        navigate("/programs");
        return;
      }

      // Map data to Program interface
      const programData: Program = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category as "training" | "diet" | "supplement",
        image_url: data.image_url,
        program_url: data.program_url || null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
      };

      setProgram(programData);

      // Check if user has purchased this program
      await checkUserPurchase(programData.id);

      // Fetch related programs
      fetchRelatedPrograms(programData.category, programData.id);
    } catch (error) {
      console.error("Error fetching program details:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری اطلاعات محصول",
        description:
          "مشکلی در دریافت اطلاعات محصول رخ داد. لطفاً دوباره تلاش کنید.",
      });
      navigate("/programs");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch related programs
  const fetchRelatedPrograms = async (
    category: "training" | "diet" | "supplement",
    currentProgramId: string
  ) => {
    try {
      console.log(
        "Fetching related programs for category:",
        category,
        "excluding ID:",
        currentProgramId
      );

      const { data, error } = await supabase
        .from("programs_sale")
        .select("id, title, price, category, image_url")
        .eq("category", category)
        .neq("id", currentProgramId)
        .limit(4);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Related programs fetched:", data);
        setRelatedPrograms(data.map(program => ({
          ...program,
          category: program.category as "training" | "diet" | "supplement"
        })) || []);
    } catch (error) {
      console.error("Error fetching related programs:", error);
    }
  };

  // Function to check if user has purchased the program
  const checkUserPurchase = async (programId: string) => {
    try {
      setCheckingPurchase(true);

      // Get current user session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setHasPurchased(false);
        return;
      }

      // Check if user has purchased this program
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("user_purchases")
        .select("id")
        .eq("user_id", sessionData.session.user.id)
        .eq("program_id", programId)
        .eq("payment_status", "completed");

      if (purchaseError) {
        console.error("Error checking purchase status:", purchaseError);
        setHasPurchased(false);
      } else {
        // If there are any purchases, the user has purchased the program
        setHasPurchased(
          purchaseData !== null &&
            Array.isArray(purchaseData) &&
            purchaseData.length > 0
        );
      }
    } catch (error) {
      console.error("Error checking user purchase:", error);
      setHasPurchased(false);
    } finally {
      setCheckingPurchase(false);
    }
  };

  // Format price with Persian numerals and Toman
  const formatPrice = (price: number) => {
    if (price === 0) {
      return "رایگان";
    }
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "training":
        return "برنامه تمرینی";
      case "diet":
        return "برنامه غذایی";
      case "supplement":
        return "مکمل";
      default:
        return category;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "training":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "diet":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "supplement":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  // Handle free program purchase
  const handleFreeProgram = async () => {
    try {
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          variant: "destructive",
          title: "ورود به حساب کاربری",
          description:
            "برای دریافت برنامه رایگان، ابتدا وارد حساب کاربری خود شوید.",
        });
        setRedirectUrl();
        navigate("/login");
        return;
      }

      // Add free program to user purchases
      const { error } = await supabase.from("user_purchases").insert({
        user_id: sessionData.session.user.id,
        program_id: program!.id,
        amount: 0,
        payment_status: "completed",
        payment_id: "free_" + Date.now(),
        purchase_date: new Date().toISOString(),
      });

      if (error) {
        console.error("Error adding free program:", error);
        toast({
          variant: "destructive",
          title: "خطا در دریافت برنامه رایگان",
          description:
            "مشکلی در اضافه کردن برنامه رایگان رخ داد. لطفاً دوباره تلاش کنید.",
        });
        return;
      }

      // Update purchase status
      setHasPurchased(true);

      toast({
        title: "برنامه رایگان دریافت شد!",
        description: "برنامه رایگان با موفقیت به حساب شما اضافه شد.",
      });

      // Redirect to program details after a short delay
      setTimeout(() => {
        const detailsUrl = program!.program_url
          ? `/programs/${program!.id}/details`
          : `/programs/${program!.program_url}/details`;
        navigate(detailsUrl);
      }, 1500);
    } catch (error) {
      console.error("Error handling free program:", error);
      toast({
        variant: "destructive",
        title: "خطا در دریافت برنامه رایگان",
        description:
          "مشکلی در دریافت برنامه رایگان رخ داد. لطفاً دوباره تلاش کنید.",
      });
    }
  };

  // Handle buy button click
  const handleBuyClick = async () => {
    if (!program) return;

    // If user has already purchased, redirect to program details
    if (hasPurchased) {
      const detailsUrl = program.program_url
        ? `/programs/${program.id}/details`
        : `/programs/${program.program_url}/details`;
      navigate(detailsUrl);
      return;
    }

    // If price is 0, add to user's purchased programs directly
    if (program.price === 0) {
      await handleFreeProgram();
      return;
    }

    // Otherwise, proceed to payment
    navigate(`/payment?program=${program.id}`);
  };

  // Load program details on component mount or when URL parameters change
  useEffect(() => {
    fetchProgramDetails();
  }, [id, slug]);

  // If loading, show skeleton
  if (loading) {
    return <ProductSkeleton />;
  }

  // If program not found, show error message
  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <Helmet>
          <title>محصول یافت نشد | لیفت لجندز</title>
          <meta
            name="description"
            content="محصول مورد نظر شما یافت نشد. برنامه‌های تمرینی و تغذیه‌ای دیگر را در لیفت لجندز مشاهده کنید."
          />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href="https://liftlegends.ir/programs" />
        </Helmet>
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-light text-white">محصول یافت نشد</h1>
            <p className="text-gray-400 leading-relaxed">
              محصول مورد نظر شما یافت نشد یا ممکن است حذف شده باشد.
            </p>
          </div>
          <Button
            onClick={() => navigate("/programs")}
            className="bg-gold-500 hover:bg-gold-400 text-black px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به محصولات
          </Button>
        </div>
      </div>
    );
  }

  // Create a clean description for meta tags (remove extra whitespace)
  const getCleanDescription = () => {
    if (!program) return "";
    return (
      program.description.replace(/\s+/g, " ").trim().substring(0, 160) +
      (program.description.length > 160 ? "..." : "")
    );
  };

  // Get structured data for product
  const getStructuredData = () => {
    if (!program) return null;

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: program.title,
      description: getCleanDescription(),
      image:
        program.image_url ||
        "https://liftlegends.ir/images/default-product.jpg",
      offers: {
        "@type": "Offer",
        url: `https://liftlegends.ir/programs/${
          program.program_url || program.id
        }`,
        priceCurrency: "IRR",
        price: program.price * 10, // Convert to Rial for international standards
        availability: "https://schema.org/InStock",
      },
      brand: {
        "@type": "Brand",
        name: "لیفت لجندز",
      },
      category: getCategoryLabel(program.category),
    };
  };

  // Get canonical URL
  const getCanonicalUrl = () => {
    if (!program) return "https://liftlegends.ir/programs";
    return program.program_url
      ? `https://liftlegends.ir/programs/${program.program_url}`
      : `https://liftlegends.ir/product/${program.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {program && (
        <Helmet>
          <title>{program.title} | لیفت لجندز</title>
          <meta name="description" content={getCleanDescription()} />
          <meta
            name="keywords"
            content={`${program.title}, ${getCategoryLabel(
              program.category
            )}, لیفت لجندز, تناسب اندام, بدنسازی, فیتنس`}
          />
          <link rel="canonical" href={getCanonicalUrl()} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="product" />
          <meta property="og:url" content={getCanonicalUrl()} />
          <meta property="og:title" content={`${program.title} | لیفت لجندز`} />
          <meta property="og:description" content={getCleanDescription()} />
          <meta
            property="og:image"
            content={
              program.image_url ||
              "https://liftlegends.ir/images/default-product.jpg"
            }
          />
          <meta
            property="product:price:amount"
            content={program.price.toString()}
          />
          <meta property="product:price:currency" content="IRR" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={getCanonicalUrl()} />
          <meta
            property="twitter:title"
            content={`${program.title} | لیفت لجندز`}
          />
          <meta
            property="twitter:description"
            content={getCleanDescription()}
          />
          <meta
            property="twitter:image"
            content={
              program.image_url ||
              "https://liftlegends.ir/images/default-product.jpg"
            }
          />

          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(getStructuredData())}
          </script>
        </Helmet>
      )}

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Minimalist Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-16 rtl:space-x-reverse">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gold-400 transition-colors duration-300"
          >
            خانه
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/programs")}
            className="hover:text-gold-400 transition-colors duration-300"
          >
            محصولات
          </button>
          <span>/</span>
          <span className="text-gold-400">{program.title}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          {/* Product Image - Enhanced Design */}
          <div className="relative group">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-800/60 backdrop-blur-sm border border-gray-800/50 hover:border-gold-500/30 transition-all duration-700 hover:shadow-2xl hover:shadow-gold-500/10">
              {program.image_url ? (
                <OptimizedImage
                  src={program.image_url}
                  alt={program.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold-500/20 transition-all duration-500">
                      <svg
                        className="w-8 h-8 group-hover:text-gold-400 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="group-hover:text-gray-400 transition-colors duration-300">
                      بدون تصویر
                    </p>
                  </div>
                </div>
              )}

              {/* Category Badge - Enhanced */}
              <div className="absolute top-6 right-6 transform group-hover:scale-110 transition-transform duration-300">
                <CategoryBadge category={program.category} size="md" />
              </div>

              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/10"></div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-12">
            {/* Header */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-light text-white leading-tight">
                {program.title}
              </h1>

              <div className="flex items-center space-x-8 rtl:space-x-reverse">
                <PriceDisplay price={program.price} size="lg" />
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-green-400 text-sm">موجود</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                {program.description}
              </p>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Button
                  onClick={handleBuyClick}
                  disabled={checkingPurchase}
                  className="group relative w-full h-16 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black text-lg font-medium rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gold-500/25 overflow-hidden"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center justify-center">
                    {checkingPurchase ? (
                      <Loader2 className="w-6 h-6 animate-spin ml-2" />
                    ) : hasPurchased ? (
                      <>
                        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        مشاهده محصول
                      </>
                    ) : program?.price === 0 ? (
                      <>
                        <Download className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform duration-300" />
                        دریافت رایگان
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform duration-300" />
                        خرید محصول
                      </>
                    )}
                  </div>
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:border-gold-500/30 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: program.title,
                          text: program.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "لینک کپی شد",
                          description: "لینک محصول در کلیپ‌بورد کپی شد.",
                        });
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 ml-2" />
                    اشتراک‌گذاری
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 border-gray-700/50 text-gray-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    <Heart className="w-4 h-4 ml-2" />
                    علاقه‌مندی
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
                <FeatureList layout="grid" />
              </div>
            </div>
          </div>
        </div>
        {/* Product Specifications - Enhanced */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-white mb-4">
              مشخصات محصول
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-800/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 hover:border-gold-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10">
              <ProductSpecs
                title="اطلاعات کلی"
                specs={[
                  {
                    label: "نوع محصول",
                    value: getCategoryLabel(program.category),
                  },
                  {
                    label: "تاریخ انتشار",
                    value: new Date(program.created_at).toLocaleDateString(
                      "fa-IR"
                    ),
                  },
                  {
                    label: "آخرین بروزرسانی",
                    value: new Date(program.updated_at).toLocaleDateString(
                      "fa-IR"
                    ),
                  },
                  { label: "شناسه محصول", value: program.id.substring(0, 8) },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Related Products - Enhanced */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-white mb-4">
              محصولات مرتبط
            </h2>
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <div className="w-16 h-1 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"></div>
              <span className="text-gold-400 font-medium">
                ({relatedPrograms.length})
              </span>
              <div className="w-16 h-1 bg-gradient-to-l from-gold-500 to-gold-400 rounded-full"></div>
            </div>
          </div>
          {relatedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPrograms.map((relatedProgram) => (
                <div
                  key={relatedProgram.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProgram.id}`)}
                >
                  <div className="relative bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-800/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800/50 hover:border-gold-500/50 transition-all duration-700 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/10">
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                    {/* Image Section */}
                    <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                      {relatedProgram.image_url ? (
                        <OptimizedImage
                          src={relatedProgram.image_url}
                          alt={relatedProgram.title}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold-500/20 transition-colors duration-300">
                              <svg
                                className="w-6 h-6 group-hover:text-gold-400 transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-sm group-hover:text-gray-400 transition-colors duration-300">
                              بدون تصویر
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Category Badge - Floating */}
                      <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                        <CategoryBadge
                          category={relatedProgram.category}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative p-6 space-y-4 z-20">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors duration-300 line-clamp-2">
                          {relatedProgram.title}
                        </h3>
                      </div>

                      {/* Price and Action - Hidden by default, shown on hover */}
                      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        <div className="flex flex-col space-y-1">
                          <PriceDisplay
                            price={relatedProgram.price}
                            size="sm"
                          />
                          <span className="text-xs text-gray-400">
                            قیمت محصول
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <div className="w-10 h-10 rounded-full bg-gold-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold-500 transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:text-black transition-colors duration-300" />
                          </div>
                        </div>
                      </div>

                      {/* Quick Info - Always visible */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-800/50 group-hover:border-gold-500/30 transition-colors duration-300">
                        <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                          {getCategoryLabel(relatedProgram.category)}
                        </span>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover:bg-gold-400 transition-colors duration-300"></div>
                          <span className="group-hover:text-gray-400 transition-colors duration-300">
                            موجود
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              هیچ محصول مرتبطی یافت نشد
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
