
import React from "react";
import { Link } from "react-router-dom";

const WhyWorkWithUs = () => {
  return (
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
        
        <div className="bg-gray-900 p-6 rounded-xl border border-white/5 mt-6">
          <h3 className="text-xl font-semibold mb-3 text-gold-500">همکاری به عنوان مربی</h3>
          <p className="text-white/80 mb-4">
            آیا مربی بدنسازی، متخصص تغذیه یا کارشناس مکمل‌های ورزشی هستید؟
          </p>
          <Link 
            to="/coach-application" 
            className="inline-block bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
          >
            درخواست همکاری به عنوان مربی
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WhyWorkWithUs;
