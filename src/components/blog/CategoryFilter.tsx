
import { Button } from "@/components/ui/button";
import { Brain, Dumbbell, Pill, Utensils } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isVisible: boolean;
}

const CategoryFilter = ({ activeCategory, setActiveCategory, isVisible }: CategoryFilterProps) => {
  return (
    <div className={`flex flex-wrap justify-center gap-3 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: "300ms" }}>
      <Button 
        variant={activeCategory === "all" ? "default" : "outline"} 
        className={activeCategory === "all" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
        onClick={() => setActiveCategory("all")}
      >
        همه مقالات
      </Button>
      <Button 
        variant={activeCategory === "workout" ? "default" : "outline"} 
        className={activeCategory === "workout" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
        onClick={() => setActiveCategory("workout")}
      >
        <Dumbbell size={16} className="ml-2" />
        تمرین و برنامه‌ریزی
      </Button>
      <Button 
        variant={activeCategory === "nutrition" ? "default" : "outline"} 
        className={activeCategory === "nutrition" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
        onClick={() => setActiveCategory("nutrition")}
      >
        <Utensils size={16} className="ml-2" />
        تغذیه و رژیم
      </Button>
      <Button 
        variant={activeCategory === "supplements" ? "default" : "outline"} 
        className={activeCategory === "supplements" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
        onClick={() => setActiveCategory("supplements")}
      >
        <Pill size={16} className="ml-2" />
        مکمل‌ها
      </Button>
      <Button 
        variant={activeCategory === "motivation" ? "default" : "outline"} 
        className={activeCategory === "motivation" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-white border-white/20 hover:bg-white/10"}
        onClick={() => setActiveCategory("motivation")}
      >
        <Brain size={16} className="ml-2" />
        انگیزش و روانشناسی
      </Button>
    </div>
  );
};

export default CategoryFilter;
