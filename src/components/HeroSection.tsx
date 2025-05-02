
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-b from-black to-gray-900"></div>
      <div className="absolute -z-10 top-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gold-500 rounded-full blur-[100px] opacity-10"></div>
      
      <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
          <span className="text-gradient">LiftLegends</span>
        </h1>
        <h2 className="text-xl md:text-2xl text-white/90">
          مربی بدنسازی هوشمند شما
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105">
            دانلود برای اندروید
          </Button>
          <Button variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500/10 px-8 py-6 text-lg font-medium rounded-xl transition-all">
            دانلود مستقیم APK
          </Button>
        </div>
        
        <div className="mt-12 relative w-full max-w-md mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black p-1.5 rounded-2xl glass-morphism border border-white/10 shadow-[0_0_25px_rgba(255,215,0,0.15)]">
            <div className="aspect-[9/16] max-h-[500px] overflow-hidden rounded-2xl">
              <img 
                src="https://source.unsplash.com/random/720x1280/?fitness-app" 
                alt="LiftLegends App Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          className="text-gold-500 hover:text-gold-400 transition-colors" 
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to features"
        >
          <ArrowDown size={32} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
