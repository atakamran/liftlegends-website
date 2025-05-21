
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FooterSection from "@/components/FooterSection";
import { Dumbbell, Utensils, Pill, Brain } from "lucide-react";
import { BlogPost } from "@/types/blog";
import BlogHero from "@/components/blog/BlogHero";
import CategoryFilter from "@/components/blog/CategoryFilter";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogPostList from "@/components/blog/BlogPostList";
import NewsletterSubscription from "@/components/blog/NewsletterSubscription";
import { supabase } from "@/integrations/supabase/client";
import { ReactNode } from "react";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get category icon
  const getCategoryIcon = (category: string): ReactNode => {
    switch(category.toLowerCase()) {
      case 'workout':
        return <Dumbbell size={16} className="ml-1" />;
      case 'nutrition':
        return <Utensils size={16} className="ml-1" />;
      case 'supplements':
        return <Pill size={16} className="ml-1" />;
      case 'motivation':
        return <Brain size={16} className="ml-1" />;
      default:
        return <Dumbbell size={16} className="ml-1" />;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    // Convert to Persian date format
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('fa-IR', options).format(date);
  };

  // Helper function to calculate read time
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} دقیقه`;
  };

  // Helper function to get category name in Persian
  const getCategoryName = (category: string): string => {
    switch(category.toLowerCase()) {
      case 'workout':
        return 'تمرین و برنامه‌ریزی';
      case 'nutrition':
        return 'تغذیه و رژیم';
      case 'supplements':
        return 'مکمل‌ها';
      case 'motivation':
        return 'انگیزش و روانشناسی';
      default:
        return category || 'عمومی';
    }
  };

  // Custom function to update category and URL params
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    fetchBlogPosts();
    
    return () => clearTimeout(timer);
  }, [activeCategory]);
  
  // Update active category when URL changes
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    if (category !== activeCategory) {
      setActiveCategory(category);
    }
  }, [searchParams, activeCategory]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Transform the data to match the BlogPost interface
        const transformedPosts: BlogPost[] = data.map(post => ({
          id: post.id,
          slug: post.slug,
          category: getCategoryName(post.category),
          categorySlug: post.category,
          icon: getCategoryIcon(post.category),
          title: post.title,
          description: post.excerpt || post.title,
          date: formatDate(post.created_at),
          readTime: calculateReadTime(post.content),
          image: post.cover_image || "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg",
          featured: false, // Since 'featured' doesn't exist in the database schema, defaulting to false
          content: post.content
        }));
        
        setBlogPosts(transformedPosts);
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError("خطا در بارگذاری مقالات. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = activeCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.categorySlug.toLowerCase() === activeCategory.toLowerCase());

  const featuredPost = blogPosts.find(post => post.featured);

  // Generate meta description based on active category
  const getMetaDescription = () => {
    if (activeCategory === "all") {
      return "مقالات تخصصی در زمینه بدنسازی، تغذیه، تناسب اندام و سلامتی در بلاگ لیفت لجندز. آخرین تکنیک‌های تمرینی و توصیه‌های تغذیه‌ای را بخوانید.";
    }
    
    switch(activeCategory.toLowerCase()) {
      case 'workout':
        return "مقالات تخصصی در زمینه تمرین و برنامه‌ریزی بدنسازی. بهترین تکنیک‌های تمرینی، برنامه‌های افزایش حجم عضلات و قدرت را در بلاگ لیفت لجندز بخوانید.";
      case 'nutrition':
        return "مقالات تخصصی در زمینه تغذیه و رژیم‌های بدنسازی. اصول تغذیه صحیح برای افزایش حجم عضلات، کاهش چربی و بهبود عملکرد ورزشی را در بلاگ لیفت لجندز بخوانید.";
      case 'supplements':
        return "راهنمای جامع مکمل‌های بدنسازی و ورزشی. اطلاعات کامل درباره انواع مکمل‌ها، نحوه مصرف و تاثیرات آنها را در بلاگ لیفت لجندز بخوانید.";
      case 'motivation':
        return "مقالات انگیزشی و روانشناسی ورزشی برای بهبود عملکرد و حفظ انگیزه در مسیر بدنسازی. راهکارهای غلبه بر موانع ذهنی را در بلاگ لیفت لجندز بخوانید.";
      default:
        return "مقالات تخصصی در زمینه بدنسازی، تغذیه، تناسب اندام و سلامتی در بلاگ لیفت لجندز. آخرین تکنیک‌های تمرینی و توصیه‌های تغذیه‌ای را بخوانید.";
    }
  };

  // Generate title based on active category
  const getPageTitle = () => {
    if (activeCategory === "all") {
      return "بلاگ لیفت لجندز | مقالات تخصصی بدنسازی، تغذیه و تناسب اندام";
    }
    
    switch(activeCategory.toLowerCase()) {
      case 'workout':
        return "مقالات تمرین و برنامه‌ریزی بدنسازی | بلاگ لیفت لجندز";
      case 'nutrition':
        return "مقالات تغذیه و رژیم بدنسازی | بلاگ لیفت لجندز";
      case 'supplements':
        return "راهنمای مکمل‌های بدنسازی و ورزشی | بلاگ لیفت لجندز";
      case 'motivation':
        return "مقالات انگیزشی و روانشناسی ورزشی | بلاگ لیفت لجندز";
      default:
        return "بلاگ لیفت لجندز | مقالات تخصصی بدنسازی، تغذیه و تناسب اندام";
    }
  };

  // Generate keywords based on active category
  const getKeywords = () => {
    const baseKeywords = "بلاگ بدنسازی، مقالات تغذیه ورزشی، برنامه تمرینی، افزایش حجم عضلات، رژیم غذایی بدنسازی، تناسب اندام";
    
    if (activeCategory === "all") {
      return baseKeywords;
    }
    
    switch(activeCategory.toLowerCase()) {
      case 'workout':
        return `برنامه تمرینی بدنسازی، افزایش حجم عضلات، تکنیک‌های تمرینی، تمرینات قدرتی، ${baseKeywords}`;
      case 'nutrition':
        return `رژیم غذایی بدنسازی، تغذیه ورزشی، رژیم افزایش وزن، رژیم کاهش چربی، ماکروها، ${baseKeywords}`;
      case 'supplements':
        return `مکمل‌های بدنسازی، پروتئین وی، کراتین، پری ورکاوت، مکمل‌های ورزشی، ${baseKeywords}`;
      case 'motivation':
        return `انگیزش ورزشی، روانشناسی بدنسازی، غلبه بر موانع ذهنی، اهداف بدنسازی، ${baseKeywords}`;
      default:
        return baseKeywords;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="keywords" content={getKeywords()} />
        <link rel="canonical" href={`https://liftlegends.ir/blog${activeCategory !== "all" ? `?category=${activeCategory}` : ""}`} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:url" content={`https://liftlegends.ir/blog${activeCategory !== "all" ? `?category=${activeCategory}` : ""}`} />
        <meta property="og:type" content="website" />
        {featuredPost && <meta property="og:image" content={featuredPost.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getPageTitle()} />
        <meta name="twitter:description" content={getMetaDescription()} />
        {featuredPost && <meta name="twitter:image" content={featuredPost.image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "headline": getPageTitle(),
            "description": getMetaDescription(),
            "url": `https://liftlegends.ir/blog${activeCategory !== "all" ? `?category=${activeCategory}` : ""}`,
            "author": {
              "@type": "Organization",
              "name": "لیفت لجندز",
              "url": "https://liftlegends.ir"
            },
            "publisher": {
              "@type": "Organization",
              "name": "لیفت لجندز",
              "url": "https://liftlegends.ir"
            }
          })}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <BlogHero isVisible={isVisible} />

      {/* Category Filters */}
      <div className="container mx-auto px-4">
        <CategoryFilter 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange} 
          isVisible={isVisible} 
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && activeCategory === "all" && (
        <FeaturedPost post={featuredPost} isVisible={isVisible} />
      )}

      {/* All Posts */}
      <main className="container mx-auto px-4 pb-24">
        {filteredPosts.length > 0 ? (
          <BlogPostList 
            posts={filteredPosts} 
            activeCategory={activeCategory} 
            isVisible={isVisible} 
          />
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">مقاله‌ای در این دسته‌بندی یافت نشد</h2>
            <p className="text-white/70 mb-8">لطفاً دسته‌بندی دیگری را انتخاب کنید یا بعداً دوباره بررسی کنید.</p>
          </div>
        )}
        
        {/* Newsletter Subscription */}
        <NewsletterSubscription isVisible={isVisible} />
      </main>

      <FooterSection />
    </div>
  );
};

export default Blog;
