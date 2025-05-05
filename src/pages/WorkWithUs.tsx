import { useState } from "react";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

const WorkWithUs = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, position: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      message: "",
      resume: null,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 relative">
        <div className="absolute -z-10 top-20 right-20 w-64 h-64 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="text-gradient">همکاری با ما</span>
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto">
            به تیم LiftLegends بپیوندید و در ساخت آینده تناسب اندام و بدنسازی هوشمند سهیم باشید.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - About working with us */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">چرا با ما همکاری کنید؟</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">ماموریت ما</h3>
                <p className="text-white/80 leading-relaxed">
                  در LiftLegends، ما در حال ساخت آینده تناسب اندام و بدنسازی با استفاده از هوش مصنوعی هستیم. هدف ما ارائه راهکارهای شخصی‌سازی شده برای کمک به افراد در رسیدن به اهداف سلامتی و تناسب اندام خود است.
                </p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">فرهنگ کاری</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  ما به ایجاد محیطی پویا، خلاقانه و حمایتی برای تیم خود متعهد هستیم. ارزش‌های اصلی ما عبارتند از:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">نوآوری و خلاقیت در حل مسائل</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">همکاری و کار تیمی</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">یادگیری مداوم و رشد شخصی</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">تعادل بین کار و زندگی</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">مزایای همکاری</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">حقوق و مزایای رقابتی</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">امکان دورکاری و ساعات کاری انعطاف‌پذیر</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">فرصت‌های یادگیری و توسعه مهارت‌ها</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">کار با تکنولوژی‌های پیشرفته و به‌روز</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">محیط کاری دوستانه و پویا</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">موقعیت‌های شغلی</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">توسعه‌دهنده فرانت‌اند (React Native)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">توسعه‌دهنده بک‌اند (Node.js)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">متخصص هوش مصنوعی و یادگیری ماشین</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">طراح UI/UX</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">متخصص بازاریابی دیجیتال</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">مربی بدنسازی و متخصص تغذیه</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right column - Application form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">فرم درخواست همکاری</h2>
            
            {formSubmitted ? (
              <div className="bg-gray-900 p-8 rounded-xl border border-white/10 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 size={60} className="text-gold-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">درخواست شما با موفقیت ثبت شد!</h3>
                <p className="text-white/70 mb-6">
                  از علاقه شما به همکاری با تیم LiftLegends متشکریم. ما در اسرع وقت درخواست شما را بررسی کرده و با شما تماس خواهیم گرفت.
                </p>
                <Button 
                  onClick={() => setFormSubmitted(false)} 
                  className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
                >
                  ارسال درخواست جدید
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                      نام و نام خانوادگی *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                      ایمیل *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">
                      شماره تماس *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-white/80 mb-1">
                      موقعیت شغلی مورد نظر *
                    </label>
                    <Select onValueChange={handleSelectChange} required>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="انتخاب موقعیت شغلی" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="frontend">توسعه‌دهنده فرانت‌اند</SelectItem>
                        <SelectItem value="backend">توسعه‌دهنده بک‌اند</SelectItem>
                        <SelectItem value="ai">متخصص هوش مصنوعی</SelectItem>
                        <SelectItem value="ui-ux">طراح UI/UX</SelectItem>
                        <SelectItem value="marketing">متخصص بازاریابی دیجیتال</SelectItem>
                        <SelectItem value="fitness">مربی بدنسازی و متخصص تغذیه</SelectItem>
                        <SelectItem value="other">سایر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-white/80 mb-1">
                      سابقه کاری (سال) *
                    </label>
                    <Input
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
                      پیام / توضیحات
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-white/80 mb-1">
                      آپلود رزومه (PDF) *
                    </label>
                    <Input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
                    >
                      ارسال درخواست
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Back to home button */}
        <div className="mt-12 text-center">
          <a 
            href="/" 
            className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
          >
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default WorkWithUs;