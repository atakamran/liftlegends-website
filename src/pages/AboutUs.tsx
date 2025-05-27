import React from "react";
import { 
  Dumbbell, 
  Utensils, 
  Beaker, 
  Brain, 
  Download,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  // Main features
  const features = [
    {
      icon: <Dumbbell className="h-10 w-10 text-gold-500" />,
      title: "برنامه تمرینی هوشمند",
      description: "برنامه‌های تمرینی شخصی‌سازی شده بر اساس سطح آمادگی، اهداف و محدودیت‌های شما با استفاده از هوش مصنوعی"
    },
    {
      icon: <Utensils className="h-10 w-10 text-gold-500" />,
      title: "برنامه غذایی هوشمند",
      description: "برنامه‌های غذایی متناسب با اهداف بدنسازی شما، با محاسبه دقیق کالری و ماکرونوترینت‌ها"
    },
    {
      icon: <Beaker className="h-10 w-10 text-gold-500" />,
      title: "برنامه مکمل و استروئید",
      description: "مشاوره تخصصی در زمینه مکمل‌ها و استروئیدها با توجه به اهداف و شرایط فیزیکی شما"
    },
    {
      icon: <Brain className="h-10 w-10 text-gold-500" />,
      title: "هوش مصنوعی پیشرفته",
      description: "استفاده از الگوریتم‌های هوشمند برای بهینه‌سازی مداوم برنامه‌های تمرینی و غذایی شما"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[10%] w-[1000px] h-[1000px] bg-gold-500/10 rounded-full blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-gold-500/10 rounded-full text-gold-400 text-sm font-medium">
              درباره لیفت لجندز
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
              مربی هوشمند بدنسازی شما
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              لیفت لجندز یک اپلیکیشن هوشمند بدنسازی است که با استفاده از هوش مصنوعی، برنامه‌های تمرینی، غذایی و مکمل شخصی‌سازی شده ارائه می‌دهد.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-gold-500/10 rounded-full text-gold-400 text-sm font-medium">
              ویژگی‌های اصلی
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">
              چرا لیفت لجندز؟
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              ما با ترکیب تکنولوژی و علم بدنسازی، تجربه‌ای منحصر به فرد برای شما فراهم کرده‌ایم
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-800/80 transition-all duration-300 hover:border-gold-500/30 group"
              >
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* App Screenshot Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-gold-500/10 rounded-full text-gold-400 text-sm font-medium">
                اپلیکیشن ما
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">
                تجربه کاربری فوق‌العاده
              </h2>
              <div className="space-y-6 text-gray-300 text-lg">
                <p>
                  اپلیکیشن لیفت لجندز با رابط کاربری ساده و زیبا طراحی شده است تا استفاده از آن برای همه کاربران آسان باشد.
                </p>
                <p>
                  با استفاده از این اپلیکیشن می‌توانید به راحتی:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-6 w-6 text-gold-500 ml-2 mt-0.5 flex-shrink-0" />
                    <span>برنامه تمرینی شخصی‌سازی شده دریافت کنید</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-6 w-6 text-gold-500 ml-2 mt-0.5 flex-shrink-0" />
                    <span>برنامه غذایی متناسب با اهداف خود داشته باشید</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-6 w-6 text-gold-500 ml-2 mt-0.5 flex-shrink-0" />
                    <span>مشاوره تخصصی در زمینه مکمل‌ها و استروئیدها دریافت کنید</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-6 w-6 text-gold-500 ml-2 mt-0.5 flex-shrink-0" />
                    <span>پیشرفت خود را به صورت دقیق پیگیری کنید</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-medium px-6 py-6 rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40"
                >
                  <Link to="/download">
                    <Download className="ml-2 h-5 w-5" />
                    دانلود اپلیکیشن
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gold-500/20 rounded-xl blur-xl"></div>
              <img 
                src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends/app/app-screenshot.png" 
                alt="اسکرین‌شات اپلیکیشن" 
                className="relative rounded-xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 to-amber-600/20"></div>
            <div className="absolute inset-0 bg-gray-900/70"></div>
            
            <div className="relative z-10 p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-amber-300">
                همین امروز شروع کنید
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                با لیفت لجندز، سفر خود را به سمت بدنی قوی‌تر و سالم‌تر آغاز کنید.
                برنامه تمرینی هوشمند، برنامه غذایی و مشاوره مکمل و استروئید همیشه همراه شماست.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-medium px-6 py-6 rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 w-full sm:w-auto"
                >
                  <Link to="/download">
                    دانلود اپلیکیشن
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  className="border-gray-700 hover:bg-gray-800 text-white px-6 py-6 rounded-xl w-full sm:w-auto"
                >
                  <Link to="/subscription">
                    مشاهده اشتراک‌ها
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;