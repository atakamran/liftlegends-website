
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Star, Shield, Zap, Brain } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts with a small delay to improve FCP
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-b from-black to-gray-900"></div>
      <div className="absolute -z-10 top-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gold-500 rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute -z-10 bottom-40 right-10 w-40 h-40 bg-gold-400 rounded-full blur-[80px] opacity-5 animate-pulse"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 -z-5 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-500 rounded-full animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-gold-400 rounded-full animate-float" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-gold-500 rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-gold-400 rounded-full animate-float" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-gold-500 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
      </div>
      
      {/* Hero content */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className={`text-center md:text-right space-y-8 order-2 md:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-white/70 text-sm">+۱۰۰۰ کاربر راضی</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="text-gradient">LiftLegends</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-white/90">
            مربی بدنسازی هوشمند شما
          </h2>
          
          <p className="text-white/70 text-lg max-w-md mx-auto md:mx-0">
            با هوش مصنوعی پیشرفته، <span className="text-gold-400">برنامه تمرینی</span> و <span className="text-gold-400">رژیم غذایی</span> شخصی‌سازی شده دریافت کنید
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5">
              <Brain size={14} className="text-gold-500" />
              <span className="text-white/80 text-xs">برنامه هوشمند تمرینی</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5">
              <Shield size={14} className="text-gold-500" />
              <span className="text-white/80 text-xs">برنامه مکمل و استرویید</span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5">
              <Zap size={14} className="text-gold-500" />
              <span className="text-white/80 text-xs">هوش مصنوعی</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
            <div className="relative">
              <Button className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)] animate-pulse-gold">
                <Download size={20} className="ml-2" />
                دانلود برای اندروید
              </Button>
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                دانلود از لینک مستقیم
              </div>
            </div>
            <div className="relative">
              <Button 
                variant="outline" 
                className="border-gold-500 text-gold-500 hover:bg-gold-500/10 px-8 py-6 text-lg font-medium rounded-xl transition-all"
                onClick={() => window.open("https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//lift%20legends.apk", "_blank")}
              >
                دانلود از لینک مستقیم
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
            <div className="flex flex-col items-center">
              <span className="text-gold-500 font-bold text-2xl">+۵۰</span>
              <span className="text-white/60 text-sm">تمرین‌ها</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-gold-500 font-bold text-2xl">+۱۰۰</span>
              <span className="text-white/60 text-sm">برنامه غذایی</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-gold-500 font-bold text-2xl">۲۴/۷</span>
              <span className="text-white/60 text-sm">پشتیبانی</span>
            </div>
          </div>
        </div>
        
        {/* App mockup */}
        <div className={`order-1 md:order-2 flex justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
          <div className="relative">
            {/* Phone frame */}
            <div className="relative z-10 w-full max-w-[280px] mx-auto">
              <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-[32px] glass-morphism border border-white/10 shadow-[0_0_25px_rgba(255,215,0,0.15)] hover:shadow-[0_0_35px_rgba(255,215,0,0.25)] transition-all duration-500">
                <div className="aspect-[9/19.5] overflow-hidden rounded-[24px] border-[8px] border-black bg-gradient-to-b from-gray-900 to-black flex flex-col">
                  {/* Status bar */}
                  <div className="h-6 bg-black/40 flex items-center justify-between px-3">
                    <div className="text-white text-[10px]">12:30</div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-white/80"></div>
                      <div className="w-2 h-2 rounded-full bg-white/80"></div>
                      <div className="w-2 h-2 rounded-full bg-white/80"></div>
                    </div>
                  </div>
                  
                  {/* App content */}
                  <div className="flex-1 flex flex-col items-center justify-between p-4">
                    {/* Logo */}
                    <div className="w-full flex justify-center items-center mt-8 mb-4">
                      <img 
                        src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" 
                        alt="LiftLegends Logo" 
                        className="w-32 h-auto"
                        loading="eager"
                        width="128"
                        height="128"
                      />
                    </div>
                    
                    {/* App elements */}
                    <div className="w-full space-y-4 mb-8">
                      {/* Stats cards */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gold-500/10 rounded-lg p-2 border border-gold-500/30 hover:border-gold-500/50 transition-all">
                          <div className="text-gold-400 text-xs">تمرین امروز</div>
                          <div className="text-white text-sm font-bold">پرس سینه</div>
                        </div>
                        <div className="bg-gold-500/10 rounded-lg p-2 border border-gold-500/30 hover:border-gold-500/50 transition-all">
                          <div className="text-gold-400 text-xs">کالری</div>
                          <div className="text-white text-sm font-bold">۱۲۰۰ / ۲۰۰۰</div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="bg-gray-800/50 rounded-lg p-2">
                        <div className="flex items-center gap-2 p-1 hover:bg-gold-500/10 rounded transition-colors">
                          <div className="w-3 h-3 rounded-full bg-gold-500"></div>
                          <div className="text-white text-xs">برنامه تمرینی</div>
                        </div>
                        <div className="flex items-center gap-2 p-1 hover:bg-gold-500/10 rounded transition-colors">
                          <div className="w-3 h-3 rounded-full bg-gold-500/60"></div>
                          <div className="text-white text-xs">رژیم غذایی</div>
                        </div>
                        <div className="flex items-center gap-2 p-1 hover:bg-gold-500/10 rounded transition-colors">
                          <div className="w-3 h-3 rounded-full bg-gold-500/60"></div>
                          <div className="text-white text-xs">پیشرفت</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom navigation */}
                    <div className="w-full bg-gray-800/30 rounded-full py-1 px-2 flex justify-around">
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gold-500/80 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gold-500 rounded-full blur-[20px] opacity-30"></div>
            </div>
            
            {/* Feature highlights */}
            <div className="absolute -top-4 -right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gold-500/30 shadow-lg animate-float">
              <p className="text-sm text-gold-400">برنامه تمرینی هوشمند</p>
            </div>
            <div className="absolute bottom-12 -left-8 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gold-500/30 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
              <p className="text-sm text-gold-400">رژیم غذایی شخصی</p>
            </div>
            <div className="absolute top-1/3 -left-10 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gold-500/30 shadow-lg animate-float" style={{ animationDelay: "2s" }}>
              <p className="text-sm text-gold-400">برنامه مکمل و استرویید</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          className="text-gold-500 hover:text-gold-400 transition-colors group" 
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="مشاهده ویژگی‌ها"
        >
          <ArrowDown size={32} className="group-hover:scale-110 transition-transform" />
          <span className="sr-only">مشاهده ویژگی‌ها</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
