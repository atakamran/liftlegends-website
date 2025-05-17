
import { BlogPost } from "@/types/blog";
import BlogPostCard from "./BlogPostCard";

interface BlogPostListProps {
  posts: BlogPost[];
  activeCategory: string;
  isVisible: boolean;
}

const BlogPostList = ({ posts, activeCategory, isVisible }: BlogPostListProps) => {
  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "500ms" }}>
      <h2 className="text-2xl font-bold mb-8 flex items-center">
        <span className="w-2 h-8 bg-yellow-500 rounded-full ml-3"></span>
        {activeCategory === "all" ? "همه مقالات" : 
         activeCategory === "workout" ? "مقالات تمرین و برنامه‌ریزی" :
         activeCategory === "nutrition" ? "مقالات تغذیه و رژیم" :
         activeCategory === "supplements" ? "مقالات مکمل‌ها" : "مقالات انگیزش و روانشناسی"}
      </h2>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">مقاله‌ای در این دسته‌بندی یافت نشد.</p>
        </div>
      )}
    </div>
  );
};

export default BlogPostList;
