
import { Brain, Dumbbell, Pill, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isVisible: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

const CategoryFilter = ({ activeCategory, setActiveCategory, isVisible }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Use static categories since they are stored in blog_posts.category field
  useEffect(() => {
    // Set static categories directly
    setCategories([
      { id: "all", name: "همه مقالات", slug: "all", shortLabel: "همه", icon: null, color: "gold" },
      { id: "workout", name: "تمرین و برنامه‌ریزی", slug: "workout", shortLabel: "تمرین", icon: <Dumbbell size={16} />, color: "blue" },
      { id: "nutrition", name: "تغذیه و رژیم", slug: "nutrition", shortLabel: "تغذیه", icon: <Utensils size={16} />, color: "green" },
      { id: "supplements", name: "مکمل‌ها", slug: "supplements", shortLabel: "مکمل‌ها", icon: <Pill size={16} />, color: "purple" },
      { id: "motivation", name: "انگیزش و روانشناسی", slug: "motivation", shortLabel: "انگیزش", icon: <Brain size={16} />, color: "pink" }
    ]);
    setLoading(false);
  }, []);

  // Helper function to get category icon
  const getCategoryIcon = (slug: string) => {
    switch(slug.toLowerCase()) {
      case 'workout':
      case 'تمرین':
        return <Dumbbell size={16} />;
      case 'nutrition':
      case 'تغذیه':
        return <Utensils size={16} />;
      case 'supplements':
      case 'مکمل':
        return <Pill size={16} />;
      case 'motivation':
      case 'انگیزش':
        return <Brain size={16} />;
      default:
        return <Dumbbell size={16} />;
    }
  };

  // Helper function to get category color
  const getCategoryColor = (slug: string) => {
    switch(slug.toLowerCase()) {
      case 'workout':
      case 'تمرین':
        return "blue";
      case 'nutrition':
      case 'تغذیه':
        return "green";
      case 'supplements':
      case 'مکمل':
        return "purple";
      case 'motivation':
      case 'انگیزش':
        return "pink";
      default:
        return "blue";
    }
  };

  // Get color class based on category
  const getColorClass = (color: string, isActive: boolean) => {
    if (!isActive) return "from-white/5 to-white/5 hover:from-white/10 hover:to-white/10";
    
    switch(color) {
      case "gold": return "from-gold-500 to-gold-400";
      case "blue": return "from-blue-500 to-blue-400";
      case "green": return "from-green-500 to-green-400";
      case "purple": return "from-purple-500 to-purple-400";
      case "pink": return "from-pink-500 to-pink-400";
      default: return "from-gold-500 to-gold-400";
    }
  };

  if (loading) {
    return (
      <div className="mb-12 sm:mb-16 px-2 sm:px-0">
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-zinc-800">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="animate-pulse bg-gray-700 rounded-xl h-10 w-20"></div>
            <div className="animate-pulse bg-gray-700 rounded-xl h-10 w-24"></div>
            <div className="animate-pulse bg-gray-700 rounded-xl h-10 w-20"></div>
          </div>
        </div>
      </div>
    );
  }

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
                bg-gradient-to-r ${getColorClass(category.color, activeCategory === category.id)}
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
              <span className="relative hidden xs:inline">{category.name}</span>
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
