import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Define Program interface
interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'training' | 'diet' | 'supplement';
  image_url: string | null;
  program_url: string | null;
  created_at: string;
}

const ProgramsSection = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'training' | 'diet' | 'supplement'>('training');
  const [isVisible, setIsVisible] = useState(false);

  // Sample programs data as fallback
  const samplePrograms: Program[] = [
    {
      id: 'sample-1',
      title: 'برنامه تمرینی FST-7',
      description: 'برنامه تمرینی پیشرفته برای افزایش حجم عضلانی با تکنیک FST-7',
      price: 299000,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/fst7-program.jpg',
      program_url: 'fst7-program',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      title: 'رژیم غذایی کاهش وزن',
      description: 'برنامه غذایی کامل برای کاهش وزن سالم و پایدار',
      price: 199000,
      category: 'diet',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/diet-plan.jpg',
      program_url: 'weight-loss-diet',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      title: 'برنامه تمرینی مبتدی',
      description: 'برنامه تمرینی کامل برای شروع بدنسازی و تناسب اندام',
      price: 149000,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/beginner-workout.jpg',
      program_url: 'beginner-workout',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-4',
      title: 'مکمل کراتین مونوهیدرات',
      description: 'کراتین با کیفیت بالا برای افزایش قدرت و حجم عضلانی',
      price: 89000,
      category: 'supplement',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/creatine.jpg',
      program_url: 'creatine-supplement',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-5',
      title: 'رژیم غذایی افزایش حجم',
      description: 'برنامه غذایی تخصصی برای افزایش وزن و حجم عضلانی',
      price: 249000,
      category: 'diet',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/bulk-diet.jpg',
      program_url: 'bulking-diet',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-6',
      title: 'برنامه تمرینی پیش‌رفته',
      description: 'برنامه تمرینی حرفه‌ای برای ورزشکاران با تجربه',
      price: 399000,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/advanced-workout.jpg',
      program_url: 'advanced-workout',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-7',
      title: 'برنامه تمرینی رایگان مبتدی',
      description: 'برنامه تمرینی کاملاً رایگان برای شروع بدنسازی',
      price: 0,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/free-workout.jpg',
      program_url: 'free-beginner-workout',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-8',
      title: 'راهنمای تغذیه رایگان',
      description: 'راهنمای کامل و رایگان تغذیه سالم برای بدنسازان',
      price: 0,
      category: 'diet',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/free-nutrition.jpg',
      program_url: 'free-nutrition-guide',
      created_at: new Date().toISOString(),
    }
  ];

  // Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("programs_sale")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(12); // Increased limit to get more programs

        if (error) {
          console.error("Database error:", error);
          // Use sample data as fallback
          setPrograms(samplePrograms);
          return;
        }

        // Map programs_sale data to Program interface
        const programsData = data ? data.map(program => ({
          id: program.id,
          title: program.title,
          description: program.description,
          price: program.price,
          category: program.category,
          image_url: program.image_url,
          program_url: program.program_url || null,
          created_at: program.created_at || new Date().toISOString(),
        })) : [];
        
        // If no data from database, use sample data
        if (programsData.length === 0) {
          setPrograms(samplePrograms);
        } else {
          // Combine database data with sample data to ensure we have enough content
          const combinedPrograms = [...programsData];
          
          // Add sample programs for categories that might be missing
          const categories = ['training', 'diet', 'supplement'];
          categories.forEach(category => {
            const categoryCount = combinedPrograms.filter(p => p.category === category).length;
            if (categoryCount < 2) {
              const sampleForCategory = samplePrograms.filter(p => p.category === category);
              combinedPrograms.push(...sampleForCategory.slice(0, 2 - categoryCount));
            }
          });
          
          setPrograms(combinedPrograms);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        // Use sample data as fallback
        setPrograms(samplePrograms);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const sectionElement = document.getElementById('programs-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  // Filter programs by category
  const filteredPrograms = programs.filter(program => program.category === activeCategory);

  // Format price with Persian numerals and Toman
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'diet':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'supplement':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Get category name
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'training':
        return 'برنامه تمرینی';
      case 'diet':
        return 'برنامه غذایی';
      case 'supplement':
        return 'مکمل';
      default:
        return 'محصول';
    }
  };

  return (
    <section id="programs-section" className="py-24 px-4 bg-gradient-to-b from-black to-gray-900 relative">
      {/* Background effects */}
      <div className="absolute -z-10 top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-gold-400 to-amber-300 rounded-full blur-[130px] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 text-sm px-5 py-2 rounded-full border border-gold-500/20 mb-5 hover:border-gold-500/40 transition-colors">
            برنامه‌های اختصاصی
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
            برنامه‌های LiftLegends
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
            برنامه‌های تخصصی ما برای کمک به شما در رسیدن به اهداف تناسب اندام و سلامتی طراحی شده‌اند.
          </p>
        </div>

        {/* Category tabs */}
        <div className={`flex justify-center mb-12 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "100ms" }}>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => setActiveCategory('training')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'training' 
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-lg' 
                : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 hover:text-white border border-transparent'}`}
            >
              برنامه‌های تمرینی
            </button>
            <button
              onClick={() => setActiveCategory('diet')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'diet' 
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-lg' 
                : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 hover:text-white border border-transparent'}`}
            >
              برنامه‌های غذایی
            </button>
            <button
              onClick={() => setActiveCategory('supplement')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'supplement' 
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-lg' 
                : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 hover:text-white border border-transparent'}`}
            >
              مکمل‌ها
            </button>
          </div>
        </div>

        {/* Programs grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-gold-500/20 border-t-gold-500 animate-spin"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.slice(0, 6).map((program, index) => (
                <Card 
                  key={program.id}
                  className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 transition-all duration-300 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/10 group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative w-full h-56 overflow-hidden">
                    {program.image_url ? (
                      <img 
                        src={program.image_url} 
                        alt={program.title} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gray-700 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-gray-500 text-sm">بدون تصویر</span>
                        </div>
                      </div>
                    )}
                    
                    <Badge className={`absolute top-3 right-3 ${getCategoryColor(program.category)} backdrop-blur-sm`}>
                      {getCategoryName(program.category)}
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-gold-500 line-clamp-1 group-hover:text-gold-400 transition-colors">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <p className="text-white/70 line-clamp-2 text-sm mb-3 h-10 group-hover:text-white/90 transition-colors">{program.description}</p>
                    <p className="text-lg font-bold text-white">
                      {program.price === 0 ? (
                        <span className="text-green-500">رایگان</span>
                      ) : (
                        formatPrice(program.price)
                      )}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Link 
                      to={program.program_url ? `/programs/${program.program_url}` : `/product/${program.id}`}
                      className="w-full"
                    >
                      <Button 
                        variant="default" 
                        className="w-full bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black group"
                      >
                        <span>مشاهده محصول</span>
                        <ChevronRight size={16} className="mr-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
              </div>
            )}
          </div>
        )}

        {/* View all button */}
        <div className={`flex justify-center mt-12 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
          <Link to={`/programs?category=${activeCategory}`}>
            <Button 
              variant="outline" 
              className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 hover:text-gold-400 hover:border-gold-500/50 px-8 py-6 text-lg group"
            >
              <span>مشاهده همه برنامه‌ها</span>
              <ChevronRight size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;