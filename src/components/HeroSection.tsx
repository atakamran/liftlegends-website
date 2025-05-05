
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-b from-black to-gray-900"></div>
      <div className="absolute -z-10 top-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gold-500 rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute -z-10 bottom-40 right-10 w-40 h-40 bg-gold-400 rounded-full blur-[80px] opacity-5 animate-pulse"></div>
      
      {/* Hero content */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="text-center md:text-right space-y-8 animate-fade-in order-2 md:order-1">
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
            با هوش مصنوعی پیشرفته، برنامه تمرینی و رژیم غذایی شخصی‌سازی شده دریافت کنید
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
            <Button className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <Download size={20} className="ml-2" />
              دانلود برای اندروید
            </Button>
            <Button variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500/10 px-8 py-6 text-lg font-medium rounded-xl transition-all">
              دانلود مستقیم APK
            </Button>
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
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative">
            {/* Phone frame */}
            <div className="relative z-10 w-full max-w-[280px] mx-auto">
              <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-[32px] glass-morphism border border-white/10 shadow-[0_0_25px_rgba(255,215,0,0.15)]">
                <div className="aspect-[9/19.5] overflow-hidden rounded-[24px] border-[8px] border-black">
                  <img 
                    src="/images/home page.jpeg" 
                    alt="LiftLegends App Preview" 
                    className="w-full h-full object-cover"
                  />
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
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          className="text-gold-500 hover:text-gold-400 transition-colors" 
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to features"
        >
          <ArrowDown size={32} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
