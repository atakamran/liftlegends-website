import FooterSection from "@/components/FooterSection";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-10 relative">
        <div className="absolute -z-10 top-20 right-20 w-64 h-64 bg-gold-500 rounded-full blur-[150px] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            <span className="text-gradient">شرایط استفاده</span>
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto">
            لطفاً قبل از استفاده از اپلیکیشن و خدمات LiftLegends، این شرایط را با دقت مطالعه کنید.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">پذیرش شرایط</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                با دسترسی یا استفاده از اپلیکیشن LiftLegends، شما موافقت می‌کنید که از این شرایط استفاده پیروی کنید. اگر با این شرایط موافق نیستید، لطفاً از استفاده از اپلیکیشن و خدمات ما خودداری کنید. ما حق تغییر این شرایط را در هر زمان حفظ می‌کنیم و استفاده مداوم شما از اپلیکیشن پس از انتشار تغییرات، به معنای پذیرش شرایط جدید است.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">حساب کاربری</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                برای استفاده از برخی ویژگی‌های اپلیکیشن، ممکن است نیاز به ایجاد یک حساب کاربری داشته باشید. شما مسئول موارد زیر هستید:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70">
                <li>حفظ محرمانگی اطلاعات حساب کاربری خود</li>
                <li>محدود کردن دسترسی به دستگاه خود</li>
                <li>مسئولیت تمام فعالیت‌هایی که تحت حساب کاربری شما انجام می‌شود</li>
                <li>اطلاع‌رسانی فوری به ما در صورت استفاده غیرمجاز از حساب کاربری شما</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">استفاده مجاز</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                شما موافقت می‌کنید که از اپلیکیشن و خدمات ما فقط برای اهداف قانونی و مطابق با این شرایط استفاده کنید. شما نباید:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70">
                <li>نقض هرگونه قانون یا مقررات قابل اجرا</li>
                <li>نقض حقوق مالکیت معنوی ما یا اشخاص ثالث</li>
                <li>ارسال هرگونه محتوای غیرقانونی، توهین‌آمیز، تهدیدآمیز یا مضر</li>
                <li>تلاش برای دسترسی غیرمجاز به سیستم‌ها یا شبکه‌های مرتبط با اپلیکیشن</li>
                <li>جمع‌آوری یا ذخیره اطلاعات شخصی سایر کاربران بدون اجازه آنها</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">مالکیت معنوی</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                اپلیکیشن LiftLegends و تمام محتوا، ویژگی‌ها و عملکردهای آن، از جمله اما نه محدود به متن، گرافیک، لوگو، آیکون‌ها، تصاویر، کلیپ‌های صوتی، دانلودها، رابط‌های کاربری و کدها، متعلق به ما یا لایسنس‌دهندگان ما است و توسط قوانین مالکیت معنوی محافظت می‌شود. هرگونه استفاده، کپی، تغییر، توزیع یا بازتولید هر بخشی از اپلیکیشن بدون اجازه کتبی ما ممنوع است.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">محدودیت مسئولیت</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                اپلیکیشن LiftLegends "همانطور که هست" و "به صورت در دسترس" ارائه می‌شود، بدون هیچ گونه ضمانت صریح یا ضمنی. ما مسئولیتی در قبال هرگونه آسیب مستقیم، غیرمستقیم، تصادفی، خاص یا تبعی ناشی از استفاده یا عدم توانایی استفاده از اپلیکیشن نداریم. توصیه‌های تمرینی و تغذیه‌ای ارائه شده در اپلیکیشن جایگزین مشاوره پزشکی حرفه‌ای نیست و قبل از شروع هر برنامه تمرینی یا رژیم غذایی جدید، باید با پزشک خود مشورت کنید.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">فسخ</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                ما می‌توانیم دسترسی شما به اپلیکیشن را در صورت نقض این شرایط یا به هر دلیل دیگری، به صلاحدید خود و بدون اطلاع قبلی، محدود، تعلیق یا فسخ کنیم. همچنین، شما می‌توانید استفاده از اپلیکیشن را در هر زمان متوقف کنید و حساب کاربری خود را حذف نمایید.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">قانون حاکم</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed">
                این شرایط استفاده تحت قوانین جمهوری اسلامی ایران اداره و تفسیر می‌شود. هرگونه اختلاف ناشی از یا در ارتباط با این شرایط، ابتدا از طریق مذاکره دوستانه حل و فصل خواهد شد و در صورت عدم توافق، به دادگاه‌های صالح ارجاع داده خواهد شد.
              </p>
            </div>
          </section>

          {/* Contact section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gold-500">تماس با ما</h2>
            <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
              <p className="text-white/80 leading-relaxed mb-4">
                اگر سوالی در مورد شرایط استفاده ما دارید، لطفاً با ما تماس بگیرید:
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

export default TermsOfUse;