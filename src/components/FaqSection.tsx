
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Download, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "آیا برنامه رایگان است؟",
    answer: "بله، LiftLegends یک نسخه رایگان با امکانات پایه دارد. می‌توانید برنامه‌های تمرینی عمومی را به صورت رایگان استفاده کنید، اما برای دسترسی به امکانات پیشرفته مانند برنامه‌های غذایی شخصی‌سازی شده و مربی هوش مصنوعی، نیاز به خرید اشتراک دارید."
  },
  {
    question: "چطور با مربی هوش مصنوعی ارتباط بگیرم؟",
    answer: "پس از خرید اشتراک Ultimate، در بخش پروفایل، گزینه «مربی هوشمند» را مشاهده خواهید کرد. با انتخاب آن می‌توانید سؤالات خود را بپرسید و راهنمایی‌های لازم را دریافت کنید. مربی هوش مصنوعی ما ۲۴ ساعته آماده پاسخگویی به سؤالات شماست."
  },
  {
    question: "آیا برنامه‌های تمرینی قابل شخصی‌سازی هستند؟",
    answer: "بله، در اشتراک‌های Pro و Ultimate، برنامه‌های تمرینی کاملاً بر اساس هدف، سطح تجربه، تجهیزات در دسترس و محدودیت‌های جسمی شما شخصی‌سازی می‌شوند. هوش مصنوعی ما با تحلیل داده‌های شما، بهترین برنامه را برای رسیدن به اهداف بدنسازی شما طراحی می‌کند."
  },
  {
    question: "چطور می‌توانم برنامه غذایی دریافت کنم؟",
    answer: "با خرید اشتراک Pro یا Ultimate، پس از تکمیل فرم اطلاعات بدنی و پاسخ به سؤالات مربوط به ترجیحات غذایی، برنامه غذایی شخصی خود را دریافت خواهید کرد. این برنامه شامل وعده‌های غذایی روزانه، میزان کالری، پروتئین، کربوهیدرات و چربی مورد نیاز شما و همچنین توصیه‌های مکمل خواهد بود."
  },
  {
    question: "آیا می‌توانم اشتراک خود را لغو کنم؟",
    answer: "بله، در هر زمان می‌توانید از بخش تنظیمات حساب کاربری، اشتراک خود را لغو کنید. در این صورت، تا پایان دوره پرداخت‌شده، به امکانات اشتراک دسترسی خواهید داشت. هیچ هزینه اضافی برای لغو اشتراک دریافت نمی‌شود."
  },
  {
    question: "آیا LiftLegends برای افراد مبتدی مناسب است؟",
    answer: "کاملاً! برنامه برای همه سطوح از مبتدی تا حرفه‌ای طراحی شده است. برای افراد تازه‌کار، ویدیوهای آموزشی دقیق و نکات ایمنی برای هر حرکت ارائه می‌شود. همچنین برنامه‌های تمرینی مخصوص مبتدیان با شدت مناسب و پیشرفت تدریجی طراحی شده‌اند."
  },
  {
    question: "آیا می‌توانم پیشرفت خود را پیگیری کنم؟",
    answer: "بله، LiftLegends دارای بخش پیگیری پیشرفت است که به شما امکان می‌دهد وزن، اندازه‌های بدن، رکوردهای تمرینی و تصاویر قبل و بعد خود را ثبت و مقایسه کنید. همچنین نمودارهای تعاملی برای مشاهده روند پیشرفت در طول زمان ارائه می‌شود."
  },
  {
    question: "آیا برنامه به صورت آفلاین هم کار می‌کند؟",
    answer: "بله، بخش‌های اصلی برنامه مانند مشاهده برنامه‌های تمرینی و غذایی، ثبت تمرینات و مشاهده آموزش‌ها به صورت آفلاین در دسترس هستند. البته برای دریافت برنامه‌های جدید و استفاده از مربی هوش مصنوعی، نیاز به اتصال اینترنت دارید."
  }
];

// FAQ categories for better organization
const faqCategories = [
  { id: "general", name: "عمومی", icon: <HelpCircle size={18} /> },
  { id: "app", name: "اپلیکیشن", icon: <Download size={18} /> },
  { id: "support", name: "پشتیبانی", icon: <MessageCircle size={18} /> }
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-20 px-4 bg-black relative">
      <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 bg-gold-500 rounded-full blur-[120px] opacity-5"></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">سوالات متداول</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            پاسخ سوالات رایج شما درباره LiftLegends
          </p>
        </div>

        {/* FAQ category tabs - for visual enhancement */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {faqCategories.map((category) => (
            <button 
              key={category.id}
              className="bg-gray-800/50 hover:bg-gray-700/50 px-5 py-2 rounded-full border border-white/10 hover:border-gold-500/30 transition-all flex items-center gap-2 text-white/80 hover:text-gold-400"
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gray-900/80 rounded-xl border border-white/10 hover:border-gold-500/20 transition-all overflow-hidden group"
            >
              <AccordionTrigger className="px-6 py-4 hover:text-gold-400 transition-colors font-medium text-right group-hover:bg-gray-800/30">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-white/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* Additional help section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-gold-500/20 text-center">
          <h3 className="text-xl font-semibold mb-4 text-white">هنوز سوالی دارید؟</h3>
          <p className="text-white/70 mb-6">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شما هستند
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:support@liftlegends.ir" 
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              تماس با پشتیبانی
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
