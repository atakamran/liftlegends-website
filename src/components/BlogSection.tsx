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
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">آخرین مقالات بلاگ</h2>
              <p className="text-gray-400 max-w-2xl">
                جدیدترین مقالات و نکات تخصصی در زمینه تمرین، تغذیه و سبک زندگی سالم
              </p>
            </div>
            <Link to="/blog">
              <Button variant="outline" className="mt-4 md:mt-0 border-gold-500/50 text-gold-500 hover:bg-gold-500/10">
                مشاهده همه مقالات
                <ArrowRight className="mr-2" size={16} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link to={`/blog/${post.slug || post.id}`} key={post.id}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-gold-500/50 transition-all duration-300 h-full flex flex-col overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.cover_image || "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <Badge variant="outline" className="text-gold-400 border-gold-400 bg-gold-400/10 mb-3 self-start">
                        {getCategoryIcon(post.category)} {getCategoryName(post.category)}
                      </Badge>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-gold-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt || "مطالعه این مقاله را از دست ندهید..."}
                      </p>
                      <div className="flex items-center text-gray-500 text-sm mt-auto">
                        <Calendar size={14} className="ml-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;