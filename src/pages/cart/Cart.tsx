import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ArrowRight,
  Package,
} from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            سبد خرید
          </h1>
          <p className="text-white/70">
            محصولات انتخابی شما
          </p>
        </div>

        {/* Empty Cart */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border border-white/10">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-purple-400" />
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-4">
              سبد خرید شما خالی است
            </h3>
            
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید. برای مشاهده محصولات و برنامه‌های ما کلیک کنید.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate("/programs")}
                className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white px-8 py-3 group"
              >
                <Package className="w-5 h-5 ml-2" />
                مشاهده برنامه‌ها
                <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              >
                بازگشت به صفحه اصلی
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-white/10">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">برنامه‌های متنوع</h4>
            <p className="text-white/60 text-sm">برنامه‌های تمرینی و غذایی متنوع برای هر سطح</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-white/10">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">خرید آسان</h4>
            <p className="text-white/60 text-sm">فرآیند خرید ساده و امن</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-white/10">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">پشتیبانی 24/7</h4>
            <p className="text-white/60 text-sm">پشتیبانی و راهنمایی در تمام ساعات</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;