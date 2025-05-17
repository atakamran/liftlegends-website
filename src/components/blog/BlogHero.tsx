
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface BlogHeroProps {
  isVisible: boolean;
}

const BlogHero = ({ isVisible }: BlogHeroProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
      {/* Background effects */}
      <div className="absolute -z-10 top-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gold-500 rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute -z-10 bottom-40 right-10 w-40 h-40 bg-gold-400 rounded-full blur-[80px] opacity-5 animate-pulse"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            بلاگ لیفت لجندز
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            آخرین مقالات و راهنماهای تخصصی در زمینه بدنسازی، تغذیه و تناسب اندام
          </p>
        </div>

        {/* Search Bar */}
        <div className={`max-w-2xl mx-auto mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "200ms" }}>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-4 pr-12 rounded-xl bg-zinc-800/50 border border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-white placeholder-gray-400 transition-all"
              placeholder="جستجو در مقالات..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
