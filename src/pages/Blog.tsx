
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import FooterSection from "@/components/FooterSection";
import { Dumbbell, Utensils, Pill, Brain } from "lucide-react";
import { BlogPost } from "@/types/blog";
import BlogHero from "@/components/blog/BlogHero";
import CategoryFilter from "@/components/blog/CategoryFilter";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogPostList from "@/components/blog/BlogPostList";
import NewsletterSubscription from "@/components/blog/NewsletterSubscription";

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const blogPosts = [
    {
      id: "workout-plans-for-muscle-growth",
      category: "تمرین و برنامه‌ریزی",
      categorySlug: "workout",
      icon: <Dumbbell size={16} className="ml-1" />,
      title: "بهترین برنامه‌های تمرینی برای افزایش حجم عضلات",
      description: "در این مقاله، بهترین برنامه‌های تمرینی برای افزایش حجم عضلات را بررسی می‌کنیم و نکات کلیدی برای موفقیت در بدنسازی را به شما آموزش می‌دهیم.",
      date: "۱۵ مرداد ۱۴۰۳",
      readTime: "۸ دقیقه",
      image: "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg",
      featured: true
    },
    {
      id: "nutrition-for-muscle-gain",
      category: "تغذیه و رژیم",
      categorySlug: "nutrition",
      icon: <Utensils size={16} className="ml-1" />,
      title: "چی بخوریم برای افزایش وزن عضلانی؟",
      description: "راهنمای کامل تغذیه برای افزایش وزن عضلانی و بهبود عملکرد در تمرینات بدنسازی. با رعایت این اصول تغذیه‌ای، سریع‌تر به اهداف بدنسازی خود برسید.",
      date: "۱۰ مرداد ۱۴۰۳",
      readTime: "۱۰ دقیقه",
      image: "https://uploadkon.ir/uploads/1eec15_25چی-بخوریم-برای-افزایش-وزن-عضلانی؟.jpg",
      featured: false
    }
  ];

  const filteredPosts = activeCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.categorySlug === activeCategory);

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>بلاگ لیفت لجندز | مقالات تخصصی بدنسازی، تغذیه و تناسب اندام</title>
        <meta name="description" content="مقالات تخصصی در زمینه بدنسازی، تغذیه، تناسب اندام و سلامتی در بلاگ لیفت لجندز. آخرین تکنیک‌های تمرینی و توصیه‌های تغذیه‌ای را بخوانید." />
        <meta name="keywords" content="بلاگ بدنسازی، مقالات تغذیه ورزشی، برنامه تمرینی، افزایش حجم عضلات، رژیم غذایی بدنسازی، تناسب اندام" />
        <link rel="canonical" href="https://liftlegends.ir/blog" />
        <meta property="og:title" content="بلاگ لیفت لجندز | مقالات تخصصی بدنسازی و تناسب اندام" />
        <meta property="og:description" content="مقالات تخصصی در زمینه بدنسازی، تغذیه، تناسب اندام و سلامتی در بلاگ لیفت لجندز. آخرین تکنیک‌های تمرینی و توصیه‌های تغذیه‌ای را بخوانید." />
        <meta property="og:url" content="https://liftlegends.ir/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <BlogHero isVisible={isVisible} />

      {/* Category Filters */}
      <div className="container mx-auto px-4">
        <CategoryFilter 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          isVisible={isVisible} 
        />
      </div>

      {/* Featured Post */}
      {featuredPost && activeCategory === "all" && (
        <FeaturedPost post={featuredPost} isVisible={isVisible} />
      )}

      {/* All Posts */}
      <main className="container mx-auto px-4 pb-24">
        <BlogPostList 
          posts={filteredPosts} 
          activeCategory={activeCategory} 
          isVisible={isVisible} 
        />
        
        {/* Newsletter Subscription */}
        <NewsletterSubscription isVisible={isVisible} />
      </main>

      <FooterSection />
    </div>
  );
};

export default Blog;
