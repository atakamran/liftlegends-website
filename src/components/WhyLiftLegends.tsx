import React from "react";
import { 
  Building2, 
  Users, 
  User, 
  ShoppingCart, 
  Brain, 
  Crown, 
  TrendingUp, 
  CreditCard, 
  Handshake, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Building2 size={32} />,
    title: "سیستم مدیریت باشگاه‌ها",
    description: "یک پنل هوشمند برای باشگاه‌ها جهت مدیریت اعضا، مربیان، پرداخت شهریه و ارائه خدمات تمرینی آنلاین.",
    highlight: "مدیریت کامل"
  },
  {
    icon: <Users size={32} />,
    title: "پنل اختصاصی مربیان",
    description: "مربیان می‌توانند برنامه تمرینی و تغذیه‌ای ایجاد کنند، ورزشکار جذب کنند و درآمد منظم کسب کنند.",
    highlight: "درآمد مستمر"
  },
  {
    icon: <User size={32} />,
    title: "پروفایل ورزشکاران شخصی‌سازی‌شده",
    description: "هر ورزشکار یک پنل شخصی دارد با قابلیت دریافت برنامه، دنبال‌کردن پیشرفت و تعامل مستقیم با مربی.",
    highlight: "کاملاً شخصی"
  },
  {
    icon: <ShoppingCart size={32} />,
    title: "فروشگاه اینترنتی تخصصی",
    description: "فروش مکمل‌های ورزشی، پوشاک و تجهیزات با تخفیف ویژه اعضا و ارسال سریع.",
    highlight: "تخفیف ویژه"
  },
  {
    icon: <Brain size={32} />,
    title: "برنامه‌ساز هوشمند AI",
    description: "کاربران بدون نیاز به مربی می‌توانند با پاسخ به چند سؤال، یک برنامه تمرینی و غذایی اختصاصی دریافت کنند.",
    highlight: "هوش مصنوعی"
  },
  {
    icon: <Crown size={32} />,
    title: "مدل اشتراک‌محور",
    description: "کاربران می‌توانند بسته به نیاز خود بین پلن‌های رایگان، پرو یا اولتیمت انتخاب کنند.",
    highlight: "انعطاف‌پذیر"
  },
  {
    icon: <TrendingUp size={32} />,
    title: "تحلیل پیشرفت و نمودارها",
    description: "مشاهده روند پیشرفت فیزیکی و تمرینی با داده‌های قابل فهم و گزارشات حرفه‌ای.",
    highlight: "گزارش دقیق"
  },
  {
    icon: <CreditCard size={32} />,
    title: "درگاه پرداخت آنلاین",
    description: "باشگاه‌ها و مربیان می‌توانند از پرداخت آنلاین برای دریافت هزینه‌ها استفاده کنند.",
    highlight: "پرداخت آسان"
  },
  {
    icon: <Handshake size={32} />,
    title: "همکاری رسمی",
    description: "ایجاد شبکه‌ای از باشگاه‌ها و مربیان تأییدشده با قابلیت دیده‌شدن بیشتر و جذب مشتری.",
    highlight: "شبکه حرفه‌ای"
  },
  {
    icon: <FileText size={32} />,
    title: "فروش برنامه‌های تخصصی",
    description: "برنامه‌هایی طراحی‌شده توسط مربیان حرفه‌ای با اهداف متنوع: چربی‌سوزی، حجم خشک، عضله‌سازی و...",
    highlight: "تخصصی"
  }
];

const WhyLiftLegends = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute -z-10 top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-gold-500/10 to-amber-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute -z-10 bottom-1/4 right-0 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 text-sm px-5 py-2 rounded-full border border-gold-500/20 mb-6">
            مزایای منحصر به فرد
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
            چرا Lift Legends؟
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
            پلتفرم جامع بدنسازی دیجیتال که تمام نیازهای ورزشکاران، مربیان و باشگاه‌ها را در یک مکان فراهم می‌کند
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] hover:-translate-y-2"
            >
              {/* Highlight badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 text-xs px-3 py-1 rounded-full border border-gold-500/20 font-medium">
                {feature.highlight}
              </div>
              
              {/* Icon */}
              <div className="bg-gradient-to-br from-gold-400 to-amber-500 p-4 rounded-xl text-black inline-block mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm p-12 rounded-3xl border border-gold-500/20 relative overflow-hidden">
          <div className="absolute -z-10 top-0 right-0 w-full h-full bg-gradient-to-r from-gold-500/5 to-amber-500/5 rounded-3xl"></div>
          
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            آماده شروع یک <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">انقلاب</span> در بدنسازی هستید؟
          </h3>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
            همین امروز با Lift Legends شروع کنید و تجربه‌ای نوین از تمرین، تغذیه و پیشرفت داشته باشید. 
            پلن رایگان ما را امتحان کنید و قدرت واقعی این پلتفرم را کشف کنید.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)]"
              onClick={() => window.open('https://liftlegends.ir', '_blank')}
            >
              شروع رایگان
            </Button>
            <span className="text-white/60 text-sm">
              بدون نیاز به کارت اعتباری
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyLiftLegends;