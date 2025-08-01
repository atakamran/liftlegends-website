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
    <section id="programs-section" className="py-24 px-4 bg-gradient-to-b from-background to-secondary relative">
      {/* Background effects */}
      <div className="absolute -z-10 top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-primary to-yellow-400 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-primary to-yellow-300 rounded-full blur-[130px] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block bg-gradient-to-r from-primary/20 to-yellow-500/10 text-primary text-sm px-5 py-2 rounded-full border border-primary/20 mb-5 hover:border-primary/40 transition-colors">
            برنامه‌های اختصاصی
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-300 to-primary">
            برنامه‌های LiftLegends
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            برنامه‌های تخصصی ما برای کمک به شما در رسیدن به اهداف تناسب اندام و سلامتی طراحی شده‌اند.
          </p>
        </div>

        {/* Category tabs */}
        <div className={`flex justify-center mb-12 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "100ms" }}>
          <div className="flex space-x-2 space-x-reverse bg-secondary/50 p-1 rounded-full">
            <Button
              onClick={() => setActiveCategory('training')}
              variant={activeCategory === 'training' ? 'default' : 'ghost'}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            >
              برنامه‌های تمرینی
            </Button>
            <Button
              onClick={() => setActiveCategory('diet')}
              variant={activeCategory === 'diet' ? 'default' : 'ghost'}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            >
              برنامه‌های غذایی
            </Button>
            <Button
              onClick={() => setActiveCategory('supplement')}
              variant={activeCategory === 'supplement' ? 'default' : 'ghost'}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            >
              مکمل‌ها
            </Button>
          </div>
        </div>

        {/* Programs grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.slice(0, 6).map((program, index) => (
                <Card 
                  key={program.id}
                  className="overflow-hidden bg-gradient-to-br from-secondary to-background border-border/10 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 group"
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
                      <div className="w-full h-full bg-gradient-to-br from-secondary to-background flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-card flex items-center justify-center">
                            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-muted-foreground text-sm">بدون تصویر</span>
                        </div>
                      </div>
                    )}
                    
                    <Badge variant="secondary" className="absolute top-3 right-3 backdrop-blur-sm">
                      {getCategoryName(program.category)}
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-primary line-clamp-1 group-hover:text-primary/90 transition-colors">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground line-clamp-2 text-sm mb-3 h-10 group-hover:text-foreground/90 transition-colors">{program.description}</p>
                    <p className="text-lg font-bold text-foreground">
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
                        className="w-full group"
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
                <p className="text-muted-foreground text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
              </div>
            )}
          </div>
        )}

        {/* View all button */}
        <div className={`flex justify-center mt-12 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
          <Link to={`/programs?category=${activeCategory}`}>
            <Button 
              variant="outline" 
              className="border-primary/30 text-primary hover:bg-accent/10 hover:text-primary/90 hover:border-primary/50 px-8 py-6 text-lg group"
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