
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
    <div className="container mx-auto px-4 mb-16">
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "400ms" }}>
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <span className="w-2 h-8 bg-yellow-500 rounded-full ml-3"></span>
          مقاله ویژه
        </h2>
        <Link to={`/blog/${post.id}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 hover:border-yellow-500 transition-all duration-300 p-0 md:p-0">
            <div className="h-64 md:h-auto overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    {post.icon} {post.category}
                  </Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 hover:text-yellow-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">
                  {post.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 ml-1" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 ml-1" />
                  <span>زمان مطالعه: {post.readTime}</span>
                </div>
                <Button variant="link" className="text-yellow-400 hover:text-yellow-500 p-0">
                  ادامه مطلب <ArrowRight className="mr-1 h-4 w-4" />
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
