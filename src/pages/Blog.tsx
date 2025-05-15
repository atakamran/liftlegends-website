import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import FooterSection from "@/components/FooterSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Search, Dumbbell, Utensils, Pill, Brain } from "lucide-react";
import { useEffect, useState } from "react";

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const blogPosts = [
    {
      id: "workout-plans-for-muscle-growth",
      category: "تمرین و برنامه‌ریزی",
      categorySlug: "workout",
      icon: <Dumbbell size={16} className="ml-1" />,
      title: "بهترین برنامه‌های تمرینی برای افزایش حجم عضلات",
      description: "در این مقاله، بهترین برنامه‌های تمرینی برای افزایش حجم عضلات را بررسی می‌کنیم و نکات کلیدی برای موفقیت در بدنسازی را به شما آموزش می‌دهیم.",
      date: "۱۵ مرداد ۱۴۰۳",
      readTime: "۸ دقیقه",
      image: "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg",
      featured: true
    },
    {
      id: "nutrition-for-muscle-gain",
      category: "تغذیه و رژیم",
      categorySlug: "nutrition",
      icon: <Utensils size={16} className="ml-1" />,
      title: "چی بخوریم برای افزایش وزن عضلانی؟",
      description: "راهنمای کامل تغذیه برای افزایش وزن عضلانی و بهبود عملکرد در تمرینات بدنسازی. با رعایت این اصول تغذیه‌ای، سریع‌تر به اهداف بدنسازی خود برسید.",
      date: "۱۰ مرداد ۱۴۰۳",
      readTime: "۱۰ دقیقه",
      image: "https://uploadkon.ir/uploads/1eec15_25چی-بخوریم-برای-افزایش-وزن-عضلانی؟.jpg",
      featured: false
    }
  ];

  const filteredPosts = activeCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.categorySlug === activeCategory);

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>بلاگ لیفت لجندز | مقالات تخصصی بدنسازی، تغذیه و تناسب اندام</title>
        <meta name="description" content="مقالات تخصصی در زمینه بدنسازی، تغذیه، تناسب اندام و سلامتی در بلاگ لیفت لجندز. آخرین تکنیک‌های تمرینی و توصیه‌های تغذیه‌ای را بخوانید." />
        <meta name="keywords" content="بلاگ بدنسازی، مقالات تغذیه ورزشی، برنامه تمرینی، افزایش حجم عضلات، رژیم غذایی بدنسازی، تناسب اندام" />
        <link rel="canonical" href="https://liftlegends.ir/blog" />
        <meta property="og:title" content="بلاگ لیفت لجندز | مقالات تخصصی بدنسازی و تناسب اندام" />
        <meta property="og:description" content="مقالات تخصصی در زمینه بدنسازی، تغذیه، تناسب اندام و سلامتی در بلاگ لیفت لجندز. آخرین تکنیک‌های تمرینی و توصیه‌های تغذیه‌ای را بخوانید." />
        <meta property="og:url" content="https://liftlegends.ir/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
        {/* Background effects */}
        <div className="absolute -z-10 top-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gold-500 rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute -z-10 bottom-40 right-10 w-40 h-40 bg-gold-400 rounded-full blur-[80px] opacity-5 animate-pulse"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              بلاگ لیفت لجندز
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              آخرین مقالات و راهنماهای تخصصی در زمینه بدنسازی، تغذیه و تناسب اندام
            </p>
          </div>

          {/* Search Bar */}
          <div className={`max-w-2xl mx-auto mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full p-4 pr-12 rounded-xl bg-zinc-800/50 border border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white placeholder-gray-400 transition-all"
                placeholder="جستجو در مقالات..."
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className={`flex flex-wrap justify-center gap-3 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
            <Button 
              variant={activeCategory === "all" ? "default" : "outline"} 
              className={activeCategory === "all" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
              onClick={() => setActiveCategory("all")}
            >
              همه مقالات
            </Button>
            <Button 
              variant={activeCategory === "workout" ? "default" : "outline"} 
              className={activeCategory === "workout" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
              onClick={() => setActiveCategory("workout")}
            >
              <Dumbbell size={16} className="ml-2" />
              تمرین و برنامه‌ریزی
            </Button>
            <Button 
              variant={activeCategory === "nutrition" ? "default" : "outline"} 
              className={activeCategory === "nutrition" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
              onClick={() => setActiveCategory("nutrition")}
            >
              <Utensils size={16} className="ml-2" />
              تغذیه و رژیم
            </Button>
            <Button 
              variant={activeCategory === "supplements" ? "default" : "outline"} 
              className={activeCategory === "supplements" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
              onClick={() => setActiveCategory("supplements")}
            >
              <Pill size={16} className="ml-2" />
              مکمل‌ها
            </Button>
            <Button 
              variant={activeCategory === "motivation" ? "default" : "outline"} 
              className={activeCategory === "motivation" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
              onClick={() => setActiveCategory("motivation")}
            >
              <Brain size={16} className="ml-2" />
              انگیزش و روانشناسی
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && activeCategory === "all" && (
        <div className="container mx-auto px-4 mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "400ms" }}>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="w-2 h-8 bg-yellow-500 rounded-full ml-3"></span>
              مقاله ویژه
            </h2>
            <Link to={`/blog/${featuredPost.id}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 hover:border-yellow-500 transition-all duration-300 p-0 md:p-0">
                <div className="h-64 md:h-auto overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        {featuredPost.icon} {featuredPost.category}
                      </Badge>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 hover:text-yellow-400 transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">
                      {featuredPost.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 ml-1" />
                      <span>{featuredPost.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 ml-1" />
                      <span>زمان مطالعه: {featuredPost.readTime}</span>
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
      )}

      {/* All Posts */}
      <main className="container mx-auto px-4 pb-24">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "500ms" }}>
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <span className="w-2 h-8 bg-yellow-500 rounded-full ml-3"></span>
            {activeCategory === "all" ? "همه مقالات" : 
             activeCategory === "workout" ? "مقالات تمرین و برنامه‌ریزی" :
             activeCategory === "nutrition" ? "مقالات تغذیه و رژیم" :
             activeCategory === "supplements" ? "مقالات مکمل‌ها" : "مقالات انگیزش و روانشناسی"}
          </h2>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-300 h-full overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">مقاله‌ای در این دسته‌بندی یافت نشد.</p>
            </div>
          )}
        </div>
        
        {/* Newsletter Subscription */}
        <div className={`mt-24 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 border border-zinc-700 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "600ms" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              عضویت در خبرنامه لیفت لجندز
            </h3>
            <p className="text-gray-300 mb-8">
              با عضویت در خبرنامه ما، از آخرین مقالات، نکات تمرینی و توصیه‌های تغذیه‌ای مطلع شوید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="ایمیل خود را وارد کنید" 
                className="flex-grow bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                عضویت
              </Button>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Blog;