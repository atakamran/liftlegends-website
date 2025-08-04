import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Award, Clock, User, CheckCircle, Users, Target, TrendingUp, Dumbbell } from "lucide-react";

interface Coach {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  specialties: string[];
  experience_years: number;
  certifications: string[];
  profile_image: string;
  gallery: string[];
  phone: string;
  email: string;
  instagram: string;
  telegram: string;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

const CoachesSection = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Sample coaches data as fallback
  const sampleCoaches: Coach[] = [
    {
      id: 'sample-1',
      user_id: 'sample-user-1',
      name: 'احمد محمدی',
      bio: 'مربی پرورش اندام با ۱۰ سال تجربه در زمینه بدنسازی و تناسب اندام',
      specialties: ['پرورش اندام', 'کاهش وزن', 'تناسب اندام'],
      experience_years: 10,
      certifications: ['مربی بدنسازی درجه یک', 'متخصص تغذیه ورزشی'],
      profile_image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg',
      gallery: [],
      phone: '09121234567',
      email: 'ahmad.mohammadi@example.com',
      instagram: '@ahmad_coach',
      telegram: '@ahmad_coach',
      rating: 4.8,
      total_reviews: 156,
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      user_id: 'sample-user-2',
      name: 'سارا احمدی',
      bio: 'متخصص تغذیه ورزشی و فیتنس با تمرکز بر برنامه‌های کاهش وزن',
      specialties: ['تغذیه ورزشی', 'کاردیو', 'یوگا'],
      experience_years: 7,
      certifications: ['متخصص تغذیه ورزشی', 'مربی یوگا'],
      profile_image: 'https://images.pexels.com/photos/1431283/pexels-photo-1431283.jpeg',
      gallery: [],
      phone: '09129876543',
      email: 'sara.ahmadi@example.com',
      instagram: '@sara_nutrition',
      telegram: '@sara_nutrition',
      rating: 4.9,
      total_reviews: 89,
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      user_id: 'sample-user-3',
      name: 'علی رضایی',
      bio: 'مربی کراس فیت و آمادگی جسمانی با رویکرد علمی و مدرن',
      specialties: ['کراس فیت', 'آمادگی جسمانی', 'قدرتی'],
      experience_years: 8,
      certifications: ['مربی کراس فیت', 'مربی آمادگی جسمانی'],
      profile_image: 'https://images.pexels.com/photos/1431284/pexels-photo-1431284.jpeg',
      gallery: [],
      phone: '09123456789',
      email: 'ali.rezaei@example.com',
      instagram: '@ali_crossfit',
      telegram: '@ali_crossfit',
      rating: 4.7,
      total_reviews: 124,
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  // Fetch coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        
        // Since coaches table doesn't exist yet, use sample data
        setCoaches(sampleCoaches);
      } catch (error) {
        console.error("Error fetching coaches:", error);
        setCoaches(sampleCoaches);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
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

    const sectionElement = document.getElementById('coaches-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  const getSpecialtyIcon = (specialty: string) => {
    const specialtyIcons: Record<string, JSX.Element> = {
      'پرورش اندام': <Dumbbell className="w-4 h-4" />,
      'کاهش وزن': <TrendingUp className="w-4 h-4" />,
      'تناسب اندام': <Target className="w-4 h-4" />,
      'تغذیه ورزشی': <Users className="w-4 h-4" />,
      'کاردیو': <Users className="w-4 h-4" />,
      'یوگا': <Users className="w-4 h-4" />,
      'کراس فیت': <Dumbbell className="w-4 h-4" />,
      'آمادگی جسمانی': <Target className="w-4 h-4" />,
      'قدرتی': <Dumbbell className="w-4 h-4" />,
    };
    return specialtyIcons[specialty] || <Users className="w-4 h-4" />;
  };

  return (
    <section id="coaches-section" className="py-24 px-4 bg-gradient-to-b from-black to-gray-900 relative">
      {/* Background effects */}
      <div className="absolute -z-10 top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-blue-300 rounded-full blur-[130px] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-purple-400 text-sm px-5 py-2 rounded-full border border-purple-500/20 mb-5 hover:border-purple-500/40 transition-colors">
            مربی‌های حرفه‌ای
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-300 to-purple-500">
            بهترین مربی‌های ورزشی
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
            مربی‌های مجرب و حرفه‌ای برای راهنمایی شما در مسیر تناسب اندام و سلامتی
          </p>
        </div>

        {/* Coaches grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
            {coaches.slice(0, 6).map((coach, index) => (
              <Card 
                key={coach.id}
                className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader className="p-6 text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 mx-auto">
                      {coach.profile_image ? (
                        <img 
                          src={coach.profile_image} 
                          alt={`تصویر مربی ${coach.name}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                    </div>
                    {coach.is_verified && (
                      <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-purple-500 bg-gray-900 rounded-full" />
                    )}
                  </div>

                  <CardTitle className="text-lg text-purple-500 line-clamp-1 group-hover:text-purple-400 transition-colors flex items-center justify-center gap-2">
                    {coach.name}
                    {coach.is_verified && (
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                    )}
                  </CardTitle>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="mr-1 font-medium">{coach.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-400">({coach.total_reviews} نظر)</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 pt-0">
                  <p className="text-white/70 line-clamp-2 text-sm mb-4 h-10 group-hover:text-white/90 transition-colors text-center">
                    {coach.bio}
                  </p>
                  
                  {/* Experience */}
                  <div className="flex items-center justify-center gap-4 text-sm mb-4">
                    <div className="flex items-center text-gray-400">
                      <Award className="h-4 w-4 ml-1" />
                      {coach.experience_years} سال تجربه
                    </div>
                  </div>

                  {/* Specialties */}
                  {coach.specialties && coach.specialties.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {coach.specialties.slice(0, 2).map((specialty, specialtyIndex) => (
                          <div key={specialtyIndex} className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
                            {getSpecialtyIcon(specialty)}
                            <span className="text-xs text-gray-300 mr-1">{specialty}</span>
                          </div>
                        ))}
                        {coach.specialties.length > 2 && (
                          <div className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
                            <span className="text-xs text-gray-300">+{coach.specialties.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Link to={`/coaches/${coach.id}`} className="w-full">
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white group"
                    >
                      <span>مشاهده مربی</span>
                      <ChevronRight size={16} className="mr-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* View all button */}
        <div className={`flex justify-center mt-12 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
          <Link to="/coaches">
            <Button 
              variant="outline" 
              className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/50 px-8 py-6 text-lg group"
            >
              <span>مشاهده همه مربی‌ها</span>
              <ChevronRight size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoachesSection;