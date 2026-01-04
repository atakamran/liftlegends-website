import { Instagram, MessageCircle, Twitter, Linkedin, Mail, MapPin, Phone, Download, ArrowUp, Dumbbell, Shield, Brain, Utensils, Star, ChevronRight, QrCode, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const FooterSection = () => {
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

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  return (
    <footer id="footer" className="bg-gradient-to-b from-gray-900 via-black to-black pt-24 pb-10 px-4 border-t border-white/10 relative">
      {/* Background effects */}
      <div className="absolute -z-10 bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute -z-10 top-20 right-20 w-80 h-80 bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[180px] opacity-5"></div>
      <div className="absolute -z-10 bottom-40 left-20 w-64 h-64 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[150px] opacity-5"></div>
      
      {/* Back to top button */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black p-4 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* App download banner */}
        <div className={`bg-gradient-to-br from-gray-900 to-black p-10 md:p-12 rounded-3xl border border-gold-500/20 mb-20 relative overflow-hidden group hover:border-gold-500/40 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-gradient-to-r from-gold-500 to-amber-400 rounded-full blur-[150px] opacity-10 group-hover:opacity-15 transition-opacity"></div>
          <div className="absolute -z-10 bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-[100px] opacity-5 group-hover:opacity-10 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 animate-gradient-x">
                Download Lift Legends Today
              </h3>
              <p className="text-white/70 max-w-xl text-lg leading-relaxed">
                Start your transformation with Lift Legends. <span className="text-gold-400 font-medium">AI-powered training</span>, <span className="text-gold-400 font-medium">custom nutrition</span>, and <span className="text-gold-400 font-medium">supplement guidance</span> always at your fingertips.
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500/30 flex items-center gap-2 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
                  <Dumbbell size={16} className="text-gold-500 group-hover:scale-110 transition-transform" />
                  <span className="text-white/80 text-sm group-hover:text-white transition-colors">AI Training</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500/30 flex items-center gap-2 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
                  <Shield size={16} className="text-gold-500 group-hover:scale-110 transition-transform" />
                  <span className="text-white/80 text-sm group-hover:text-white transition-colors">Supplement Guide</span>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gold-500/30 flex items-center gap-2 hover:border-gold-500/70 hover:bg-gray-800/80 transition-all duration-300 group">
                  <Brain size={16} className="text-gold-500 group-hover:scale-110 transition-transform" />
                  <span className="text-white/80 text-sm group-hover:text-white transition-colors">AI Coach</span>
                </div>
              </div>
            </div>
            
            {/* Download button and QR code */}
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="bg-white p-3 rounded-xl shadow-lg hidden md:block">
                <QrCode size={100} className="text-black" />
              </div>
              <div className="relative">
                <Button 
                  className="bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-600 hover:to-amber-500 text-black px-8 py-6 text-lg font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] group"
                  onClick={() => window.location.href = "/download"}
                >
                  <Download size={20} className="mr-2 group-hover:animate-bounce" />
                  Download App
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer main content */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-10 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-2 rounded-lg shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <Dumbbell size={24} className="text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gradient">Lift Legends</h3>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Your AI-powered fitness companion for achieving peak performance. Get personalized <span className="text-gold-400">training programs</span>, <span className="text-gold-400">nutrition plans</span>, and <span className="text-gold-400">supplement guidance</span>.
            </p>
            
            {/* Social media links */}
            <div className="flex items-center gap-4 mt-6">
              <a href="https://www.instagram.com/liftlegends" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-2 rounded-full transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com/liftlegends" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-blue-500 text-white hover:text-white p-2 rounded-full transition-all hover:scale-110 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </a>
              </li>
              <li>
                <a href="/blog" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Blog</span>
                </a>
              </li>
              <li>
                <a href="/download" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Download App</span>
                </a>
              </li>
              <li>
                <a href="#features" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Features</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company info */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg text-white">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="/about-us" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="/terms-of-use" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Terms of Use</span>
                </a>
              </li>
              <li>
                <a href="/coach-application" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                  <ChevronRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Become a Coach</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="font-semibold mb-6 text-lg text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:hello@liftlegends.io" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-3 group">
                  <div className="bg-gray-800/80 p-2 rounded-full group-hover:bg-gold-500/10 transition-colors">
                    <Mail size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">hello@liftlegends.io</span>
                </a>
              </li>
              <li>
                <a href="tel:+15550123" className="text-white/70 hover:text-gold-400 transition-colors flex items-center gap-3 group">
                  <div className="bg-gray-800/80 p-2 rounded-full group-hover:bg-gold-500/10 transition-colors">
                    <Phone size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">+1 (555) 012-3456</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800/80 p-2 rounded-full">
                    <MapPin size={18} className="text-gold-500" />
                  </div>
                  <p className="text-white/70">San Francisco, CA</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Features section */}
        <div className={`mt-16 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-6 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "400ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Dumbbell size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">AI Training Programs</h5>
              <p className="text-white/60 text-sm">Personalized workout plans powered by artificial intelligence</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Utensils size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">Nutrition Plans</h5>
              <p className="text-white/60 text-sm">Custom meal plans designed for your fitness goals</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Shield size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">Supplement Guide</h5>
              <p className="text-white/60 text-sm">Expert guidance on supplements and performance enhancers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-gold-500/10 p-2 rounded-lg">
              <Brain size={20} className="text-gold-500" />
            </div>
            <div>
              <h5 className="text-white font-medium mb-1">AI Coach</h5>
              <p className="text-white/60 text-sm">24/7 intelligent coaching powered by advanced AI</p>
            </div>
          </div>
        </div>
        
        {/* Copyright and legal */}
        <div className={`mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "600ms" }}>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-white/60 text-sm">© 2024 Lift Legends. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-6 text-white/50 text-sm">
            <a href="/privacy-policy" className="hover:text-gold-400 transition-colors">Privacy</a>
            <a href="/terms-of-use" className="hover:text-gold-400 transition-colors">Terms</a>
            <a href="/cookie-policy" className="hover:text-gold-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;