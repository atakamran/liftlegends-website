import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  MessageCircle,
  Clock,
  Dumbbell,
  Search,
  Filter,
  Star,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

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

interface GymMembership {
  id: string;
  gym_id: string;
  title: string;
  description: string;
  price: number;
  duration_months: number;
  sessions_count: number;
  includes_pool: boolean;
  includes_sauna: boolean;
  includes_personal_trainer: boolean;
  discount_percentage: number;
  is_active: boolean;
}

const Gyms = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [memberships, setMemberships] = useState<
    Record<string, GymMembership[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchGyms();
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchGyms = async () => {
    try {
      setLoading(true);

      // Fetch gyms
      const { data: gymsData, error: gymsError } = await supabase
        .from("gyms")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (gymsError) throw gymsError;

      setGyms(gymsData || []);

      // Fetch memberships for all gyms
      if (gymsData && gymsData.length > 0) {
        const gymIds = gymsData.map((gym) => gym.id);
        const { data: membershipsData, error: membershipsError } =
          await supabase
            .from("gym_memberships")
            .select("*")
            .in("gym_id", gymIds)
            .eq("is_active", true)
            .order("price", { ascending: true });

        if (membershipsError) throw membershipsError;

        // Group memberships by gym_id
        const groupedMemberships: Record<string, GymMembership[]> = {};
        membershipsData?.forEach((membership) => {
          if (!groupedMemberships[membership.gym_id]) {
            groupedMemberships[membership.gym_id] = [];
          }
          groupedMemberships[membership.gym_id].push(membership);
        });

        setMemberships(groupedMemberships);
      }
    } catch (error) {
      console.error("Error fetching gyms:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری باشگاه‌ها",
        description: "مشکلی در دریافت اطلاعات باشگاه‌ها رخ داد.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    membershipId: string,
    gymName: string,
    membershipTitle: string,
    price: number
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "ورود الزامی",
        description: "برای افزودن به سبد خرید ابتدا وارد شوید.",
      });
      return;
    }

    try {
      const { error } = await supabase.from("shopping_cart").upsert({
        user_id: user.id,
        item_type: "gym_membership",
        item_id: membershipId,
        quantity: 1,
        price: price,
        discount_amount: 0,
      });

      if (error) throw error;

      toast({
        title: "افزوده شد",
        description: `${membershipTitle} باشگاه ${gymName} به سبد خرید اضافه شد.`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "مشکلی در افزودن به سبد خرید رخ داد.",
      });
    }
  };

  const formatPrice = (price: number): string => {
    return price === 0
      ? "رایگان"
      : `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
  };

  const filteredGyms = gyms.filter((gym) => {
    const matchesSearch =
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !selectedLocation || gym.location?.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  const locations = [
    ...new Set(gyms.map((gym) => gym.location).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بارگذاری باشگاه‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold-500 to-amber-400 bg-clip-text text-transparent">
            باشگاه‌های ورزشی
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            بهترین باشگاه‌های ورزشی را پیدا کنید و عضویت خود را انتخاب کنید
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="جستجو در باشگاه‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
          >
            <option value="">همه مناطق</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Gyms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredGyms.map((gym) => (
            <Card
              key={gym.id}
              className="bg-gray-900 border-gray-700 overflow-hidden hover:border-gold-500/50 transition-all duration-300"
            >
              {/* Cover Image */}
              {gym.cover_image && (
                <div className="h-48 bg-gray-800 overflow-hidden">
                  <img
                    src={gym.cover_image}
                    alt={gym.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-gold-500 text-xl">
                  {gym.name}
                </CardTitle>
                {gym.location && (
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 ml-1" />
                    {gym.location}
                  </div>
                )}
                {gym.description && (
                  <CardDescription className="text-gray-300">
                    {gym.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  {gym.phone && (
                    <div className="flex items-center text-sm text-gray-400">
                      <Phone className="h-4 w-4 ml-2" />
                      {gym.phone}
                    </div>
                  )}
                  {gym.address && (
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 ml-2" />
                      {gym.address}
                    </div>
                  )}
                </div>

                {/* Facilities */}
                {gym.facilities && gym.facilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gold-500 mb-2">
                      امکانات:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {gym.facilities.slice(0, 3).map((facility, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {facility}
                        </Badge>
                      ))}
                      {gym.facilities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{gym.facilities.length - 3} مورد دیگر
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Memberships */}
                {memberships[gym.id] && memberships[gym.id].length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gold-500 mb-2">
                      شهریه‌ها:
                    </h4>
                    <div className="space-y-2">
                      {memberships[gym.id].slice(0, 2).map((membership) => (
                        <div
                          key={membership.id}
                          className="bg-gray-800 p-3 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-white text-sm">
                              {membership.title}
                            </h5>
                            <span className="text-gold-500 font-bold text-sm">
                              {formatPrice(membership.price)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {membership.duration_months} ماه
                            </Badge>
                            {membership.sessions_count && (
                              <Badge variant="outline" className="text-xs">
                                {membership.sessions_count} جلسه
                              </Badge>
                            )}
                            {membership.includes_pool && (
                              <Badge variant="outline" className="text-xs">
                                استخر
                              </Badge>
                            )}
                            {membership.includes_sauna && (
                              <Badge variant="outline" className="text-xs">
                                سونا
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              addToCart(
                                membership.id,
                                gym.name,
                                membership.title,
                                membership.price
                              )
                            }
                            className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                          >
                            <ShoppingCart className="h-4 w-4 ml-1" />
                            افزودن به سبد خرید
                          </Button>
                        </div>
                      ))}
                      {memberships[gym.id].length > 2 && (
                        <Link
                          to={`/gyms/${gym.id}`}
                          className="block text-center text-gold-500 hover:text-gold-400 text-sm"
                        >
                          مشاهده همه شهریه‌ها ({memberships[gym.id].length})
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-2 pt-2">
                  {gym.website && (
                    <a
                      href={gym.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Globe className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {gym.instagram && (
                    <a
                      href={gym.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {gym.telegram && (
                    <a
                      href={gym.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGyms.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              باشگاهی یافت نشد
            </h3>
            <p className="text-gray-500">
              با تغییر فیلترها یا جستجوی جدید دوباره تلاش کنید
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gyms;
