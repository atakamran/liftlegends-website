
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "آیا برنامه رایگان است؟",
    answer: "بله، LiftLegends یک نسخه رایگان با امکانات محدود دارد. می‌توانید برنامه‌های تمرینی عمومی را به صورت رایگان استفاده کنید، اما برای دسترسی به امکانات کامل مانند برنامه‌های غذایی و مربی AI، نیاز به خرید اشتراک دارید."
  },
  {
    question: "چطور با مربی هوش مصنوعی ارتباط بگیرم؟",
    answer: "پس از خرید اشتراک Ultimate، در بخش پروفایل، گزینه «مربی هوشمند» را مشاهده خواهید کرد. با انتخاب آن می‌توانید سؤالات خود را بپرسید و راهنمایی‌های لازم را دریافت کنید."
  },
  {
    question: "آیا برنامه‌های تمرینی قابل شخصی‌سازی هستند؟",
    answer: "بله، در اشتراک‌های Pro و Ultimate، برنامه‌های تمرینی بر اساس هدف، سطح تجربه، تجهیزات در دسترس و محدودیت‌های جسمی شما شخصی‌سازی می‌شوند."
  },
  {
    question: "چطور می‌توانم برنامه غذایی دریافت کنم؟",
    answer: "با خرید اشتراک Pro یا Ultimate، پس از تکمیل فرم اطلاعات بدنی و پاسخ به سؤالات مربوط به ترجیحات غذایی، برنامه غذایی شخصی خود را دریافت خواهید کرد."
  },
  {
    question: "آیا می‌توانم اشتراک خود را لغو کنم؟",
    answer: "بله، در هر زمان می‌توانید از بخش تنظیمات حساب کاربری، اشتراک خود را لغو کنید. در این صورت، تا پایان دوره پرداخت‌شده، به امکانات اشتراک دسترسی خواهید داشت."
  },
  {
    question: "آیا LiftLegends برای افراد مبتدی مناسب است؟",
    answer: "کاملاً! برنامه برای همه سطوح از مبتدی تا حرفه‌ای طراحی شده است. برای افراد تازه‌کار، ویدیوهای آموزشی دقیق و نکات ایمنی برای هر حرکت ارائه می‌شود."
  }
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-20 px-4 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">سوالات متداول</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            پاسخ سوالات رایج شما درباره LiftLegends
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:text-gold-400 transition-colors font-medium text-right">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
