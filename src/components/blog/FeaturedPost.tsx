
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface FeaturedPostProps {
  post: BlogPost;
  isVisible: boolean;
}

const FeaturedPost = ({ post, isVisible }: FeaturedPostProps) => {
  return (
    <div className="container mx-auto px-4 mb-10 sm:mb-16">
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "400ms" }}>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center px-2 sm:px-0">
          <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-yellow-500 rounded-full ml-2 sm:ml-3"></span>
          مقاله ویژه
        </h2>
        <Link 
          to={`/blog/${post.slug || post.id}`}
          title={post.title}
          aria-label={`مشاهده مقاله: ${post.title}`}
          className="block"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-700 hover:border-yellow-500 transition-all duration-300">
            <div className="h-48 sm:h-64 md:h-auto overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                width="600"
                height="400"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-3 sm:mb-4">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm">
                    {post.icon} {post.category}
                  </Badge>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 hover:text-yellow-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                  {post.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex flex-wrap items-center text-gray-400 text-xs sm:text-sm">
                  <div className="flex items-center ml-3">
                    <Calendar className="w-3 sm:w-4 h-3 sm:h-4 ml-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 sm:w-4 h-3 sm:h-4 ml-1" />
                    <span>زمان مطالعه: {post.readTime}</span>
                  </div>
                </div>
                <Button variant="link" className="text-yellow-400 hover:text-yellow-500 p-0 h-auto text-sm sm:text-base">
                  ادامه مطلب <ArrowRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPost;
