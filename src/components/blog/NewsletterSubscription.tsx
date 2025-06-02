
import { Button } from "@/components/ui/button";

interface NewsletterSubscriptionProps {
  isVisible: boolean;
}

const NewsletterSubscription = ({ isVisible }: NewsletterSubscriptionProps) => {
  return (
    <div className={`mt-16 sm:mt-24 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border border-zinc-700 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "600ms" }}>
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          عضویت در خبرنامه لیفت لجندز
        </h3>
        <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base px-2 sm:px-0">
          با عضویت در خبرنامه ما، از آخرین مقالات، نکات تمرینی و توصیه‌های تغذیه‌ای مطلع شوید.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto px-2 sm:px-0">
          <input 
            type="email" 
            placeholder="ایمیل خود را وارد کنید" 
            className="flex-grow bg-zinc-800 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none text-sm sm:text-base"
          />
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] text-sm sm:text-base">
            عضویت
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
