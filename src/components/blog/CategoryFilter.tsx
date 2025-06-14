
import { Brain, Dumbbell, Pill, Utensils } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isVisible: boolean;
}

const CategoryFilter = ({ activeCategory, setActiveCategory, isVisible }: CategoryFilterProps) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Category data
  const categories = [
    { id: "all", label: "همه مقالات", shortLabel: "همه", icon: null, color: "gold" },
    { id: "workout", label: "تمرین و برنامه‌ریزی", shortLabel: "تمرین", icon: <Dumbbell size={16} />, color: "blue" },
    { id: "nutrition", label: "تغذیه و رژیم", shortLabel: "تغذیه", icon: <Utensils size={16} />, color: "green" },
    { id: "supplements", label: "مکمل‌ها", shortLabel: "مکمل‌ها", icon: <Pill size={16} />, color: "purple" },
    { id: "motivation", label: "انگیزش و روانشناسی", shortLabel: "انگیزش", icon: <Brain size={16} />, color: "pink" }
  ];

  // Get color class based on category
  const getColorClass = (category: string, isActive: boolean) => {
    if (!isActive) return "from-white/5 to-white/5 hover:from-white/10 hover:to-white/10";
    
    switch(category) {
      case "all": return "from-gold-500 to-gold-400";
      case "workout": return "from-blue-500 to-blue-400";
      case "nutrition": return "from-green-500 to-green-400";
      case "supplements": return "from-purple-500 to-purple-400";
      case "motivation": return "from-pink-500 to-pink-400";
      default: return "from-gold-500 to-gold-400";
    }
  };

  return (
    <motion.div 
      className="mb-12 sm:mb-16 px-2 sm:px-0"
      variants={container}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-zinc-800 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-max">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              variants={item}
              className={`
                relative group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl
                bg-gradient-to-r ${getColorClass(category.id, activeCategory === category.id)}
                transition-all duration-300 text-sm sm:text-base
                ${activeCategory === category.id ? 'text-black font-medium shadow-lg' : 'text-white hover:text-white/90'}
              `}
              onClick={() => setActiveCategory(category.id)}
            >
              {/* Glow Effect on Active */}
              {activeCategory === category.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent blur opacity-50"></div>
              )}
              
              {/* Icon */}
              {category.icon && (
                <span className="relative">{category.icon}</span>
              )}
              
              {/* Label */}
              <span className="relative hidden xs:inline">{category.label}</span>
              <span className="relative xs:hidden">{category.shortLabel}</span>
              
              {/* Active Indicator */}
              {activeCategory === category.id && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black"></span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
