import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
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
import { Dumbbell, Clock, Flame, Calendar, Info, Lock, ShoppingCart } from "lucide-react";

// Define interfaces for exercise and workout data
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface DayWorkout {
  day: string;
  title: string;
  exercises: Exercise[];
  notes?: string;
}

interface WeekProgram {
  week: number;
  description: string;
  workouts: DayWorkout[];
}

// Define interface for user purchases
interface UserPurchase {
  id: string;
  user_id: string;
  program_id: string;
  payment_status: string;
  created_at: string;
}

// Import the PurchasePrompt component
import PurchasePrompt from "@/components/program/PurchasePrompt";

const Fst7Program = () => {
  const navigate = useNavigate();
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // FST-7 Program ID (the one you provided)
  const FST7_PROGRAM_ID = "22cfde61-03b7-48d5-936f-0a2f6fa04bdc";
  
  // Check if user has purchased the program
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // User is not logged in
          setHasPurchased(false);
          setIsLoading(false);
          return;
        }
        
        // Check if user has purchased this program
        const { data, error } = await supabase
          .from('user_purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('program_id', FST7_PROGRAM_ID)
          .eq('payment_status', 'completed');
          
        if (error) {
          console.error("Error checking purchase status:", error);
          setHasPurchased(false);
        } else {
          // If there are any purchases, the user has purchased the program
          setHasPurchased(data && data.length > 0);
        }
      } catch (error) {
        console.error("Error in purchase check:", error);
        setHasPurchased(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPurchaseStatus();
  }, []);
  
  // FST-7 Program data
  const programData: WeekProgram[] = [
    {
      week: 1,
      description: "هفته اول: آشنایی با تکنیک FST-7 و تمرکز بر عضلات بزرگ",
      workouts: [
        {
          day: "روز اول",
          title: "سینه و بازو",
          exercises: [
            { name: "پرس سینه با هالتر", sets: 4, reps: "8-12", rest: "90 ثانیه" },
            { name: "پرس سینه با دمبل", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "قفسه سینه با دستگاه (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه", notes: "استراحت کوتاه بین ست‌ها" },
            { name: "جلو بازو با هالتر", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "جلو بازو با دمبل", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "پشت بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" }
          ],
          notes: "در تمرینات FST-7، استراحت بین ست‌ها باید کوتاه باشد تا پمپ عضلانی حفظ شود."
        },
        {
          day: "روز دوم",
          title: "پا و ساق",
          exercises: [
            { name: "اسکوات با هالتر", sets: 4, reps: "8-12", rest: "90 ثانیه" },
            { name: "پرس پا", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "هاک اسکوات", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "جلو پا با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "ساق پا ایستاده", sets: 4, reps: "12-15", rest: "60 ثانیه" },
            { name: "ساق پا نشسته", sets: 3, reps: "12-15", rest: "60 ثانیه" }
          ]
        },
        {
          day: "روز سوم",
          title: "استراحت",
          exercises: []
        },
        {
          day: "روز چهارم",
          title: "پشت و شانه",
          exercises: [
            { name: "زیر بغل با هالتر", sets: 4, reps: "8-12", rest: "90 ثانیه" },
            { name: "زیر بغل با دمبل", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "قایقی با دستگاه (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه" },
            { name: "پرس شانه با هالتر", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "نشر جانب با دمبل", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "نشر جانب با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" }
          ]
        },
        {
          day: "روز پنجم",
          title: "بازو و ساعد",
          exercises: [
            { name: "جلو بازو با هالتر", sets: 3, reps: "8-12", rest: "60 ثانیه" },
            { name: "جلو بازو با دمبل چکشی", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "جلو بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "پشت بازو با هالتر", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "پشت بازو با دمبل", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "پشت بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "ساعد با هالتر", sets: 3, reps: "12-15", rest: "60 ثانیه" }
          ]
        },
        {
          day: "روز ششم",
          title: "پا و شکم",
          exercises: [
            { name: "اسکوات با هالتر", sets: 4, reps: "8-12", rest: "90 ثانیه" },
            { name: "پشت پا خوابیده", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "پشت پا با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "کرانچ", sets: 3, reps: "15-20", rest: "45 ثانیه" },
            { name: "زیر شکم با دستگاه", sets: 3, reps: "15-20", rest: "45 ثانیه" }
          ]
        },
        {
          day: "روز هفتم",
          title: "استراحت",
          exercises: []
        }
      ]
    },
    {
      week: 2,
      description: "هفته دوم: افزایش شدت و تمرکز بر تکنیک FST-7",
      workouts: [
        {
          day: "روز اول",
          title: "سینه و جلو بازو",
          exercises: [
            { name: "پرس سینه با هالتر", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "پرس سینه شیبدار", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "قفسه سینه با دستگاه", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "فلای سینه با دمبل (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه" },
            { name: "جلو بازو با هالتر", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "جلو بازو با دمبل", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "جلو بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" }
          ]
        },
        {
          day: "روز دوم",
          title: "پا",
          exercises: [
            { name: "اسکوات با هالتر", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "پرس پا", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "هاک اسکوات", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "جلو پا با دستگاه", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "پشت پا با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "ساق پا ایستاده", sets: 4, reps: "12-15", rest: "60 ثانیه" },
            { name: "ساق پا نشسته (FST-7)", sets: 7, reps: "12-15", rest: "30-45 ثانیه" }
          ]
        },
        {
          day: "روز سوم",
          title: "استراحت",
          exercises: []
        },
        {
          day: "روز چهارم",
          title: "پشت و پشت بازو",
          exercises: [
            { name: "زیر بغل با هالتر", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "زیر بغل با دمبل", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "قایقی با دستگاه", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "پولاور (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه" },
            { name: "پشت بازو با هالتر", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "پشت بازو با دمبل", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "پشت بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" }
          ]
        },
        {
          day: "روز پنجم",
          title: "شانه و ساعد",
          exercises: [
            { name: "پرس شانه با هالتر", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "پرس شانه با دمبل", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "نشر جانب با دمبل", sets: 3, reps: "10-12", rest: "60 ثانیه" },
            { name: "نشر جانب با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "ساعد با هالتر", sets: 3, reps: "12-15", rest: "60 ثانیه" },
            { name: "ساعد با دمبل", sets: 3, reps: "12-15", rest: "60 ثانیه" }
          ]
        },
        {
          day: "روز ششم",
          title: "سینه، بازو و شکم",
          exercises: [
            { name: "پرس سینه با دمبل", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "قفسه سینه با دستگاه (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه" },
            { name: "جلو بازو با دمبل", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "پشت بازو با دمبل", sets: 3, reps: "8-10", rest: "60 ثانیه" },
            { name: "کرانچ", sets: 3, reps: "15-20", rest: "45 ثانیه" },
            { name: "زیر شکم با دستگاه", sets: 3, reps: "15-20", rest: "45 ثانیه" }
          ]
        },
        {
          day: "روز هفتم",
          title: "استراحت",
          exercises: []
        }
      ]
    },
    {
      week: 3,
      description: "هفته سوم: افزایش حجم و تمرکز بر عضلات خاص",
      workouts: [
        {
          day: "روز اول",
          title: "سینه و جلو بازو",
          exercises: [
            { name: "پرس سینه با هالتر", sets: 4, reps: "6-8", rest: "120 ثانیه" },
            { name: "پرس سینه شیبدار", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "قفسه سینه با دستگاه", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "فلای سینه با دمبل (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه" },
            { name: "جلو بازو با هالتر", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "جلو بازو با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "جلو بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" }
          ]
        },
        {
          day: "روز دوم",
          title: "پا",
          exercises: [
            { name: "اسکوات با هالتر", sets: 4, reps: "6-8", rest: "120 ثانیه" },
            { name: "پرس پا", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "هاک اسکوات", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "جلو پا با دستگاه", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت پا با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "ساق پا ایستاده", sets: 4, reps: "12-15", rest: "60 ثانیه" },
            { name: "ساق پا نشسته (FST-7)", sets: 7, reps: "12-15", rest: "30-45 ثانیه" }
          ]
        },
        {
          day: "روز سوم",
          title: "استراحت",
          exercises: []
        },
        {
          day: "روز چهارم",
          title: "پشت و پشت بازو",
          exercises: [
            { name: "زیر بغل با هالتر", sets: 4, reps: "6-8", rest: "120 ثانیه" },
            { name: "زیر بغل با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "قایقی با دستگاه", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پولاور (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه" },
            { name: "پشت بازو با هالتر", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت بازو با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" }
          ]
        },
        {
          day: "روز پنجم",
          title: "شانه و ساعد",
          exercises: [
            { name: "پرس شانه با هالتر", sets: 4, reps: "6-8", rest: "120 ثانیه" },
            { name: "پرس شانه با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "نشر جانب با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "نشر جانب با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30-45 ثانیه" },
            { name: "ساعد با هالتر", sets: 3, reps: "12-15", rest: "60 ثانیه" },
            { name: "ساعد با دمبل", sets: 3, reps: "12-15", rest: "60 ثانیه" }
          ]
        },
        {
          day: "روز ششم",
          title: "سینه، بازو و شکم",
          exercises: [
            { name: "پرس سینه با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "قفسه سینه با دستگاه (FST-7)", sets: 7, reps: "10-12", rest: "30-45 ثانیه" },
            { name: "جلو بازو با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت بازو با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "کرانچ", sets: 3, reps: "15-20", rest: "45 ثانیه" },
            { name: "زیر شکم با دستگاه", sets: 3, reps: "15-20", rest: "45 ثانیه" }
          ]
        },
        {
          day: "روز هفتم",
          title: "استراحت",
          exercises: []
        }
      ]
    },
    {
      week: 4,
      description: "هفته چهارم: افزایش شدت و تمرکز بر تکنیک FST-7 پیشرفته",
      workouts: [
        {
          day: "روز اول",
          title: "سینه و جلو بازو",
          exercises: [
            { name: "پرس سینه با هالتر", sets: 5, reps: "6-8", rest: "120 ثانیه" },
            { name: "پرس سینه شیبدار", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "قفسه سینه با دستگاه", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "فلای سینه با دمبل (FST-7)", sets: 7, reps: "10-12", rest: "30 ثانیه", notes: "کاهش زمان استراحت" },
            { name: "جلو بازو با هالتر", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "جلو بازو با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "جلو بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30 ثانیه" }
          ]
        },
        {
          day: "روز دوم",
          title: "پا",
          exercises: [
            { name: "اسکوات با هالتر", sets: 5, reps: "6-8", rest: "120 ثانیه" },
            { name: "پرس پا", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "هاک اسکوات", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "جلو پا با دستگاه", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت پا با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30 ثانیه" },
            { name: "ساق پا ایستاده", sets: 4, reps: "12-15", rest: "60 ثانیه" },
            { name: "ساق پا نشسته (FST-7)", sets: 7, reps: "12-15", rest: "30 ثانیه" }
          ]
        },
        {
          day: "روز سوم",
          title: "استراحت",
          exercises: []
        },
        {
          day: "روز چهارم",
          title: "پشت و پشت بازو",
          exercises: [
            { name: "زیر بغل با هالتر", sets: 5, reps: "6-8", rest: "120 ثانیه" },
            { name: "زیر بغل با دمبل", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "قایقی با دستگاه", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پولاور (FST-7)", sets: 7, reps: "10-12", rest: "30 ثانیه" },
            { name: "پشت بازو با هالتر", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت بازو با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت بازو با سیم کش (FST-7)", sets: 7, reps: "10-15", rest: "30 ثانیه" }
          ]
        },
        {
          day: "روز پنجم",
          title: "شانه و ساعد",
          exercises: [
            { name: "پرس شانه با هالتر", sets: 5, reps: "6-8", rest: "120 ثانیه" },
            { name: "پرس شانه با دمبل", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "نشر جانب با دمبل", sets: 3, reps: "8-10", rest: "90 ثانیه" },
            { name: "نشر جانب با دستگاه (FST-7)", sets: 7, reps: "10-15", rest: "30 ثانیه" },
            { name: "ساعد با هالتر", sets: 4, reps: "12-15", rest: "60 ثانیه" },
            { name: "ساعد با دمبل", sets: 3, reps: "12-15", rest: "60 ثانیه" }
          ]
        },
        {
          day: "روز ششم",
          title: "سینه، بازو و شکم",
          exercises: [
            { name: "پرس سینه با دمبل", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "قفسه سینه با دستگاه (FST-7)", sets: 7, reps: "10-12", rest: "30 ثانیه" },
            { name: "جلو بازو با دمبل", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "پشت بازو با دمبل", sets: 4, reps: "8-10", rest: "90 ثانیه" },
            { name: "کرانچ", sets: 4, reps: "15-20", rest: "45 ثانیه" },
            { name: "زیر شکم با دستگاه", sets: 4, reps: "15-20", rest: "45 ثانیه" }
          ]
        },
        {
          day: "روز هفتم",
          title: "استراحت",
          exercises: []
        }
      ]
    }
  ];

  // Function to render exercise rows
  const renderExercises = (exercises: Exercise[]) => {
    if (exercises.length === 0) {
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
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-800 ${exercise.name.includes('FST-7') ? 'bg-gold-500/5' : ''}`}
              >
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end">
                    <span>{exercise.name}</span>
                    {exercise.name.includes('FST-7') && (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:py-12">
      <Helmet>
        <title>برنامه تمرینی FST-7 | لیفت لجندز</title>
        <meta name="robots" content="noindex" />
        <meta name="description" content="برنامه تمرینی FST-7 برای افزایش حجم و تفکیک عضلات" />
      </Helmet>

      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">برنامه تمرینی FST-7</h1>
        <p className="text-gray-400 max-w-3xl mx-auto">
          برنامه تمرینی FST-7 (Fascia Stretch Training) یک روش تمرینی پیشرفته برای افزایش حجم و تفکیک عضلات است که توسط هانی رامبود طراحی شده است.
        </p>
      </div>

      {/* Introduction Card */}
      <Card className="mb-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-gold-500">درباره برنامه FST-7</CardTitle>
          <CardDescription>اصول و مزایای روش تمرینی FST-7</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-300">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-gold-500 mt-1 flex-shrink-0" />
            <p>
              <span className="font-semibold text-white">FST-7</span> مخفف Fascia Stretch Training (7 sets) است که یک روش تمرینی برای کشش فاسیا (بافت همبند اطراف عضلات) با انجام 7 ست پشت سر هم با استراحت کوتاه است.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Dumbbell className="h-5 w-5 text-gold-500 mt-1 flex-shrink-0" />
            <p>
              در این روش، پس از انجام تمرینات اصلی، آخرین تمرین هر گروه عضلانی به صورت 7 ست با استراحت 30-45 ثانیه انجام می‌شود تا پمپ عضلانی به حداکثر برسد.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gold-500 mt-1 flex-shrink-0" />
            <p>
              زمان استراحت کوتاه بین ست‌های FST-7 باعث می‌شود خون و مواد مغذی بیشتری به عضلات برسد و فاسیا کشیده شود، که به رشد بیشتر عضلات کمک می‌کند.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Flame className="h-5 w-5 text-gold-500 mt-1 flex-shrink-0" />
            <p>
              این روش تمرینی برای افزایش حجم، تفکیک عضلات و بهبود جریان خون به عضلات بسیار موثر است و برای بدنسازان متوسط تا پیشرفته طراحی شده است.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gold-500 mt-1 flex-shrink-0" />
            <p>
              برنامه 4 هفته‌ای زیر شامل تمرینات FST-7 برای تمام گروه‌های عضلانی است که به تدریج شدت آن افزایش می‌یابد.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Prompt - Show if user hasn't purchased the program */}
      {!isLoading && !hasPurchased && (
        <PurchasePrompt 
          programId={FST7_PROGRAM_ID}
          programTitle="FST-7"
          description="برنامه تمرینی FST-7 یک روش پیشرفته برای افزایش حجم و تفکیک عضلات است. برای دسترسی به جزئیات کامل برنامه، تمرینات هر روز و نکات تخصصی، لطفاً این برنامه را خریداری کنید."
        />
      )}

      {/* Program Tabs - Show full content if purchased, or limited preview if not */}
      <Tabs defaultValue="week1" className="w-full mt-8">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="week1">هفته اول</TabsTrigger>
          <TabsTrigger value="week2">هفته دوم</TabsTrigger>
          <TabsTrigger value="week3">هفته سوم</TabsTrigger>
          <TabsTrigger value="week4">هفته چهارم</TabsTrigger>
        </TabsList>
        
        {programData.map((weekData, weekIndex) => (
          <TabsContent key={weekIndex} value={`week${weekIndex + 1}`} className="space-y-6">
            <div className="bg-gradient-to-r from-gold-500/10 to-transparent p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gold-500">{weekData.description}</h2>
            </div>
            
            {/* If user hasn't purchased, only show first day of each week */}
            <Accordion type="single" collapsible className="w-full">
              {(hasPurchased ? weekData.workouts : weekData.workouts.slice(0, 1)).map((workout, dayIndex) => (
                <AccordionItem key={dayIndex} value={`day-${weekIndex}-${dayIndex}`} className="border-gray-800">
                  <AccordionTrigger className="hover:no-underline py-4 px-4 hover:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Badge className="bg-gray-800 text-gray-300 mr-3">{workout.day}</Badge>
                        <span className="font-medium text-white">{workout.title}</span>
                      </div>
                      {workout.exercises.length > 0 && (
                        <Badge className="bg-gray-800 text-gray-300 ml-2">
                          {workout.exercises.length} تمرین
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    {renderExercises(workout.exercises)}
                    {workout.notes && (
                      <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-300 text-sm">
                        <span className="font-medium text-gold-500">نکته: </span>
                        {workout.notes}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
              
              {/* Show locked message if not purchased */}
              {!hasPurchased && weekData.workouts.length > 1 && (
                <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-gold-500 ml-2" />
                    <span>برای مشاهده سایر روزهای تمرینی این هفته، لطفاً برنامه را خریداری کنید</span>
                  </div>
                  <Button 
                    onClick={() => navigate(`/product/${FST7_PROGRAM_ID}`)}
                    size="sm"
                    className="bg-gold-500 hover:bg-gold-600 text-black"
                  >
                    خرید برنامه
                  </Button>
                </div>
              )}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>

      {/* Tips Section - Only show full tips if purchased */}
      <Card className="mt-10 bg-gradient-to-br from-gray-900 to-black border border-gray-800">
        <CardHeader>
          <CardTitle className="text-gold-500">نکات مهم برنامه FST-7</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPurchased ? (
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>در تمرینات FST-7، استراحت بین ست‌ها باید کوتاه باشد (30-45 ثانیه) تا پمپ عضلانی حفظ شود.</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>مصرف آب کافی قبل و حین تمرین برای این روش بسیار مهم است.</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>وزنه‌ها باید طوری انتخاب شوند که بتوانید تمام 7 ست را با تکنیک صحیح انجام دهید.</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>تغذیه مناسب قبل و بعد از تمرین برای بازسازی عضلات ضروری است.</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>این برنامه برای افراد مبتدی مناسب نیست و نیاز به آمادگی جسمانی مناسب دارد.</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                <span>در صورت احساس درد غیرطبیعی، تمرین را متوقف کنید و با مربی مشورت کنید.</span>
              </li>
            </ul>
          ) : (
            <div className="space-y-4">
              {/* Show only 2 tips as preview */}
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                  <span>در تمرینات FST-7، استراحت بین ست‌ها باید کوتاه باشد (30-45 ثانیه) تا پمپ عضلانی حفظ شود.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 mt-2 ml-2 rounded-full bg-gold-500"></div>
                  <span>مصرف آب کافی قبل و حین تمرین برای این روش بسیار مهم است.</span>
                </li>
              </ul>
              
              {/* Locked content message */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gold-500 ml-2" />
                  <span className="text-gray-300">برای مشاهده تمام نکات تخصصی، لطفاً برنامه را خریداری کنید</span>
                </div>
                <Button 
                  onClick={() => navigate(`/product/${FST7_PROGRAM_ID}`)}
                  size="sm"
                  className="bg-gold-500 hover:bg-gold-600 text-black"
                >
                  خرید برنامه
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Fst7Program;