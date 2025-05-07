
import { Instagram, MessageCircle, Twitter, Linkedin, Mail, MapPin, Phone, Download, ArrowUp, Dumbbell, Shield, Brain, Utensils, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const FooterSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  return (
    <footer id="footer" className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 px-4 border-t border-white/10 relative">
      {/* Background effects */}
      <div className="absolute -z-10 bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute -z-10 top-20 right-20 w-64 h-64 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-40 left-20 w-48 h-48 bg-gold-400 rounded-full blur-[120px] opacity-5"></div>
      
      {/* Back to top button */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gold-500 hover:bg-gold-600 text-black p-3 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(255,215,0,0.4)]"
          aria-label="بازگشت به بالا"
        >
          <ArrowUp size={20} />
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* App download banner */}
        <div className={`bg-gradient-to-r from-gray-800 to-black p-8 md:p-10 rounded-2xl border border-gold-500/20 mb-16 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-15 transition-opacity"></div>
          <div className="absolute -z-10 bottom-0 left-0 w-32 h-32 bg-gold-400 rounded-full blur-[80px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <span className="text-white/70 text-sm">+۱۰۰۰ کاربر راضی</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-gradient">LiftLegends</span> را همین امروز دانلود کنید
              </h3>
              <p className="text-white/70 max-w-xl">
                با LiftLegends، سفر خود را به سمت بدنی قوی‌تر و سالم‌تر آغاز کنید. <span className="text-gold-400">برنامه تمرینی هوشمند</span> و <span className="text-gold-400">برنامه مکمل و استرویید</span> شما همیشه همراهتان است.
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5">
                  <Dumbbell size={14} className="text-gold-500" />
                  <span className="text-white/80 text-xs">برنامه تمرینی هوشمند</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5">
                  <Shield size={14} className="text-gold-500" />
                  <span className="text-white/80 text-xs">برنامه مکمل و استرویید</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5">
                  <Brain size={14} className="text-gold-500" />
                  <span className="text-white/80 text-xs">هوش مصنوعی</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Button className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  <Download size={18} className="ml-2" />
                  دانلود اپلیکیشن
                </Button>
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  بزودی
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer main content */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-lg shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <Dumbbell size={24} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gradient">LiftLegends</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              مربی بدنسازی هوشمند شما برای رسیدن به اهداف تناسب اندام و بدنسازی. با استفاده از <span className="text-gold-400">هوش مصنوعی</span> پیشرفته، <span className="text-gold-400">برنامه تمرینی</span> و <span className="text-gold-400">رژیم غذایی</span> شخصی‌سازی شده دریافت کنید.
            </p>
            
            {/* Social media links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-2 rounded-full transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-2 rounded-full transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-2 rounded-full transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg text-white">لینک‌های سریع</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">ویژگی‌ها</span>
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">نظرات کاربران</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">سوالات متداول</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">دانلود</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company info */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg text-white">شرکت</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">درباره ما</span>
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">حریم خصوصی</span>
                </a>
              </li>
              <li>
                <a href="/terms-of-use" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">شرایط استفاده</span>
                </a>
              </li>
              <li>
                <a href="/work-with-us" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="group-hover:translate-x-1 transition-transform">همکاری با ما</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-semibold mb-6 text-lg text-white">تماس با ما</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:info@liftlegends.ir" className="text-white/70 hover:text-gold-400 transition-colors flex items-start gap-3 group">
                  <Mail size={18} className="mt-1 text-gold-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">info@liftlegends.ir</span>
                </a>
              </li>
              <li>
                <a href="tel:+989148866040" className="text-white/70 hover:text-gold-400 transition-colors flex items-start gap-3 group">
                  <Phone size={18} className="mt-1 text-gold-500 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">09148866040</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 text-gold-500" />
                  <p className="text-white/70">تبریز</p>
                </div>
              </li>
            </ul>
            
            {/* Newsletter subscription */}
            {/* <div className="mt-6 pt-6 border-t border-white/10">
              <h5 className="font-medium mb-3 text-white">عضویت در خبرنامه</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="ایمیل خود را وارد کنید" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-r-none rounded-lg border-0 focus:ring-1 focus:ring-gold-500 outline-none flex-grow"
                />
                <button className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-l-none rounded-lg transition-colors">
                  عضویت
                </button>
              </div>
              <p className="text-white/50 text-xs mt-2">با عضویت در خبرنامه، از آخرین اخبار و بروزرسانی‌های برنامه مطلع شوید</p>
            </div> */}
          </div>
        </div>
        
        {/* Features section */}
        <div className={`mt-16 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-6 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "400ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Dumbbell size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">برنامه تمرینی هوشمند</h5>
              <p className="text-white/60 text-sm">برنامه‌های تمرینی شخصی‌سازی شده با هوش مصنوعی</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Utensils size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">برنامه غذایی</h5>
              <p className="text-white/60 text-sm">رژیم غذایی متناسب با اهداف بدنسازی شما</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Shield size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">برنامه مکمل و استرویید</h5>
              <p className="text-white/60 text-sm">مشاوره تخصصی در زمینه مکمل‌ها و استروییدها</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Brain size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">هوش مصنوعی</h5>
              <p className="text-white/60 text-sm">مربی هوشمند با استفاده از فناوری هوش مصنوعی</p>
            </div>
          </div>
        </div>
        
        {/* Copyright and legal */}
        <div className={`mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "600ms" }}>
          <p className="text-white/60 text-sm">© ۱۴۰۴ LiftLegends. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-4 text-sm">
            <a href="/privacy-policy" className="text-white/60 hover:text-gold-400 transition-colors">حریم خصوصی</a>
            <span className="text-white/40">|</span>
            <a href="/terms-of-use" className="text-white/60 hover:text-gold-400 transition-colors">شرایط استفاده</a>
            <span className="text-white/40">|</span>
            <a href="/privacy-policy#cookies" className="text-white/60 hover:text-gold-400 transition-colors">سیاست کوکی‌ها</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
