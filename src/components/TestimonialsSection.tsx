
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "علی محمدی",
    role: "مربی بدنسازی",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,1",
    text: "به عنوان یک مربی بدنسازی، LiftLegends رو به تمام مشتری‌هام پیشنهاد می‌کنم. برنامه‌های تمرینی فوق‌العاده و مشاوره هوش مصنوعی واقعا کاربردیه.",
    rating: 5,
    date: "۲ مرداد ۱۴۰۳"
  },
  {
    name: "سارا احمدی",
    role: "کاربر تازه‌کار",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait,1",
    text: "من هیچوقت تجربه بدنسازی نداشتم، اما LiftLegends همه چیز رو ساده کرد. الان سه ماهه استفاده می‌کنم و نتایج باورنکردنی هستند!",
    rating: 5,
    date: "۱۵ تیر ۱۴۰۳"
  },
  {
    name: "محمد رضایی",
    role: "بدنساز حرفه‌ای",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,2",
    text: "مشاوره تغذیه در پلن Ultimate واقعا عالیه. به من کمک کرد با برنامه غذایی مناسب، به اهداف بدنسازیم برسم. این اپ فراتر از انتظاراتم بود.",
    rating: 4,
    date: "۸ خرداد ۱۴۰۳"
  },
  {
    name: "مریم حسینی",
    role: "مربی فیتنس",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait,2",
    text: "رابط کاربری عالی و برنامه‌های تمرینی متنوع. به عنوان مربی فیتنس، از این اپلیکیشن برای پیگیری پیشرفت مراجعین استفاده می‌کنم.",
    rating: 5,
    date: "۲۰ اردیبهشت ۱۴۰۳"
  },
  {
    name: "رضا کریمی",
    role: "کاربر با ۶ ماه تجربه",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,3",
    text: "بعد از ۶ ماه استفاده مداوم، می‌تونم بگم که این بهترین اپلیکیشن بدنسازی هست که تا حالا استفاده کردم. پیشرفتم قابل توجه بوده.",
    rating: 5,
    date: "۵ تیر ۱۴۰۳"
  },
  {
    name: "نیلوفر محسنی",
    role: "متخصص تغذیه",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait,3",
    text: "برنامه‌های غذایی پیشنهادی اپلیکیشن از نظر علمی کاملاً صحیح و متناسب با اهداف کاربران هستند. به عنوان متخصص تغذیه تأییدش می‌کنم.",
    rating: 4,
    date: "۱۲ خرداد ۱۴۰۳"
  }
];

// Stats for the app
const stats = [
  { value: "+۱۰۰,۰۰۰", label: "دانلود" },
  { value: "۴.۸", label: "امتیاز در گوگل پلی" },
  { value: "+۵۰۰", label: "برنامه تمرینی" },
  { value: "+۱۰۰۰", label: "کاربر فعال روزانه" }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-900 relative">
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">نظرات کاربران</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            ببینید دیگران درباره تجربه خود با LiftLegends چه می‌گویند
          </p>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/30 p-6 rounded-xl border border-white/5 text-center">
              <div className="text-3xl font-bold text-gold-400 mb-2">{stat.value}</div>
              <div className="text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured testimonial */}
        <div className="mb-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gold-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 rounded-full blur-[80px] opacity-5"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/30 to-transparent rounded-full opacity-70 transform scale-[1.15]"></div>
                <img 
                  src="https://source.unsplash.com/random/300x300/?fitness,trainer" 
                  alt="Featured testimonial" 
                  className="w-48 h-48 object-cover rounded-full border-4 border-gold-500/30"
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={20} className="text-gold-500 fill-gold-500" />
                ))}
              </div>
              
              <p className="text-white/90 text-lg mb-6 leading-relaxed">
                "من به عنوان یک مربی بدنسازی با ۱۰ سال سابقه، LiftLegends را بهترین اپلیکیشن در زمینه بدنسازی می‌دانم. هوش مصنوعی استفاده شده در این اپلیکیشن به طور دقیق نیازهای هر فرد را تشخیص می‌دهد و برنامه‌های تمرینی و غذایی کاملاً شخصی‌سازی شده ارائه می‌دهد."
              </p>
              
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-medium text-white text-lg">امیر حسینی</h4>
                  <p className="text-white/60">قهرمان پرورش اندام کشوری</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 group">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < testimonial.rating ? "text-gold-500 fill-gold-500" : "text-gray-600"} 
                      />
                    ))}
                  </div>
                  <span className="text-white/40 text-sm">{testimonial.date}</span>
                </div>
                
                <p className="text-white/80 mb-6 flex-grow">{testimonial.text}</p>
                
                <div className="flex items-center gap-4 mt-auto group-hover:scale-105 transition-transform">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/50"
                  />
                  <div>
                    <h4 className="font-medium text-white group-hover:text-gold-400 transition-colors">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* App store badges */}
        <div className="mt-16 text-center">
          <p className="text-white/70 mb-6">LiftLegends را همین امروز دانلود کنید</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" className="inline-block transition-transform hover:scale-105">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-16" />
            </a>
            <a href="#" className="inline-block transition-transform hover:scale-105">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-16" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
