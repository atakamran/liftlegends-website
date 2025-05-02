
const testimonials = [
  {
    name: "علی محمدی",
    role: "مربی بدنسازی",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,1",
    text: "به عنوان یک مربی بدنسازی، LiftLegends رو به تمام مشتری‌هام پیشنهاد می‌کنم. برنامه‌های تمرینی فوق‌العاده و مشاوره هوش مصنوعی واقعا کاربردیه."
  },
  {
    name: "سارا احمدی",
    role: "کاربر تازه‌کار",
    image: "https://source.unsplash.com/random/100x100/?woman,portrait,1",
    text: "من هیچوقت تجربه بدنسازی نداشتم، اما LiftLegends همه چیز رو ساده کرد. الان سه ماهه استفاده می‌کنم و نتایج باورنکردنی هستند!"
  },
  {
    name: "محمد رضایی",
    role: "بدنساز حرفه‌ای",
    image: "https://source.unsplash.com/random/100x100/?man,portrait,2",
    text: "مشاوره استروئید در پلن Ultimate واقعا عالیه. به من کمک کرد با کمترین عوارض جانبی، به اهداف بدنسازیم برسم. این اپ فراتر از انتظاراتم بود."
  }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 group">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <svg className="w-8 h-8 text-gold-500/80" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
                  </svg>
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
