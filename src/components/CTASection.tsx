import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Star,
  Users,
  Zap,
  ArrowRight,
  Smartphone,
  Gift,
} from "lucide-react";

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const sectionElement = document.getElementById("cta-section");
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  return (
    <section
      id="cta-section"
      className="py-24 px-4 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5"></div>
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[200px] opacity-10"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 -z-5 opacity-20">
        <div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-gold-500 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-2 h-2 bg-gold-400 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-4 h-4 bg-gold-500/60 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 left-2/3 w-2 h-2 bg-gold-400 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto text-center">
        {/* Main CTA Content */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 text-sm px-6 py-3 rounded-full border border-gold-500/30 mb-8 hover:border-gold-500/50 transition-all">
            <Gift size={16} />
            <span>Free Download – No Credit Card Required</span>
          </div>

          {/* Main headline */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 animate-gradient-x">
              Ready to Transform?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Download{" "}
            <span className="text-gold-400 font-semibold">Lift Legends</span>{" "}
            now and experience AI-powered fitness like never before
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] group min-w-[250px]"
              onClick={() => (window.location.href = "/download")}
            >
              <Download size={20} className="mr-2 group-hover:animate-bounce" />
              Get It Free
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto border-gold-500/40 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/70 px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 min-w-[200px]"
              onClick={() => (window.location.href = "/programs")}
            >
              <ArrowRight size={20} className="mr-2" />
              View Programs
            </Button>
          </div>
        </div>

        {/* Mobile app preview */}
        <div
          className={`mt-16 transform transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="relative inline-block">
            <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-[32px] border border-white/20 shadow-[0_0_40px_rgba(255,215,0,0.2)] hover:shadow-[0_0_60px_rgba(255,215,0,0.3)] transition-all duration-500">
              <div className="w-64 h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-[24px] border-4 border-black flex flex-col overflow-hidden">
                {/* Status bar */}
                <div className="h-6 bg-black/40 flex items-center justify-between px-4">
                  <div className="text-white text-xs">12:30</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-white/80"></div>
                    <div className="w-1 h-1 rounded-full bg-white/80"></div>
                  </div>
                </div>

                {/* App content */}
                <div className="flex-1 flex flex-col items-center p-4">
                  {/* Logo */}
                  <div className="w-full flex justify-center items-center mt-4 mb-4">
                    <img
                      src="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
                      alt="Lift Legends Logo"
                      className="w-20 h-auto"
                      loading="lazy"
                    />
                  </div>

                  {/* App features */}
                  <div className="w-full space-y-3">
                    <div className="bg-gold-500/20 rounded-lg p-3 border border-gold-500/40">
                      <div className="text-gold-400 text-sm font-medium text-center">
                        AI Fitness Coach
                      </div>
                    </div>

                    <div className="bg-gray-800/60 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gold-500"></div>
                        <div className="text-white text-xs">
                          Smart Training Program
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gold-500/70"></div>
                        <div className="text-white text-xs">
                          Custom Nutrition Plan
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gold-500/70"></div>
                        <div className="text-white text-xs">Supplement Guide</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom navigation */}
                <div className="w-full bg-gray-800/40 rounded-full py-2 px-4 flex justify-around mb-3">
                  <div className="w-6 h-6 rounded-full bg-gold-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gold-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gold-500/40 shadow-lg animate-float">
              <p className="text-xs text-gold-400 font-medium">100% Free!</p>
            </div>
            <div
              className="absolute bottom-8 -left-8 bg-gray-900/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gold-500/40 shadow-lg animate-float"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-xs text-gold-400 font-medium">AI-Powered</p>
            </div>
          </div>
        </div>

        {/* Final urgency message */}
        <div
          className={`mt-12 transform transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-white/60 text-sm">
            ⚡ Free download – No signup required to start
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;