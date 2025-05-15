import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import FooterSection from "@/components/FooterSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Copy, Check, Dumbbell, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// مقالات بلاگ
const blogPosts = {
  "workout-plans-for-muscle-growth": {
    id: "workout-plans-for-muscle-growth",
    category: "تمرین و برنامه‌ریزی",
    icon: "💪",
    title: "بهترین برنامه‌های تمرینی برای افزایش حجم عضلات",
    description: "در این مقاله، بهترین برنامه‌های تمرینی برای افزایش حجم عضلات را بررسی می‌کنیم و نکات کلیدی برای موفقیت در بدنسازی را به شما آموزش می‌دهیم.",
    date: "۱۵ مرداد ۱۴۰۳",
    readTime: "۸ دقیقه",
    image: "https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg",
    content: `
      <h2>مقدمه</h2>
      <p>افزایش حجم عضلات یکی از اهداف اصلی بسیاری از ورزشکاران و علاقه‌مندان به بدنسازی است. برای رسیدن به این هدف، داشتن یک برنامه تمرینی مناسب و اصولی بسیار مهم است. در این مقاله، بهترین برنامه‌های تمرینی برای افزایش حجم عضلات را معرفی می‌کنیم و نکات کلیدی برای موفقیت در این مسیر را به شما آموزش می‌دهیم.</p>
      
      <h2>اصول اساسی هایپرتروفی (افزایش حجم عضلات)</h2>
      <p>قبل از معرفی برنامه‌های تمرینی، لازم است با اصول اساسی هایپرتروفی آشنا شوید:</p>
      <ul>
        <li><strong>اورلود پیشرونده:</strong> افزایش تدریجی وزنه یا مقاومت در طول زمان</li>
        <li><strong>حجم تمرینی مناسب:</strong> تعداد مناسب ست و تکرار برای تحریک رشد عضلات</li>
        <li><strong>تنوع تمرینی:</strong> استفاده از تمرینات متنوع برای تحریک فیبرهای عضلانی مختلف</li>
        <li><strong>استراحت کافی:</strong> دادن زمان کافی به عضلات برای ریکاوری و رشد</li>
        <li><strong>تغذیه مناسب:</strong> تأمین پروتئین و کالری کافی برای رشد عضلات</li>
      </ul>
      
      <h2>برنامه تمرینی پوش-پول-لگز (Push-Pull-Legs)</h2>
      <p>یکی از محبوب‌ترین و موثرترین برنامه‌های تمرینی برای افزایش حجم عضلات، برنامه پوش-پول-لگز است. این برنامه عضلات بدن را به سه گروه تقسیم می‌کند:</p>
      
      <h3>روز اول: تمرینات پوش (عضلات سینه، شانه و سه سر)</h3>
      <ul>
        <li>پرس سینه با هالتر: ۴ ست × ۸-۱۲ تکرار</li>
        <li>پرس سینه با دمبل روی نیمکت شیب‌دار: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>فلای سینه با دمبل: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>پرس شانه با هالتر: ۴ ست × ۸-۱۲ تکرار</li>
        <li>نشر جانب با دمبل: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>پشت بازو سیم‌کش: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>پشت بازو فرانسوی: ۳ ست × ۱۰-۱۲ تکرار</li>
      </ul>
      
      <h3>روز دوم: تمرینات پول (عضلات پشت و دو سر)</h3>
      <ul>
        <li>ددلیفت: ۴ ست × ۶-۱۰ تکرار</li>
        <li>زیر بغل لت: ۴ ست × ۸-۱۲ تکرار</li>
        <li>زیر بغل دمبل تک دست: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>زیر بغل سیم‌کش: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>جلو بازو هالتر: ۴ ست × ۸-۱۲ تکرار</li>
        <li>جلو بازو چکشی: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>جلو بازو سیم‌کش: ۳ ست × ۱۲-۱۵ تکرار</li>
      </ul>
      
      <h3>روز سوم: تمرینات لگز (عضلات پا و شکم)</h3>
      <ul>
        <li>اسکات با هالتر: ۴ ست × ۸-۱۲ تکرار</li>
        <li>پرس پا: ۴ ست × ۱۰-۱۲ تکرار</li>
        <li>هاک اسکات: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>جلو پا: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>پشت پا: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>ساق پا ایستاده: ۴ ست × ۱۵-۲۰ تکرار</li>
        <li>کرانچ: ۳ ست × ۱۵-۲۰ تکرار</li>
        <li>پلانک: ۳ ست × ۳۰-۶۰ ثانیه</li>
      </ul>
      
      <p>این برنامه را می‌توانید به صورت ۶ روز در هفته (با تکرار هر روز دو بار در هفته) یا ۳ روز در هفته اجرا کنید.</p>
      
      <h2>برنامه تمرینی آپر-لوور (Upper-Lower)</h2>
      <p>برنامه آپر-لوور بدن را به دو بخش بالاتنه و پایین‌تنه تقسیم می‌کند و برای کسانی که نمی‌توانند ۶ روز در هفته تمرین کنند، گزینه مناسبی است:</p>
      
      <h3>روز اول: بالاتنه</h3>
      <ul>
        <li>پرس سینه با هالتر: ۴ ست × ۸-۱۰ تکرار</li>
        <li>زیر بغل لت: ۴ ست × ۸-۱۰ تکرار</li>
        <li>پرس شانه با دمبل: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>زیر بغل سیم‌کش: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>جلو بازو هالتر: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>پشت بازو سیم‌کش: ۳ ست × ۱۰-۱۲ تکرار</li>
      </ul>
      
      <h3>روز دوم: پایین‌تنه</h3>
      <ul>
        <li>اسکات با هالتر: ۴ ست × ۸-۱۰ تکرار</li>
        <li>ددلیفت: ۴ ست × ۸-۱۰ تکرار</li>
        <li>پرس پا: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>جلو پا: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>پشت پا: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>ساق پا: ۴ ست × ۱۵-۲۰ تکرار</li>
        <li>کرانچ: ۳ ست × ۱۵-۲۰ تکرار</li>
      </ul>
      
      <h3>روز سوم: استراحت</h3>
      
      <h3>روز چهارم: بالاتنه (با تمرینات متفاوت)</h3>
      <ul>
        <li>پرس سینه با دمبل: ۴ ست × ۸-۱۰ تکرار</li>
        <li>زیر بغل دمبل تک دست: ۴ ست × ۸-۱۰ تکرار</li>
        <li>نشر جانب: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>قایقی با هالتر: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>جلو بازو لاری: ۳ ست × ۱۰-۱۲ تکرار</li>
        <li>پشت بازو فرانسوی: ۳ ست × ۱۰-۱۲ تکرار</li>
      </ul>
      
      <h3>روز پنجم: پایین‌تنه (با تمرینات متفاوت)</h3>
      <ul>
        <li>هاک اسکات: ۴ ست × ۸-۱۰ تکرار</li>
        <li>ددلیفت رومانیایی: ۴ ست × ۸-۱۰ تکرار</li>
        <li>لانگز: ۳ ست × ۱۰-۱۲ تکرار (هر پا)</li>
        <li>اکستنشن ران: ۳ ست × ۱۲-۱۵ تکرار</li>
        <li>ساق پا نشسته: ۴ ست × ۱۵-۲۰ تکرار</li>
        <li>پلانک جانبی: ۳ ست × ۳۰-۴۵ ثانیه (هر طرف)</li>
      </ul>
      
      <h2>نکات کلیدی برای موفقیت در برنامه تمرینی</h2>
      <ol>
        <li><strong>پیشرفت تدریجی:</strong> هر هفته سعی کنید وزنه‌ها را افزایش دهید یا تکرارها را بیشتر کنید.</li>
        <li><strong>فرم صحیح:</strong> همیشه فرم صحیح را بر افزایش وزنه اولویت دهید.</li>
        <li><strong>استراحت بین ست‌ها:</strong> برای تمرینات سنگین ۲-۳ دقیقه و برای تمرینات سبک‌تر ۱-۲ دقیقه استراحت کنید.</li>
        <li><strong>تغذیه مناسب:</strong> مصرف کالری مازاد و پروتئین کافی (۱.۶-۲.۲ گرم به ازای هر کیلوگرم وزن بدن) برای رشد عضلات ضروری است.</li>
        <li><strong>خواب کافی:</strong> حداقل ۷-۸ ساعت خواب شبانه برای ریکاوری و رشد عضلات لازم است.</li>
        <li><strong>هیدراتاسیون:</strong> نوشیدن آب کافی قبل، حین و بعد از تمرین.</li>
        <li><strong>تنوع تمرینی:</strong> هر ۸-۱۲ هفته برنامه تمرینی خود را تغییر دهید تا از سازگاری بدن جلوگیری کنید.</li>
      </ol>
      
      <h2>نتیجه‌گیری</h2>
      <p>افزایش حجم عضلات نیازمند ترکیبی از برنامه تمرینی مناسب، تغذیه صحیح، استراحت کافی و تداوم است. برنامه‌های تمرینی معرفی شده در این مقاله، اگر به درستی و با تعهد اجرا شوند، می‌توانند به شما در رسیدن به اهداف بدنسازی کمک کنند.</p>
      
      <p>به یاد داشته باشید که هر فردی منحصر به فرد است و ممکن است نیاز به تعدیل برنامه‌ها بر اساس شرایط خود داشته باشید. برای دریافت برنامه تمرینی کاملاً شخصی‌سازی شده، می‌توانید از اپلیکیشن لیفت لجندز استفاده کنید.</p>
    `
  },
  "nutrition-for-muscle-gain": {
    id: "nutrition-for-muscle-gain",
    category: "تغذیه و رژیم",
    icon: "🍽",
    title: "چی بخوریم برای افزایش وزن عضلانی؟",
    description: "راهنمای کامل تغذیه برای افزایش وزن عضلانی و بهبود عملکرد در تمرینات بدنسازی. با رعایت این اصول تغذیه‌ای، سریع‌تر به اهداف بدنسازی خود برسید.",
    date: "۱۰ مرداد ۱۴۰۳",
    readTime: "۱۰ دقیقه",
    image: "https://uploadkon.ir/uploads/1eec15_25چی-بخوریم-برای-افزایش-وزن-عضلانی؟.jpg",
    content: `
      <h2>مقدمه</h2>
      <p>افزایش وزن عضلانی یکی از اهداف اصلی بسیاری از ورزشکاران و علاقه‌مندان به بدنسازی است. برای رسیدن به این هدف، تغذیه مناسب نقش بسیار مهمی دارد. در این مقاله، راهنمای کاملی برای تغذیه مناسب جهت افزایش وزن عضلانی ارائه می‌دهیم.</p>
      
      <h2>اصول اساسی تغذیه برای افزایش وزن عضلانی</h2>
      <p>برای افزایش وزن عضلانی، رعایت چند اصل اساسی در تغذیه ضروری است:</p>
      
      <h3>۱. مصرف کالری مازاد</h3>
      <p>برای افزایش وزن عضلانی، باید بیشتر از میزان کالری مصرفی روزانه خود، کالری دریافت کنید. توصیه می‌شود حدود ۳۰۰ تا ۵۰۰ کالری بیشتر از نیاز روزانه خود مصرف کنید. این مازاد کالری باید از منابع سالم و مغذی تأمین شود.</p>
      
      <h3>۲. دریافت پروتئین کافی</h3>
      <p>پروتئین اصلی‌ترین ماده مغذی برای ساخت عضلات است. برای افزایش وزن عضلانی، به ۱.۶ تا ۲.۲ گرم پروتئین به ازای هر کیلوگرم وزن بدن نیاز دارید. برای مثال، اگر ۷۵ کیلوگرم وزن دارید، باید روزانه حدود ۱۲۰ تا ۱۶۵ گرم پروتئین مصرف کنید.</p>
      
      <h3>۳. مصرف کربوهیدرات‌های مناسب</h3>
      <p>کربوهیدرات‌ها منبع اصلی انرژی برای تمرینات شدید هستند و به حفظ گلیکوژن عضلانی کمک می‌کنند. توصیه می‌شود ۴ تا ۷ گرم کربوهیدرات به ازای هر کیلوگرم وزن بدن مصرف کنید. کربوهیدرات‌های پیچیده مانند برنج قهوه‌ای، سیب‌زمینی شیرین، جو و کینوا گزینه‌های مناسبی هستند.</p>
      
      <h3>۴. چربی‌های سالم</h3>
      <p>چربی‌های سالم برای تولید هورمون‌های آنابولیک مانند تستوسترون ضروری هستند. حدود ۲۰ تا ۳۵ درصد از کالری روزانه شما باید از چربی‌های سالم تأمین شود. منابع خوب چربی‌های سالم شامل آووکادو، مغزها، دانه‌ها، روغن زیتون و ماهی‌های چرب هستند.</p>
      
      <h2>بهترین منابع غذایی برای افزایش وزن عضلانی</h2>
      
      <h3>منابع پروتئینی</h3>
      <ul>
        <li><strong>گوشت قرمز کم‌چرب:</strong> منبع عالی پروتئین، آهن، روی و ویتامین B12</li>
        <li><strong>مرغ و بوقلمون:</strong> منابع کم‌چرب و غنی از پروتئین</li>
        <li><strong>ماهی:</strong> علاوه بر پروتئین، حاوی اسیدهای چرب امگا-۳ مفید</li>
        <li><strong>تخم مرغ:</strong> منبع کامل پروتئین با ارزش بیولوژیکی بالا</li>
        <li><strong>لبنیات:</strong> شیر، ماست، پنیر و کشک منابع خوب پروتئین و کلسیم</li>
        <li><strong>حبوبات:</strong> منابع گیاهی پروتئین مانند عدس، لوبیا و نخود</li>
        <li><strong>پروتئین وی:</strong> مکمل سریع‌الجذب برای بعد از تمرین</li>
      </ul>
      
      <h3>منابع کربوهیدراتی</h3>
      <ul>
        <li><strong>برنج قهوه‌ای:</strong> منبع عالی کربوهیدرات پیچیده و فیبر</li>
        <li><strong>سیب‌زمینی شیرین:</strong> غنی از کربوهیدرات، فیبر و ویتامین A</li>
        <li><strong>جو و کینوا:</strong> غلات کامل با ارزش تغذیه‌ای بالا</li>
        <li><strong>نان سبوس‌دار:</strong> منبع خوب کربوهیدرات پیچیده</li>
        <li><strong>میوه‌ها:</strong> منابع طبیعی قند، ویتامین‌ها و آنتی‌اکسیدان‌ها</li>
        <li><strong>بلغور جو دوسر:</strong> منبع عالی کربوهیدرات، فیبر و پروتئین</li>
      </ul>
      
      <h3>منابع چربی سالم</h3>
      <ul>
        <li><strong>آووکادو:</strong> غنی از چربی‌های تک‌غیراشباع و پتاسیم</li>
        <li><strong>مغزها و دانه‌ها:</strong> بادام، گردو، تخم کتان و چیا</li>
        <li><strong>روغن زیتون:</strong> منبع عالی چربی‌های تک‌غیراشباع</li>
        <li><strong>ماهی‌های چرب:</strong> سالمون، ساردین و ماهی تن منابع خوب امگا-۳</li>
        <li><strong>تخم مرغ:</strong> زرده تخم مرغ حاوی چربی‌های مفید است</li>
      </ul>
      
      <h2>برنامه غذایی نمونه برای افزایش وزن عضلانی</h2>
      <p>یک برنامه غذایی نمونه برای فردی با وزن ۷۵ کیلوگرم که هدف افزایش وزن عضلانی دارد:</p>
      
      <h3>وعده ۱: صبحانه (ساعت ۷ صبح)</h3>
      <ul>
        <li>۱ پیمانه بلغور جو دوسر</li>
        <li>۱ موز</li>
        <li>۲ قاشق غذاخوری کره بادام زمینی</li>
        <li>۱ قاشق غذاخوری عسل</li>
        <li>۱ پیمانه شیر کم‌چرب</li>
        <li>۳ عدد تخم مرغ (۱ زرده و ۳ سفیده)</li>
      </ul>
      
      <h3>وعده ۲: میان‌وعده صبح (ساعت ۱۰ صبح)</h3>
      <ul>
        <li>۱ سیب</li>
        <li>۳۰ گرم بادام</li>
        <li>۱ پیمانه ماست یونانی</li>
      </ul>
      
      <h3>وعده ۳: ناهار (ساعت ۱ بعدازظهر)</h3>
      <ul>
        <li>۱۵۰ گرم سینه مرغ گریل شده</li>
        <li>۱ پیمانه برنج قهوه‌ای</li>
        <li>۱ پیمانه سبزیجات پخته (بروکلی، هویج، کدو)</li>
        <li>۱/۲ عدد آووکادو</li>
        <li>۱ قاشق غذاخوری روغن زیتون</li>
      </ul>
      
      <h3>وعده ۴: میان‌وعده عصر (ساعت ۴ بعدازظهر)</h3>
      <ul>
        <li>۱ عدد سیب‌زمینی شیرین متوسط</li>
        <li>۱۰۰ گرم تن کنسروی در آب</li>
        <li>۱ عدد تخم مرغ آب‌پز</li>
      </ul>
      
      <h3>وعده ۵: بعد از تمرین (ساعت ۶:۳۰ بعدازظهر)</h3>
      <ul>
        <li>۱ اسکوپ پروتئین وی (۲۵-۳۰ گرم)</li>
        <li>۱ موز</li>
        <li>۱ قاشق غذاخوری عسل</li>
      </ul>
      
      <h3>وعده ۶: شام (ساعت ۸ شب)</h3>
      <ul>
        <li>۱۵۰ گرم گوشت قرمز کم‌چرب</li>
        <li>۱ عدد سیب‌زمینی متوسط</li>
        <li>۲ پیمانه سالاد سبزیجات</li>
        <li>۱ قاشق غذاخوری روغن زیتون و سرکه بالزامیک</li>
      </ul>
      
      <h3>وعده ۷: قبل از خواب (ساعت ۱۰:۳۰ شب)</h3>
      <ul>
        <li>۱ پیمانه ماست یونانی</li>
        <li>۱ قاشق غذاخوری عسل</li>
        <li>۱ قاشق غذاخوری دانه چیا</li>
      </ul>
      
      <h2>نکات مهم برای تغذیه موثر</h2>
      <ol>
        <li><strong>آب کافی بنوشید:</strong> روزانه حداقل ۳-۴ لیتر آب بنوشید تا هیدراتاسیون بدن حفظ شود.</li>
        <li><strong>وعده‌های منظم:</strong> هر ۳-۴ ساعت یک وعده غذایی مصرف کنید تا جریان مداوم مواد مغذی به عضلات برسد.</li>
        <li><strong>تغذیه قبل و بعد از تمرین:</strong> قبل از تمرین کربوهیدرات و مقداری پروتئین، و بعد از تمرین پروتئین و کربوهیدرات مصرف کنید.</li>
        <li><strong>خواب کافی:</strong> ۷-۸ ساعت خواب شبانه برای ریکاوری و رشد عضلات ضروری است.</li>
        <li><strong>پیگیری کالری و ماکروها:</strong> حداقل در ابتدا، کالری و ماکروهای دریافتی خود را پیگیری کنید تا از دریافت مقادیر مناسب اطمینان حاصل کنید.</li>
        <li><strong>صبر داشته باشید:</strong> افزایش وزن عضلانی فرآیندی زمان‌بر است. انتظار نتایج سریع نداشته باشید.</li>
      </ol>
      
      <h2>مکمل‌های مفید برای افزایش وزن عضلانی</h2>
      <p>مکمل‌ها جایگزین غذای واقعی نیستند، اما می‌توانند مکمل رژیم غذایی شما باشند:</p>
      <ul>
        <li><strong>پروتئین وی:</strong> برای تأمین سریع پروتئین بعد از تمرین</li>
        <li><strong>کراتین:</strong> برای افزایش قدرت و حجم عضلانی</li>
        <li><strong>گینرها:</strong> برای افرادی که در افزایش کالری دریافتی مشکل دارند</li>
        <li><strong>BCAA:</strong> برای کمک به ریکاوری عضلات</li>
        <li><strong>مولتی ویتامین:</strong> برای اطمینان از دریافت ریزمغذی‌های کافی</li>
      </ul>
      
      <h2>نتیجه‌گیری</h2>
      <p>افزایش وزن عضلانی نیازمند ترکیبی از تغذیه مناسب، برنامه تمرینی اصولی و استراحت کافی است. با رعایت اصول تغذیه‌ای ذکر شده در این مقاله، می‌توانید به اهداف بدنسازی خود نزدیک‌تر شوید.</p>
      
      <p>به یاد داشته باشید که هر فردی منحصر به فرد است و ممکن است نیاز به تعدیل برنامه غذایی بر اساس شرایط خود داشته باشید. برای دریافت برنامه غذایی کاملاً شخصی‌سازی شده، می‌توانید از اپلیکیشن لیفت لجندز استفاده کنید.</p>
    `
  }
};

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // در یک پروژه واقعی، اینجا می‌توانید از API برای دریافت مقاله استفاده کنید
    if (postId && blogPosts[postId]) {
      setPost(blogPosts[postId]);
      // اسکرول به بالای صفحه
      window.scrollTo(0, 0);
      
      // انیمیشن ظاهر شدن محتوا
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [postId]);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // تعیین آیکون مناسب برای دسته‌بندی
  const getCategoryIcon = (category) => {
    if (category.includes("تمرین")) return <Dumbbell size={16} className="ml-1" />;
    if (category.includes("تغذیه")) return <Utensils size={16} className="ml-1" />;
    return null;
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">مقاله مورد نظر یافت نشد</h1>
          <Link to="/blog">
            <Button variant="outline" className="mt-4 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500">
              <ArrowRight className="ml-2 h-4 w-4" /> بازگشت به بلاگ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{post.title} | بلاگ لیفت لجندز</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={`${post.category}، ${post.title}، لیفت لجندز، بدنسازی، تناسب اندام، تغذیه ورزشی`} />
        <link rel="canonical" href={`https://liftlegends.ir/blog/${post.id}`} />
        <meta property="og:title" content={`${post.title} | بلاگ لیفت لجندز`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={`https://liftlegends.ir/blog/${post.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.image,
            "datePublished": "2024-08-06T08:00:00+03:30",
            "dateModified": "2024-08-06T08:00:00+03:30",
            "author": {
              "@type": "Organization",
              "name": "LiftLegends"
            },
            "publisher": {
              "@type": "Organization",
              "name": "LiftLegends",
              "logo": {
                "@type": "ImageObject",
                "url": "https://liftlegends.ir/images/white logo.png"
              }
            },
            "description": post.description
          })}
        </script>
      </Helmet>

      {/* Hero Section with Featured Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Featured Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <div className={`max-w-4xl mx-auto w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link to="/blog">
              <Button variant="outline" size="sm" className="mb-6 border-white/20 hover:bg-white/10 hover:border-white/30">
                <ArrowRight className="ml-2 h-4 w-4" /> بازگشت به بلاگ
              </Button>
            </Link>
            
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black mb-4">
              {getCategoryIcon(post.category)} {post.category}
            </Badge>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-300 gap-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 ml-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 ml-2" />
                <span>زمان مطالعه: {post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Social Share */}
          <div className={`sticky top-4 z-10 flex justify-end mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
            <div className="bg-zinc-900/80 backdrop-blur-md p-2 rounded-full border border-zinc-800 flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                      <Facebook size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>اشتراک در فیسبوک</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-sky-500 hover:text-sky-400 hover:bg-sky-500/10">
                      <Twitter size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>اشتراک در توییتر</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-blue-600 hover:text-blue-500 hover:bg-blue-600/10">
                      <Linkedin size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>اشتراک در لینکدین</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full w-9 h-9 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "کپی شد!" : "کپی لینک"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Article Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
            <article className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>
          </div>
          
          <Separator className="my-12" />
          
          {/* App Download CTA */}
          <div className={`bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-10 border border-zinc-700 mb-12 relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "400ms" }}>
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-15 transition-opacity"></div>
            <div className="absolute -z-10 bottom-0 left-0 w-32 h-32 bg-yellow-400 rounded-full blur-[80px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">اپلیکیشن لیفت لجندز</span> را همین امروز دانلود کنید
                </h3>
                <p className="text-gray-300 mb-6">
                  برای دریافت برنامه تمرینی و رژیم غذایی کاملاً شخصی‌سازی شده با هوش مصنوعی، همین حالا اپلیکیشن لیفت لجندز را دانلود کنید.
                </p>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                  دانلود اپلیکیشن
                </Button>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <img 
                  src="/images/white logo.png" 
                  alt="LiftLegends Logo" 
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "500ms" }}>
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <span className="w-2 h-8 bg-yellow-500 rounded-full ml-3"></span>
              مقالات مرتبط
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(blogPosts)
                .filter(relatedPost => relatedPost.id !== post.id)
                .slice(0, 2)
                .map(relatedPost => (
                  <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                    <Card className="bg-zinc-900 border-zinc-800 hover:border-yellow-500 transition-all duration-300 overflow-hidden">
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-1/3 h-32 md:h-auto overflow-hidden">
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        <CardContent className="md:w-2/3 p-4 flex flex-col justify-between">
                          <div>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10 mb-2">
                              {getCategoryIcon(relatedPost.category)} {relatedPost.category}
                            </Badge>
                            <h4 className="text-lg font-bold mb-2 line-clamp-2 hover:text-yellow-400 transition-colors">
                              {relatedPost.title}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                            <span>{relatedPost.date}</span>
                            <span>{relatedPost.readTime}</span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default BlogPost;