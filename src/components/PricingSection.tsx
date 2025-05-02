
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "رایگان",
    price: "۰",
    period: "برای همیشه",
    features: [
      "دسترسی به تمرینات عمومی",
      "پیگیری پیشرفت محدود",
      "۳ برنامه تمرینی آماده",
      "بدون پشتیبانی هوش مصنوعی",
      "بدون برنامه غذایی"
    ],
    buttonText: "شروع رایگان",
    popular: false
  },
  {
    name: "Pro",
    price: "۴۹۰,۰۰۰",
    period: "ماهانه",
    features: [
      "تمام امکانات نسخه رایگان",
      "برنامه غذایی شخصی‌سازی شده",
      "پیگیری کامل پیشرفت",
      "۲۰+ برنامه تمرینی اختصاصی",
      "دسترسی به کتابخانه تمرینات"
    ],
    buttonText: "خرید اشتراک",
    popular: true
  },
  {
    name: "Ultimate",
    price: "۹۹۰,۰۰۰",
    period: "ماهانه",
    features: [
      "تمام امکانات Pro",
      "مربی AI اختصاصی",
      "مشاوره استروئید",
      "برنامه‌ریزی پیشرفته",
      "دسترسی به همه قابلیت‌های آینده"
    ],
    buttonText: "خرید اشتراک",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-black relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">پلن‌های اشتراک</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            پلن مناسب خود را انتخاب کنید و مسیر رسیدن به اهداف بدنسازی خود را هموار کنید
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                bg-gray-900 rounded-2xl overflow-hidden 
                ${plan.popular ? 'border-2 border-gold-500 shadow-[0_0_30px_rgba(255,215,0,0.15)] scale-105 z-10' : 'border border-white/10'} 
                transition-all hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:scale-[1.02]
              `}
            >
              {plan.popular && (
                <div className="bg-gold-500 text-black py-1.5 text-center font-medium">
                  محبوب‌ترین
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="my-5">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/60 mr-2">تومان / {plan.period}</span>
                </div>
                
                <hr className="border-white/10 my-6" />
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-gold-500"><Check size={18} /></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-6 ${
                    plan.popular 
                    ? 'bg-gold-500 hover:bg-gold-600 text-black' 
                    : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
