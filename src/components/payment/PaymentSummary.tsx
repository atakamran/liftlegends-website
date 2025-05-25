
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, CheckCircle } from "lucide-react";

interface PaymentSummaryProps {
  amount: string;
}

const PaymentSummary = ({ amount }: PaymentSummaryProps) => {
  const numericAmount = parseInt(amount) || 0;
  const formattedAmount = numericAmount.toLocaleString('fa-IR');

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-yellow-400">خلاصه پرداخت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">مبلغ خرید:</span>
            <span className="text-white font-bold">{formattedAmount} تومان</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">هزینه پردازش:</span>
            <span className="text-green-400">رایگان</span>
          </div>
          
          <Separator className="bg-gray-700" />
          
          <div className="flex justify-between items-center text-lg">
            <span className="text-yellow-400 font-bold">مجموع:</span>
            <span className="text-yellow-400 font-bold">{formattedAmount} تومان</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            امنیت پرداخت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <CheckCircle className="h-4 w-4 text-green-400" />
            پرداخت از طریق درگاه معتبر زرین‌پال
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <CheckCircle className="h-4 w-4 text-green-400" />
            رمزنگاری SSL 256 بیتی
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <CheckCircle className="h-4 w-4 text-green-400" />
            پشتیبانی 24 ساعته
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <CheckCircle className="h-4 w-4 text-green-400" />
            ضمانت بازگشت وجه
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 mt-1">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-blue-400 font-semibold text-sm">نکته مهم</h4>
            <p className="text-blue-200 text-sm mt-1">
              پس از تکمیل پرداخت، به صفحه تأیید هدایت خواهید شد و دسترسی شما فعال می‌شود.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
