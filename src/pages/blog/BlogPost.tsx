import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import FooterSection from "@/components/FooterSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Copy, Check, Dumbbell, Utensils, Pill, Brain, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

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

const BlogPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    fetchBlogPost();
    
    return () => clearTimeout(timer);
  }, [postId]);
  
  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      
      // Try to find by slug first
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", postId)
        .eq("published", true)
        .single();
      
      // If not found by slug, try by id
      if (error || !data) {
        const { data: dataById, error: errorById } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", postId)
          .eq("published", true)
          .single();
          
        if (errorById) throw errorById;
        
        // Use dataById instead of reassigning data
        if (dataById) {
          setPost(dataById);
          fetchRelatedPosts(dataById.category, dataById.id);
          return;
        }
      }
      
      if (data) {
        setPost(data);
        fetchRelatedPosts(data.category, data.id);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRelatedPosts = async (category: string | null, currentPostId: string) => {
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .eq("category", category)
        .neq("id", currentPostId)
        .order("created_at", { ascending: false })
        .limit(2);
      
      if (data) {
        setRelatedPosts(data);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Convert to Persian date format
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('fa-IR', options).format(date);
  };

  // Helper function to get category name in Persian
  const getCategoryName = (category: string | null) => {
    switch(category?.toLowerCase()) {
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
  
  // Helper function to get icon based on category
  const getCategoryIcon = (category: string | null) => {
    switch(category?.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مقاله مورد نظر یافت نشد</h1>
          <Link to="/blog">
            <Button variant="outline" className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10">
              <ArrowRight className="ml-2" size={16} />
              بازگشت به بلاگ
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{post.title} | لیفت لجندز</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta name="keywords" content={`${getCategoryName(post.category)}، بدنسازی، تناسب اندام، لیفت لجندز، ${post.title}`} />
        <link rel="canonical" href={`https://liftlegends.ir/blog/${post.slug || post.id}`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${post.title} | لیفت لجندز`} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={`https://liftlegends.ir/blog/${post.slug || post.id}`} />
        <meta property="og:image" content={post.cover_image || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:site_name" content="LiftLegends" />
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:modified_time" content={post.updated_at} />
        <meta property="article:section" content={getCategoryName(post.category)} />
        
        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        <meta name="twitter:image" content={post.cover_image || ""} />
        <meta name="twitter:site" content="@liftlegends" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.cover_image,
            "datePublished": post.created_at,
            "dateModified": post.updated_at || post.created_at,
            "author": {
              "@type": "Person",
              "name": "تیم لیفت لجندز"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LiftLegends",
              "logo": {
                "@type": "ImageObject",
                "url": "https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
              }
            },
            "description": post.excerpt || post.title,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://liftlegends.ir/blog/${post.slug || post.id}`
            },
            "keywords": `${getCategoryName(post.category)}، بدنسازی، تناسب اندام، لیفت لجندز، ${post.title}`
          })}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={post.cover_image || "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg"} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 sm:pb-12">
          <div className={`max-w-4xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link 
              to="/blog" 
              className="inline-flex items-center text-white/70 hover:text-gold-400 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
              title="بازگشت به صفحه اصلی بلاگ"
              aria-label="بازگشت به صفحه اصلی بلاگ"
            >
              <ArrowRight className="ml-1 sm:ml-2" size={14} />
              بازگشت به بلاگ
            </Link>
            
            <Link to={`/blog?category=${post.category}`}>
              <Badge 
                variant="outline" 
                className="text-yellow-400 border-yellow-400 bg-yellow-400/10 mb-3 sm:mb-4 text-xs sm:text-sm hover:bg-yellow-400/20 cursor-pointer transition-colors"
              >
                {getCategoryIcon(post.category)} {getCategoryName(post.category)}
              </Badge>
            </Link>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm">
              <div className="flex items-center">
                <Calendar className="ml-1" size={12} />
                {formatDate(post.created_at)}
              </div>
              <div className="flex items-center">
                <Clock className="ml-1" size={12} />
                ۵ دقیقه مطالعه
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 lg:order-1 order-2">
            <article className={`prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
            
            {/* Share Section */}
            <div className={`mt-12 border-t border-white/10 pt-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
              <h3 className="text-xl font-bold mb-4">اشتراک‌گذاری مقاله</h3>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                        <Facebook size={18} />
                        <span className="sr-only">اشتراک در فیسبوک</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>اشتراک در فیسبوک</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}>
                        <Twitter size={18} />
                        <span className="sr-only">اشتراک در توییتر</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>اشتراک در توییتر</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`, '_blank')}>
                        <Linkedin size={18} />
                        <span className="sr-only">اشتراک در لینکدین</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>اشتراک در لینکدین</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" onClick={copyToClipboard}>
                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        <span className="sr-only">کپی لینک</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "کپی شد!" : "کپی لینک"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 lg:order-2 order-1">
            <div className={`sticky top-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "100ms" }}>
              {/* App Download Card */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" 
                      alt="LiftLegends Logo" 
                      className="w-16 h-16"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">اپلیکیشن لیفت لجندز</h3>
                  <p className="text-white/70 text-sm text-center mb-4">
                    برنامه تمرینی و رژیم غذایی شخصی‌سازی شده دریافت کنید
                  </p>
                  <Button 
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                    onClick={() => window.location.href = "/download"}
                  >
                    <Download size={16} className="ml-2" />
                    دانلود اپلیکیشن
                  </Button>
                </CardContent>
              </Card>
              
              {/* Related Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">دسته‌بندی‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  <Link 
                    to="/blog?category=workout" 
                    title="مقالات تمرین و برنامه‌ریزی"
                    aria-label="مشاهده مقالات دسته تمرین و برنامه‌ریزی"
                  >
                    <Badge variant="outline" className="bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
                      <Dumbbell size={14} className="ml-1" />
                      تمرین و برنامه‌ریزی
                    </Badge>
                  </Link>
                  <Link 
                    to="/blog?category=nutrition" 
                    title="مقالات تغذیه و رژیم"
                    aria-label="مشاهده مقالات دسته تغذیه و رژیم"
                  >
                    <Badge variant="outline" className="bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
                      <Utensils size={14} className="ml-1" />
                      تغذیه و رژیم
                    </Badge>
                  </Link>
                  <Link 
                    to="/blog?category=supplements" 
                    title="مقالات مکمل‌ها"
                    aria-label="مشاهده مقالات دسته مکمل‌ها"
                  >
                    <Badge variant="outline" className="bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
                      <Pill size={14} className="ml-1" />
                      مکمل‌ها
                    </Badge>
                  </Link>
                  <Link 
                    to="/blog?category=motivation" 
                    title="مقالات انگیزش و روانشناسی"
                    aria-label="مشاهده مقالات دسته انگیزش و روانشناسی"
                  >
                    <Badge variant="outline" className="bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
                      <Brain size={14} className="ml-1" />
                      انگیزش و روانشناسی
                    </Badge>
                  </Link>
                </div>
              </div>
              
              {/* Newsletter Subscription */}
              {/* <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3">عضویت در خبرنامه</h3>
                  <p className="text-white/70 text-sm mb-4">
                    برای دریافت آخرین مقالات و نکات تخصصی در خبرنامه ما عضو شوید
                  </p>
                  <form className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="ایمیل خود را وارد کنید" 
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                    <Button className="w-full bg-gold-500 hover:bg-gold-600 text-black">
                      عضویت
                    </Button>
                  </form>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-2 h-8 bg-yellow-500 rounded-full ml-3"></span>
              مقالات مرتبط
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link to={`/blog/${relatedPost.slug || relatedPost.id}`} key={relatedPost.id}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-500 transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-1/3 h-32 md:h-auto overflow-hidden">
                        <img 
                          src={relatedPost.cover_image || "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg"} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <CardContent className="md:w-2/3 p-4 flex flex-col justify-between">
                        <div>
                          <Link 
                            to={`/blog?category=${relatedPost.category}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge 
                              variant="outline" 
                              className="text-yellow-400 border-yellow-400 bg-yellow-400/10 mb-2 hover:bg-yellow-400/20 cursor-pointer transition-colors"
                            >
                              {getCategoryIcon(relatedPost.category)} {getCategoryName(relatedPost.category)}
                            </Badge>
                          </Link>
                          <h4 className="text-lg font-bold mb-2 line-clamp-2 hover:text-yellow-400 transition-colors">
                            {relatedPost.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                          <span>{formatDate(relatedPost.created_at)}</span>
                          <span>۵ دقیقه مطالعه</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <FooterSection />
    </div>
  );
};

export default BlogPostPage;