import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, MapPin, Star, Clock, Dumbbell, Users, Wifi, Car } from "lucide-react";

interface Gym {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  telegram: string;
  cover_image: string;
  gallery: string[];
  facilities: string[];
  working_hours: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const GymsSection = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Sample gyms data as fallback
  const sampleGyms: Gym[] = [
    {
      id: 'sample-1',
      name: 'باشگاه آتلانتیک',
      description: 'باشگاه مدرن با امکانات کامل و تجهیزات پیشرفته',
      location: 'تهران - ولیعصر',
      address: 'خیابان ولیعصر، نرسیده به پارک وی',
      phone: '02122334455',
      email: 'info@atlantic-gym.ir',
      website: 'https://atlantic-gym.ir',
      instagram: '@atlantic_gym',
      telegram: '@atlantic_gym',
      cover_image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
      gallery: [],
      facilities: ['وزنه', 'کاردیو', 'استخر', 'سونا', 'پارکینگ'],
      working_hours: { 'شنبه تا پنجشنبه': '6:00 - 23:00', 'جمعه': '8:00 - 22:00' },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      name: 'باشگاه پاور جیم',
      description: 'تخصصی در پرورش اندام و تمرینات قدرتی',
      location: 'تهران - نیاوران',
      address: 'خیابان نیاوران، کوچه بهار',
      phone: '02133445566',
      email: 'info@powergym.ir',
      website: 'https://powergym.ir',
      instagram: '@power_gym',
      telegram: '@power_gym',
      cover_image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
      gallery: [],
      facilities: ['وزنه', 'کراس فیت', 'بوکس', 'مربی شخصی'],
      working_hours: { 'همه روزه': '5:30 - 24:00' },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      name: 'باشگاه فیتنس پلاس',
      description: 'باشگاه خانوادگی با فضای دوستانه و امکانات متنوع',
      location: 'تهران - سعادت آباد',
      address: 'سعادت آباد، خیابان اصلی',
      phone: '02144556677',
      email: 'info@fitnessplus.ir',
      website: 'https://fitnessplus.ir',
      instagram: '@fitness_plus',
      telegram: '@fitness_plus',
      cover_image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg',
      gallery: [],
      facilities: ['وزنه', 'کاردیو', 'یوگا', 'پیلاتس', 'کافه'],
      working_hours: { 'شنبه تا چهارشنبه': '6:00 - 23:00', 'پنجشنبه و جمعه': '8:00 - 22:00' },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  // Fetch gyms
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("gyms")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) {
          console.error("Database error:", error);
          setGyms(sampleGyms);
          return;
        }

        if (data && data.length > 0) {
          setGyms(data);
        } else {
          setGyms(sampleGyms);
        }
      } catch (error) {
        console.error("Error fetching gyms:", error);
        setGyms(sampleGyms);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
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

    const sectionElement = document.getElementById('gyms-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  const getFacilityIcon = (facility: string) => {
    const facilityIcons: Record<string, JSX.Element> = {
      'وزنه': <Dumbbell className="w-4 h-4" />,
      'کاردیو': <Users className="w-4 h-4" />,
      'استخر': <Users className="w-4 h-4" />,
      'سونا': <Users className="w-4 h-4" />,
      'پارکینگ': <Car className="w-4 h-4" />,
      'وای‌فای': <Wifi className="w-4 h-4" />,
      'کافه': <Users className="w-4 h-4" />,
      'یوگا': <Users className="w-4 h-4" />,
      'پیلاتس': <Users className="w-4 h-4" />,
      'کراس فیت': <Dumbbell className="w-4 h-4" />,
      'بوکس': <Dumbbell className="w-4 h-4" />,
      'مربی شخصی': <Users className="w-4 h-4" />,
    };
    return facilityIcons[facility] || <Dumbbell className="w-4 h-4" />;
  };

  return (
    <section id="gyms-section" className="py-24 px-4 bg-gradient-to-b from-gray-900 to-black relative">
      {/* Background effects */}
      <div className="absolute -z-10 top-1/3 left-0 w-96 h-96 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full blur-[130px] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 text-sm px-5 py-2 rounded-full border border-green-500/20 mb-5 hover:border-green-500/40 transition-colors">
            باشگاه‌های برتر
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-green-500">
            بهترین باشگاه‌های شهر
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
            باشگاه‌های مجهز و مدرن با امکانات کامل برای رسیدن به اهداف تناسب اندام شما
          </p>
        </div>

        {/* Gyms grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
            {gyms.slice(0, 6).map((gym, index) => (
              <Card 
                key={gym.id}
                className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full h-56 overflow-hidden">
                  {gym.cover_image ? (
                    <img 
                      src={gym.cover_image} 
                      alt={`تصویر باشگاه ${gym.name}`}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gray-700 flex items-center justify-center">
                          <Dumbbell className="w-6 h-6 text-gray-500" />
                        </div>
                        <span className="text-gray-500 text-sm">تصویر باشگاه</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
                      باشگاه
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center space-x-1 space-x-reverse bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs font-medium">4.8</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="p-4">
                  <CardTitle className="text-lg text-green-500 line-clamp-1 group-hover:text-green-400 transition-colors">
                    {gym.name}
                  </CardTitle>
                  {gym.location && (
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 ml-1" />
                      {gym.location}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <p className="text-white/70 line-clamp-2 text-sm mb-3 h-10 group-hover:text-white/90 transition-colors">
                    {gym.description}
                  </p>
                  
                  {/* Facilities */}
                  {gym.facilities && gym.facilities.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {gym.facilities.slice(0, 3).map((facility, facilityIndex) => (
                          <div key={facilityIndex} className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
                            {getFacilityIcon(facility)}
                            <span className="text-xs text-gray-300 mr-1">{facility}</span>
                          </div>
                        ))}
                        {gym.facilities.length > 3 && (
                          <div className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
                            <span className="text-xs text-gray-300">+{gym.facilities.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Working Hours */}
                  {gym.working_hours && Object.keys(gym.working_hours).length > 0 && (
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{Object.values(gym.working_hours)[0]}</span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Link to={`/gyms/${gym.id}`} className="w-full">
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black group"
                    >
                      <span>مشاهده باشگاه</span>
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
          <Link to="/gyms">
            <Button 
              variant="outline" 
              className="border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/50 px-8 py-6 text-lg group"
            >
              <span>مشاهده همه باشگاه‌ها</span>
              <ChevronRight size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GymsSection;