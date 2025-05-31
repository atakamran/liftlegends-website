import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Define interfaces
interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("training");

  // Function to fetch programs
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("programs_sale")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map programs_sale data to Program interface
      const programsData = data ? data.map(program => ({
        id: program.id,
        title: program.title,
        description: program.description,
        price: program.price,
        category: program.category,
        image_url: program.image_url,
        created_at: program.created_at || new Date().toISOString(),
        updated_at: program.updated_at || new Date().toISOString()
      })) : [];
      
      setPrograms(programsData);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری برنامه‌ها",
        description: "مشکلی در دریافت لیست برنامه‌ها رخ داد. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Filter programs by category
  const filteredPrograms = programs.filter(program => program.category === activeTab);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gold-500 mb-4">برنامه‌های لیفت لجندز</h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          برنامه‌های تخصصی ما برای کمک به شما در رسیدن به اهداف تناسب اندام و سلامتی طراحی شده‌اند.
        </p>
      </div>

      <Tabs defaultValue="training" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="training" className="text-sm md:text-base">برنامه‌های تمرینی</TabsTrigger>
            <TabsTrigger value="diet" className="text-sm md:text-base">برنامه‌های غذایی</TabsTrigger>
            <TabsTrigger value="supplement" className="text-sm md:text-base">مکمل‌ها</TabsTrigger>
          </TabsList>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : (
          <>
            <TabsContent value="training" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="diet" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="supplement" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">در حال حاضر برنامه‌ای در این دسته وجود ندارد.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

// Program Card Component
const ProgramCard = ({ program }: { program: Program }) => {
  // Format price with Persian numerals and Toman
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-800 transition-all duration-300 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/10">
      <div className="aspect-video w-full overflow-hidden">
        {program.image_url ? (
          <img 
            src={program.image_url} 
            alt={program.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">بدون تصویر</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-gold-500">{program.title}</CardTitle>
        <CardDescription className="text-gray-400">
          {program.category === 'training' && 'برنامه تمرینی'}
          {program.category === 'diet' && 'برنامه غذایی'}
          {program.category === 'supplement' && 'مکمل'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 line-clamp-3">{program.description}</p>
        <p className="mt-4 text-lg font-bold text-white">{formatPrice(program.price)}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/payment?program=${program.id}`} className="w-full">
          <Button variant="default" className="w-full bg-gold-500 hover:bg-gold-600 text-black">
            خرید برنامه
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Programs;