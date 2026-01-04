import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Download,
  Star,
  Shield,
  Zap,
  Brain,
  Smartphone,
} from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-20 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        >
          <source
            src="https://videos.pexels.com/video-files/3838631/3838631-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </div>

      {/* Background effects */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-b from-black via-gray-900 to-black opacity-50"></div>
      <div className="absolute -z-10 top-20 left-1/2 transform -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-r from-gold-500 to-amber-500 rounded-full blur-[120px] opacity-10"></div>
      <div className="absolute -z-10 bottom-40 right-10 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-gold-400 to-amber-300 rounded-full blur-[100px] opacity-5 animate-pulse"></div>
      <div className="absolute -z-10 top-1/3 left-1/4 w-36 sm:w-48 h-36 sm:h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[120px] opacity-5"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 -z-5 opacity-30">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-500 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-1 h-1 bg-gold-400 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-2 h-2 bg-gold-500 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 left-2/3 w-1 h-1 bg-gold-400 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/5 w-2 h-2 bg-gold-500 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/5 left-3/4 w-3 h-3 bg-gold-500/30 rounded-full animate-float"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute top-2/5 left-1/3 w-1.5 h-1.5 bg-gold-400/40 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Hero content */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
        {/* Text content */}
        <div
          className={`text-center md:text-left space-y-6 sm:space-y-8 order-2 md:order-1 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 animate-gradient-x">
              Build Your Legend
            </span>
          </h1>

          <h2 className="text-lg sm:text-xl md:text-2xl text-white/90 font-light">
            Train smarter. Transform faster. Powered by AI.
          </h2>

          <p className="text-white/70 text-base sm:text-lg max-w-md mx-auto md:mx-0 leading-relaxed px-2 sm:px-0">
            Your training and nutrition designed by <span className="text-gold-400 font-medium">advanced AI</span> to deliver maximum results in minimum time. No guesswork. Just gains.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mt-4">
            <div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
              <Brain
                size={14}
                className="text-gold-500 group-hover:scale-110 transition-transform"
              />
              <span className="text-white/80 text-xs group-hover:text-white transition-colors">
                AI Training
              </span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
              <Shield
                size={14}
                className="text-gold-500 group-hover:scale-110 transition-transform"
              />
              <span className="text-white/80 text-xs group-hover:text-white transition-colors">
                Supplement & PED Guide
              </span>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 rounded-full border border-gold-500/30 flex items-center gap-1.5 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
              <Zap
                size={14}
                className="text-gold-500 group-hover:scale-110 transition-transform"
              />
              <span className="text-white/80 text-xs group-hover:text-white transition-colors">
                Smart Nutrition
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start mt-6 sm:mt-8 w-full px-4 sm:px-0">
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black px-4 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] group"
              onClick={() => (window.location.href = "/download")}
            >
              <Download size={18} className="mr-2 group-hover:animate-bounce" />
              Get the App
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto border-gold-500/30 text-white hover:bg-gold-500/10 px-4 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-medium rounded-xl transition-all hover:border-gold-500/70"
              onClick={() => (window.location.href = "/programs")}
            >
              <ArrowDown size={18} className="mr-2" />
              Explore Programs
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 mt-6 sm:mt-8 overflow-x-auto pb-2 w-full">
            <div className="flex flex-col items-center group">
              <span className="text-gold-500 font-bold text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                50+
              </span>
              <span className="text-white/60 text-xs sm:text-sm group-hover:text-white/80 transition-colors">
                Workouts
              </span>
            </div>
            <div className="w-px h-8 sm:h-10 bg-white/10"></div>
            <div className="flex flex-col items-center group">
              <span className="text-gold-500 font-bold text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                100+
              </span>
              <span className="text-white/60 text-xs sm:text-sm group-hover:text-white/80 transition-colors">
                Meal Plans
              </span>
            </div>
            <div className="w-px h-8 sm:h-10 bg-white/10"></div>
            <div className="flex flex-col items-center group">
              <span className="text-gold-500 font-bold text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                24/7
              </span>
              <span className="text-white/60 text-xs sm:text-sm group-hover:text-white/80 transition-colors">
                AI Support
              </span>
            </div>
          </div>
        </div>

        {/* Mobile app preview */}
        <div
          className={`order-1 md:order-2 flex justify-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative">
            {/* Phone frame */}
            <div className="relative z-10 w-full max-w-[220px] sm:max-w-[280px] mx-auto">
              <div className="bg-gradient-to-br from-gray-800 to-black p-2 sm:p-3 rounded-[24px] sm:rounded-[32px] glass-morphism border border-white/10 shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.25)] transition-all duration-500">
                <div className="aspect-[9/19.5] overflow-hidden rounded-[18px] sm:rounded-[24px] border-[4px] sm:border-[6px] border-black bg-gradient-to-b from-gray-900 to-black flex flex-col">
                  {/* Status bar */}
                  <div className="h-4 sm:h-5 bg-black/40 flex items-center justify-between px-2 sm:px-3">
                    <div className="text-white text-[6px] sm:text-[8px]">
                      12:30
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-white/80"></div>
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-white/80"></div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="flex-1 flex flex-col items-center p-2 sm:p-3">
                    {/* Logo */}
                    <div className="w-full flex justify-center items-center mt-2 sm:mt-3 mb-2 sm:mb-3">
                      <img
                        src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
                        alt="Lift Legends Logo"
                        className="w-16 sm:w-20 h-auto"
                        loading="eager"
                        width="80"
                        height="80"
                      />
                    </div>

                    {/* App elements */}
                    <div className="w-full space-y-2 sm:space-y-3 mb-2 sm:mb-3">
                      {/* Feature cards */}
                      <div className="bg-gold-500/10 rounded-lg p-1.5 sm:p-2 border border-gold-500/30">
                        <div className="text-gold-400 text-[10px] sm:text-xs font-medium text-center">
                          AI Fitness Coach
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="bg-gray-800/50 rounded-lg p-1.5 sm:p-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 p-0.5 sm:p-1">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gold-500"></div>
                          <div className="text-white text-[10px] sm:text-xs">
                            Training Program
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 p-0.5 sm:p-1">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gold-500/60"></div>
                          <div className="text-white text-[10px] sm:text-xs">
                            Nutrition Plan
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 p-0.5 sm:p-1">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gold-500/60"></div>
                          <div className="text-white text-[10px] sm:text-xs">
                            Progress
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom navigation */}
                  <div className="w-full bg-gray-800/30 rounded-full py-0.5 sm:py-1 px-1.5 sm:px-2 flex justify-around mb-1.5 sm:mb-2">
                    <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gold-500 rounded-full"></div>
                    </div>
                    <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-gold-500/80 flex items-center justify-center">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gold-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/2 -right-6 sm:-right-8 transform -translate-y-1/2 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full blur-[40px] sm:blur-[60px] opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-8 sm:w-12 h-8 sm:h-12 bg-gold-500 rounded-full blur-[15px] sm:blur-[20px] opacity-30"></div>
            </div>

            {/* Floating feature highlights */}
            <div className="absolute -top-4 -right-4 bg-gray-900/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gold-500/30 shadow-lg animate-float hidden sm:block">
              <p className="text-xs sm:text-sm text-gold-400 font-medium">
                AI-Powered Training
              </p>
            </div>
            <div
              className="absolute bottom-12 -left-8 bg-gray-900/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gold-500/30 shadow-lg animate-float hidden sm:block"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-xs sm:text-sm text-gold-400 font-medium">
                Custom Meal Plans
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 mx-auto flex justify-center animate-bounce">
        <button
          className="text-gold-500 hover:text-gold-400 transition-colors group bg-gray-900/50 backdrop-blur-sm p-2.5 sm:p-3 md:p-3.5 rounded-full border border-gold-500/20 hover:border-gold-500/40 shadow-lg hover:shadow-gold-500/20"
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="View Features"
        >
          <ArrowDown
            size={22}
            className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform"
          />
          <span className="sr-only">View Features</span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;