import FooterSection from "@/components/FooterSection";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 relative">
        <div className="absolute -z-10 top-20 right-20 w-64 h-64 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="text-gradient">حریم خصوصی</span>
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto">
            ما در LiftLegends به حریم خصوصی شما اهمیت می‌دهیم. این صفحه توضیح می‌دهد که چگونه اطلاعات شما را جمع‌آوری، استفاده و محافظت می‌کنیم.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">اطلاعات جمع‌آوری شده</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                ما ممکن است اطلاعات زیر را از شما جمع‌آوری کنیم:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70">
                <li>اطلاعات شخصی مانند نام، آدرس ایمیل و شماره تلفن</li>
                <li>اطلاعات پروفایل مانند سن، وزن، قد و اهداف تناسب اندام</li>
                <li>داده‌های تمرینی و فعالیت‌های بدنی</li>
                <li>اطلاعات دستگاه و استفاده از اپلیکیشن</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">نحوه استفاده از اطلاعات</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                ما از اطلاعات جمع‌آوری شده برای موارد زیر استفاده می‌کنیم:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70">
                <li>ارائه خدمات شخصی‌سازی شده برای تمرینات و برنامه‌های غذایی</li>
                <li>بهبود و توسعه اپلیکیشن و خدمات ما</li>
                <li>ارتباط با شما در مورد به‌روزرسانی‌ها، پیشنهادات و اطلاعیه‌ها</li>
                <li>تحلیل الگوهای استفاده و بهینه‌سازی تجربه کاربری</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">اشتراک‌گذاری اطلاعات</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                ما اطلاعات شما را با اشخاص ثالث به اشتراک نمی‌گذاریم، مگر در موارد زیر:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70">
                <li>با ارائه‌دهندگان خدمات که به ما در ارائه خدمات کمک می‌کنند</li>
                <li>در صورت الزام قانونی یا درخواست مقامات ذیصلاح</li>
                <li>برای محافظت از حقوق، اموال یا امنیت ما یا دیگران</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">امنیت داده‌ها</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                ما از اقدامات امنیتی مناسب برای محافظت از اطلاعات شما در برابر دسترسی غیرمجاز، تغییر، افشا یا تخریب استفاده می‌کنیم. این اقدامات شامل رمزگذاری داده‌ها، دسترسی محدود به اطلاعات شخصی و بررسی‌های امنیتی منظم است.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">حقوق شما</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                شما دارای حقوق زیر در رابطه با داده‌های شخصی خود هستید:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70">
                <li>دسترسی به داده‌های شخصی که ما از شما نگهداری می‌کنیم</li>
                <li>اصلاح یا به‌روزرسانی اطلاعات نادرست</li>
                <li>درخواست حذف داده‌های شخصی</li>
                <li>اعتراض به پردازش داده‌های شما در شرایط خاص</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">تغییرات در سیاست حریم خصوصی</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                ما ممکن است این سیاست حریم خصوصی را به‌روزرسانی کنیم. هرگونه تغییر از طریق اپلیکیشن یا وب‌سایت ما اطلاع‌رسانی خواهد شد. استفاده مداوم از خدمات ما پس از این تغییرات به معنای پذیرش سیاست‌های جدید است.
              </p>
            </div>
          </section>

          {/* Contact section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">تماس با ما</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                اگر سوالی در مورد سیاست حریم خصوصی ما دارید، لطفاً با ما تماس بگیرید:
              </p>
              <div className="text-white/70">
                <p>ایمیل: info@liftlegends.ir</p>
                <p>تلفن: 09148866040</p>
                <p>آدرس: تبریز</p>
              </div>
            </div>
          </section>
        </div>

        {/* Back to home button */}
        <div className="mt-12 text-center">
          <a 
            href="/" 
            className="inline-block bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
          >
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default PrivacyPolicy;