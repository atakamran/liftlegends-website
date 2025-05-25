
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  const authority = searchParams.get('Authority');
  const statusParam = searchParams.get('Status');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (statusParam === 'OK' && authority) {
          // Here you would normally verify the payment with ZarinPal
          // For demo purposes, we'll simulate a successful verification
          setTimeout(() => {
            setStatus('success');
            setMessage('پرداخت با موفقیت انجام شد');
          }, 2000);
        } else {
          setStatus('failed');
          setMessage('پرداخت لغو شد یا با خطا مواجه شد');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('خطا در تأیید پرداخت');
      }
    };

    verifyPayment();
  }, [authority, statusParam]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-16 w-16 animate-spin text-yellow-400" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-400" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-xl ${getStatusColor()}`}>
            {status === 'loading' && 'در حال بررسی پرداخت...'}
            {status === 'success' && 'پرداخت موفق'}
            {status === 'failed' && 'پرداخت ناموفق'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300">{message}</p>
          
          {authority && (
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400">کد پیگیری:</p>
              <p className="text-white font-mono">{authority}</p>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              بازگشت به صفحه اصلی
            </Button>
            
            {status === 'failed' && (
              <Button
                onClick={() => navigate('/payment')}
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800"
              >
                تلاش مجدد
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
