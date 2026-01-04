import { Activity, Dumbbell, Utensils, Brain, Calendar, BarChart3, Zap, Download, Shield, Pill, Award, Sparkles, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AdditionalFeature {
  icon: ReactNode;
  title: string;
  badge?: string;
}

const features = [
  {
    icon: <Dumbbell size={28} />,
    title: "AI Training Programs",
    description: "Personalized workout plans built around your goals, experience level, and equipment—powered by advanced artificial intelligence.",
    tag: "Smart"
  },
  {
    icon: <Utensils size={28} />,
    title: "Custom Nutrition Plans",
    description: "Tailored meal plans designed to fuel your performance and accelerate results. Macros calculated. Meals planned. Goals crushed.",
    tag: "Personalized"
  },
  {
    icon: <Shield size={28} />,
    title: "Supplement & PED Guide",
    description: "Expert guidance on supplements and performance enhancers. Science-backed protocols tailored to your physique and objectives.",
    tag: "Expert"
  },
  {
    icon: <Brain size={28} />,
    title: "24/7 AI Coach",
    description: "Round-the-clock access to your AI fitness coach. Get instant answers, form corrections, and program adjustments anytime.",
    tag: "AI-Powered"
  },
  {
    icon: <Calendar size={28} />,
    title: "Weekly Programming",
    description: "Structured weekly training schedules optimized for progressive overload and recovery. Never wonder what to do next.",
    tag: "Organized"
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Progress Analytics",
    description: "Track your lifts, measurements, and body composition with detailed analytics. Visualize your transformation over time.",
    tag: "Data-Driven"
  },
];

const additionalFeatures: AdditionalFeature[] = [
  {
    icon: <Activity size={20} />,
    title: "Personal Records",
  },
  {
    icon: <Pill size={20} />,
    title: "Supplement Advisor",
  },
  {
    icon: <Award size={20} />,
    title: "Challenges",
  },
  {
    icon: <Clock size={20} />,
    title: "Workout Timer",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Cycle Planning",
  },
  {
    icon: <Brain size={20} />,
    title: "Nutrition Coach",
  }
];

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1 && !visibleFeatures.includes(index)) {
              setVisibleFeatures(prev => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [visibleFeatures]);

  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute -z-10 top-1/3 right-0 w-96 h-96 bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[150px] opacity-5"></div>
      <div className="absolute -z-10 bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-gold-400 to-amber-300 rounded-full blur-[130px] opacity-5"></div>
      <div className="absolute -z-10 top-2/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[120px] opacity-3"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 text-sm px-5 py-2 rounded-full border border-gold-500/20 mb-5 hover:border-gold-500/40 transition-colors">
            Elite Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 animate-gradient-x">
            Everything You Need to Dominate
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
            Unlock your full potential with Lift Legends. Our <span className="text-gold-400 font-medium">AI-powered platform</span> delivers everything you need to build the physique you deserve.
          </p>
        </div>

        {/* Main features grid */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="h-full"
                ref={el => featureRefs.current[index] = el}
              >
                <div 
                  className={`relative h-full bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl glass-morphism border border-white/10 shadow-[0_0_25px_rgba(255,215,0,0.1)] overflow-hidden group hover:border-gold-500/30 hover:shadow-[0_0_35px_rgba(255,215,0,0.15)] transition-all duration-500 transform ${visibleFeatures.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Hover effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-500/20 to-amber-500/10 text-gold-400 text-xs px-3 py-1 rounded-full border border-gold-500/20 font-medium">
                    {feature.tag}
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-5 flex flex-col items-center text-center pt-4">
                    <div className="bg-gradient-to-br from-gold-400 to-amber-500 p-5 rounded-xl text-black inline-block group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-gold-400 transition-colors">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                    
                    {/* Learn more link */}
                    <button 
                      type="button"
                      className="text-gold-400 hover:text-gold-300 flex items-center gap-1 text-sm mt-2 group-hover:translate-x-1 transition-transform border-0 bg-transparent p-0"
                    >
                      Learn More
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* App experience showcase */}
        <div className="my-32 relative">
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-gold-500/10 to-amber-500/5 rounded-full blur-[100px]"></div>
          
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-purple-400 text-sm px-5 py-2 rounded-full border border-purple-500/20 mb-5">
              App Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Exceptional User Experience</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Modern, intuitive design built for athletes who demand the best
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-500 hover:-translate-y-2 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-500/60 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-3">Dashboard</h3>
              <p className="text-center text-white/70 group-hover:text-purple-400 transition-colors">
                Quick access to all features with a clean, intuitive interface
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-500 hover:-translate-y-2 group md:transform md:translate-y-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gold-500/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gold-500/60 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-3">Training Hub</h3>
              <p className="text-center text-white/70 group-hover:text-gold-400 transition-colors">
                Personalized workouts with detailed instructions and video demos
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.1)] transition-all duration-500 hover:-translate-y-2 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-amber-500/60 rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-3">Supplement Stack</h3>
              <p className="text-center text-white/70 group-hover:text-amber-400 transition-colors">
                Expert guidance on supplements and performance enhancers
              </p>
            </div>
          </div>
        </div>
        
        {/* Additional features */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-6 text-white">More Power Features</h3>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            Beyond the core features, Lift Legends packs everything you need to dominate your fitness journey
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-white/5 hover:border-gold-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:-translate-y-1 group text-center relative"
              >
                {feature.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {feature.badge}
                  </div>
                )}
                <div className="bg-gradient-to-br from-gold-400 to-amber-500 p-3 rounded-lg text-black inline-block mb-4 group-hover:scale-110 transition-transform shadow-md">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-medium text-white group-hover:text-gold-400 transition-colors">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-32 bg-gradient-to-r from-gray-900 to-black p-10 rounded-2xl border border-gold-500/20 relative overflow-hidden group hover:border-gold-500/40 transition-all duration-500">
          <div className="absolute -z-10 top-0 right-0 w-80 h-80 bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[120px] opacity-10 group-hover:opacity-15 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-white">
                Ready to <span className="text-gradient">Transform</span>?
              </h3>
              <p className="text-white/70 max-w-xl leading-relaxed">
                Download Lift Legends today and start building the physique you deserve. No excuses. Just results.
              </p>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]"
              onClick={() => window.location.href = "/download"}
            >
              <Download size={20} className="mr-2" />
              Download Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;