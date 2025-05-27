import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 text-white px-4 py-12">
      <div className="w-full max-w-3xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[150px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 opacity-70 blur-sm select-none">
              404
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[150px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 select-none animate-pulse">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            صفحه مورد نظر یافت نشد!
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
          </p>
        </div>

        {/* Path Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-8 max-w-xl mx-auto border border-gray-700">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle size={18} className="text-amber-400 mr-2" />
            <span className="text-gray-300 text-sm">آدرس درخواستی:</span>
          </div>
          <code className="text-amber-300 bg-gray-800 px-3 py-1 rounded text-sm break-all">
            {location.pathname}
          </code>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild
            className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-medium px-6 py-6 rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 w-full sm:w-auto"
          >
            <Link to="/">
              <Home size={18} className="ml-2" />
              بازگشت به صفحه اصلی
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="border-gray-700 hover:bg-gray-800 text-white px-6 py-6 rounded-xl w-full sm:w-auto"
          >
            <Link to="/blog">
              <Search size={18} className="ml-2" />
              جستجو در مقالات
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default NotFound;
