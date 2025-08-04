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
  Clock,
  Users,
  Search,
  Filter,
  Dumbbell,
  Car,
  Wifi,
  Coffee,
} from "lucide-react";

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
  cover_image: string;
  facilities: string[];
  working_hours: Record<string, string>;
  rating: number;
  total_reviews: number;
  price_range: string;
}

const Gyms = () => {
  const [gyms] = useState<Gym[]>([
    {
      id: '1',
      name: 'باشگاه آتلانتیک',
      description: 'باشگاه مدرن با امکانات کامل و تجهیزات پیشرفته برای بدنسازی و تناسب اندام',
      location: 'تهران - ولیعصر',
      address: 'خیابان ولیعصر، نرسیده به پارک وی، پلاک ۱۲۳',
      phone: '02122334455',
      email: 'info@atlantic-gym.ir',
      website: 'https://atlantic-gym.ir',
      instagram: '@atlantic_gym',
      cover_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      facilities: ['وزنه', 'کاردیو', 'استخر', 'سونا', 'پارکینگ', 'وای‌فای'],
      working_hours: { 'شنبه تا پنجشنبه': '6:00 - 23:00', 'جمعه': '8:00 - 22:00' },
      rating: 4.7,
      total_reviews: 234,
      price_range: '200,000 - 500,000 تومان/ماه'
    },
    {
      id: '2',
      name: 'باشگاه پاور جیم',
      description: 'تخصصی در پرورش اندام و تمرینات قدرتی با بهترین دستگاه‌های بدنسازی',
      location: 'تهران - نیاوران',
      address: 'خیابان نیاوران، کوچه بهار، پلاک ۴۵',
      phone: '02133445566',
      email: 'info@powergym.ir',
      website: 'https://powergym.ir',
      instagram: '@power_gym',
      cover_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      facilities: ['وزنه', 'کراس فیت', 'بوکس', 'مربی شخصی', 'پارکینگ'],
      working_hours: { 'همه روزه': '5:30 - 24:00' },
      rating: 4.8,
      total_reviews: 189,
      price_range: '300,000 - 600,000 تومان/ماه'
    },
    {
      id: '3',
      name: 'باشگاه فیتنس پلاس',
      description: 'باشگاه خانوادگی با فضای دوستانه و امکانات متنوع برای تمام سنین',
      location: 'تهران - سعادت آباد',
      address: 'سعادت آباد، خیابان اصلی، برج آسمان',
      phone: '02144556677',
      email: 'info@fitnessplus.ir',
      website: 'https://fitnessplus.ir',
      instagram: '@fitness_plus',
      cover_image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      facilities: ['وزنه', 'کاردیو', 'یوگا', 'پیلاتس', 'کافه', 'وای‌فای'],
      working_hours: { 'شنبه تا چهارشنبه': '6:00 - 23:00', 'پنجشنبه و جمعه': '8:00 - 22:00' },
      rating: 4.5,
      total_reviews: 156,
      price_range: '150,000 - 400,000 تومان/ماه'
    },
    {
      id: '4',
      name: 'باشگاه المپیا',
      description: 'باشگاه حرفه‌ای با استانداردهای بین‌المللی و مربی‌های مجرب',
      location: 'تهران - زعفرانیه',
      address: 'زعفرانیه، خیابان ولیعصر، مجتمع تجاری پارس',
      phone: '02188776655',
      email: 'info@olympia-gym.ir',
      website: 'https://olympia-gym.ir',
      instagram: '@olympia_gym',
      cover_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      facilities: ['وزنه', 'کاردیو', 'استخر', 'سونا', 'جکوزی', 'پارکینگ'],
      working_hours: { 'همه روزه': '6:00 - 23:30' },
      rating: 4.9,
      total_reviews: 312,
      price_range: '400,000 - 800,000 تومان/ماه'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("همه");
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>(gyms);

  // Get all unique facilities
  const allFacilities = Array.from(
    new Set(gyms.flatMap(gym => gym.facilities))
  );

  useEffect(() => {
    let filtered = gyms;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(gym =>
        gym.name.includes(searchQuery) ||
        gym.description.includes(searchQuery) ||
        gym.location.includes(searchQuery) ||
        gym.facilities.some(facility => facility.includes(searchQuery))
      );
    }

    // Filter by facility
    if (selectedFacility !== "همه") {
      filtered = filtered.filter(gym =>
        gym.facilities.includes(selectedFacility)
      );
    }

    setFilteredGyms(filtered);
  }, [searchQuery, selectedFacility, gyms]);

  const getFacilityIcon = (facility: string) => {
    const facilityIcons: Record<string, JSX.Element> = {
      'وزنه': <Dumbbell className="w-4 h-4" />,
      'کاردیو': <Users className="w-4 h-4" />,
      'استخر': <Users className="w-4 h-4" />,
      'سونا': <Users className="w-4 h-4" />,
      'پارکینگ': <Car className="w-4 h-4" />,
      'وای‌فای': <Wifi className="w-4 h-4" />,
      'کافه': <Coffee className="w-4 h-4" />,
      'یوگا': <Users className="w-4 h-4" />,
      'پیلاتس': <Users className="w-4 h-4" />,
      'کراس فیت': <Dumbbell className="w-4 h-4" />,
      'بوکس': <Dumbbell className="w-4 h-4" />,
      'مربی شخصی': <Users className="w-4 h-4" />,
      'جکوزی': <Users className="w-4 h-4" />,
    };
    return facilityIcons[facility] || <Dumbbell className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-green-500">
            بهترین باشگاه‌های شهر
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            باشگاه‌های مجهز و مدرن با امکانات کامل برای رسیدن به اهداف تناسب اندام شما
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="جستجو در نام، توضیحات یا امکانات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-gray-900/50 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="pr-10 pl-4 py-2 bg-gray-900/50 border border-white/20 text-white rounded-md min-w-[200px] appearance-none"
            >
              <option value="همه">همه امکانات</option>
              {allFacilities.map((facility) => (
                <option key={facility} value={facility}>
                  {facility}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-white/60">
            {filteredGyms.length} باشگاه یافت شد
          </p>
        </div>

        {/* Gyms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGyms.map((gym) => (
            <Card
              key={gym.id}
              className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 group"
            >
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={gym.cover_image}
                  alt={gym.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
                    باشگاه
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center space-x-1 space-x-reverse bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs font-medium">{gym.rating}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="p-4">
                <CardTitle className="text-lg text-green-400 group-hover:text-green-300 transition-colors">
                  {gym.name}
                </CardTitle>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 ml-1" />
                  {gym.location}
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {gym.description}
                </p>

                {/* Facilities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {gym.facilities.slice(0, 3).map((facility, index) => (
                      <div key={index} className="flex items-center bg-gray-800/50 rounded-full px-2 py-1">
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

                {/* Working Hours */}
                <div className="flex items-center text-gray-400 text-xs mb-4">
                  <Clock className="w-3 h-3 ml-1" />
                  <span>{Object.values(gym.working_hours)[0]}</span>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <p className="text-sm text-green-400 font-medium">{gym.price_range}</p>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-2 mb-4">
                  <a
                    href={`tel:${gym.phone}`}
                    className="p-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://instagram.com/${gym.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-500/20 text-pink-400 rounded-full hover:bg-pink-500/30 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={gym.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                  </a>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black"
                >
                  مشاهده جزئیات
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredGyms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Dumbbell className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              باشگاهی یافت نشد
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

export default Gyms;