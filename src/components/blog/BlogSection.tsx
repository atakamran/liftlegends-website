import { useEffect, useState, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Calendar, Dumbbell, Utensils, Pill, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  cover_image: string | null;
  published: boolean;
  category: string | null;
  created_at: string;
}

// Default fallback image
const FALLBACK_IMAGE = "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg";

// Memoized blog post card component for better performance
const BlogPostCard = memo(({ 
  post, 
  formatDate, 
  getCategoryName, 
  getCategoryIcon, 
  handleCategoryClick 
}: { 
  post: BlogPost; 
  formatDate: (date: string) => string;
  getCategoryName: (category: string | null) => string;
  getCategoryIcon: (category: string | null) => JSX.Element;
  handleCategoryClick: (e: React.MouseEvent, category: string | null) => void;
}) => {
  // Image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(post.cover_image || FALLBACK_IMAGE);
  
  // Handle image loading errors
  const handleImageError = useCallback(() => {
    setImageSrc(FALLBACK_IMAGE);
  }, []);
  
  return (
    <Link to={`/blog/${post.slug || post.id}`} className="group">
      <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-gold-500/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]">
        {/* Image Container with optimized loading */}
        <div className="aspect-[16/10] w-full overflow-hidden relative">
          {/* Placeholder while image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-zinc-800 animate-pulse"></div>
          )}
          
          <img 
            src={imageSrc}
            alt={post.title} 
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            decoding="async"
            width="400"
            height="225"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          
          {/* Category Badge - Disappears on Hover */}
          <div className="absolute top-3 right-3 z-10 transform transition-all duration-500 ease-in-out group-hover:translate-y-[-100%] group-hover:opacity-0">
            <Badge 
              variant="outline" 
              className="bg-black/50 backdrop-blur-sm text-gold-400 border-gold-400/30 text-xs cursor-pointer hover:bg-black/70"
              onClick={(e) => handleCategoryClick(e, post.category)}
            >
              {getCategoryIcon(post.category)} {getCategoryName(post.category)}
            </Badge>
          </div>
          
          {/* Title - Disappears on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform transition-all duration-500 ease-in-out group-hover:translate-y-full group-hover:opacity-0">
            <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2">
              {post.title}
            </h3>
          </div>
        </div>
        
        {/* Hidden Content - Revealed on Hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
          {/* Category Badge in Hover State */}
          <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <Badge 
              variant="outline" 
              className="bg-black/50 backdrop-blur-sm text-gold-400 border-gold-400/30 text-xs cursor-pointer hover:bg-black/70"
              onClick={(e) => handleCategoryClick(e, post.category)}
            >
              {getCategoryIcon(post.category)} {getCategoryName(post.category)}
            </Badge>
          </div>
          
          {/* Title in Hover State - Appears with Animation */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-gold-400 transition-all duration-300 
                        transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-100">
            {post.title}
          </h3>
          
          {/* Description - Only Visible on Hover */}
          <p className="text-gray-300 text-sm line-clamp-3 mb-4 
                      transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
            {post.excerpt || "مطالعه این مقاله را از دست ندهید..."}
          </p>
          
          {/* Footer - Only Visible on Hover */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto 
                        transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200">
            <span className="flex items-center">
              <Calendar className="ml-1" size={12} />
              {formatDate(post.created_at)}
            </span>
            <span>۵ دقیقه مطالعه</span>
          </div>
          
          {/* Read More Button - Only Visible on Hover */}
          <div className="mt-3 flex items-center text-gold-400 text-sm font-medium 
                        transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-250">
            <span>ادامه مطلب</span>
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:translate-x-[-4px] transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
});

// Optimized BlogSection component
const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Only fetch posts when section is visible
          fetchLatestPosts();
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const sectionElement = document.getElementById('blog-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }
    
    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  // Memoized fetch function
  const fetchLatestPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, slug, cover_image, published, category, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      if (data) setPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized helper functions
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    // Convert to Persian date format
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('fa-IR', options).format(date);
  }, []);

  const getCategoryName = useCallback((category: string | null) => {
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
  }, []);
  
  const getCategoryIcon = useCallback((category: string | null) => {
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
  }, []);

  // Memoized event handler
  const handleCategoryClick = useCallback((e: React.MouseEvent, category: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blog?category=${category?.toLowerCase() || 'all'}`);
  }, [navigate]);

  return (
    <section id="blog-section" className="py-32 bg-gradient-to-b from-black to-gray-900 text-white relative">
      {/* Enhanced background effects - only render when visible for performance */}
      {isVisible && (
        <>
          <div className="absolute -z-10 top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[150px] opacity-5"></div>
          <div className="absolute -z-10 bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[120px] opacity-3"></div>
        </>
      )}
      
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Enhanced section header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-purple-400 text-sm px-5 py-2 rounded-full border border-purple-500/20 mb-5">
              بلاگ آموزشی
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
              آخرین مقالات بلاگ
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              جدیدترین مقالات و نکات تخصصی در زمینه تمرین، تغذیه و سبک زندگی سالم
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Blog post cards with hover effect - using virtualized rendering for performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {posts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    formatDate={formatDate}
                    getCategoryName={getCategoryName}
                    getCategoryIcon={getCategoryIcon}
                    handleCategoryClick={handleCategoryClick}
                  />
                ))}
              </div>
              
              {/* Enhanced CTA button */}
              <div className="flex justify-center">
                <Link to="/blog">
                  <Button 
                    variant="outline" 
                    className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10 px-8 py-6 text-lg rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] transition-all duration-300 group"
                  >
                    مشاهده همه مقالات
                    <ArrowRight className="mr-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(BlogSection);