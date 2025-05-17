
import { Button } from "@/components/ui/button";

interface NewsletterSubscriptionProps {
  isVisible: boolean;
}

const NewsletterSubscription = ({ isVisible }: NewsletterSubscriptionProps) => {
  return (
    <div className={`mt-24 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 border border-zinc-700 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "600ms" }}>
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          عضویت در خبرنامه لیفت لجندز
        </h3>
        <p className="text-gray-300 mb-8">
          با عضویت در خبرنامه ما، از آخرین مقالات، نکات تمرینی و توصیه‌های تغذیه‌ای مطلع شوید.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="ایمیل خود را وارد کنید" 
            className="flex-grow bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
          />
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            عضویت
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
