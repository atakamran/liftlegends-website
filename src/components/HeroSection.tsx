
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Star, Shield, Zap, Brain, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts with a small delay to improve FCP
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // SEO structured data
  useEffect(() => {
    // Add structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "name": "LiftLegends",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IRR"
      },
      "description": "مربی بدنسازی هوشمند با هوش مصنوعی پیشرفته، برنامه تمرینی و رژیم غذایی شخصی‌سازی شده",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1"
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background effects - enhanced with more modern gradients */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-b from-black via-gray-900 to-black"></div>
      <div className="absolute -z-10 top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-gold-500 to-amber-500 rounded-full blur-[120px] opacity-10"></div>
      <div className="absolute -z-10 bottom-40 right-10 w-64 h-64 bg-gradient-to-r from-gold-400 to-amber-300 rounded-full blur-[100px] opacity-5 animate-pulse"></div>
      <div className="absolute -z-10 top-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[120px] opacity-5"></div>
      
      {/* Enhanced animated particles with more variety */}
      <div className="absolute inset-0 -z-5 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-500 rounded-full animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-gold-400 rounded-full animate-float" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-gold-500 rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-gold-400 rounded-full animate-float" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-gold-500 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/5 left-3/4 w-3 h-3 bg-gold-500/30 rounded-full animate-float" style={{ animationDelay: "2.5s" }}></div>
        <div className="absolute top-2/5 left-1/3 w-1.5 h-1.5 bg-gold-400/40 rounded-full animate-float" style={{ animationDelay: "3s" }}></div>
      </div>
      
      {/* Hero content - enhanced with more modern layout */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text content - enhanced with better typography and animations */}
        <div className={`text-center md:text-right space-y-8 order-2 md:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-white/70 text-sm">+۱۰ کاربر راضی</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 animate-gradient-x">LiftLegends</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-white/90 font-light">
            مربی بدنسازی هوشمند شما
          </h2>
          
          <p className="text-white/70 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
            با هوش مصنوعی پیشرفته، <span className="text-gold-400 font-medium">برنامه تمرینی</span> و <span className="text-gold-400 font-medium">رژیم غذایی</span> شخصی‌سازی شده دریافت کنید
          </p>
          
          {/* Enhanced feature badges with better visual design */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
              <Brain size={14} className="text-gold-500 group-hover:scale-110 transition-transform" />
              <span className="text-white/80 text-xs group-hover:text-white transition-colors">برنامه هوشمند تمرینی</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
              <Shield size={14} className="text-gold-500 group-hover:scale-110 transition-transform" />
              <span className="text-white/80 text-xs group-hover:text-white transition-colors">برنامه مکمل و استرویید</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
              <Zap size={14} className="text-gold-500 group-hover:scale-110 transition-transform" />
              <span className="text-white/80 text-xs group-hover:text-white transition-colors">هوش مصنوعی</span>
            </div>
          </div>
          
          {/* Enhanced CTA buttons with better visual design */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
            <Button 
              className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] group"
              onClick={() => window.location.href = "/download"}
            >
              <Download size={20} className="ml-2 group-hover:animate-bounce" />
              دانلود برای اندروید
            </Button>
            
            <Button 
              variant="outline"
              className="border-gold-500/30 text-white hover:bg-gold-500/10 px-8 py-6 text-lg font-medium rounded-xl transition-all hover:border-gold-500/70"
              onClick={() => window.location.href = "/programs"}
            >
              <ArrowDown size={20} className="ml-2" />
              مشاهده برنامه‌ها
            </Button>
          </div>
          
          {/* Enhanced stats with better visual design */}
          <div className="flex items-center justify-center md:justify-start gap-6 mt-8">
            <div className="flex flex-col items-center group">
              <span className="text-gold-500 font-bold text-2xl group-hover:scale-110 transition-transform">+۵۰</span>
              <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">تمرین‌ها</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center group">
              <span className="text-gold-500 font-bold text-2xl group-hover:scale-110 transition-transform">+۱۰۰</span>
              <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">برنامه غذایی</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center group">
              <span className="text-gold-500 font-bold text-2xl group-hover:scale-110 transition-transform">۲۴/۷</span>
              <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">پشتیبانی</span>
            </div>
          </div>
          
          {/* QR Code for app download */}
          
        </div>
        
        {/* Modern simplified mobile app representation */}
        <div className={`order-1 md:order-2 flex justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
          <div className="relative">
            {/* Simple modern phone frame */}
            <div className="relative z-10 w-full max-w-[280px] mx-auto">
              <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-[32px] glass-morphism border border-white/10 shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] transition-all duration-500">
                <div className="aspect-[9/19.5] overflow-hidden rounded-[24px] border-[6px] border-black bg-gradient-to-b from-gray-900 to-black flex flex-col">
                  {/* Status bar */}
                  <div className="h-5 bg-black/40 flex items-center justify-between px-3">
                    <div className="text-white text-[8px]">12:30</div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
                    </div>
                  </div>
                  
                  {/* App content - simplified */}
                  <div className="flex-1 flex flex-col items-center p-3">
                    {/* Logo */}
                    <div className="w-full flex justify-center items-center mt-3 mb-3">
                      <img 
                        src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" 
                        alt="LiftLegends Logo" 
                        className="w-20 h-auto"
                        loading="eager"
                        width="80"
                        height="80"
                      />
                    </div>
                    
                    {/* Simplified app elements */}
                    <div className="w-full space-y-3 mb-3">
                      {/* Feature cards */}
                      <div className="bg-gold-500/10 rounded-lg p-2 border border-gold-500/30">
                        <div className="text-gold-400 text-xs font-medium text-center">مربی هوشمند بدنسازی</div>
                      </div>
                      
                      {/* Menu items - simplified */}
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="flex items-center gap-2 p-1">
                          <div className="w-2 h-2 rounded-full bg-gold-500"></div>
                          <div className="text-white text-xs">برنامه تمرینی</div>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                          <div className="w-2 h-2 rounded-full bg-gold-500/60"></div>
                          <div className="text-white text-xs">رژیم غذایی</div>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                          <div className="w-2 h-2 rounded-full bg-gold-500/60"></div>
                          <div className="text-white text-xs">پیشرفت</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom navigation - simplified */}
                  <div className="w-full bg-gray-800/30 rounded-full py-1 px-2 flex justify-around mb-2">
                    <div className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-gold-500/80 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simplified decorative elements */}
              <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gold-500 rounded-full blur-[20px] opacity-30"></div>
            </div>
            
            {/* Simplified feature highlights */}
            <div className="absolute -top-4 -right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gold-500/30 shadow-lg animate-float">
              <p className="text-sm text-gold-400 font-medium">برنامه تمرینی هوشمند</p>
            </div>
            <div className="absolute bottom-12 -left-8 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gold-500/30 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
              <p className="text-sm text-gold-400 font-medium">رژیم غذایی شخصی</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced responsive scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          className="text-gold-500 hover:text-gold-400 transition-colors group bg-gray-900/50 backdrop-blur-sm p-2 sm:p-2.5 md:p-3 rounded-full border border-gold-500/20 hover:border-gold-500/40 shadow-lg hover:shadow-gold-500/20" 
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="مشاهده ویژگی‌ها"
        >
          <ArrowDown size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
          <span className="sr-only">مشاهده ویژگی‌ها</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
