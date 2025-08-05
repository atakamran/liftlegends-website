import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Calendar, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Coach {
  id: string;
  full_name: string;
  bio: string | null;
  profile_image: string | null;
  expertise: string;
  experience_years: number | null;
  created_at: string;
  updated_at: string;
}

const CoachDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const { data, error } = await supabase
          .from("coaches")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setCoach(data);
      } catch (error) {
        console.error("Error fetching coach:", error);
        toast({
          variant: "destructive",
          title: "خطا",
          description: "مشکلی در بارگذاری اطلاعات مربی رخ داد.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoach();
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

  if (!coach) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">مربی یافت نشد</h1>
          <Button onClick={() => navigate("/coaches")}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست مربی‌ها
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate("/coaches")}
        className="mb-6"
      >
        <ArrowLeft className="ml-2 h-4 w-4" />
        بازگشت به لیست مربی‌ها
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {coach.profile_image ? (
                    <img 
                      src={coach.profile_image} 
                      alt={coach.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-muted-foreground">
                      {coach.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-2">{coach.full_name}</h1>
                <Badge variant="secondary" className="mb-4">
                  {coach.expertise}
                </Badge>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{coach.experience_years} سال تجربه</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>درباره مربی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">بیوگرافی</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {coach.bio || "بیوگرافی برای این مربی ثبت نشده است."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">تخصص</h3>
                  <Badge variant="outline">{coach.expertise}</Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">سابقه کاری</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{coach.experience_years} سال تجربه در زمینه {coach.expertise}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">تماس با مربی</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button>
                      <Mail className="ml-2 h-4 w-4" />
                      ارسال پیام
                    </Button>
                    <Button variant="outline">
                      <Phone className="ml-2 h-4 w-4" />
                      درخواست مشاوره
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachDetail;