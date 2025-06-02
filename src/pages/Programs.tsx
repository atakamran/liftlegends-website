import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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

// Define interfaces
interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'training' | 'diet' | 'supplement';
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const Programs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("training");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

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
        created_at: program.created_at || new Date().toISOString(),
        updated_at: program.updated_at || new Date().toISOString()
      })) : [];
      
      setPrograms(programsData);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری برنامه‌ها",
        description: "مشکلی در دریافت لیست برنامه‌ها رخ داد. لطفاً دوباره تلاش کنید.",
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
  }, [programs, activeTab, searchQuery, sortOption, priceRange]);

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

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:py-12">
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
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
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
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="diet" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="supplement" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                )}
              </div>
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

  // Handle card click to navigate to product page
  const handleCardClick = () => {
    navigate(`/product/${program.id}`);
  };

  return (
    <Card 
      className="overflow-hidden bg-gray-900 border-gray-800 transition-all duration-300 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/10 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {program.image_url ? (
          <img 
            src={program.image_url} 
            alt={program.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">بدون تصویر</span>
          </div>
        )}
        
        <Badge className={`absolute top-2 right-2 ${getCategoryColor(program.category)}`}>
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
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="default" 
          className="w-full bg-gold-500 hover:bg-gold-600 text-black"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click event from firing
            navigate(`/product/${program.id}`);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path><path d="M11 8v6"></path><path d="M8 11h6"></path></svg>
          مشاهده محصول
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Programs;