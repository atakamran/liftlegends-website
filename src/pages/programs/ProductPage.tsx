import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Loader2, ArrowRight, ShoppingCart, Share2, Star } from "lucide-react";

// Define interfaces
interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'training' | 'diet' | 'supplement';
  image_url: string | null;
  program_url: string | null;
  created_at: string;
  updated_at: string;
}

interface RelatedProgram {
  id: string;
  title: string;
  price: number;
  category: 'training' | 'diet' | 'supplement';
  image_url: string | null;
}

const ProductPage = () => {
  // Handle both ID-based and slug-based URLs
  const { id, slug } = useParams<{ id?: string, slug?: string }>();
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
      
      let query = supabase
        .from("programs_sale")
        .select("*");
      
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
        navigate("/programs");
        return;
      }
      
      // Map data to Program interface
      const programData: Program = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: data.image_url,
        program_url: data.program_url || null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
      
      setProgram(programData);
      
      // Check if user has purchased this program
      await checkUserPurchase(programData.id);
      
      // Fetch related programs
      fetchRelatedPrograms(programData.category);
    } catch (error) {
      console.error("Error fetching program details:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری اطلاعات محصول",
        description: "مشکلی در دریافت اطلاعات محصول رخ داد. لطفاً دوباره تلاش کنید.",
      });
      navigate("/programs");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch related programs
  const fetchRelatedPrograms = async (category: 'training' | 'diet' | 'supplement') => {
    try {
      const { data, error } = await supabase
        .from("programs_sale")
        .select("id, title, price, category, image_url")
        .eq("category", category)
        .neq("id", id)
        .limit(4);
        
      if (error) throw error;
      
      setRelatedPrograms(data || []);
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
        .from('user_purchases')
        .select('id')
        .eq('user_id', sessionData.session.user.id)
        .eq('program_id', programId)
        .eq('payment_status', 'completed');
        
      if (purchaseError) {
        console.error("Error checking purchase status:", purchaseError);
        setHasPurchased(false);
      } else {
        // If there are any purchases, the user has purchased the program
        setHasPurchased(purchaseData !== null && Array.isArray(purchaseData) && purchaseData.length > 0);
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
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'training':
        return 'برنامه تمرینی';
      case 'diet':
        return 'برنامه غذایی';
      case 'supplement':
        return 'مکمل';
      default:
        return category;
    }
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'diet':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'supplement':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };
  
  // Handle buy button click
  const handleBuyClick = () => {
    if (!program) return;
    
    // If user has already purchased, redirect to program details
    if (hasPurchased) {
      const detailsUrl = program.program_url 
        ? `/programs/${program.program_url}/details`
        : `/programs/${program.id}/details`;
      navigate(detailsUrl);
      return;
    }
    
    // Otherwise, proceed to payment
    navigate(`/payment?program=${program.id}`);
  };
  
  // Load program details on component mount or when URL parameters change
  useEffect(() => {
    fetchProgramDetails();
  }, [id, slug]);
  
  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
      </div>
    );
  }
  
  // If program not found, show error message
  if (!program) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">محصول یافت نشد</h1>
        <p className="text-gray-300 mb-6">محصول مورد نظر شما یافت نشد یا حذف شده است.</p>
        <Button onClick={() => navigate("/programs")}>
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت به صفحه محصولات
        </Button>
      </div>
    );
  }
  
  // Create a clean description for meta tags (remove extra whitespace)
  const getCleanDescription = () => {
    if (!program) return '';
    return program.description
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 160) + (program.description.length > 160 ? '...' : '');
  };

  // Get structured data for product
  const getStructuredData = () => {
    if (!program) return null;
    
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": program.title,
      "description": getCleanDescription(),
      "image": program.image_url || "https://liftlegends.ir/images/default-product.jpg",
      "offers": {
        "@type": "Offer",
        "url": `https://liftlegends.ir/programs/${program.program_url || program.id}`,
        "priceCurrency": "IRR",
        "price": program.price * 10, // Convert to Rial for international standards
        "availability": "https://schema.org/InStock"
      },
      "brand": {
        "@type": "Brand",
        "name": "لیفت لجندز"
      },
      "category": getCategoryLabel(program.category)
    };
  };

  // Get canonical URL
  const getCanonicalUrl = () => {
    if (!program) return 'https://liftlegends.ir/programs';
    return program.program_url 
      ? `https://liftlegends.ir/programs/${program.program_url}`
      : `https://liftlegends.ir/product/${program.id}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:py-12">
      {program && (
        <Helmet>
          <title>{program.title} | لیفت لجندز</title>
          <meta name="description" content={getCleanDescription()} />
          <meta name="keywords" content={`${program.title}, ${getCategoryLabel(program.category)}, لیفت لجندز, تناسب اندام, بدنسازی, فیتنس`} />
          <link rel="canonical" href={getCanonicalUrl()} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="product" />
          <meta property="og:url" content={getCanonicalUrl()} />
          <meta property="og:title" content={`${program.title} | لیفت لجندز`} />
          <meta property="og:description" content={getCleanDescription()} />
          <meta property="og:image" content={program.image_url || "https://liftlegends.ir/images/default-product.jpg"} />
          <meta property="product:price:amount" content={program.price.toString()} />
          <meta property="product:price:currency" content="IRR" />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={getCanonicalUrl()} />
          <meta property="twitter:title" content={`${program.title} | لیفت لجندز`} />
          <meta property="twitter:description" content={getCleanDescription()} />
          <meta property="twitter:image" content={program.image_url || "https://liftlegends.ir/images/default-product.jpg"} />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(getStructuredData())}
          </script>
        </Helmet>
      )}
      
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-400 mb-6 flex-wrap">
        <button onClick={() => navigate("/")} className="hover:text-gold-500 transition-colors">
          خانه
        </button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate("/programs")} className="hover:text-gold-500 transition-colors">
          محصولات
        </button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate(`/programs?category=${program.category}`)} className="hover:text-gold-500 transition-colors">
          {getCategoryLabel(program.category)}
        </button>
        <span className="mx-2">/</span>
        <span className="text-gold-500 truncate max-w-full">{program.title}</span>
      </div>
      
      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image - Ultra Modern Design */}
        <div className="relative group">
          {/* Enhanced decorative elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/30 via-gold-400/20 to-gold-500/30 rounded-2xl blur-lg opacity-30 group-hover:opacity-70 transition-opacity duration-700"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/10 to-gold-400/10 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse"></div>
          
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gold-500/20 to-transparent rounded-bl-3xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gold-500/20 to-transparent rounded-tr-3xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
          
          {/* Main image container with enhanced styling */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800/50 group-hover:border-gold-500/30 shadow-lg group-hover:shadow-gold-500/20 transition-all duration-500 z-10">
            {program.image_url ? (
              <div className="relative aspect-square w-full overflow-hidden">
                {/* Image with enhanced hover effects */}
                <img 
                  src={program.image_url} 
                  alt={program.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:filter group-hover:brightness-110"
                />
                
                {/* Enhanced overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Subtle vignette effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-40 mix-blend-overlay"></div>
                
                {/* Enhanced category badge */}
                <Badge className={`absolute top-4 right-4 ${getCategoryColor(program.category)} backdrop-blur-sm shadow-md border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                  {getCategoryLabel(program.category)}
                </Badge>
                
                {/* Image shine effect on hover */}
                <div className="absolute -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
                
                {/* Zoom indicator on hover */}
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  بزرگنمایی
                </div>
              </div>
            ) : (
              <div className="aspect-square w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                <span className="text-gray-500">بدون تصویر</span>
                <Badge className={`absolute top-4 right-4 ${getCategoryColor(program.category)} backdrop-blur-sm shadow-md border border-white/10`}>
                  {getCategoryLabel(program.category)}
                </Badge>
              </div>
            )}
            
            {/* Subtle inner border */}
            <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{program.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= 4 ? 'fill-gold-500 text-gold-500' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <span className="mr-1">(۴.۰)</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
              <span>کد محصول: {program.id.substring(0, 8)}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
              <span>تاریخ بروزرسانی: {new Date(program.updated_at).toLocaleDateString('fa-IR')}</span>
            </div>
            
            {/* Product Description - Added here */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 mb-4">
              <h3 className="text-lg font-medium mb-2 text-gold-500">توضیحات محصول</h3>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-gray-300 leading-relaxed text-sm">
                  {program.description}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">قیمت:</span>
              <div className="text-2xl font-bold text-gold-500">{formatPrice(program.price)}</div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">وضعیت:</span>
              <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">موجود</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Button 
                onClick={handleBuyClick}
                className="col-span-3 bg-gold-500 hover:bg-gold-600 text-black"
              >
                <ShoppingCart className="ml-2 h-4 w-4" />
                خرید محصول
              </Button>
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Product Features */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h3 className="text-lg font-medium mb-3 text-gold-500">ویژگی‌های محصول</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>دسترسی آنی پس از خرید</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>برنامه اختصاصی و شخصی‌سازی شده</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>پشتیبانی ۲۴/۷ از طریق پیام‌رسان</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>بروزرسانی‌های رایگان</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-4 text-gold-500 border-b border-gray-800 pb-3">مشخصات محصول</h3>
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-gold-500 font-medium mb-2">اطلاعات محصول</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">نوع محصول:</span>
                      <span>{getCategoryLabel(program.category)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">تاریخ انتشار:</span>
                      <span>{new Date(program.created_at).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">آخرین بروزرسانی:</span>
                      <span>{new Date(program.updated_at).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">شناسه محصول:</span>
                      <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">{program.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-gold-500 font-medium mb-2">مشخصات فنی</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">فرمت تحویل:</span>
                      <span>PDF + ویدیو آموزشی</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">نحوه دسترسی:</span>
                      <span>دانلود مستقیم</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">مدت پشتیبانی:</span>
                      <span>۳ ماه</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">قابلیت بروزرسانی:</span>
                      <span>دارد</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-right">
                  <div className="text-3xl font-bold text-gold-500 mb-2">
                    {formatPrice(program.price)}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {hasPurchased ? 'شما این محصول را خریداری کرده‌اید' : 'قیمت نهایی محصول'}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleBuyClick}
                    disabled={checkingPurchase}
                    className={`px-8 py-3 text-lg font-medium transition-all duration-300 ${
                      hasPurchased 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gold-500 hover:bg-gold-600 text-black'
                    }`}
                  >
                    {checkingPurchase ? (
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    ) : hasPurchased ? (
                      <>
                        <ArrowRight className="ml-2 h-5 w-5" />
                        مشاهده جزئیات
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="ml-2 h-5 w-5" />
                        خرید محصول
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: program.title,
                          text: program.description,
                          url: window.location.href,
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "لینک کپی شد",
                          description: "لینک محصول در کلیپ‌بورد کپی شد.",
                        });
                      }
                    }}
                  >
                    <Share2 className="ml-2 h-4 w-4" />
                    اشتراک‌گذاری
                  </Button>
                </div>
              </div>
              
              {!hasPurchased && (
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center text-sm text-gray-400">
                    <div className="flex items-center ml-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                      <span>پرداخت امن</span>
                    </div>
                    <div className="flex items-center ml-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                      <span>دانلود فوری</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                      <span>پشتیبانی ۳ ماهه</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedPrograms.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gold-500 mb-6">محصولات مرتبط</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPrograms.map((relatedProgram) => (
              <Card 
                key={relatedProgram.id} 
                className="overflow-hidden bg-gray-900 border-gray-800 transition-all duration-300 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/10"
              >
                <div className="aspect-video w-full overflow-hidden">
                  {relatedProgram.image_url ? (
                    <img 
                      src={relatedProgram.image_url} 
                      alt={relatedProgram.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">بدون تصویر</span>
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg text-gold-500 line-clamp-1">{relatedProgram.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {getCategoryLabel(relatedProgram.category)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-lg font-bold text-white">{formatPrice(relatedProgram.price)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="default" 
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    onClick={() => navigate(`/product/${relatedProgram.id}`)}
                  >
                    مشاهده محصول
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;