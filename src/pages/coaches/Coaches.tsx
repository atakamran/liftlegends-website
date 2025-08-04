import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Award,
  Users,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Dumbbell,
  Target,
  TrendingUp,
} from "lucide-react";

interface Coach {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  experience_years: number;
  certifications: string[];
  profile_image: string;
  phone: string;
  email: string;
  instagram: string;
  telegram: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  location: string;
  price_range: string;
}

const Coaches = () => {
  const [coaches] = useState<Coach[]>([
    {
      id: '1',
      name: 'احمد محمدی',
      bio: 'مربی پرورش اندام با ۱۰ سال تجربه در زمینه بدنسازی و تناسب اندام. متخصص در تمرینات قدرتی و برنامه‌های کاهش وزن',
      specialties: ['پرورش اندام', 'کاهش وزن', 'تناسب اندام'],
      experience_years: 10,
      certifications: ['مربی بدنسازی درجه یک', 'متخصص تغذیه ورزشی'],
      profile_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      phone: '09121234567',
      email: 'ahmad.mohammadi@example.com',
      instagram: '@ahmad_coach',
      telegram: '@ahmad_coach',
      rating: 4.8,
      total_reviews: 156,
      is_verified: true,
      location: 'تهران - ولیعصر',
      price_range: '500,000 - 1,000,000 تومان'
    },
    {
      id: '2',
      name: 'سارا احمدی',
      bio: 'متخصص تغذیه ورزشی و فیتنس با تمرکز بر برنامه‌های کاهش وزن و تناسب اندام بانوان',
      specialties: ['تغذیه ورزشی', 'کاردیو', 'یوگا'],
      experience_years: 7,
      certifications: ['متخصص تغذیه ورزشی', 'مربی یوگا'],
      profile_image: 'https://images.unsplash.com/photo-1594736797933-d0200ba80259?w=400',
      phone: '09129876543',
      email: 'sara.ahmadi@example.com',
      instagram: '@sara_nutrition',
      telegram: '@sara_nutrition',
      rating: 4.9,
      total_reviews: 89,
      is_verified: true,
      location: 'تهران - نیاوران',
      price_range: '400,000 - 800,000 تومان'
    },
    {
      id: '3',
      name: 'علی رضایی',
      bio: 'مربی کراس فیت و آمادگی جسمانی با رویکرد علمی و مدرن. متخصص در تمرینات عملکردی',
      specialties: ['کراس فیت', 'آمادگی جسمانی', 'تمرینات قدرتی'],
      experience_years: 8,
      certifications: ['مربی کراس فیت', 'مربی آمادگی جسمانی'],
      profile_image: 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400',
      phone: '09123456789',
      email: 'ali.rezaei@example.com',
      instagram: '@ali_crossfit',
      telegram: '@ali_crossfit',
      rating: 4.7,
      total_reviews: 124,
      is_verified: true,
      location: 'تهران - سعادت آباد',
      price_range: '600,000 - 1,200,000 تومان'
    },
    {
      id: '4',
      name: 'مریم حسینی',
      bio: 'مربی فیتنس و پیلاتس با تخصص در تمرینات بازتوانی و تناسب اندام بانوان',
      specialties: ['فیتنس', 'پیلاتس', 'بازتوانی'],
      experience_years: 6,
      certifications: ['مربی فیتنس', 'مربی پیلاتس'],
      profile_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      phone: '09124567890',
      email: 'maryam.hosseini@example.com',
      instagram: '@maryam_fitness',
      telegram: '@maryam_fitness',
      rating: 4.6,
      total_reviews: 76,
      is_verified: false,
      location: 'تهران - فرشته',
      price_range: '350,000 - 700,000 تومان'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("همه");
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>(coaches);

  // Get all unique specialties
  const allSpecialties = Array.from(
    new Set(coaches.flatMap(coach => coach.specialties))
  );

  useEffect(() => {
    let filtered = coaches;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(coach =>
        coach.name.includes(searchQuery) ||
        coach.bio.includes(searchQuery) ||
        coach.specialties.some(specialty => specialty.includes(searchQuery))
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "همه") {
      filtered = filtered.filter(coach =>
        coach.specialties.includes(selectedSpecialty)
      );
    }

    setFilteredCoaches(filtered);
  }, [searchQuery, selectedSpecialty, coaches]);

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
      'تمرینات قدرتی': <Dumbbell className="w-4 h-4" />,
      'فیتنس': <Users className="w-4 h-4" />,
      'پیلاتس': <Users className="w-4 h-4" />,
      'بازتوانی': <Target className="w-4 h-4" />,
    };
    return specialtyIcons[specialty] || <Users className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-300 to-purple-500">
            مربی‌های حرفه‌ای
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            بهترین مربی‌های ورزشی برای راهنمایی شما در مسیر تناسب اندام و سلامتی
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="جستجو در نام، تخصص یا توضیحات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-gray-900/50 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="pr-10 pl-4 py-2 bg-gray-900/50 border border-white/20 text-white rounded-md min-w-[200px] appearance-none"
            >
              <option value="همه">همه تخصص‌ها</option>
              {allSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-white/60">
            {filteredCoaches.length} مربی یافت شد
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCoaches.map((coach) => (
            <Card
              key={coach.id}
              className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 group"
            >
              <CardHeader className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                      <img
                        src={coach.profile_image}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {coach.is_verified && (
                      <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-purple-500 bg-gray-900 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg text-purple-400">
                        {coach.name}
                      </CardTitle>
                      {coach.is_verified && (
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="mr-1 font-medium">{coach.rating}</span>
                      </div>
                      <span className="text-gray-400">({coach.total_reviews} نظر)</span>
                    </div>

                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 ml-1" />
                      {coach.location}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {coach.bio}
                </p>

                {/* Experience */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center text-gray-400">
                    <Award className="h-4 w-4 ml-1" />
                    {coach.experience_years} سال تجربه
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {coach.specialties.slice(0, 2).map((specialty, index) => (
                      <div key={index} className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
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

                {/* Price Range */}
                <div className="mb-4">
                  <p className="text-sm text-purple-400 font-medium">{coach.price_range}</p>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-2 mb-4">
                  {coach.phone && (
                    <a
                      href={`tel:${coach.phone}`}
                      className="p-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {coach.instagram && (
                    <a
                      href={`https://instagram.com/${coach.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-pink-500/20 text-pink-400 rounded-full hover:bg-pink-500/30 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {coach.telegram && (
                    <a
                      href={`https://t.me/${coach.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
                >
                  مشاهده جزئیات
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCoaches.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              مربی‌ای یافت نشد
            </h3>
            <p className="text-white/60">
              لطفاً فیلترها را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coaches;