
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const navigate = useNavigate();

  // Handle category click to redirect to filtered blog page
  const handleCategoryClick = (e: React.MouseEvent, categorySlug: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/blog?category=${categorySlug}`);
  };

  return (
    <Link 
      to={`/blog/${post.slug || post.id}`}
      title={post.title}
      aria-label={`مشاهده مقاله: ${post.title}`}
      className="block w-full group"
    >
      <div className="relative h-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-gold-500/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]">
        {/* Image Container */}
        <div className="aspect-[16/10] w-full overflow-hidden relative">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            width="400"
            height="250"
            loading="lazy"
            decoding="async"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
          
          {/* Category Badge - Disappears on Hover */}
          <div className="absolute top-3 right-3 z-10 transform transition-all duration-500 ease-in-out group-hover:translate-y-[-100%] group-hover:opacity-0">
            <Badge 
              variant="outline" 
              className="bg-black/50 backdrop-blur-sm text-gold-400 border-gold-400/30 text-xs cursor-pointer hover:bg-black/70"
              onClick={(e) => handleCategoryClick(e, post.categorySlug)}
            >
              {post.icon} {post.category}
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
              onClick={(e) => handleCategoryClick(e, post.categorySlug)}
            >
              {post.icon} {post.category}
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
            {post.description}
          </p>
          
          {/* Footer - Only Visible on Hover */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto 
                         transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
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
};

export default BlogPostCard;
