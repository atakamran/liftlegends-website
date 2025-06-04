
import { useState } from "react";
import FooterSection from "@/components/FooterSection";
import CoachApplicationForm from "@/components/coach/CoachApplicationForm";

const CoachApplication = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 relative">
        <div className="absolute -z-10 top-20 right-20 w-64 h-64 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="text-gradient">همکاری به عنوان مربی</span>
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto">
            به تیم مربیان LiftLegends بپیوندید و در توسعه برنامه‌های تمرینی، تغذیه‌ای و مکمل همکاری کنید.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - About coaching with us */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">چرا به عنوان مربی با ما همکاری کنید؟</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">مزایای همکاری</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">دسترسی به پلتفرم پیشرفته و هوشمند</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">درآمد از فروش برنامه‌های تمرینی و تغذیه‌ای</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">امکان تولید محتوا و انتشار مقالات تخصصی</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">برندسازی شخصی و معرفی به جامعه ورزشی</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">همکاری با تیمی حرفه‌ای و با انگیزه</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">شرایط همکاری</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  برای پیوستن به تیم مربیان LiftLegends، باید شرایط زیر را داشته باشید:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">حداقل یک سال تجربه در زمینه تخصصی خود</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">داشتن مدارک معتبر در زمینه ورزشی یا تغذیه</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">آشنایی با اصول علمی تمرین و تغذیه</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">تعهد به تولید محتوای با کیفیت</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-3">زمینه‌های همکاری</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">طراحی برنامه‌های تمرینی بدنسازی و فیتنس</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">ارائه رژیم‌های غذایی و برنامه‌های تغذیه</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">مشاوره در زمینه مکمل‌های ورزشی</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold-500 mt-1">•</span>
                    <span className="text-white/70">نگارش مقالات تخصصی در زمینه تمرین و تغذیه</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right column - Application form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gold-500">فرم درخواست همکاری</h2>
            <CoachApplicationForm />
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

export default CoachApplication;
