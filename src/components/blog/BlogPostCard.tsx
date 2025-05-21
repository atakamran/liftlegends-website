
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
    <Link 
      to={`/blog/${post.slug || post.id}`}
      title={post.title}
      aria-label={`مشاهده مقاله: ${post.title}`}
    >
      <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-300 h-full overflow-hidden">
        <div className="aspect-video w-full overflow-hidden relative">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            width="400"
            height="225"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center mb-2">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
              {post.icon} {post.category}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold hover:text-yellow-400 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <CardDescription className="text-gray-400 line-clamp-3">
            {post.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="text-sm text-gray-400 flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 ml-1" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 ml-1" />
            <span>{post.readTime}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogPostCard;
