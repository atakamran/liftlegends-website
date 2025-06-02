
import { Button } from "@/components/ui/button";
import { Brain, Dumbbell, Pill, Utensils } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isVisible: boolean;
}

const CategoryFilter = ({ activeCategory, setActiveCategory, isVisible }: CategoryFilterProps) => {
  return (
    <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-16 transition-all duration-1000 overflow-x-auto pb-2 px-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
      <Button 
        variant={activeCategory === "all" ? "default" : "outline"} 
        className={`text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 h-auto ${activeCategory === "all" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}`}
        onClick={() => setActiveCategory("all")}
      >
        همه مقالات
      </Button>
      <Button 
        variant={activeCategory === "workout" ? "default" : "outline"} 
        className={`text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 h-auto ${activeCategory === "workout" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}`}
        onClick={() => setActiveCategory("workout")}
      >
        <Dumbbell size={14} className="ml-1 sm:ml-2" />
        <span className="hidden xs:inline">تمرین و برنامه‌ریزی</span>
        <span className="xs:hidden">تمرین</span>
      </Button>
      <Button 
        variant={activeCategory === "nutrition" ? "default" : "outline"} 
        className={`text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 h-auto ${activeCategory === "nutrition" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}`}
        onClick={() => setActiveCategory("nutrition")}
      >
        <Utensils size={14} className="ml-1 sm:ml-2" />
        <span className="hidden xs:inline">تغذیه و رژیم</span>
        <span className="xs:hidden">تغذیه</span>
      </Button>
      <Button 
        variant={activeCategory === "supplements" ? "default" : "outline"} 
        className={`text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 h-auto ${activeCategory === "supplements" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}`}
        onClick={() => setActiveCategory("supplements")}
      >
        <Pill size={14} className="ml-1 sm:ml-2" />
        مکمل‌ها
      </Button>
      <Button 
        variant={activeCategory === "motivation" ? "default" : "outline"} 
        className={`text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 h-auto ${activeCategory === "motivation" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}`}
        onClick={() => setActiveCategory("motivation")}
      >
        <Brain size={14} className="ml-1 sm:ml-2" />
        <span className="hidden xs:inline">انگیزش و روانشناسی</span>
        <span className="xs:hidden">انگیزش</span>
      </Button>
    </div>
  );
};

export default CategoryFilter;
