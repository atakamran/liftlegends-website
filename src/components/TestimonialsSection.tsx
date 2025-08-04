
import { useEffect, useState, useRef } from "react";
import { 
  Star, 
  Quote, 
  Shield, 
  Dumbbell, 
  Brain, 
  Utensils, 
  ChevronLeft, 
  ChevronRight, 
  Users as UsersIcon,
  ArrowDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "علی محمدی",
    role: "مربی بدنسازی",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,1",
    text: "به عنوان یک مربی بدنسازی، LiftLegends رو به تمام مشتری‌هام پیشنهاد می‌کنم. برنامه تمرینی هوشمند و مشاوره هوش مصنوعی واقعا کاربردیه.",
    rating: 5,
    date: "۲ مرداد ۱۴۰۳",
    highlight: "برنامه تمرینی هوشمند"
  },
  {
    name: "سارا احمدی",
    role: "کاربر تازه‌کار",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait,1",
    text: "من هیچوقت تجربه بدنسازی نداشتم، اما LiftLegends همه چیز رو ساده کرد. هوش مصنوعی اپ به من کمک کرد تا برنامه مناسب خودم رو پیدا کنم!",
    rating: 5,
    date: "۱۵ تیر ۱۴۰۳",
    highlight: "هوش مصنوعی"
  },
  {
    name: "محمد رضایی",
    role: "بدنساز حرفه‌ای",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,2",
    text: "برنامه مکمل و استرویید در پلن Ultimate واقعا عالیه. به من کمک کرد با برنامه غذایی مناسب، به اهداف بدنسازیم برسم. این اپ فراتر از انتظاراتم بود.",
    rating: 4,
    date: "۸ خرداد ۱۴۰۳",
    highlight: "برنامه مکمل و استرویید"
  },
  {
    name: "مریم حسینی",
    role: "مربی فیتنس",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait,2",
    text: "رابط کاربری عالی و برنامه‌های تمرینی هوشمند متنوع. به عنوان مربی فیتنس، از این اپلیکیشن برای پیگیری پیشرفت مراجعین استفاده می‌کنم.",
    rating: 5,
    date: "۲۰ اردیبهشت ۱۴۰۳",
    highlight: "برنامه‌های تمرینی هوشمند"
  },
  {
    name: "رضا کریمی",
    role: "کاربر با ۶ ماه تجربه",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,3",
    text: "بعد از ۶ ماه استفاده مداوم، می‌تونم بگم که این بهترین اپلیکیشن بدنسازی هست که تا حالا استفاده کردم. برنامه غذایی و تمرینی عالی داره.",
    rating: 5,
    date: "۵ تیر ۱۴۰۳",
    highlight: "برنامه غذایی"
  },
  {
    name: "نیلوفر محسنی",
    role: "متخصص تغذیه",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait,3",
    text: "برنامه‌های غذایی پیشنهادی اپلیکیشن از نظر علمی کاملاً صحیح و متناسب با اهداف کاربران هستند. به عنوان متخصص تغذیه تأییدش می‌کنم.",
    rating: 4,
    date: "۱۲ خرداد ۱۴۰۳",
    highlight: "برنامه‌های غذایی"
  }
];

// Stats for the app
const stats = [
  { 
    value: "+۱۰۰,۰۰۰", 
    label: "دانلود", 
    icon: <ArrowDown size={24} className="text-gold-500" />,
    bgClass: "bg-gradient-to-br from-gold-500/10 to-transparent"
  },
  { 
    value: "۴.۸", 
    label: "امتیاز در گوگل پلی", 
    icon: <Star size={24} className="text-gold-500" />,
    bgClass: "bg-gradient-to-br from-gold-500/10 to-transparent"
  },
  { 
    value: "+۵۰۰", 
    label: "برنامه تمرینی", 
    icon: <Dumbbell size={24} className="text-gold-500" />,
    bgClass: "bg-gradient-to-br from-gold-500/10 to-transparent"
  },
  { 
    value: "+۱۰۰۰", 
    label: "کاربر فعال روزانه", 
    icon: <UsersIcon size={24} className="text-gold-500" />,
    bgClass: "bg-gradient-to-br from-gold-500/10 to-transparent"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900 relative" ref={sectionRef}>
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 top-1/4 right-1/4 w-64 h-64 bg-gold-400 rounded-full blur-[120px] opacity-5"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block bg-gold-500/10 text-gold-400 text-sm px-4 py-1.5 rounded-full border border-gold-500/20 mb-4">
            تجربه کاربران
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">نظرات کاربران LiftLegends</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            ببینید دیگران درباره تجربه خود با <span className="text-gold-400">برنامه تمرینی هوشمند</span> و <span className="text-gold-400">برنامه مکمل و استرویید</span> چه می‌گویند
          </p>
        </div>

        {/* Stats section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.bgClass} p-6 rounded-xl border border-gold-500/10 hover:border-gold-500/30 text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:-translate-y-1`}
            >
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gold-400 mb-2">{stat.value}</div>
              <div className="text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured testimonial */}
        <div className={`mb-20 bg-gradient-to-br from-gray-900 to-black p-8 md:p-10 rounded-2xl border border-gold-500/20 relative overflow-hidden group hover:border-gold-500/30 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "400ms" }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 rounded-full blur-[80px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-400 rounded-full blur-[60px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          
          <div className="absolute top-8 right-8 text-gold-500/20 group-hover:text-gold-500/30 transition-colors">
            <Quote size={80} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/30 to-transparent rounded-full opacity-70 transform scale-[1.15] animate-pulse"></div>
                <img 
                  src="https://source.unsplash.com/random/300x300/?fitness,trainer" 
                  alt="امیر حسینی، قهرمان پرورش اندام کشوری و کاربر Lift Legends"
                  className="w-48 h-48 object-cover rounded-full border-4 border-gold-500/30 group-hover:border-gold-500/50 transition-colors"
                  loading="lazy"
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
                "من به عنوان یک مربی بدنسازی با ۱۰ سال سابقه، LiftLegends را بهترین اپلیکیشن در زمینه بدنسازی می‌دانم. <span className="text-gold-400">هوش مصنوعی</span> استفاده شده در این اپلیکیشن به طور دقیق نیازهای هر فرد را تشخیص می‌دهد و <span className="text-gold-400">برنامه‌های تمرینی</span> و <span className="text-gold-400">برنامه مکمل و استرویید</span> کاملاً شخصی‌سازی شده ارائه می‌دهد."
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

        {/* Testimonials carousel */}
        <div className={`relative mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "600ms" }}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold text-white">تجربه کاربران واقعی</h3>
            <div className="flex gap-2">
              <button 
                onClick={prevTestimonial}
                className="bg-gray-800 hover:bg-gold-500/20 text-white hover:text-gold-400 p-2 rounded-full transition-all border border-white/10 hover:border-gold-500/30"
                aria-label="Previous testimonial"
              >
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={nextTestimonial}
                className="bg-gray-800 hover:bg-gold-500/20 text-white hover:text-gold-400 p-2 rounded-full transition-all border border-white/10 hover:border-gold-500/30"
                aria-label="Next testimonial"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(${activeIndex * 100 / 3}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="min-w-full md:min-w-[33.333%] px-3"
                >
                  <div className="h-full bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-gold-500/30 transition-all duration-300 group shadow-md hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]">
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
                      
                      <p className="text-white/80 mb-6 flex-grow">
                        {testimonial.text.replace(testimonial.highlight, `<span class="text-gold-400">${testimonial.highlight}</span>`)}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-auto group-hover:scale-105 transition-transform">
                        <img 
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/50"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="font-medium text-white group-hover:text-gold-400 transition-colors">{testimonial.name}</h4>
                          <p className="text-white/60 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? "bg-gold-500 w-6" 
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "800ms" }}>
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-gold-500/30 transition-all duration-300 group flex items-start gap-4">
            <div className="bg-gold-500/10 p-3 rounded-lg">
              <Dumbbell size={24} className="text-gold-500" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors mb-2">برنامه تمرینی هوشمند</h4>
              <p className="text-white/70 text-sm">برنامه‌های تمرینی شخصی‌سازی شده با هوش مصنوعی برای رسیدن به اهداف بدنسازی</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-gold-500/30 transition-all duration-300 group flex items-start gap-4">
            <div className="bg-gold-500/10 p-3 rounded-lg">
              <Shield size={24} className="text-gold-500" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors mb-2">برنامه مکمل و استرویید</h4>
              <p className="text-white/70 text-sm">مشاوره تخصصی در زمینه مکمل‌ها و استروییدها برای بهبود عملکرد</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-gold-500/30 transition-all duration-300 group flex items-start gap-4">
            <div className="bg-gold-500/10 p-3 rounded-lg">
              <Brain size={24} className="text-gold-500" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors mb-2">هوش مصنوعی</h4>
              <p className="text-white/70 text-sm">استفاده از فناوری هوش مصنوعی برای ارائه برنامه‌های شخصی‌سازی شده</p>
            </div>
          </div>
        </div>
        
        {/* App store badges */}
        <div className={`mt-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "1000ms" }}>
          <h3 className="text-2xl font-semibold text-white mb-4">LiftLegends را همین امروز دانلود کنید</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            با دانلود اپلیکیشن LiftLegends، به <span className="text-gold-400">برنامه تمرینی هوشمند</span>، <span className="text-gold-400">برنامه غذایی</span> و <span className="text-gold-400">برنامه مکمل و استرویید</span> دسترسی پیدا کنید
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/download">
              <Button className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-black font-medium px-8 py-4 text-lg rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]">
                <Download size={20} className="ml-2" />
                دانلود اپلیکیشن
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add missing icon component
const Download = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const Users = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default TestimonialsSection;
