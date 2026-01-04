import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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

  const samplePrograms: Program[] = [
    {
      id: 'sample-1',
      title: 'FST-7 Hypertrophy System',
      description: 'Advanced muscle-building program using the legendary FST-7 technique for maximum hypertrophy',
      price: 49,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/fst7-program.jpg',
      program_url: 'fst7-program',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      title: 'SHRED-X Fat Loss Protocol',
      description: 'High-intensity fat loss nutrition plan for sustainable, healthy weight loss',
      price: 39,
      category: 'diet',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/diet-plan.jpg',
      program_url: 'weight-loss-diet',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      title: 'Beginner Foundations',
      description: 'Complete starter program for those new to strength training and fitness',
      price: 29,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/beginner-workout.jpg',
      program_url: 'beginner-workout',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-4',
      title: 'Creatine Monohydrate Guide',
      description: 'Science-backed creatine protocol for strength and muscle gains',
      price: 19,
      category: 'supplement',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/creatine.jpg',
      program_url: 'creatine-supplement',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-5',
      title: 'Mass Gain Meal Plan',
      description: 'Strategic nutrition plan designed for clean muscle gains and weight increase',
      price: 44,
      category: 'diet',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/bulk-diet.jpg',
      program_url: 'bulking-diet',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-6',
      title: 'Elite Performance Training',
      description: 'Advanced training protocol for experienced athletes seeking peak performance',
      price: 69,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/advanced-workout.jpg',
      program_url: 'advanced-workout',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-7',
      title: 'Starter Training Program',
      description: 'Free beginner-friendly workout program to kickstart your fitness journey',
      price: 0,
      category: 'training',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/free-workout.jpg',
      program_url: 'free-beginner-workout',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sample-8',
      title: 'Nutrition Essentials Guide',
      description: 'Free comprehensive guide to healthy eating for athletes and fitness enthusiasts',
      price: 0,
      category: 'diet',
      image_url: 'https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/free-nutrition.jpg',
      program_url: 'free-nutrition-guide',
      created_at: new Date().toISOString(),
    }
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("programs_sale")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(12);

        if (error) {
          console.error("Database error:", error);
          setPrograms(samplePrograms);
          return;
        }

        const programsData = data ? data.map(program => ({
          id: program.id,
          title: program.title,
          description: program.description,
          price: program.price,
          category: program.category as 'training' | 'diet' | 'supplement',
          image_url: program.image_url,
          program_url: program.program_url || null,
          created_at: program.created_at || new Date().toISOString(),
        })) : [];
        
        if (programsData.length === 0) {
          setPrograms(samplePrograms);
        } else {
          const combinedPrograms = [...programsData];
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
        setPrograms(samplePrograms);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

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

  const filteredPrograms = programs.filter(program => program.category === activeCategory);

  const formatPrice = (price: number) => {
    return '$' + price.toFixed(0);
  };

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

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'training':
        return 'Training';
      case 'diet':
        return 'Nutrition';
      case 'supplement':
        return 'Supplement';
      default:
        return 'Product';
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
            Premium Programs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
            LiftLegends Programs
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
            Expert-designed programs to help you achieve your fitness and health goals faster.
          </p>
        </div>

        {/* Category tabs */}
        <div className={`flex justify-center mb-12 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "100ms" }}>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveCategory('training')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'training' 
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-lg' 
                : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 hover:text-white border border-transparent'}`}
            >
              Training Programs
            </button>
            <button
              onClick={() => setActiveCategory('diet')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'diet' 
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-lg' 
                : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 hover:text-white border border-transparent'}`}
            >
              Nutrition Plans
            </button>
            <button
              onClick={() => setActiveCategory('supplement')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'supplement' 
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-lg' 
                : 'bg-gray-800/50 text-white/70 hover:bg-gray-800 hover:text-white border border-transparent'}`}
            >
              Supplements
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
                        alt={`${program.title} - Lift Legends`}
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
                          <span className="text-gray-500 text-sm">No Image</span>
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
                        <span className="text-green-500">Free</span>
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
                        <span>View Program</span>
                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No programs available in this category yet.</p>
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
              <span>View All Programs</span>
              <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;