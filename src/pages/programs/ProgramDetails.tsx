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
  weeks: WeekProgram[];
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
  weeks: Record<number, WeekProgress>;
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
  const [activeTab, setActiveTab] = useState<string>("week1");
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
        weeks: {}
      };
      
      // Initialize progress structure based on program data
      programData.weeks.forEach(week => {
        newProgress.weeks[week.week_number] = {
          completed: false,
          workouts: {},
          timestamp: 0
        };
        
        week.workouts.forEach(workout => {
          newProgress.weeks[week.week_number].workouts[workout.day_number] = {
            completed: false,
            exercises: {},
            timestamp: 0
          };
          
          workout.exercises.forEach((_, index) => {
            newProgress.weeks[week.week_number].workouts[workout.day_number].exercises[index] = {
              completed: false
            };
          });
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
        weeks: {}
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
  const toggleExerciseCompletion = (weekNumber: number, dayNumber: number, exerciseIndex: number) => {
    if (!progress || !hasPurchased) return;
    
    const updatedProgress = { ...progress };
    const exerciseProgress = updatedProgress.weeks[weekNumber]?.workouts[dayNumber]?.exercises[exerciseIndex];
    
    if (exerciseProgress) {
      exerciseProgress.completed = !exerciseProgress.completed;
      exerciseProgress.timestamp = Date.now();
      
      // Update workout completion status
      const workout = updatedProgress.weeks[weekNumber]?.workouts[dayNumber];
      if (workout) {
        const allExercisesCompleted = Object.values(workout.exercises).every(ex => ex.completed);
        workout.completed = allExercisesCompleted;
        if (allExercisesCompleted) {
          workout.timestamp = Date.now();
        }
      }
      
      // Update week completion status
      const week = updatedProgress.weeks[weekNumber];
      if (week) {
        const allWorkoutsCompleted = Object.values(week.workouts).every(w => w.completed);
        week.completed = allWorkoutsCompleted;
        if (allWorkoutsCompleted) {
          week.timestamp = Date.now();
        }
      }
      
      // Calculate overall progress
      const totalExercises = Object.values(updatedProgress.weeks).flatMap(week => 
        Object.values(week.workouts).flatMap(workout => 
          Object.values(workout.exercises)
        )
      ).length;
      
      const completedExercises = Object.values(updatedProgress.weeks).flatMap(week => 
        Object.values(week.workouts).flatMap(workout => 
          Object.values(workout.exercises).filter(ex => ex.completed)
        )
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
        Array.isArray(data.weeks) &&
        // Validate that weeks have the expected structure
        data.weeks.every((week: WeekProgram) => 
          typeof week.week_number === 'number' &&
          typeof week.description === 'string' &&
          Array.isArray(week.workouts)
        )
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
        
        // Validate program details before using them
        if (validateProgramDetails(programDetails)) {
          setProgramData(programDetails);
          
          // Initialize progress tracking
          const initialProgress = initializeProgress(programDetails);
          setProgress(initialProgress);
          saveProgress(initialProgress);
        } else {
          console.error("Program details do not match expected format:", programDetails);
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
  
  // Function to render exercise rows
  const renderExercises = (exercises: Exercise[], weekNumber: number, dayNumber: number) => {
    if (!exercises || exercises.length === 0) {
      return (
        <div className="text-center py-4 text-gray-400">
          روز استراحت - بدن نیاز به ریکاوری دارد
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-2 px-3 text-right text-gray-400 font-medium">تمرین</th>
              <th className="py-2 px-3 text-center text-gray-400 font-medium">ست</th>
              <th className="py-2 px-3 text-center text-gray-400 font-medium">تکرار</th>
              <th className="py-2 px-3 text-center text-gray-400 font-medium">استراحت</th>
              {hasPurchased && <th className="py-2 px-3 text-center text-gray-400 font-medium">وضعیت</th>}
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise, index) => {
              const isCompleted = progress?.weeks[weekNumber]?.workouts[dayNumber]?.exercises[index]?.completed || false;
              
              return (
                <tr 
                  key={index} 
                  className={`border-b border-gray-800 ${exercise.is_fst7 ? 'bg-gold-500/5' : ''} ${isCompleted ? 'bg-green-900/10' : ''}`}
                >
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end">
                      <span className={isCompleted ? 'text-green-400' : ''}>{exercise.name}</span>
                      {exercise.is_fst7 && (
                        <Badge className="mr-2 bg-gold-500/20 text-gold-500 border-gold-500/30">
                          FST-7
                        </Badge>
                      )}
                    </div>
                    {exercise.notes && (
                      <div className="text-xs text-gray-400 mt-1">{exercise.notes}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">{exercise.sets}</td>
                  <td className="py-3 px-3 text-center">{exercise.reps}</td>
                  <td className="py-3 px-3 text-center">{exercise.rest}</td>
                  {hasPurchased && (
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleExerciseCompletion(weekNumber, dayNumber, index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <CheckCircle className={`h-5 w-5 ${isCompleted ? 'fill-green-500' : ''}`} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{programInfo.title}</h1>
          <p className="text-gray-400 max-w-3xl mx-auto mb-6">
            {programInfo.description}
          </p>
          
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
              onClick={() => navigate(`/checkout/${programId}`)}
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
                {Object.values(progress.weeks).filter(w => w.completed).length} از {programData.weeks.length} هفته تکمیل شده
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
                onClick={() => navigate(`/checkout/${programId}`)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                خرید این برنامه
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs 
            defaultValue="week1" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6 w-full overflow-x-auto flex flex-nowrap justify-start md:justify-center p-1 bg-gray-900 rounded-lg">
              {programData.weeks.map((week) => {
                const isCompleted = progress?.weeks[week.week_number]?.completed || false;
                return (
                  <TabsTrigger 
                    key={week.week_number} 
                    value={`week${week.week_number}`}
                    className={`whitespace-nowrap relative ${isCompleted ? 'text-green-400' : ''}`}
                  >
                    {isCompleted && (
                      <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 fill-green-500 text-black" />
                    )}
                    هفته {week.week_number}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {programData.weeks.map((week) => (
              <TabsContent key={week.week_number} value={`week${week.week_number}`}>
                <Card className="bg-gray-900 border border-gray-800 shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>هفته {week.week_number}</CardTitle>
                        <CardDescription>{week.description}</CardDescription>
                      </div>
                      {progress?.weeks[week.week_number]?.completed && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          تکمیل شده
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion 
                      type="single" 
                      collapsible 
                      className="w-full"
                      value={activeAccordion}
                      onValueChange={setActiveAccordion}
                    >
                      {week.workouts.map((workout, index) => {
                        const isWorkoutCompleted = progress?.weeks[week.week_number]?.workouts[workout.day_number]?.completed || false;
                        const dayId = `day-${week.week_number}-${index}`;
                        
                        return (
                          <AccordionItem 
                            key={index} 
                            value={dayId}
                            className={`border-b border-gray-800 ${isWorkoutCompleted ? 'bg-green-900/5' : ''}`}
                          >
                            <AccordionTrigger className="text-right">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <span className={isWorkoutCompleted ? 'text-green-400' : ''}>
                                    {workout.day_name}: {workout.title}
                                  </span>
                                  {isWorkoutCompleted && (
                                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="ml-2">
                                    {workout.exercises.length} تمرین
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {workout.notes && (
                                <div className="mb-4 p-3 bg-gray-800/50 rounded-md text-gray-300 text-sm">
                                  <strong className="text-gold-500">نکته:</strong> {workout.notes}
                                </div>
                              )}
                              {renderExercises(workout.exercises, week.week_number, workout.day_number)}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
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