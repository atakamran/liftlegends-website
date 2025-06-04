import { Button } from "@/components/ui/button";
import { Download, Star, Shield, Zap, Brain } from "lucide-react";
import { useEffect, useState } from "react";

const DownloadPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
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
      
      {/* Download content */}
      <div className={`max-w-3xl w-full mx-auto text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
            ))}
          </div>
          <span className="text-white/70 text-sm">+۱۰۰۰ کاربر راضی</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold">
          دانلود <span className="text-gradient">LiftLegends</span>
        </h1>
        
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          با LiftLegends، سفر خود را به سمت بدنی قوی‌تر و سالم‌تر آغاز کنید. <span className="text-gold-400">برنامه تمرینی هوشمند</span> و <span className="text-gold-400">برنامه مکمل و استرویید</span> شما همیشه همراهتان است.
        </p>
        
        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
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
        
        {/* Download options */}
        <div className="bg-gradient-to-r from-gray-800 to-black p-8 rounded-2xl border border-gold-500/20 mt-10 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-500">
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-15 transition-opacity"></div>
          
          <h2 className="text-2xl font-bold mb-6">دانلود اپلیکیشن</h2>
          
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
            <Button 
              className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-6 text-lg font-medium rounded-xl w-full transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              onClick={() => window.open("http://cafebazaar.ir/app/?id=com.liftlegends.app&ref=share", "_blank")}
            >
              <Download size={20} className="ml-2" />
              دانلود از کافه بازار
            </Button>
            
            <div className="text-white/60 text-sm">
              برای دانلود و نصب اپلیکیشن LiftLegends، روی دکمه بالا کلیک کنید.
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-10">
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
        
        <div className="mt-12">
          <a href="/" className="text-gold-500 hover:text-gold-400 transition-colors">
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadPage;