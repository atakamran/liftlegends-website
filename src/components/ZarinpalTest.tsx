import { useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

const ZarinpalTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentTest = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = JSON.stringify({
        "merchant_id": "89999bca-a25d-4ada-9846-62ec13a250b1",
        "amount": "15000",
        "description": "test",
        "metadata": {
          "mobile": "09148866040"
        },
        "callback_url": "https://zarinpal.com"
      });
      
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/zarinpal/payment-request',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };
      
      const response = await axios.request(config);
      setResult(JSON.stringify(response.data, null, 2));
      
      // If the request was successful and contains a payment URL, redirect to it
      if (response.data.data && response.data.data.authority) {
        const authority = response.data.data.authority;
        window.location.href = `https://staging.zarinpal.com/pg/StartPay/${authority}`;
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gold-500/30 shadow-lg">
      <h3 className="text-xl font-bold text-gold-500 mb-4 text-center">تست درگاه پرداخت زرین‌پال</h3>
      
      <Button 
        className="w-full bg-gold-500 hover:bg-gold-600 text-black px-6 py-5 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
        onClick={handlePaymentTest}
        disabled={loading}
      >
        {loading ? 'در حال پردازش...' : 'پرداخت تستی ۱۵,۰۰۰ تومان'}
      </Button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-900/70 rounded-lg border border-gold-500/20">
          <h4 className="text-gold-400 text-sm mb-2">نتیجه:</h4>
          <pre className="text-white/80 text-xs overflow-x-auto whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
          <h4 className="text-red-400 text-sm mb-2">خطا:</h4>
          <p className="text-white/80 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ZarinpalTest;