
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Download, MessageCircle, Dumbbell, Utensils, Shield, Brain, Calendar, User } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "general",
    question: "آیا برنامه رایگان است؟",
    answer: "بله، LiftLegends یک نسخه رایگان با امکانات پایه دارد. می‌توانید برنامه‌های تمرینی عمومی را به صورت رایگان استفاده کنید، اما برای دسترسی به امکانات پیشرفته مانند برنامه‌های غذایی شخصی‌سازی شده و مربی هوش مصنوعی، نیاز به خرید اشتراک دارید."
  },
  {
    category: "ai",
    question: "چطور با مربی هوش مصنوعی ارتباط بگیرم؟",
    answer: "پس از خرید اشتراک Ultimate، در بخش پروفایل، گزینه «مربی هوشمند» را مشاهده خواهید کرد. با انتخاب آن می‌توانید سؤالات خود را بپرسید و راهنمایی‌های لازم را دریافت کنید. مربی هوش مصنوعی ما ۲۴ ساعته آماده پاسخگویی به سؤالات شماست."
  },
  {
    category: "training",
    question: "برنامه تمرینی هوشمند چگونه کار می‌کند؟",
    answer: "برنامه تمرینی هوشمند LiftLegends با استفاده از هوش مصنوعی و بر اساس اطلاعاتی که شما وارد می‌کنید (مانند سن، وزن، قد، سطح تجربه، اهداف بدنسازی و محدودیت‌های جسمی) یک برنامه کاملاً شخصی‌سازی شده برای شما طراحی می‌کند. این برنامه شامل تمرینات مناسب، تعداد ست‌ها، تکرارها و استراحت بین ست‌ها است و به مرور زمان با پیشرفت شما تغییر می‌کند."
  },
  {
    category: "training",
    question: "آیا برنامه‌های تمرینی قابل شخصی‌سازی هستند؟",
    answer: "بله، در اشتراک‌های Pro و Ultimate، برنامه‌های تمرینی کاملاً بر اساس هدف، سطح تجربه، تجهیزات در دسترس و محدودیت‌های جسمی شما شخصی‌سازی می‌شوند. هوش مصنوعی ما با تحلیل داده‌های شما، بهترین برنامه را برای رسیدن به اهداف بدنسازی شما طراحی می‌کند."
  },
  {
    category: "diet",
    question: "چطور می‌توانم برنامه غذایی دریافت کنم؟",
    answer: "با خرید اشتراک Pro یا Ultimate، پس از تکمیل فرم اطلاعات بدنی و پاسخ به سؤالات مربوط به ترجیحات غذایی، برنامه غذایی شخصی خود را دریافت خواهید کرد. این برنامه شامل وعده‌های غذایی روزانه، میزان کالری، پروتئین، کربوهیدرات و چربی مورد نیاز شما و همچنین توصیه‌های مکمل خواهد بود."
  },
  {
    category: "supplement",
    question: "برنامه مکمل و استرویید چه ویژگی‌هایی دارد؟",
    answer: "بخش برنامه مکمل و استرویید LiftLegends به شما مشاوره تخصصی در مورد انواع مکمل‌ها و استروییدهای مناسب برای اهداف بدنسازی شما ارائه می‌دهد. این برنامه شامل دوزهای پیشنهادی، زمان‌بندی مصرف، چرخه‌های استرویید و نکات ایمنی است. همچنین اطلاعات جامعی درباره عوارض جانبی احتمالی و روش‌های کاهش آن‌ها در اختیار شما قرار می‌گیرد."
  },
  {
    category: "general",
    question: "آیا می‌توانم اشتراک خود را لغو کنم؟",
    answer: "بله، در هر زمان می‌توانید از بخش تنظیمات حساب کاربری، اشتراک خود را لغو کنید. در این صورت، تا پایان دوره پرداخت‌شده، به امکانات اشتراک دسترسی خواهید داشت. هیچ هزینه اضافی برای لغو اشتراک دریافت نمی‌شود."
  },
  {
    category: "general",
    question: "آیا LiftLegends برای افراد مبتدی مناسب است؟",
    answer: "کاملاً! برنامه برای همه سطوح از مبتدی تا حرفه‌ای طراحی شده است. برای افراد تازه‌کار، ویدیوهای آموزشی دقیق و نکات ایمنی برای هر حرکت ارائه می‌شود. همچنین برنامه‌های تمرینی مخصوص مبتدیان با شدت مناسب و پیشرفت تدریجی طراحی شده‌اند."
  },
  {
    category: "app",
    question: "آیا می‌توانم پیشرفت خود را پیگیری کنم؟",
    answer: "بله، LiftLegends دارای بخش پیگیری پیشرفت است که به شما امکان می‌دهد وزن، اندازه‌های بدن، رکوردهای تمرینی و تصاویر قبل و بعد خود را ثبت و مقایسه کنید. همچنین نمودارهای تعاملی برای مشاهده روند پیشرفت در طول زمان ارائه می‌شود."
  },
  {
    category: "app",
    question: "آیا برنامه به صورت آفلاین هم کار می‌کند؟",
    answer: "بله، بخش‌های اصلی برنامه مانند مشاهده برنامه‌های تمرینی و غذایی، ثبت تمرینات و مشاهده آموزش‌ها به صورت آفلاین در دسترس هستند. البته برای دریافت برنامه‌های جدید و استفاده از مربی هوش مصنوعی، نیاز به اتصال اینترنت دارید."
  },
  {
    category: "ai",
    question: "هوش مصنوعی چگونه به بهبود تمرینات من کمک می‌کند؟",
    answer: "هوش مصنوعی LiftLegends با تحلیل داده‌های تمرینی شما، الگوهای پیشرفت و رکوردهای ثبت شده، نقاط قوت و ضعف شما را شناسایی می‌کند. سپس برنامه تمرینی را به گونه‌ای تنظیم می‌کند که بر نقاط ضعف تمرکز بیشتری داشته باشد و از بروز آسیب‌دیدگی جلوگیری کند. همچنین با توجه به میزان پیشرفت شما، شدت تمرینات را به طور هوشمند تنظیم می‌کند."
  },
  {
    category: "supplement",
    question: "آیا مشاوره استرویید در برنامه قانونی است؟",
    answer: "LiftLegends تنها اطلاعات آموزشی و علمی درباره انواع مکمل‌ها و استروییدها ارائه می‌دهد. استفاده از این اطلاعات بر عهده کاربر است و باید مطابق با قوانین کشور محل سکونت خود عمل کند. ما همواره توصیه می‌کنیم قبل از استفاده از هرگونه مکمل یا استرویید با پزشک متخصص مشورت کنید."
  }
];

// FAQ categories for better organization
const faqCategories = [
  { id: "all", name: "همه", icon: <HelpCircle size={18} /> },
  { id: "training", name: "برنامه تمرینی", icon: <Dumbbell size={18} /> },
  { id: "diet", name: "رژیم غذایی", icon: <Utensils size={18} /> },
  { id: "supplement", name: "مکمل و استرویید", icon: <Shield size={18} /> },
  { id: "ai", name: "هوش مصنوعی", icon: <Brain size={18} /> },
  { id: "app", name: "اپلیکیشن", icon: <Download size={18} /> },
  { id: "general", name: "عمومی", icon: <User size={18} /> }
];

const FaqSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="py-20 px-4 bg-black relative">
      <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 bg-gold-500 rounded-full blur-[120px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 right-1/4 w-48 h-48 bg-gold-400 rounded-full blur-[100px] opacity-5"></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-gold-500/10 text-gold-400 text-sm px-4 py-1.5 rounded-full border border-gold-500/20 mb-4">
            پاسخ به سوالات شما
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">سوالات متداول</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            پاسخ سوالات رایج شما درباره <span className="text-gold-400">برنامه تمرینی هوشمند</span>، <span className="text-gold-400">برنامه غذایی</span> و <span className="text-gold-400">برنامه مکمل و استرویید</span>
          </p>
        </div>

        {/* FAQ category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 overflow-x-auto pb-2">
          {faqCategories.map((category) => (
            <button 
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full border transition-all flex items-center gap-2 ${
                activeCategory === category.id 
                  ? "bg-gold-500/20 text-gold-400 border-gold-500/40" 
                  : "bg-gray-800/50 text-white/80 border-white/10 hover:border-gold-500/30 hover:text-gold-400"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/10 hover:border-gold-500/20 transition-all overflow-hidden group shadow-sm hover:shadow-[0_0_15px_rgba(255,215,0,0.1)]"
            >
              <AccordionTrigger className="px-6 py-4 hover:text-gold-400 transition-colors font-medium text-right group-hover:bg-gray-800/30">
                <div className="flex items-center gap-2">
                  {faq.category === "training" && <Dumbbell size={16} className="text-gold-500" />}
                  {faq.category === "diet" && <Utensils size={16} className="text-gold-500" />}
                  {faq.category === "supplement" && <Shield size={16} className="text-gold-500" />}
                  {faq.category === "ai" && <Brain size={16} className="text-gold-500" />}
                  {faq.category === "app" && <Download size={16} className="text-gold-500" />}
                  {faq.category === "general" && <User size={16} className="text-gold-500" />}
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-white/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* Additional help section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-gold-500/20 text-center relative overflow-hidden group hover:border-gold-500/30 transition-all">
          <div className="absolute -z-10 top-0 right-0 w-48 h-48 bg-gold-500 rounded-full blur-[100px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          
          <h3 className="text-xl font-semibold mb-4 text-white">هنوز سوالی دارید؟</h3>
          <p className="text-white/70 mb-6">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شما درباره <span className="text-gold-400">برنامه هوشمند تمرینی</span> و <span className="text-gold-400">هوش مصنوعی</span> هستند
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:support@liftlegends.ir" 
              className="bg-gray-800 hover:bg-gold-500/20 text-white hover:text-gold-400 px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2 border border-transparent hover:border-gold-500/30"
            >
              <MessageCircle size={18} />
              تماس با پشتیبانی
            </a>
            <a 
              href="#" 
              className="bg-gray-800 hover:bg-gold-500/20 text-white hover:text-gold-400 px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2 border border-transparent hover:border-gold-500/30"
            >
              <Download size={18} />
              دانلود راهنمای کامل
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
