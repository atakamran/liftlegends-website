
import { Instagram, Telegram } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 py-16 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-gradient mb-4">LiftLegends</h3>
            <p className="text-white/70 leading-relaxed">
              مربی بدنسازی هوشمند شما برای رسیدن به اهداف تناسب اندام و بدنسازی
            </p>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-lg">لینک‌های مفید</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-white/70 hover:text-gold-400 transition-colors">ویژگی‌ها</a></li>
              <li><a href="#pricing" className="text-white/70 hover:text-gold-400 transition-colors">قیمت‌گذاری</a></li>
              <li><a href="#testimonials" className="text-white/70 hover:text-gold-400 transition-colors">نظرات کاربران</a></li>
              <li><a href="#faq" className="text-white/70 hover:text-gold-400 transition-colors">سوالات متداول</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-lg">شرکت</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-gold-400 transition-colors">درباره ما</a></li>
              <li><a href="#" className="text-white/70 hover:text-gold-400 transition-colors">قوانین و حریم خصوصی</a></li>
              <li><a href="#" className="text-white/70 hover:text-gold-400 transition-colors">شرایط استفاده</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-semibold mb-4 text-lg">تماس با ما</h4>
            <ul className="space-y-2">
              <li><a href="mailto:info@liftlegends.ir" className="text-white/70 hover:text-gold-400 transition-colors">info@liftlegends.ir</a></li>
              <li><p className="text-white/70">تهران، خیابان ولیعصر</p></li>
              <li>
                <div className="flex items-center gap-4 mt-4">
                  <a href="#" className="text-white/70 hover:text-gold-400 transition-colors">
                    <Instagram size={22} />
                  </a>
                  <a href="#" className="text-white/70 hover:text-gold-400 transition-colors">
                    <Telegram size={22} />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">© ۱۴۰۴ LiftLegends. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-white/60 hover:text-white transition-colors">حریم خصوصی</a>
            <span className="text-white/40">|</span>
            <a href="#" className="text-white/60 hover:text-white transition-colors">شرایط استفاده</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
