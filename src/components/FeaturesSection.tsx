
import { Activity, Dumbbell, Utensils, Brain, Calendar, BarChart3, Zap, Download, Shield, Pill, Award, Sparkles, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef, ReactNode } from "react";

interface AdditionalFeature {
  icon: ReactNode;
  title: string;
  badge?: string;
}

const features = [
  {
    icon: <Dumbbell size={28} />,
    title: "برنامه تمرینی هوشمند",
    description: "برنامه‌های تمرینی شخصی‌سازی شده بر اساس اهداف، سطح تجربه و محدودیت‌های شما با هوش مصنوعی پیشرفته",
    tag: "هوشمند"
  },
  {
    icon: <Utensils size={28} />,
    title: "رژیم غذایی شخصی",
    description: "برنامه‌های غذایی متناسب با اهداف بدنسازی و توصیه‌های تغذیه‌ای برای رسیدن سریع‌تر به نتیجه",
    tag: "شخصی‌سازی شده"
  },
  {
    icon: <Shield size={28} />,
    title: "برنامه مکمل و استرویید",
    description: "مشاوره تخصصی در زمینه مکمل‌ها و استروییدها با در نظر گرفتن شرایط بدنی و اهداف شما",
    tag: "تخصصی"
  },
  {
    icon: <Brain size={28} />,
    title: "پشتیبانی با هوش مصنوعی",
    description: "دسترسی ۲۴ ساعته به مربی هوش مصنوعی برای راهنمایی، پاسخ به سؤالات و اصلاح تکنیک‌های تمرینی",
    tag: "هوش مصنوعی"
  },
  {
    icon: <Calendar size={28} />,
    title: "برنامه‌ریزی هفتگی",
    description: "برنامه‌ریزی دقیق تمرینات هفتگی با توجه به زمان‌بندی و اهداف شما برای دستیابی به نتایج بهتر",
    tag: "منظم"
  },
  {
    icon: <BarChart3 size={28} />,
    title: "پیگیری پیشرفت",
    description: "ابزارهای پیشرفته برای ثبت و پیگیری پیشرفت بدنی، وزنه‌ها و اندازه‌های بدن با نمودارهای تحلیلی",
    tag: "تحلیلی"
  },
];

const additionalFeatures: AdditionalFeature[] = [
  {
    icon: <Activity size={20} />,
    title: "ثبت رکوردهای شخصی",
  },
  {
    icon: <Pill size={20} />,
    title: "مشاوره مکمل",
  },
  {
    icon: <Award size={20} />,
    title: "چالش‌های انگیزشی",
  },
  {
    icon: <Clock size={20} />,
    title: "تایمر تمرین",
  },
  {
    icon: <Sparkles size={20} />,
    title: "برنامه استرویید",
  },
  {
    icon: <Brain size={20} />,
    title: "مشاوره تغذیه",
  }
];

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1 && !visibleFeatures.includes(index)) {
              setVisibleFeatures(prev => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [visibleFeatures]);

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute -z-10 top-1/3 right-0 w-72 h-72 bg-gold-500 rounded-full blur-[120px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 left-1/4 w-64 h-64 bg-gold-400 rounded-full blur-[100px] opacity-5"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-gold-500/10 text-gold-400 text-sm px-4 py-1.5 rounded-full border border-gold-500/20 mb-4">
            ویژگی‌های منحصر به فرد
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">ویژگی‌های برتر LiftLegends</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            با LiftLegends به قدرت خود دست یابید و اهداف بدنسازی خود را با <span className="text-gold-400">برنامه هوشمند تمرینی</span> محقق کنید
          </p>
        </div>

        {/* Main features grid */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="h-full"
                ref={el => featureRefs.current[index] = el}
              >
                <div 
                  className={`relative h-full bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl glass-morphism border border-white/10 shadow-[0_0_25px_rgba(255,215,0,0.1)] overflow-hidden group hover:border-gold-500/30 transition-all duration-500 transform ${visibleFeatures.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 bg-gold-500/10 text-gold-400 text-xs px-2 py-0.5 rounded-full border border-gold-500/20">
                    {feature.tag}
                  </div>
                  <div className="space-y-4 flex flex-col items-center text-center pt-4">
                    <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-4 rounded-lg text-black inline-block group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                    {/* <a href="#" className="text-gold-400 hover:text-gold-300 flex items-center gap-1 text-sm mt-2 group-hover:translate-x-1 transition-transform">
                      اطلاعات بیشتر
                      <ChevronRight size={16} />
                    </a> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional features */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-center mb-4 text-white">امکانات بیشتر</h3>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            علاوه بر ویژگی‌های اصلی، LiftLegends امکانات متنوع دیگری نیز برای کمک به شما در مسیر بدنسازی ارائه می‌دهد
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 p-6 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:-translate-y-1 group text-center relative"
              >
                {feature.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {feature.badge}
                  </div>
                )}
                <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-3 rounded-lg text-black inline-block mb-4 group-hover:scale-110 transition-transform shadow-md">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Banner */}
        <div className="mt-24 bg-gradient-to-r from-gray-900 to-black p-8 md:p-12 rounded-2xl border border-gold-500/20 relative overflow-hidden group hover:border-gold-500/40 transition-all duration-500">
          <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="absolute -z-10 bottom-0 left-0 w-32 h-32 bg-gold-400 rounded-full blur-[80px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">آماده شروع هستید؟</h3>
              <p className="text-white/70 max-w-xl">
                همین امروز LiftLegends را دانلود کنید و سفر خود را به سمت بدنی قوی‌تر و سالم‌تر با <span className="text-gold-400">برنامه هوشمند تمرینی</span> و <span className="text-gold-400">برنامه مکمل و استرویید</span> آغاز کنید.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <button className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  <Download size={18} className="inline ml-2" />
                  دانلود اپلیکیشن
                </button>
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  بزودی
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
