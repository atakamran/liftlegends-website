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
  User,
  Star,
  Award,
  Clock,
  Search,
  Filter,
  ShoppingCart,
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

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

interface CoachProgram {
  id: string;
  coach_id: string;
  title: string;
  description: string;
  type: "workout" | "nutrition" | "supplement" | "complete";
  price: number;
  duration_weeks: number;
  includes_workout: boolean;
  includes_nutrition: boolean;
  includes_supplement: boolean;
  discount_percentage: number;
  is_active: boolean;
}

const Coaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [programs, setPrograms] = useState<Record<string, CoachProgram[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchCoaches();
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);

      // Fetch coaches
      const { data: coachesData, error: coachesError } = await supabase
        .from("coaches")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (coachesError) throw coachesError;

      setCoaches(coachesData || []);

      // Fetch programs for all coaches
      if (coachesData && coachesData.length > 0) {
        const coachIds = coachesData.map((coach) => coach.id);
        const { data: programsData, error: programsError } = await supabase
          .from("coach_programs")
          .select("*")
          .in("coach_id", coachIds)
          .eq("is_active", true)
          .order("price", { ascending: true });

        if (programsError) throw programsError;

        // Group programs by coach_id
        const groupedPrograms: Record<string, CoachProgram[]> = {};
        programsData?.forEach((program) => {
          if (!groupedPrograms[program.coach_id]) {
            groupedPrograms[program.coach_id] = [];
          }
          groupedPrograms[program.coach_id].push(program);
        });

        setPrograms(groupedPrograms);
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری مربی‌ها",
        description: "مشکلی در دریافت اطلاعات مربی‌ها رخ داد.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    programId: string,
    coachName: string,
    programTitle: string,
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
        item_type: "coach_program",
        item_id: programId,
        quantity: 1,
        price: price,
        discount_amount: 0,
      });

      if (error) throw error;

      toast({
        title: "افزوده شد",
        description: `${programTitle} مربی ${coachName} به سبد خرید اضافه شد.`,
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

  const getProgramTypeLabel = (type: string): string => {
    const labels = {
      workout: "برنامه تمرینی",
      nutrition: "برنامه غذایی",
      supplement: "برنامه مکمل",
      complete: "پک کامل",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getProgramTypeColor = (type: string): string => {
    const colors = {
      workout: "bg-blue-500/20 text-blue-400",
      nutrition: "bg-green-500/20 text-green-400",
      supplement: "bg-purple-500/20 text-purple-400",
      complete: "bg-gold-500/20 text-gold-400",
    };
    return (
      colors[type as keyof typeof colors] || "bg-gray-500/20 text-gray-400"
    );
  };

  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch =
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.specialties?.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSpecialty =
      !selectedSpecialty || coach.specialties?.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const sortedCoaches = [...filteredCoaches].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.experience_years - a.experience_years;
      case "reviews":
        return b.total_reviews - a.total_reviews;
      default:
        return 0;
    }
  });

  const allSpecialties = [
    ...new Set(coaches.flatMap((coach) => coach.specialties || [])),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بارگذاری مربی‌ها...</p>
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
            مربی‌های حرفه‌ای
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            بهترین مربی‌های ورزشی را پیدا کنید و برنامه‌های تخصصی خود را انتخاب
            کنید
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="جستجو در مربی‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
          >
            <option value="">همه تخصص‌ها</option>
            {allSpecialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
          >
            <option value="rating">بر اساس امتیاز</option>
            <option value="experience">بر اساس تجربه</option>
            <option value="reviews">بر اساس نظرات</option>
          </select>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedCoaches.map((coach) => (
            <Card
              key={coach.id}
              className="bg-gray-900 border-gray-700 overflow-hidden hover:border-gold-500/50 transition-all duration-300"
            >
              {/* Profile Section */}
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mx-auto">
                    {coach.profile_image ? (
                      <img
                        src={coach.profile_image}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  {coach.is_verified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-gold-500 bg-gray-900 rounded-full" />
                  )}
                </div>

                <CardTitle className="text-gold-500 text-xl flex items-center justify-center gap-2">
                  {coach.name}
                  {coach.is_verified && (
                    <CheckCircle className="h-5 w-5 text-gold-500" />
                  )}
                </CardTitle>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="mr-1 font-medium">
                      {coach.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    ({coach.total_reviews} نظر)
                  </span>
                </div>

                {coach.bio && (
                  <CardDescription className="text-gray-300 text-sm">
                    {coach.bio.length > 100
                      ? `${coach.bio.substring(0, 100)}...`
                      : coach.bio}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Experience */}
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Award className="h-4 w-4 ml-1" />
                    {coach.experience_years} سال تجربه
                  </div>
                </div>

                {/* Specialties */}
                {coach.specialties && coach.specialties.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gold-500 mb-2">
                      تخصص‌ها:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {coach.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {coach.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{coach.specialties.length - 3} مورد دیگر
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Programs */}
                {programs[coach.id] && programs[coach.id].length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gold-500 mb-2">
                      برنامه‌ها:
                    </h4>
                    <div className="space-y-2">
                      {programs[coach.id].slice(0, 2).map((program) => (
                        <div
                          key={program.id}
                          className="bg-gray-800 p-3 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-white text-sm">
                                {program.title}
                              </h5>
                              <Badge
                                className={`text-xs mt-1 ${getProgramTypeColor(
                                  program.type
                                )}`}
                              >
                                {getProgramTypeLabel(program.type)}
                              </Badge>
                            </div>
                            <div className="text-left">
                              {program.discount_percentage > 0 && (
                                <div className="text-xs text-gray-400 line-through">
                                  {formatPrice(program.price)}
                                </div>
                              )}
                              <span className="text-gold-500 font-bold text-sm">
                                {formatPrice(
                                  program.price *
                                    (1 - program.discount_percentage / 100)
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {program.duration_weeks} هفته
                            </Badge>
                            {program.includes_workout && (
                              <Badge variant="outline" className="text-xs">
                                تمرین
                              </Badge>
                            )}
                            {program.includes_nutrition && (
                              <Badge variant="outline" className="text-xs">
                                تغذیه
                              </Badge>
                            )}
                            {program.includes_supplement && (
                              <Badge variant="outline" className="text-xs">
                                مکمل
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() =>
                              addToCart(
                                program.id,
                                coach.name,
                                program.title,
                                program.price *
                                  (1 - program.discount_percentage / 100)
                              )
                            }
                            className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                          >
                            <ShoppingCart className="h-4 w-4 ml-1" />
                            افزودن به سبد خرید
                          </Button>
                        </div>
                      ))}
                      {programs[coach.id].length > 2 && (
                        <Link
                          to={`/coaches/${coach.id}`}
                          className="block text-center text-gold-500 hover:text-gold-400 text-sm"
                        >
                          مشاهده همه برنامه‌ها ({programs[coach.id].length})
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="flex gap-2 pt-2">
                  {coach.instagram && (
                    <a
                      href={coach.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Instagram className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {coach.telegram && (
                    <a
                      href={coach.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {coach.phone && (
                    <a
                      href={`tel:${coach.phone}`}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Phone className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedCoaches.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              مربی‌ای یافت نشد
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

export default Coaches;
