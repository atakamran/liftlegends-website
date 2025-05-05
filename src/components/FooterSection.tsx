
import { Instagram, MessageCircle, Twitter, Linkedin, Mail, MapPin, Phone, Download, ArrowUp, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 pt-20 pb-10 px-4 border-t border-white/10 relative">
      {/* Background effects */}
      <div className="absolute -z-10 bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute -z-10 top-20 right-20 w-64 h-64 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
      
      {/* Back to top button */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gold-500 hover:bg-gold-600 text-black p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* App download banner */}
        <div className="bg-gradient-to-r from-gray-800 to-black p-8 rounded-2xl border border-gold-500/20 mb-16 relative overflow-hidden">
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[100px] opacity-10"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="text-gradient">LiftLegends</span> را همین امروز دانلود کنید
              </h3>
              <p className="text-white/70 max-w-xl">
                با LiftLegends، سفر خود را به سمت بدنی قوی‌تر و سالم‌تر آغاز کنید. مربی هوشمند شما همیشه همراهتان است.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium">
                <Download size={18} className="ml-2" />
                دانلود اپلیکیشن
              </Button>
            </div>
          </div>
        </div>
        
        {/* Footer main content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-lg">
                <Dumbbell size={24} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gradient">LiftLegends</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              مربی بدنسازی هوشمند شما برای رسیدن به اهداف تناسب اندام و بدنسازی. با استفاده از هوش مصنوعی پیشرفته، برنامه‌های تمرینی و غذایی شخصی‌سازی شده دریافت کنید.
            </p>
            
            {/* Social media links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-2 rounded-full transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-2 rounded-full transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-2 rounded-full transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg text-white">لینک‌های سریع</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>ویژگی‌ها</a></li>
              <li><a href="#testimonials" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>نظرات کاربران</a></li>
              <li><a href="#faq" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>سوالات متداول</a></li>
              <li><a href="#" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>دانلود</a></li>
            </ul>
          </div>
          
          {/* Company info */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg text-white">شرکت</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>درباره ما</a></li>
              <li><a href="/privacy-policy" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>حریم خصوصی</a></li>
              <li><a href="/terms-of-use" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>شرایط استفاده</a></li>
              <li><a href="/work-with-us" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>همکاری با ما</a></li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-semibold mb-6 text-lg text-white">تماس با ما</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:info@liftlegends.ir" className="text-white/70 hover:text-gold-400 transition-colors flex items-start gap-3">
                  <Mail size={18} className="mt-1 text-gold-500" />
                  <span>info@liftlegends.ir</span>
                </a>
              </li>
              <li>
                <a href="tel:+982112345678" className="text-white/70 hover:text-gold-400 transition-colors flex items-start gap-3">
                  <Phone size={18} className="mt-1 text-gold-500" />
                  <span>09148866040</span>
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
            </div> */}
          </div>
        </div>
        
        {/* Copyright and legal */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">© ۱۴۰۴ LiftLegends. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-4 text-sm">
            <a href="/privacy-policy" className="text-white/60 hover:text-white transition-colors">حریم خصوصی</a>
            <span className="text-white/40">|</span>
            <a href="/terms-of-use" className="text-white/60 hover:text-white transition-colors">شرایط استفاده</a>
            <span className="text-white/40">|</span>
            <a href="/privacy-policy#cookies" className="text-white/60 hover:text-white transition-colors">سیاست کوکی‌ها</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
