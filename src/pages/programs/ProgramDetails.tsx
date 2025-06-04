import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  Calendar, 
  Info, 
  Lock, 
  ShoppingCart, 
  CheckCircle, 
  Eye, 
  Award,
  BarChart
} from "lucide-react";

// Define interfaces for exercise and workout data
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  is_fst7?: boolean;
}

interface DayWorkout {
  day_number: number;
  day_name: string;
  title: string;
  exercises: Exercise[];
  notes?: string;
}

interface WeekProgram {
  week_number: number;
  description: string;
  workouts: DayWorkout[];
}

interface ProgramDetails {
  id: string;
  program_id: string;
  title: string;
  description: string;
  details: {
    language: string;
    difficulty_level: string;
    target_audience: string;
    equipment_needed: string[];
    estimated_duration: string;
    calories_burned: string;
  };
  workouts: DayWorkout[];
  created_at?: string;
  updated_at?: string;
}

interface ProgramSaleInfo {
  id: string;
  title: string;
  description: string;
  price: number;
  // Add other properties as needed
}

interface UserPurchase {
  id: string;
  user_id: string;
  program_id: string;
  payment_status: string;
  // Add other properties as needed
}

// Interfaces for tracking program progress
interface ExerciseProgress {
  completed: boolean;
  timestamp?: number;
}

interface WorkoutProgress {
  completed: boolean;
  exercises: Record<number, ExerciseProgress>;
  timestamp?: number;
}

interface WeekProgress {
  completed: boolean;
  workouts: Record<number, WorkoutProgress>;
  timestamp?: number;
}

interface ProgramProgress {
  viewed: boolean;
  lastViewed: number;
  workouts: Record<number, WorkoutProgress>;
  overallProgress: number;
}

const ProgramDetails = () => {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [programData, setProgramData] = useState<ProgramDetails | null>(null);
  const [programInfo, setProgramInfo] = useState<ProgramSaleInfo | null>(null);
  const [progress, setProgress] = useState<ProgramProgress | null>(null);
  // No longer need tabs
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  
  // Initialize or get program progress from localStorage
  const initializeProgress = (programData: ProgramDetails): ProgramProgress => {
    try {
      // Try to get existing progress from localStorage
      const storedProgressString = localStorage.getItem(`program_progress_${programId}`);
      let storedProgress: ProgramProgress | null = null;
      
      if (storedProgressString) {
        storedProgress = JSON.parse(storedProgressString);
      }
      
      if (storedProgress) {
        // Update last viewed timestamp
        storedProgress.lastViewed = Date.now();
        storedProgress.viewed = true;
        return storedProgress;
      }
      
      // Create new progress object if none exists
      const newProgress: ProgramProgress = {
        viewed: true,
        lastViewed: Date.now(),
        overallProgress: 0,
        workouts: {}
      };
      
      // Initialize progress structure based on program data
      programData.workouts.forEach(workout => {
        newProgress.workouts[workout.day_number] = {
          completed: false,
          exercises: {},
          timestamp: 0
        };
        
        workout.exercises.forEach((_, index) => {
          newProgress.workouts[workout.day_number].exercises[index] = {
            completed: false
          };
        });
      });
      
      return newProgress;
    } catch (error) {
      console.error("Error initializing progress:", error);
      // Return a basic progress object if there's an error
      return {
        viewed: true,
        lastViewed: Date.now(),
        overallProgress: 0,
        workouts: {}
      };
    }
  };
  
  // Save progress to localStorage
  const saveProgress = (updatedProgress: ProgramProgress) => {
    try {
      localStorage.setItem(`program_progress_${programId}`, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error("Error saving progress to localStorage:", error);
    }
  };
  
  // Toggle exercise completion status
  const toggleExerciseCompletion = (dayNumber: number, exerciseIndex: number) => {
    if (!progress || !hasPurchased) return;
    
    const updatedProgress = { ...progress };
    const exerciseProgress = updatedProgress.workouts[dayNumber]?.exercises[exerciseIndex];
    
    if (exerciseProgress) {
      exerciseProgress.completed = !exerciseProgress.completed;
      exerciseProgress.timestamp = Date.now();
      
      // Update workout completion status
      const workout = updatedProgress.workouts[dayNumber];
      if (workout) {
        const allExercisesCompleted = Object.values(workout.exercises).every(ex => ex.completed);
        workout.completed = allExercisesCompleted;
        if (allExercisesCompleted) {
          workout.timestamp = Date.now();
        }
      }
      
      // Calculate overall progress
      const totalExercises = Object.values(updatedProgress.workouts).flatMap(workout => 
        Object.values(workout.exercises)
      ).length;
      
      const completedExercises = Object.values(updatedProgress.workouts).flatMap(workout => 
        Object.values(workout.exercises).filter(ex => ex.completed)
      ).length;
      
      updatedProgress.overallProgress = totalExercises > 0 
        ? Math.round((completedExercises / totalExercises) * 100) 
        : 0;
      
      setProgress(updatedProgress);
      saveProgress(updatedProgress);
    }
  };
  
  // Function to validate if data conforms to ProgramDetails interface
  const validateProgramDetails = (data: any): data is ProgramDetails => {
    try {
      return (
        data &&
        typeof data.id === 'string' &&
        typeof data.program_id === 'string' &&
        typeof data.title === 'string' &&
        typeof data.description === 'string' &&
        data.details &&
        typeof data.details.language === 'string' &&
        typeof data.details.difficulty_level === 'string' &&
        typeof data.details.target_audience === 'string' &&
        Array.isArray(data.details.equipment_needed) &&
        typeof data.details.estimated_duration === 'string' &&
        typeof data.details.calories_burned === 'string' &&
        Array.isArray(data.workouts || data.weeks) // Accept either workouts or weeks for backward compatibility
      );
    } catch (error) {
      console.error("Error validating program details:", error);
      return false;
    }
  };

  // Check if user has purchased the program and fetch program data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        
        // Fetch program details
        const { data: programDetails, error: programError } = await supabase
          .from('program_details')
          .select('*')
          .eq('program_id', programId)
          .single();
          
        if (programError) {
          console.error("Error fetching program details:", programError);
          return;
        }
        
        // Fetch program info from programs_sale table
        const { data: programSaleInfo, error: saleError } = await supabase
          .from('programs_sale')
          .select('*')
          .eq('id', programId)
          .single();
          
        if (saleError) {
          console.error("Error fetching program sale info:", saleError);
          return;
        }
        
        // Validate and set program info
        if (programSaleInfo && typeof programSaleInfo.id === 'string' && 
            typeof programSaleInfo.title === 'string' && 
            typeof programSaleInfo.description === 'string' &&
            typeof programSaleInfo.price === 'number') {
          setProgramInfo(programSaleInfo);
        } else {
          console.error("Program sale info does not match expected format:", programSaleInfo);
        }
        
        // Transform data if needed
        let transformedProgramDetails = { ...programDetails };
        
        // Always use the workouts directly from the data provided
        if (programDetails.weeks && Array.isArray(programDetails.weeks)) {
          // Get all workouts from all weeks
          const allWorkouts = programDetails.weeks.flatMap(week => week.workouts);
          
          // Set workouts directly on the program details
          transformedProgramDetails.workouts = allWorkouts;
        }
        
        // Validate program details before using them
        if (validateProgramDetails(transformedProgramDetails)) {
          setProgramData(transformedProgramDetails);
          
          // Initialize progress tracking
          const initialProgress = initializeProgress(transformedProgramDetails);
          setProgress(initialProgress);
          saveProgress(initialProgress);
        } else {
          console.error("Program details do not match expected format:", transformedProgramDetails);
          setIsLoading(false);
          return;
        }
        
        if (!user) {
          // User is not logged in
          setHasPurchased(false);
          setIsLoading(false);
          return;
        }
        
        // Check if user has purchased this program
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('user_purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('program_id', programId)
          .eq('payment_status', 'completed');
          
        if (purchaseError) {
          console.error("Error checking purchase status:", purchaseError);
          setHasPurchased(false);
        } else {
          // If there are any purchases, the user has purchased the program
          setHasPurchased(purchaseData !== null && Array.isArray(purchaseData) && purchaseData.length > 0);
        }
      } catch (error) {
        console.error("Error in data fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (programId) {
      fetchData();
    }
  }, [programId]);
  
  // Add event listener to update button text based on accordion state
  useEffect(() => {
    const handleAccordionStateChange = () => {
      // Find all accordion triggers
      const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
      
      // For each trigger, update the text based on its state
      accordionTriggers.forEach(trigger => {
        const state = trigger.getAttribute('data-state');
        const textElement = trigger.querySelector('[data-state-text]');
        
        if (textElement) {
          if (state === 'open') {
            textElement.textContent = 'بستن جزئیات';
          } else {
            textElement.textContent = 'مشاهده جزئیات';
          }
        }
      });
    };
    
    // Run once on mount to set initial states
    handleAccordionStateChange();
    
    // Set up a mutation observer to watch for state changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          handleAccordionStateChange();
        }
      });
    });
    
    // Observe all accordion triggers
    document.querySelectorAll('[data-accordion-trigger]').forEach(trigger => {
      observer.observe(trigger, { attributes: true });
    });
    
    // Clean up observer on unmount
    return () => observer.disconnect();
  }, []); // Run once on mount
  
  // Function to render exercise rows
  const renderExercises = (exercises: Exercise[], dayNumber: number) => {
    if (!exercises || exercises.length === 0) {
      return (
        <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-blue-900/5 transition-all duration-300 py-6 px-4 my-2">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8 z-0"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/10 rounded-full -ml-6 -mb-6 z-0"></div>
          
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="bg-blue-900/30 p-3 rounded-full border border-blue-500/20 shadow-lg shadow-blue-900/10">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-blue-300 font-bold text-lg">روز استراحت</p>
            <div className="bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-500/10 text-center">
              <p className="text-gray-300 text-sm">بدن نیاز به ریکاوری دارد</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {exercises.map((exercise, index) => {
          const isCompleted = progress?.workouts[dayNumber]?.exercises[index]?.completed || false;
          
          return (
            <div 
              key={index}
              className={`rounded-lg border ${isCompleted ? 'border-green-500/20 bg-green-900/5' : 'border-gray-700/30 bg-gray-800/30'} 
                ${exercise.is_fst7 ? 'border-gold-500/20' : ''} p-3 transition-all duration-300 cursor-pointer
                hover:border-gold-500/30 hover:shadow-md hover:shadow-black/20`}
              onClick={() => hasPurchased && toggleExerciseCompletion(dayNumber, index)}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {hasPurchased && (
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-green-500 text-black' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      <CheckCircle className={`h-5 w-5 ${isCompleted ? '' : ''}`} />
                    </div>
                  )}
                  <h4 className={`font-medium ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                    {exercise.name}
                  </h4>
                  {exercise.is_fst7 && (
                    <Badge className="bg-gold-500/20 text-gold-500 border-gold-500/30">
                      FST-7
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`px-2 py-1 rounded-md text-xs ${isCompleted ? 'bg-green-900/20 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                    <span className="font-bold">{exercise.sets}</span> ست
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs ${isCompleted ? 'bg-green-900/20 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                    <span className="font-bold">{exercise.reps}</span> تکرار
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs ${isCompleted ? 'bg-green-900/20 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                    <span className="font-bold">{exercise.rest}</span> استراحت
                  </div>
                </div>
              </div>
              
              {exercise.notes && (
                <div className={`text-sm mt-2 p-2 rounded-md ${isCompleted ? 'bg-green-900/10 text-gray-300' : 'bg-gray-800 text-gray-400'}`}>
                  {exercise.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 lg:py-12 text-center">
        <p className="text-white">در حال بارگذاری برنامه...</p>
      </div>
    );
  }

  if (!programData || !programInfo) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 lg:py-12 text-center">
        <p className="text-white">برنامه مورد نظر یافت نشد.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/programs')}
        >
          بازگشت به لیست برنامه‌ها
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:py-12">
      <Helmet>
        <title>{programInfo.title} | لیفت لجندز</title>
        <meta name="robots" content="noindex" />
        <meta name="description" content={programInfo.description} />
      </Helmet>

      {/* Header Section with Progress Bar */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{programInfo.title}</h1>
          
          {hasPurchased && progress && (
            <div className="max-w-xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">پیشرفت شما</span>
                <span className="text-sm font-medium text-gold-500">{progress.overallProgress}%</span>
              </div>
              <Progress 
                value={progress.overallProgress} 
                className="h-2 bg-gray-800" 
                indicatorClassName="bg-gradient-to-r from-gold-500 to-gold-400" 
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>شروع</span>
                <span>تکمیل</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Program Status Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {progress?.viewed && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 py-1.5 px-3">
              <Eye className="h-3.5 w-3.5 mr-1" />
              مشاهده شده
            </Badge>
          )}
          
          {hasPurchased && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 py-1.5 px-3">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              خریداری شده
            </Badge>
          )}
          
          {progress?.overallProgress === 100 && (
            <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30 py-1.5 px-3">
              <Award className="h-3.5 w-3.5 mr-1" />
              تکمیل شده
            </Badge>
          )}
        </div>
      </div>

      {/* Introduction Card */}
      <Card className="mb-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-gold-500">درباره {programData.title}</CardTitle>
          <CardDescription>اصول و مزایای این برنامه تمرینی</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
              <Dumbbell className="h-5 w-5 text-gold-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">سطح دشواری</h3>
                <p>{programData.details.difficulty_level}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
              <Info className="h-5 w-5 text-gold-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">مناسب برای</h3>
                <p>{programData.details.target_audience}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
              <Calendar className="h-5 w-5 text-gold-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">مدت زمان برنامه</h3>
                <p>{programData.details.estimated_duration}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
              <Clock className="h-5 w-5 text-gold-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">تجهیزات مورد نیاز</h3>
                <p>{programData.details.equipment_needed.join('، ')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors md:col-span-2">
              <Flame className="h-5 w-5 text-gold-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">کالری سوزی</h3>
                <p>{programData.details.calories_burned}</p>
              </div>
            </div>
          </div>
        </CardContent>
        {!hasPurchased && (
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-black shadow-lg shadow-gold-500/20"
              onClick={() => navigate(`/product/${programId}`)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              خرید این برنامه - {programInfo.price.toLocaleString()} تومان
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Program Content */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">محتوای برنامه</h2>
          {hasPurchased && progress && (
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-gold-500" />
              <span className="text-sm text-gray-400">
                {progress.overallProgress}% تکمیل شده
              </span>
            </div>
          )}
        </div>
        
        {!hasPurchased ? (
          <Card className="bg-gray-900 border border-gray-800 shadow-xl">
            <CardContent className="pt-6 text-center">
              <Lock className="h-12 w-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">محتوای قفل شده</h3>
              <p className="text-gray-400 mb-4">
                برای دسترسی به جزئیات کامل برنامه، لطفا آن را خریداری کنید.
              </p>
              <Button 
                className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-black shadow-lg shadow-gold-500/20"
                onClick={() => navigate(`/product/${programId}`)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                خرید این برنامه
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full">
            <Card className="bg-gray-900 border border-gray-800 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>برنامه تمرینی</CardTitle>
                    <CardDescription>{programData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {programData.workouts.map((workout, index) => {
                    const isWorkoutCompleted = progress?.workouts[workout.day_number]?.completed || false;
                    const dayId = `day-${workout.day_number}-${index}`;
                        
                        return (
                          <div 
                            key={index}
                            className={`relative overflow-hidden rounded-xl border ${isWorkoutCompleted ? 'border-green-500/30 bg-green-900/10' : 'border-gray-700/50 bg-gray-800/30'} 
                              transition-all duration-300 hover:shadow-lg hover:shadow-gold-900/10 group cursor-pointer`}
                            onClick={(e) => {
                              // Get the current state of the accordion
                              const accordionTrigger = document.querySelector(`[data-state][data-accordion-trigger="${dayId}"]`);
                              const isOpen = accordionTrigger?.getAttribute('data-state') === 'open';
                              
                              // Only open if it's currently closed
                              if (!isOpen && accordionTrigger) {
                                (accordionTrigger as HTMLElement).click();
                              }
                            }}
                          >
                            {/* Day badge */}
                            <div className="absolute top-3 right-3 z-10">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                                ${isWorkoutCompleted ? 'bg-green-500 text-black' : 'bg-gold-500/20 text-gold-300'} 
                                font-bold text-sm transition-all duration-300`}>
                                {workout.day_number}
                              </div>
                            </div>
                            
                            {/* Completed checkmark */}
                            {isWorkoutCompleted && (
                              <div className="absolute top-3 left-3 z-10">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400">
                                  <CheckCircle className="h-5 w-5" />
                                </div>
                              </div>
                            )}
                            
                            {/* Card content */}
                            <Accordion 
                              type="single" 
                              collapsible 
                              className="w-full"
                            >
                              <AccordionItem 
                                value={dayId}
                                className="border-0"
                              >
                                <div className="pt-12 px-4 pb-4">
                                  <div className="flex flex-col">
                                    <h3 className={`font-bold text-lg mb-2 ${isWorkoutCompleted ? 'text-green-400' : 'text-white'}`}>
                                      {workout.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3">
                                      <Badge variant="outline" className={`${isWorkoutCompleted ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-gray-800/80 border-gray-700 text-gold-300'}`}>
                                        {workout.exercises.length} تمرین
                                      </Badge>
                                      <Badge variant="outline" className={`${isWorkoutCompleted ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-gray-800/80 border-gray-700 text-gold-300'}`}>
                                        {workout.day_name}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {/* Expandable button */}
                                  <AccordionTrigger data-accordion-trigger={dayId} className="py-2 px-4 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-200 w-full flex justify-between items-center">
                                    <span className="text-sm font-medium" data-state-text="true">مشاهده جزئیات</span>
                                  </AccordionTrigger>
                                </div>
                                
                                <AccordionContent className="px-4 pb-4">
                                  {workout.notes && (
                                    <div className="mb-4 p-3 bg-gray-800/50 rounded-md text-gray-300 text-sm">
                                      <strong className="text-gold-500">نکته:</strong> {workout.notes}
                                    </div>
                                  )}
                                  {renderExercises(workout.exercises, workout.day_number)}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                            
                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
      </div>

      {/* Tips Section */}
      <Card className="mb-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-gold-500">نکات مهم</CardTitle>
          <CardDescription>برای دستیابی به بهترین نتایج</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-gold-500/30">
              <p className="text-gray-300">• قبل از شروع تمرین، حتما بدن خود را گرم کنید.</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-gold-500/30">
              <p className="text-gray-300">• در تمرینات FST-7، استراحت بین ست‌ها باید کوتاه باشد تا پمپ عضلانی حفظ شود.</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-gold-500/30">
              <p className="text-gray-300">• در طول برنامه، مصرف پروتئین و کربوهیدرات کافی را فراموش نکنید.</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-gold-500/30">
              <p className="text-gray-300">• برای جلوگیری از آسیب، فرم صحیح حرکات را رعایت کنید.</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-gold-500/30 md:col-span-2">
              <p className="text-gray-300">• بین جلسات تمرینی، به بدن خود استراحت کافی بدهید.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Reset Progress Button (Only for purchased programs) */}
      {hasPurchased && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="text-gray-400 hover:text-white"
            onClick={() => {
              if (confirm('آیا مطمئن هستید که می‌خواهید پیشرفت خود را بازنشانی کنید؟')) {
                localStorage.removeItem(`program_progress_${programId}`);
                window.location.reload();
              }
            }}
          >
            بازنشانی پیشرفت برنامه
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProgramDetails;