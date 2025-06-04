import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Dumbbell, Utensils, Pill, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchLatestPosts();
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchLatestPosts = async () => {
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

  return (
    <section className="py-32 bg-gradient-to-b from-black to-gray-900 text-white relative">
      {/* Enhanced background effects */}
      <div className="absolute -z-10 top-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[120px] opacity-3"></div>
      
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
              {/* Enhanced blog post cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {posts.map((post) => (
                  <Link to={`/blog/${post.slug || post.id}`} key={post.id} className="group">
                    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 group-hover:border-gold-500/50 transition-all duration-500 h-full flex flex-col overflow-hidden rounded-2xl shadow-xl group-hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transform group-hover:-translate-y-2">
                      <div className="h-56 overflow-hidden relative">
                        {/* Overlay gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/40 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10"></div>
                        
                        <img
                          src={post.cover_image || "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        
                        {/* Category badge positioned over image */}
                        <Badge variant="outline" className="absolute top-4 right-4 z-20 text-gold-400 border-gold-400 bg-black/70 backdrop-blur-sm py-1.5">
                          {getCategoryIcon(post.category)} {getCategoryName(post.category)}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-gold-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {post.excerpt || "مطالعه این مقاله را از دست ندهید..."}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800/50">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar size={14} className="ml-1" />
                            {formatDate(post.created_at)}
                          </div>
                          
                          <span className="text-gold-400 text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            مطالعه مقاله
                            <ArrowRight size={14} className="mr-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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

export default BlogSection;