
import { Activity, Dumbbell, Utensils, Brain, Calendar, BarChart3, Zap, Download, Shield, Pill, Award, Sparkles, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";

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
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-secondary via-background to-secondary relative">
      {/* Enhanced background effects */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute -z-10 top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-primary to-yellow-400 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-primary to-yellow-300 rounded-full blur-[130px] opacity-5"></div>
      <div className="absolute -z-10 top-2/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[120px] opacity-3"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Enhanced section header with better typography and animations */}
        <div className="text-center mb-20">
          <span className="inline-block bg-gradient-to-r from-primary/20 to-yellow-500/10 text-primary text-sm px-5 py-2 rounded-full border border-primary/20 mb-5 hover:border-primary/40 transition-colors">
            ویژگی‌های منحصر به فرد
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-300 to-primary animate-gradient-x">
            ویژگی‌های برتر Lift Legends
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            با Lift Legends به قدرت خود دست یابید و اهداف بدنسازی خود را با <span className="text-primary font-medium">برنامه هوشمند تمرینی</span> محقق کنید.
            اپلیکیشنی که با استفاده از <span className="text-primary font-medium">هوش مصنوعی</span> به شما کمک می‌کند به بهترین فرم بدنی خود برسید.
          </p>
        </div>

        {/* Enhanced main features grid with better card design */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="h-full"
                ref={el => featureRefs.current[index] = el}
              >
                <div 
                  className={`relative h-full bg-gradient-to-br from-secondary to-background p-8 rounded-2xl glass-morphism border border-border/10 shadow-[0_0_25px_rgba(212,175,55,0.1)] overflow-hidden group hover:border-primary/30 hover:shadow-[0_0_35px_rgba(212,175,55,0.15)] transition-all duration-500 transform ${visibleFeatures.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced hover effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-primary/20 to-yellow-500/10 text-primary text-xs px-3 py-1 rounded-full border border-primary/20 font-medium">
                    {feature.tag}
                  </div>
                  
                  {/* Enhanced content layout */}
                  <div className="space-y-5 flex flex-col items-center text-center pt-4">
                    <div className="bg-gradient-to-br from-primary to-yellow-500 p-5 rounded-xl text-primary-foreground inline-block group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    
                    {/* Learn more link */}
                    <button 
                      type="button"
                      className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm mt-2 group-hover:translate-x-1 transition-transform border-0 bg-transparent p-0"
                    >
                      اطلاعات بیشتر
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* App experience showcase - without screenshots */}
        <div className="my-32 relative">
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-primary/10 to-yellow-500/5 rounded-full blur-[100px]"></div>
          
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-purple-400 text-sm px-5 py-2 rounded-full border border-purple-500/20 mb-5">
              ویژگی‌های کاربری
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">تجربه کاربری فوق‌العاده</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              طراحی مدرن و کاربرپسند اپلیکیشن Lift Legends برای تجربه‌ای لذت‌بخش
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-secondary to-background p-6 rounded-2xl border border-border/10 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-2 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-500/60 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-center text-foreground mb-3">صفحه اصلی</h3>
              <p className="text-center text-muted-foreground group-hover:text-purple-400 transition-colors">
                دسترسی سریع به تمام ویژگی‌های اپلیکیشن با رابط کاربری ساده و زیبا
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary to-background p-6 rounded-2xl border border-border/10 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-2 group md:transform md:translate-y-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/60 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-center text-foreground mb-3">برنامه تمرینی</h3>
              <p className="text-center text-muted-foreground group-hover:text-primary transition-colors">
                برنامه‌های تمرینی شخصی‌سازی شده با جزئیات کامل و ویدیوهای آموزشی
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary to-background p-6 rounded-2xl border border-border/10 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-2 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-500/60 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-center text-foreground mb-3">مکمل و استرویید</h3>
              <p className="text-center text-muted-foreground group-hover:text-yellow-400 transition-colors">
                مشاوره تخصصی در زمینه مکمل‌ها و استروئیدها با توجه به اهداف شما
              </p>
            </div>
          </div>
        </div>
        
        {/* Enhanced additional features with better visual design */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-6 text-foreground">امکانات بیشتر</h3>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            علاوه بر ویژگی‌های اصلی، Lift Legends امکانات متنوع دیگری نیز برای کمک به شما در مسیر بدنسازی ارائه می‌دهد
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-secondary/50 to-background/50 p-6 rounded-xl border border-border/5 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:-translate-y-1 group text-center relative"
              >
                {feature.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {feature.badge}
                  </div>
                )}
                <div className="bg-gradient-to-br from-primary to-yellow-500 p-3 rounded-lg text-primary-foreground inline-block mb-4 group-hover:scale-110 transition-transform shadow-md">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-32 bg-gradient-to-r from-secondary to-background p-10 rounded-2xl border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
          <div className="absolute -z-10 top-0 right-0 w-80 h-80 bg-gradient-to-r from-primary to-yellow-400 rounded-full blur-[120px] opacity-10 group-hover:opacity-15 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                آماده <span className="text-gradient">تغییر بدن</span> خود هستید؟
              </h3>
              <p className="text-muted-foreground max-w-xl leading-relaxed">
                همین امروز اپلیکیشن Lift Legends را دانلود کنید و سفر خود را به سمت بدنی قوی‌تر و سالم‌تر آغاز کنید.
              </p>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-primary to-yellow-400 hover:from-primary/90 hover:to-yellow-400/90 text-primary-foreground px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              onClick={() => window.location.href = "/download"}
            >
              <Download size={20} className="ml-2" />
              دانلود اپلیکیشن
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
