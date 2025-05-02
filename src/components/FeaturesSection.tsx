
import { Activity, Dumbbell, Utensils, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Dumbbell size={28} />,
    title: "برنامه تمرینی هوشمند",
    description: "برنامه‌های تمرینی شخصی‌سازی شده بر اساس اهداف شما با هوش مصنوعی"
  },
  {
    icon: <Utensils size={28} />,
    title: "رژیم غذایی و مکمل",
    description: "برنامه‌های غذایی متناسب با اهداف بدنسازی و توصیه‌های مکمل"
  },
  {
    icon: <TrendingUp size={28} />,
    title: "پیگیری پیشرفت",
    description: "ثبت و پیگیری پیشرفت تمرینات و تغییرات بدنی در طول زمان"
  },
  {
    icon: <Activity size={28} />,
    title: "پشتیبانی مربی با هوش مصنوعی",
    description: "دسترسی به مربی هوش مصنوعی برای راهنمایی و پاسخ به سؤالات"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent"></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">ویژگی‌های برتر</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            با LiftLegends به قدرت خود دست یابید و اهداف بدنسازی خود را محقق کنید
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-800/50 p-6 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-3 rounded-lg text-black group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-gold-400 transition-colors">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
