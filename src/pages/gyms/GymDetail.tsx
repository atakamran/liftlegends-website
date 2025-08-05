import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Dumbbell,
  Users,
  CreditCard
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Gym {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  image_url: string | null;
  facilities: string[] | null;
  operating_hours: any;
  membership_types: any;
  price_range: string | null;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const { data, error } = await supabase
          .from("gyms")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setGym(data);
      } catch (error) {
        console.error("Error fetching gym:", error);
        toast({
          variant: "destructive",
          title: "خطا",
          description: "مشکلی در بارگذاری اطلاعات باشگاه رخ داد.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGym();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">باشگاه یافت نشد</h1>
          <Button onClick={() => navigate("/gyms")}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست باشگاه‌ها
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate("/gyms")}
        className="mb-6"
      >
        <ArrowLeft className="ml-2 h-4 w-4" />
        بازگشت به لیست باشگاه‌ها
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="h-64 bg-muted rounded-t-lg overflow-hidden">
                {gym.image_url ? (
                  <img 
                    src={gym.image_url} 
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Dumbbell className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{gym.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{gym.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{gym.rating}</span>
                    <span className="text-muted-foreground">({gym.total_reviews} نظر)</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {gym.description || "توضیحاتی برای این باشگاه ثبت نشده است."}
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">امکانات</h3>
                    <div className="flex flex-wrap gap-2">
                      {gym.facilities?.map((facility, index) => (
                        <Badge key={index} variant="outline">
                          {facility}
                        </Badge>
                      )) || <span className="text-muted-foreground">امکاناتی ثبت نشده</span>}
                    </div>
                  </div>

                  {gym.operating_hours && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">ساعات کاری</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(gym.operating_hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between p-2 bg-muted rounded">
                            <span className="font-medium">{getDayName(day)}</span>
                            <span>{hours as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                اشتراک‌ها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-2">
                  محدوده قیمت: {gym.price_range}
                </div>
                {gym.membership_types && Object.entries(gym.membership_types).map(([type, price]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">{getMembershipTypeName(type)}</span>
                    <span className="text-primary font-semibold">
                      {formatPrice(Number(price))}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تماس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {gym.contact_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{gym.contact_phone}</span>
                </div>
              )}
              {gym.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{gym.contact_email}</span>
                </div>
              )}
              <div className="pt-4 space-y-2">
                <Button className="w-full">
                  <Phone className="ml-2 h-4 w-4" />
                  تماس با باشگاه
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="ml-2 h-4 w-4" />
                  درخواست بازدید
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const getDayName = (day: string) => {
  const dayNames: Record<string, string> = {
    monday: "دوشنبه",
    tuesday: "سه‌شنبه", 
    wednesday: "چهارشنبه",
    thursday: "پنج‌شنبه",
    friday: "جمعه",
    saturday: "شنبه",
    sunday: "یکشنبه"
  };
  return dayNames[day] || day;
};

const getMembershipTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    monthly: "ماهانه",
    "3_months": "۳ ماهه",
    "6_months": "۶ ماهه", 
    yearly: "سالانه"
  };
  return typeNames[type] || type;
};

export default GymDetail;