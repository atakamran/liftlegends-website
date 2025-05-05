
import { Activity, Dumbbell, Utensils, Brain, Calendar, BarChart3, Zap, Download } from "lucide-react";

const features = [
  {
    icon: <Dumbbell size={28} />,
    title: "برنامه تمرینی هوشمند",
    description: "برنامه‌های تمرینی شخصی‌سازی شده بر اساس اهداف، سطح تجربه و محدودیت‌های شما با هوش مصنوعی"
  },
  {
    icon: <Utensils size={28} />,
    title: "رژیم غذایی و مکمل",
    description: "برنامه‌های غذایی متناسب با اهداف بدنسازی و توصیه‌های مکمل برای رسیدن سریع‌تر به نتیجه"
  },
  {
    icon: <Brain size={28} />,
    title: "پشتیبانی مربی با هوش مصنوعی",
    description: "دسترسی ۲۴ ساعته به مربی هوش مصنوعی برای راهنمایی، پاسخ به سؤالات و اصلاح تکنیک‌های تمرینی"
  },
  {
    icon: <Calendar size={28} />,
    title: "برنامه‌ریزی هفتگی",
    description: "برنامه‌ریزی دقیق تمرینات هفتگی با توجه به زمان‌بندی و اهداف شما برای دستیابی به نتایج بهتر"
  },
];

const additionalFeatures = [
  {
    icon: <Zap size={20} />,
    title: "یادآوری تمرین",
  },
  {
    icon: <Download size={20} />,
    title: "دانلود ویدیوهای آموزشی",
  },
  {
    icon: <Activity size={20} />,
    title: "ثبت رکوردهای شخصی",
  },
  {
    icon: <Brain size={20} />,
    title: "مشاوره تغذیه",
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute -z-10 top-1/3 right-0 w-72 h-72 bg-gold-500 rounded-full blur-[120px] opacity-5"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">ویژگی‌های برتر</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            با LiftLegends به قدرت خود دست یابید و اهداف بدنسازی خود را محقق کنید
          </p>
        </div>

        {/* Main features grid */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="h-full">
                <div className="relative h-full bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl glass-morphism border border-white/10 shadow-[0_0_25px_rgba(255,215,0,0.1)] overflow-hidden group hover:border-gold-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="space-y-4 flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-4 rounded-lg text-black inline-block group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional features */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-center mb-12 text-white">امکانات بیشتر</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 p-6 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] group text-center"
              >
                <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-3 rounded-lg text-black inline-block mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Banner */}
        <div className="mt-24 bg-gradient-to-r from-gray-900 to-black p-8 md:p-12 rounded-2xl border border-gold-500/20 relative overflow-hidden">
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[100px] opacity-10"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">آماده شروع هستید؟</h3>
              <p className="text-white/70 max-w-xl">
                همین امروز LiftLegends را دانلود کنید و سفر خود را به سمت بدنی قوی‌تر و سالم‌تر آغاز کنید.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium">
                <Download size={18} className="inline ml-2" />
                دانلود اپلیکیشن
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
