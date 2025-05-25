
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Shield } from "lucide-react";
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
      // ZarinPal payment request
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "merchant_id": "89999bca-a25d-4ada-9846-62ec13a250b1",
        "amount": data.amount,
        "description": data.description,
        "metadata": {
          "mobile": data.mobile,
          "email": data.email
        },
        "callback_url": `${window.location.origin}/payment/callback`
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch("https://staging.zarinpal.com/pg/v4/payment/request.json", requestOptions);
      const result = await response.json();

      console.log("Payment request result:", result);

      if (result.data?.code === 100) {
        // Redirect to ZarinPal payment gateway
        const paymentUrl = `https://staging.zarinpal.com/pg/StartPay/${result.data.authority}`;
        window.location.href = paymentUrl;
      } else {
        toast({
          title: "خطا در پرداخت",
          description: "مشکلی در ایجاد درخواست پرداخت رخ داده است.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطا در اتصال",
        description: "مشکلی در اتصال به درگاه پرداخت رخ داده است.",
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
                  پرداخت امن
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
