import React, { useState, useEffect, memo } from "react";
import { 
  Dumbbell, 
  Utensils, 
  Beaker, 
  Brain, 
  Download,
  ArrowRight,
  Target,
  Trophy,
  Shield,
  Smartphone,
  CheckCircle,
  TrendingUp,
  Award,
  Heart,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate features - optimized
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000); // Slower rotation for better performance
    
    return () => clearInterval(interval);
  }, []);

  // Main features - memoized for performance
  const features = React.useMemo(() => [
    {
      icon: <Brain className="h-12 w-12 text-gold-500" />,
      title: "هوش مصنوعی پیشرفته",
      description: "الگوریتم‌های یادگیری ماشین که برنامه‌های شما را بر اساس پیشرفت و بازخوردتان بهینه‌سازی می‌کنند",
      stats: "۹۵٪ دقت در پیش‌بینی نتایج"
    },
    {
      icon: <Dumbbell className="h-12 w-12 text-gold-500" />,
      title: "برنامه تمرینی شخصی‌سازی شده",
      description: "برنامه‌های تمرینی منحصر به فرد بر اساس سطح آمادگی، اهداف، تجهیزات موجود و محدودیت‌های زمانی شما",
      stats: "+۵۰۰ حرکت تمرینی"
    },
    {
      icon: <Utensils className="h-12 w-12 text-gold-500" />,
      title: "رژیم غذایی هوشمند",
      description: "برنامه‌های غذایی علمی با محاسبه دقیق کالری، ماکرونوترینت‌ها و میکرونوترینت‌ها متناسب با اهداف شما",
      stats: "+۱۰۰۰ غذای سالم"
    },
    {
      icon: <Beaker className="h-12 w-12 text-gold-500" />,
      title: "مشاوره مکمل و استروئید",
      description: "راهنمایی تخصصی و علمی در انتخاب و مصرف مکمل‌ها و استروئیدها با توجه به اهداف و شرایط فیزیکی",
      stats: "مشاوره ۲۴/۷"
    }
  ], []);

  // Company stats - memoized
  const stats = React.useMemo(() => [
    { number: "500+", label: "برنامه تمرینی", icon: <Dumbbell className="h-6 w-6" /> },
    { number: "24/7", label: "پشتیبانی", icon: <Shield className="h-6 w-6" /> },
    { number: "AI", label: "هوش مصنوعی", icon: <Brain className="h-6 w-6" /> },
    { number: "100%", label: "شخصی‌سازی", icon: <Target className="h-6 w-6" /> }
  ], []);

  // Why choose us reasons - memoized
  const whyChooseUs = React.useMemo(() => [
    {
      icon: <Target className="h-8 w-8 text-gold-500" />,
      title: "هدف‌محور",
      description: "تمام برنامه‌ها بر اساس اهداف شخصی شما طراحی می‌شوند"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-gold-500" />,
      title: "پیشرفت قابل اندازه‌گیری",
      description: "پیگیری دقیق پیشرفت با نمودارها و آمار تفصیلی"
    },
    {
      icon: <Award className="h-8 w-8 text-gold-500" />,
      title: "کیفیت برتر",
      description: "محتوای علمی و به‌روز تهیه شده توسط متخصصان"
    },
    {
      icon: <Heart className="h-8 w-8 text-gold-500" />,
      title: "سلامت محور",
      description: "اولویت اول ما سلامت و ایمنی شماست"
    }
  ], []);

  return (
    <>
      <Helmet>
        <title>درباره ما - لیفت لجندز | بهترین اپلیکیشن بدنسازی هوشمند</title>
        <meta name="description" content="لیفت لجندز - اپلیکیشن بدنسازی هوشمند با هوش مصنوعی. برنامه تمرینی شخصی، رژیم غذایی علمی و مشاوره تخصصی." />
        <meta name="keywords" content="بدنسازی,تناسب اندام,هوش مصنوعی,برنامه تمرینی,رژیم غذایی,لیفت لجندز" />
        <link rel="canonical" href="https://liftlegends.ir/about-us" />
        <meta property="og:title" content="درباره ما - لیفت لجندز" />
        <meta property="og:description" content="اپلیکیشن بدنسازی هوشمند با هوش مصنوعی" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://liftlegends.ir/about-us" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "درباره لیفت لجندز",
            "url": "https://liftlegends.ir/about-us",
            "mainEntity": {
              "@type": "Organization",
              "name": "Lift Legends",
              "alternateName": "لیفت لجندز"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Optimized Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gold-500/15 to-amber-500/15 rounded-full blur-[80px]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-gold-400/8 to-transparent rounded-full blur-[60px]"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-amber-500/8 to-transparent rounded-full blur-[50px]"></div>
          </div>
          

          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-gold-500/20 to-amber-500/20 rounded-full border border-gold-500/30">
                <Trophy className="h-4 w-4 text-gold-400" />
                <span className="text-gold-400 text-sm font-medium">پیشرو در فناوری بدنسازی</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
                  لیفت لجندز
                </span>
              </h1>
              
              {/* Subtitle */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-white/90">
                آینده بدنسازی در دستان شما
              </h2>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                ترکیب <span className="text-gold-400 font-semibold">هوش مصنوعی پیشرفته</span> و 
                <span className="text-gold-400 font-semibold"> علم بدنسازی</span> برای تجربه‌ای منحصر به فرد
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800/40 border border-gold-500/20 rounded-xl p-4 hover:border-gold-500/40 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-center mb-2 text-gold-500 group-hover:scale-110 transition-transform duration-200">
                      {stat.icon}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-bold px-8 py-6 text-lg rounded-xl transition-colors duration-200 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] group"
                >
                  <Link to="/download">
                    <Download className="ml-2 h-5 w-5" />
                    دانلود رایگان اپلیکیشن
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  className="border-gold-500/50 text-white hover:bg-gold-500/10 hover:border-gold-500 px-8 py-6 text-lg rounded-xl transition-colors duration-200"
                >
                  <Link to="/programs">
                    <ArrowRight className="ml-2 h-5 w-5" />
                    مشاهده برنامه‌ها
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Interactive Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">
                ویژگی‌های منحصر به فرد
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                <span className="text-gold-400 font-semibold">انقلابی در دنیای بدنسازی</span> با هوش مصنوعی پیشرفته
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Features List */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`relative bg-gradient-to-r from-gray-800/60 to-gray-900/60 border rounded-2xl p-8 transition-all duration-300 cursor-pointer group ${
                      activeFeature === index 
                        ? 'border-gold-500/60 shadow-[0_0_30px_rgba(255,215,0,0.2)] scale-105' 
                        : 'border-gray-700/50 hover:border-gold-500/30'
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        activeFeature === index 
                          ? 'bg-gradient-to-r from-gold-500/30 to-amber-500/30 scale-110' 
                          : 'bg-gold-500/10 group-hover:bg-gold-500/20'
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-3 transition-all duration-300 ${
                          activeFeature === index ? 'text-gold-400' : 'text-white group-hover:text-gold-400'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                          activeFeature === index 
                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' 
                            : 'bg-gray-700/50 text-gray-400'
                        }`}>
                          <CheckCircle className="h-4 w-4" />
                          {feature.stats}
                        </div>
                      </div>
                    </div>
                    
                    {/* Active indicator */}
                    {activeFeature === index && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-gold-500 to-amber-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Visual Element */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gold-500/20 rounded-2xl p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-amber-500/10"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">اپلیکیشن هوشمند</h3>
                    <p className="text-gray-300 text-sm mb-4">تجربه کاربری بی‌نظیر</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <Activity className="h-6 w-6 text-gold-500 mx-auto mb-1" />
                        <div className="text-sm font-bold text-white">۲۴/۷</div>
                        <div className="text-xs text-gray-400">پیگیری</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <Brain className="h-6 w-6 text-gold-500 mx-auto mb-1" />
                        <div className="text-sm font-bold text-white">AI</div>
                        <div className="text-xs text-gray-400">هوشمند</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">
                چرا لیفت لجندز؟
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyChooseUs.slice(0, 4).map((item, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-2xl p-6 hover:border-gold-500/50 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-400 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        

        
        {/* Final CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-amber-500/10"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gold-500/30 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-amber-500/10"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">
                  آماده تحول هستید؟
                </h2>
                
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                  سفر شما به سمت <span className="text-gold-400 font-semibold">بهترین نسخه خودتان</span> امروز شروع می‌شود
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-bold px-8 py-6 text-lg rounded-xl transition-colors duration-200 shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(255,215,0,0.5)] group"
                  >
                    <Link to="/download">
                      <Download className="ml-2 h-5 w-5" />
                      دانلود رایگان اپلیکیشن
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-gold-500/50 text-white hover:bg-gold-500/10 hover:border-gold-500 px-8 py-6 text-lg rounded-xl transition-colors duration-200"
                  >
                    <Link to="/programs">
                      <ArrowRight className="ml-2 h-5 w-5" />
                      مشاهده برنامه‌ها
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-6 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gold-500" />
                    <span>بدون تعهد</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gold-500" />
                    <span>پشتیبانی ۲۴/۷</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gold-500" />
                    <span>شخصی‌سازی کامل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default memo(AboutUs);