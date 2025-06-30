import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, ShoppingCart, Heart, ArrowUpDown } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import Breadcrumb from "@/components/Breadcrumb";

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

const Programs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [displayedPrograms, setDisplayedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("training");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category && ["training", "diet", "supplement"].includes(category)) {
      setActiveTab(category);
    }
  }, [location]);

  // Function to fetch programs
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      
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
        category: program.category,
        image_url: program.image_url,
        program_url: program.program_url || null,
        created_at: program.created_at || new Date().toISOString(),
        updated_at: program.updated_at || new Date().toISOString()
      })) : [];
      
      setPrograms(programsData);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast({
        variant: "default",
        title: "⚠️ مشکلی پیش آمده",
        description: "در حال حاضر امکان نمایش برنامه‌ها وجود ندارد. لطفاً صفحه را رفرش کنید یا چند لحظه دیگر دوباره تلاش کنید.",
        className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Filter and sort programs when dependencies change
  useEffect(() => {
    if (!programs.length) return;
    
    let result = [...programs];
    
    // Filter by category
    result = result.filter(program => program.category === activeTab);
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(program => 
        program.title.toLowerCase().includes(query) || 
        program.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    result = result.filter(program => 
      program.price >= priceRange[0] && program.price <= priceRange[1]
    );
    
    // Sort programs
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "title_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredPrograms(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [programs, activeTab, searchQuery, sortOption, priceRange]);

  // Update displayed programs based on pagination
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedPrograms(filteredPrograms.slice(startIndex, endIndex));
  }, [filteredPrograms, currentPage, itemsPerPage]);

  // Load more products function
  const loadMoreProducts = async () => {
    if (loadingMore || (currentPage * itemsPerPage) >= filteredPrograms.length) return;
    
    setLoadingMore(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(prev => prev + 1);
    setLoadingMore(false);
  };

  // Check if there are more products to load
  const hasMoreProducts = (currentPage * itemsPerPage) < filteredPrograms.length;

  // Format price with Persian numerals and Toman
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Get category badge color
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

  // Get category name for title and meta description
  const getCategoryName = () => {
    switch (activeTab) {
      case 'training':
        return 'برنامه‌های تمرینی';
      case 'diet':
        return 'برنامه‌های غذایی';
      case 'supplement':
        return 'مکمل‌ها';
      default:
        return 'محصولات';
    }
  };

  // Generate meta description based on active category
  const getMetaDescription = () => {
    switch (activeTab) {
      case 'training':
        return 'مجموعه کاملی از برنامه‌های تمرینی تخصصی لیفت لجندز برای بدنسازی، فیتنس و تناسب اندام. برنامه‌های تمرینی با کیفیت برای رسیدن به اهداف بدنی شما.';
      case 'diet':
        return 'برنامه‌های غذایی تخصصی لیفت لجندز برای کاهش وزن، افزایش وزن و حجم عضلانی. رژیم‌های غذایی متناسب با اهداف بدنی و سبک زندگی شما.';
      case 'supplement':
        return 'مکمل‌های ورزشی و غذایی با کیفیت لیفت لجندز برای بهبود عملکرد ورزشی، افزایش حجم عضلانی و بهبود سلامت. مکمل‌های مورد تایید متخصصین تغذیه.';
      default:
        return 'محصولات تخصصی لیفت لجندز شامل برنامه‌های تمرینی، رژیم‌های غذایی و مکمل‌های ورزشی برای رسیدن به اهداف تناسب اندام و سلامتی شما.';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:py-12 pb-16 md:pb-8">
      <Helmet>
        <title>{getCategoryName()} | لیفت لجندز</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="keywords" content={`لیفت لجندز, ${getCategoryName()}, تناسب اندام, بدنسازی, فیتنس, برنامه تمرینی, رژیم غذایی, مکمل ورزشی`} />
        <link rel="canonical" href={`https://liftlegends.ir/programs?category=${activeTab}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://liftlegends.ir/programs?category=${activeTab}`} />
        <meta property="og:title" content={`${getCategoryName()} | لیفت لجندز`} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:image" content="https://liftlegends.ir/images/og-programs.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://liftlegends.ir/programs?category=${activeTab}`} />
        <meta property="twitter:title" content={`${getCategoryName()} | لیفت لجندز`} />
        <meta property="twitter:description" content={getMetaDescription()} />
        <meta property="twitter:image" content="https://liftlegends.ir/images/og-programs.jpg" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="لیفت لجندز" />
        <meta name="language" content="fa-IR" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${getCategoryName()} - لیفت لجندز`,
            "description": getMetaDescription(),
            "url": `https://liftlegends.ir/programs${activeTab !== "training" ? `?category=${activeTab}` : ""}`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredPrograms.length,
              "itemListElement": displayedPrograms.slice(0, 10).map((program, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "name": program.title,
                  "description": program.description,
                  "image": program.image_url || "https://liftlegends.ir/images/default-program.jpg",
                  "url": `https://liftlegends.ir/programs/${program.program_url || program.id}`,
                  "offers": {
                    "@type": "Offer",
                    "price": program.price,
                    "priceCurrency": "IRR",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": "لیفت لجندز",
                      "url": "https://liftlegends.ir"
                    }
                  },
                  "brand": {
                    "@type": "Brand",
                    "name": "لیفت لجندز"
                  },
                  "category": program.category
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "خانه",
                  "item": "https://liftlegends.ir"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "محصولات",
                  "item": "https://liftlegends.ir/programs"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": getCategoryName(),
                  "item": `https://liftlegends.ir/programs${activeTab !== "training" ? `?category=${activeTab}` : ""}`
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <Breadcrumb 
          items={[
            { label: 'خانه', href: '/' },
            { label: 'محصولات', href: '/programs' },
            { label: getCategoryName() }
          ]} 
        />
      </div>

      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gold-500 mb-4">برنامه‌های لیفت لجندز</h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          برنامه‌های تخصصی ما برای کمک به شما در رسیدن به اهداف تناسب اندام و سلامتی طراحی شده‌اند.
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-900/70 p-1 rounded-lg">
            <TabsTrigger 
              value="training" 
              className="text-sm md:text-base data-[state=active]:bg-gold-500 data-[state=active]:text-black"
            >
              برنامه‌های تمرینی
            </TabsTrigger>
            <TabsTrigger 
              value="diet" 
              className="text-sm md:text-base data-[state=active]:bg-gold-500 data-[state=active]:text-black"
            >
              برنامه‌های غذایی
            </TabsTrigger>
            <TabsTrigger 
              value="supplement" 
              className="text-sm md:text-base data-[state=active]:bg-gold-500 data-[state=active]:text-black"
            >
              مکمل‌ها
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="جستجو در محصولات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-gray-900/70 border-gray-700"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="border-gray-700 hover:bg-gray-800"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Filters and Sort */}
        {showFilters && (
          <div className="bg-gray-900/70 p-4 rounded-lg mb-6 border border-gray-800 animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">مرتب‌سازی بر اساس:</h3>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">جدیدترین</SelectItem>
                    <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
                    <SelectItem value="price_asc">قیمت: کم به زیاد</SelectItem>
                    <SelectItem value="price_desc">قیمت: زیاد به کم</SelectItem>
                    <SelectItem value="title_asc">حروف الفبا</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-300">محدوده قیمت:</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="حداقل"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full bg-gray-800 border-gray-700"
                  />
                  <span className="text-gray-400">تا</span>
                  <Input
                    type="number"
                    placeholder="حداکثر"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000000])}
                    className="w-full bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-700 hover:bg-gray-800"
                  onClick={() => {
                    setSearchQuery("");
                    setSortOption("newest");
                    setPriceRange([0, 10000000]);
                  }}
                >
                  پاک کردن فیلترها
                </Button>
                <Button 
                  size="sm"
                  className="bg-gold-500 hover:bg-gold-600 text-black"
                >
                  اعمال فیلترها
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="w-32 h-4 bg-gray-800 rounded animate-pulse"></div>
              <div className="w-40 h-4 bg-gray-800 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                  <div className="w-full h-48 bg-gray-800/50 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="w-20 h-4 bg-gray-800/50 rounded animate-pulse"></div>
                    <div className="w-full h-5 bg-gray-800/50 rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-gray-800/50 rounded animate-pulse"></div>
                    <div className="w-24 h-6 bg-gray-800/50 rounded animate-pulse"></div>
                    <div className="w-full h-10 bg-gray-800/50 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-400">
                {filteredPrograms.length} محصول یافت شد
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ArrowUpDown className="h-4 w-4" />
                <span>مرتب‌سازی: </span>
                <span className="text-gold-500">
                  {sortOption === "newest" && "جدیدترین"}
                  {sortOption === "oldest" && "قدیمی‌ترین"}
                  {sortOption === "price_asc" && "ارزان‌ترین"}
                  {sortOption === "price_desc" && "گران‌ترین"}
                  {sortOption === "title_asc" && "حروف الفبا"}
                </span>
              </div>
            </div>
            
            <TabsContent value="training" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedPrograms.length > 0 ? (
                  displayedPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : filteredPrograms.length === 0 && !loading ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                ) : null}
              </div>
              
              {/* Load More Button */}
              {(currentPage * itemsPerPage) < filteredPrograms.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-gold-500/20 hover:bg-gold-500/30 text-gold-500 border border-gold-500/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 inline animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      'نمایش بیشتر'
                    )}
                  </button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="diet" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedPrograms.length > 0 ? (
                  displayedPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : filteredPrograms.length === 0 && !loading ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                ) : null}
              </div>
              
              {/* Load More Button */}
              {(currentPage * itemsPerPage) < filteredPrograms.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-gold-500/20 hover:bg-gold-500/30 text-gold-500 border border-gold-500/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 inline animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      'نمایش بیشتر'
                    )}
                  </button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="supplement" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedPrograms.length > 0 ? (
                  displayedPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : filteredPrograms.length === 0 && !loading ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                ) : null}
              </div>
              
              {/* Load More Button */}
              {(currentPage * itemsPerPage) < filteredPrograms.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-gold-500/20 hover:bg-gold-500/30 text-gold-500 border border-gold-500/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 inline animate-spin" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      'نمایش بیشتر'
                    )}
                  </button>
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

// Program Card Component
const ProgramCard = ({ program }: { program: Program }) => {
  const navigate = useNavigate();
  
  // Format price with Persian numerals and Toman
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Get category badge color
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

  // Handle card click to navigate to product page using program_url as slug
  const handleCardClick = () => {
    // If program_url exists, use it as the slug; otherwise, fall back to the ID-based URL
    if (program.program_url) {
      navigate(`/programs/${program.program_url}`);
    } else {
      navigate(`/product/${program.id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden bg-gray-900 border-gray-800 transition-all duration-300 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/10 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-t-lg">
        {program.image_url ? (
          <LazyImage
            src={program.image_url}
            alt={program.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            fallbackSrc="/images/program-placeholder.jpg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-gray-500 text-sm">بدون تصویر</span>
            </div>
          </div>
        )}
        
        <Badge className={`absolute top-3 right-3 ${getCategoryColor(program.category)} backdrop-blur-sm`}>
          {program.category === 'training' && 'برنامه تمرینی'}
          {program.category === 'diet' && 'برنامه غذایی'}
          {program.category === 'supplement' && 'مکمل'}
        </Badge>
      </div>
      
      <CardHeader className="p-4">
        <CardTitle className="text-lg text-gold-500 line-clamp-1 hover:underline">
          {program.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-gray-300 line-clamp-2 text-sm mb-3 h-10">{program.description}</p>
        <p className="text-lg font-bold text-white">{formatPrice(program.price)}</p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          variant="default" 
          className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-black font-medium rounded-xl h-12 shadow-lg shadow-gold-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold-500/30"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click event from firing
            // Use program_url as the slug if available, otherwise fall back to ID-based URL
            if (program.program_url) {
              navigate(`/programs/${program.program_url}`);
            } else {
              navigate(`/product/${program.id}`);
            }
          }}
        >
          <ShoppingCart className="ml-2 h-4 w-4" />
          مشاهده محصول
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Programs;