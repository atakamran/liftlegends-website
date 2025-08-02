import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Zap, Award, ShoppingCart, Users, Calendar, TrendingUp } from "lucide-react";
import FooterSection from "@/components/FooterSection";
import { useNavigate } from "react-router-dom";

interface LegendBundle {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_percentage: number | null;
  image_url: string | null;
  is_active: boolean;
  is_legend: boolean;
  created_at: string | null;
  updated_at: string | null;
  bundle_items?: {
    program_id: string;
    programs_sale: {
      title: string;
      category: 'training' | 'diet' | 'supplement';
    };
  }[];
}

const Legends = () => {
  const navigate = useNavigate();
  const [legendBundles, setLegendBundles] = useState<LegendBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    fetchLegendBundles();
    
    return () => clearTimeout(timer);
  }, []);

  const fetchLegendBundles = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("product_bundles")
        .select(`
          *,
          bundle_items (
            program_id,
            programs_sale (
              title,
              category
            )
          )
        `)
        .eq("is_legend", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
        setLegendBundles(data.map(bundle => ({
          ...bundle,
          bundle_items: bundle.bundle_items.map(item => ({
            ...item,
            programs_sale: {
              ...item.programs_sale,
              category: item.programs_sale.category as 'training' | 'diet' | 'supplement'
            }
          }))
        })) || []);
    } catch (error) {
      console.error("Error fetching legend bundles:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری پک‌های افسانه‌ای",
        description: "مشکلی در دریافت اطلاعات رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (bundleId: string) => {
    // Navigate to payment page with bundle ID
    navigate(`/payment?bundle=${bundleId}`);
  };

  const calculateDiscountedPrice = (price: number, discountPercentage: number | null) => {
    if (!discountPercentage) return price;
    return price - (price * discountPercentage / 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'training':
        return <Zap className="w-4 h-4" />;
      case 'diet':
        return <Users className="w-4 h-4" />;
      case 'supplement':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'training':
        return 'برنامه تمرینی';
      case 'diet':
        return 'برنامه غذایی';
      case 'supplement':
        return 'راهنمای مکمل';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>افسانه‌های بدنسازی | لیفت لجندز - برنامه‌های آرنولد، cbum و قهرمانان</title>
        <meta name="description" content="برنامه‌های تمرینی و غذایی افسانه‌های بدنسازی مثل آرنولد شوارتزنگر، کریس بامستد و سایر قهرمانان. پک‌های کامل شامل تمرین، تغذیه و مکمل‌یاری." />
        <meta name="keywords" content="برنامه آرنولد، برنامه cbum، افسانه‌های بدنسازی، برنامه قهرمانان، تمرین حرفه‌ای، بدنسازی افسانه‌ای" />
        <link rel="canonical" href="https://liftlegends.ir/legends" />
        <meta property="og:title" content="افسانه‌های بدنسازی | لیفت لجندز" />
        <meta property="og:description" content="برنامه‌های تمرینی و غذایی افسانه‌های بدنسازی مثل آرنولد شوارتزنگر، کریس بامستد و سایر قهرمانان." />
        <meta property="og:url" content="https://liftlegends.ir/legends" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://liftlegends.ir/images/legends-hero.jpg" />
      </Helmet>

      {/* Hero Section */}
      <motion.section 
        className="relative py-20 sm:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-gold-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown className="w-8 h-8 text-gold-500" />
              <Badge variant="outline" className="border-gold-500 text-gold-500 px-4 py-2 text-lg">
                افسانه‌های بدنسازی
              </Badge>
              <Crown className="w-8 h-8 text-gold-500" />
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              برنامه‌های افسانه‌ای
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/80 mb-8 leading-relaxed">
              برنامه‌های تمرینی و غذایی <span className="text-gold-500 font-semibold">آرنولد شوارتزنگر</span>، 
              <span className="text-gold-500 font-semibold"> کریس بامستد</span> و سایر قهرمانان بدنسازی
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-500" />
                <span>برنامه‌های اصیل قهرمانان</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold-500" />
                <span>پک‌های کامل ۳ در ۱</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold-500" />
                <span>دسترسی مادام‌العمر</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Legend Bundles Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          {legendBundles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {legendBundles.map((bundle, index) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-gold-500/50 transition-all duration-300 group overflow-hidden">
                    {/* Bundle Image */}
                    {bundle.image_url && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={bundle.image_url} 
                          alt={bundle.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gold-500 text-black font-semibold">
                            <Crown className="w-3 h-3 mr-1" />
                            افسانه‌ای
                          </Badge>
                        </div>
                        {bundle.discount_percentage && (
                          <div className="absolute top-4 left-4">
                            <Badge variant="destructive" className="font-semibold">
                              {bundle.discount_percentage}% تخفیف
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors">
                        {bundle.title}
                      </CardTitle>
                      <CardDescription className="text-white/70 leading-relaxed">
                        {bundle.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Bundle Items */}
                      {bundle.bundle_items && bundle.bundle_items.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gold-500 mb-2">شامل:</h4>
                          {bundle.bundle_items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2 text-sm text-white/80">
                              {getCategoryIcon(item.programs_sale.category)}
                              <span>{getCategoryName(item.programs_sale.category)}: {item.programs_sale.title}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div className="space-y-1">
                          {bundle.discount_percentage ? (
                            <>
                              <div className="text-sm text-white/50 line-through">
                                {formatPrice(bundle.price)} تومان
                              </div>
                              <div className="text-xl font-bold text-gold-500">
                                {formatPrice(calculateDiscountedPrice(bundle.price, bundle.discount_percentage))} تومان
                              </div>
                            </>
                          ) : (
                            <div className="text-xl font-bold text-gold-500">
                              {formatPrice(bundle.price)} تومان
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => handlePurchase(bundle.id)}
                          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          خرید پک
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <Crown className="w-16 h-16 text-gold-500/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">به زودی...</h2>
              <p className="text-white/70 max-w-md mx-auto">
                پک‌های افسانه‌ای قهرمانان بدنسازی به زودی در دسترس خواهند بود. 
                منتظر بمانید تا برنامه‌های اصیل آرنولد و سایر افسانه‌ها را ارائه دهیم.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Legends;