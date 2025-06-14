
import { BlogPost } from "@/types/blog";
import BlogPostCard from "./BlogPostCard";
import { motion } from "framer-motion";

interface BlogPostListProps {
  posts: BlogPost[];
  activeCategory: string;
  isVisible: boolean;
}

const BlogPostList = ({ posts, activeCategory, isVisible }: BlogPostListProps) => {
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Get category title
  const getCategoryTitle = () => {
    switch(activeCategory) {
      case "all": return "همه مقالات";
      case "workout": return "مقالات تمرین و برنامه‌ریزی";
      case "nutrition": return "مقالات تغذیه و رژیم";
      case "supplements": return "مقالات مکمل‌ها";
      case "motivation": return "مقالات انگیزش و روانشناسی";
      default: return "همه مقالات";
    }
  };

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
      {/* Section Title with Modern Design */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center">
          <div className="w-1 sm:w-1.5 h-8 sm:h-10 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full ml-3 sm:ml-4"></div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {getCategoryTitle()}
          </h2>
        </div>
        <p className="text-gray-400 text-sm sm:text-base mt-2 mr-4 sm:mr-6">
          {activeCategory === "all" 
            ? "آخرین مقالات و محتوای آموزشی در زمینه بدنسازی و تناسب اندام" 
            : `مجموعه مقالات تخصصی در دسته‌بندی ${getCategoryTitle()}`}
        </p>
      </div>
      
      {posts.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={item}>
              <BlogPostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 sm:py-16 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800">
          <p className="text-gray-300 text-base sm:text-lg">مقاله‌ای در این دسته‌بندی یافت نشد.</p>
          <p className="text-gray-400 text-sm mt-2">لطفاً دسته‌بندی دیگری را انتخاب کنید یا بعداً دوباره بررسی کنید.</p>
        </div>
      )}
    </div>
  );
};

export default BlogPostList;
