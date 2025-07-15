import { Button } from "@/components/ui/button";
import { Download, Shield, Zap, Brain, Smartphone, Clock, Users, ArrowLeft, Bot, Globe, Monitor, Tablet } from "lucide-react";
import { useEffect, useState } from "react";

const DownloadPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gold-500/20 to-gold-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <a 
              href="/" 
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>بازگشت به خانه</span>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className={`max-w-6xl w-full mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Hero Section with Phone Mockup */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
              
              {/* Left Side - Content */}
              <div className="text-center lg:text-right space-y-8">
                {/* Title */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
                    دانلود
                    <span className="block bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                      LiftLegends
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    وب اپلیکیشن پیشرفته برای همه دستگاه‌ها
                  </p>
                </div>

                {/* Device Compatibility Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-blue-400/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
                      <Smartphone className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <span className="text-white text-sm font-medium">موبایل</span>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-purple-400/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
                      <Tablet className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <span className="text-white text-sm font-medium">تبلت</span>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-green-400/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
                      <Monitor className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <span className="text-white text-sm font-medium">دسکتاپ</span>
                    </div>
                  </div>
                </div>

                {/* Access Buttons */}
                <div className="space-y-6">
                  {/* PWA Access Button */}
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/50 to-gold-400/50 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
                    <Button 
                      className="relative bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black text-xl font-medium px-12 py-6 rounded-3xl shadow-2xl hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 min-w-[280px]"
                      onClick={() => window.open("https://liftlegendsapp.liara.run", "_blank")}
                    >
                      <Globe className="w-6 h-6 ml-3" />
                      ورود به وب اپ
                    </Button>
                  </div>

                  {/* Bot Button */}
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
                    <Button 
                      className="relative bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white text-xl font-medium px-12 py-6 rounded-3xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 min-w-[280px]"
                      onClick={() => window.open("https://t.me/LiftLegendsBot", "_blank")}
                    >
                      <Bot className="w-6 h-6 ml-3" />
                      ربات تلگرام
                    </Button>
                  </div>
                </div>

              </div>

              {/* Right Side - Phone Mockup */}
              <div className="relative flex justify-center lg:justify-end">
                {/* Phone Container */}
                <div className="relative">
                  {/* Phone Glow */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-gold-500/30 via-purple-500/20 to-blue-500/30 rounded-[3rem] blur-2xl opacity-60 animate-pulse"></div>
                  
                  {/* Phone Frame */}
                  <div className="relative w-80 h-[640px] bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl border border-gray-700">
                    {/* Screen */}
                    <div className="w-full h-full bg-gradient-to-b from-gray-950 to-gray-900 rounded-[2.5rem] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-white rounded-sm"></div>
                          <div className="w-6 h-2 bg-white rounded-sm"></div>
                          <div className="w-6 h-2 bg-white rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App Content Preview */}
                      <div className="px-4 py-6 space-y-6">
                        {/* App Header */}
                        <div className="text-center">
                          <h3 className="text-gold-400 text-2xl font-bold mb-2">LiftLegends</h3>
                          <p className="text-gray-400 text-sm">همراه هوشمند بدنسازی</p>
                        </div>
                        
                        {/* Feature Cards in Phone */}
                        <div className="space-y-3">
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                                <Brain className="w-5 h-5 text-gold-400" />
                              </div>
                              <div>
                                <h4 className="text-white text-sm font-medium">برنامه تمرینی هوشمند</h4>
                                <p className="text-gray-400 text-xs">بر اساس هدف شما</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-white text-sm font-medium">برنامه مکمل‌یاری</h4>
                                <p className="text-gray-400 text-xs">مناسب بدن شما</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <Zap className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <h4 className="text-white text-sm font-medium">پیگیری پیشرفت</h4>
                                <p className="text-gray-400 text-xs">آمار دقیق و کامل</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar in Phone */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">پیشرفت هفتگی</span>
                            <span className="text-gold-400 text-sm font-medium">75%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PWA Installation Guide */}
            <div className="relative mb-20">
              {/* Background Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-60"></div>
              
              {/* Installation Guide Container */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-light text-white text-center mb-12">
                    نحوه نصب وب اپ
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Step 1 - Mobile */}
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Smartphone className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-4">موبایل</h3>
                        <div className="text-gray-300 text-sm space-y-2">
                          <p>۱. لینک را در مرورگر باز کنید</p>
                          <p>۲. منوی مرورگر را باز کنید</p>
                          <p>۳. "افزودن به صفحه اصلی" را انتخاب کنید</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 2 - Desktop */}
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Monitor className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-4">دسکتاپ</h3>
                        <div className="text-gray-300 text-sm space-y-2">
                          <p>۱. سایت را در کروم باز کنید</p>
                          <p>۲. آیکون نصب در نوار آدرس</p>
                          <p>۳. روی "نصب" کلیک کنید</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 3 - Features */}
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Download className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-4">مزایا</h3>
                        <div className="text-gray-300 text-sm space-y-2">
                          <p>✓ بدون نیاز به استور</p>
                          <p>✓ آپدیت خودکار</p>
                          <p>✓ دسترسی آفلاین</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="relative mb-20">
              {/* Background Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-gold-500/10 rounded-3xl blur-2xl opacity-60"></div>
              
              {/* Stats Glass Container */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-light text-white text-center mb-12">
                    چرا LiftLegends؟
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Stat 1 */}
                    <div className="group relative text-center">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-blue-400 mb-2">+۵۰</div>
                        <div className="text-gray-300">برنامه تمرینی</div>
                      </div>
                    </div>
                    
                    {/* Stat 2 */}
                    <div className="group relative text-center">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="text-4xl font-bold text-purple-400 mb-2">۲۴/۷</div>
                        <div className="text-gray-300">پشتیبانی</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="relative mb-20">
              {/* Background Glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-60"></div>
              
              {/* Features Glass Container */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-light text-white text-center mb-12">
                    ویژگی‌های منحصر به فرد
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Feature 1 */}
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/20 to-gold-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="w-6 h-6 text-gold-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium text-white mb-2">هوش مصنوعی پیشرفته</h3>
                            <p className="text-gray-300 leading-relaxed">
                              برنامه تمرینی شخصی‌سازی شده بر اساس هدف، سطح آمادگی و ترجیحات شما
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature 2 */}
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium text-white mb-2">برنامه مکمل‌یاری</h3>
                            <p className="text-gray-300 leading-relaxed">
                              راهنمای کامل مکمل‌ها و استروییدها با توصیه‌های تخصصی و ایمن
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature 3 */}
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Zap className="w-6 h-6 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium text-white mb-2">پیگیری پیشرفت</h3>
                            <p className="text-gray-300 leading-relaxed">
                              ثبت و تحلیل دقیق پیشرفت شما با نمودارها و آمار کامل
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature 4 */}
                    <div className="group relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Globe className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium text-white mb-2">دسترسی همه‌جا</h3>
                            <p className="text-gray-300 leading-relaxed">
                              وب اپلیکیشن پیشرفته قابل دسترسی در همه دستگاه‌ها و مرورگرها
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PWA Ready Notice */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/30 to-gold-400/30 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-3xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl lg:text-3xl font-light text-white mb-4">
                      وب اپلیکیشن پیشرفته
                    </h3>
                    <p className="text-gray-300 text-lg mb-6">
                      LiftLegends را در همه دستگاه‌ها بدون نیاز به نصب از استور استفاده کنید
                    </p>
                    <div className="flex items-center justify-center gap-4 text-gold-400 text-lg font-medium">
                      <Globe className="w-6 h-6" />
                      <span>PWA آماده استفاده</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;