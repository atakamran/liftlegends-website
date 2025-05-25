
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Shield, AlertTriangle } from "lucide-react";
import PaymentSummary from "./PaymentSummary";

interface PaymentFormData {
  amount: string;
  description: string;
  mobile: string;
  email: string;
}

const PaymentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PaymentFormData>({
    defaultValues: {
      amount: "15000",
      description: "خرید برنامه تمرینی",
      mobile: "",
      email: ""
    }
  });

  const watchedAmount = watch("amount");

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing for demo purposes
      // Note: In production, this should be handled through a backend API to avoid CORS issues
      toast({
        title: "توجه",
        description: "این یک نسخه نمایشی است. پرداخت واقعی نیازمند پیاده‌سازی بک‌اند است.",
        variant: "default",
      });

      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment for demo
      const demoAuthority = "A" + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Redirect to callback page with demo data
      window.location.href = `/payment/callback?Authority=${demoAuthority}&Status=OK`;

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطا در پرداخت",
        description: "مشکلی در پردازش پرداخت رخ داده است.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            اطلاعات پرداخت
          </CardTitle>
          <CardDescription className="text-gray-400">
            لطفاً اطلاعات پرداخت خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Notice */}
          <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
              <div>
                <h4 className="text-orange-400 font-semibold text-sm">نسخه نمایشی</h4>
                <p className="text-orange-200 text-sm mt-1">
                  این یک نسخه نمایشی است. برای پیاده‌سازی واقعی، نیاز به راه‌اندازی بک‌اند و API درگاه پرداخت دارید.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">مبلغ (تومان)</Label>
              <Input
                id="amount"
                type="number"
                className="bg-gray-800 border-gray-700 text-white"
                {...register("amount", { 
                  required: "مبلغ الزامی است",
                  min: { value: 1000, message: "حداقل مبلغ 1000 تومان است" }
                })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">توضیحات</Label>
              <Input
                id="description"
                className="bg-gray-800 border-gray-700 text-white"
                {...register("description", { required: "توضیحات الزامی است" })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-white">شماره موبایل</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="09123456789"
                className="bg-gray-800 border-gray-700 text-white"
                {...register("mobile", { 
                  required: "شماره موبایل الزامی است",
                  pattern: {
                    value: /^09\d{9}$/,
                    message: "شماره موبایل معتبر نیست"
                  }
                })}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">ایمیل (اختیاری)</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="bg-gray-800 border-gray-700 text-white"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "ایمیل معتبر نیست"
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  پرداخت نمایشی
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <PaymentSummary amount={watchedAmount} />
    </div>
  );
};

export default PaymentForm;
