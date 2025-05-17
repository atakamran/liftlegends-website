
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "نام باید حداقل 2 حرف باشد" }),
  email: z.string().email({ message: "ایمیل معتبر وارد کنید" }),
  phone: z.string().optional(),
  expertise: z.string().min(1, { message: "انتخاب تخصص الزامی است" }),
  experienceYears: z.coerce.number().min(0, { message: "سابقه کار معتبر وارد کنید" }),
  message: z.string().optional(),
  resumeFile: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CoachApplicationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      expertise: "",
      experienceYears: 0,
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Upload resume if provided
      let resumeUrl = null;
      if (data.resumeFile && data.resumeFile[0]) {
        const file = data.resumeFile[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // We would add storage bucket handling here in a full implementation
        resumeUrl = fileName; // Placeholder for now
      }

      // Insert application into database
      const { error } = await supabase.from('coach_applications').insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        expertise: data.expertise,
        experience_years: data.experienceYears,
        message: data.message || null,
        resume_url: resumeUrl,
      });

      if (error) {
        throw error;
      }

      // Send notification to admin (would implement email notification in a full version)
      console.log("Application submitted:", data);

      toast({
        title: "درخواست همکاری ثبت شد",
        description: "درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.",
      });

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        variant: "destructive",
        title: "خطا در ثبت درخواست",
        description: "مشکلی در ثبت درخواست شما رخ داد. لطفا دوباره تلاش کنید.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
      {isSubmitted ? (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={60} className="text-gold-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">درخواست شما با موفقیت ثبت شد!</h3>
          <p className="text-white/70 mb-6">
            از علاقه شما به همکاری با تیم LiftLegends متشکریم. ما در اسرع وقت درخواست شما را بررسی کرده و با شما تماس خواهیم گرفت.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)} 
            className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
          >
            ارسال درخواست جدید
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">نام و نام خانوادگی *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="نام و نام خانوادگی خود را وارد کنید" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">ایمیل *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email" 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="ایمیل خود را وارد کنید" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">شماره تماس *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="شماره تماس خود را وارد کنید" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">تخصص *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="تخصص خود را انتخاب کنید" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="برنامه تمرینی">برنامه تمرینی</SelectItem>
                      <SelectItem value="تغذیه و رژیم">تغذیه و رژیم</SelectItem>
                      <SelectItem value="مکمل‌های ورزشی">مکمل‌های ورزشی</SelectItem>
                      <SelectItem value="روانشناسی ورزشی">روانشناسی ورزشی</SelectItem>
                      <SelectItem value="سایر">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">سابقه کاری (سال) *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="سابقه کاری خود را وارد کنید" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">پیام / توضیحات</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white" 
                      placeholder="توضیحات بیشتر..." 
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="resumeFile"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-white/80">آپلود رزومه (PDF) *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => onChange(e.target.files)}
                      className="bg-gray-800 border-gray-700 text-white" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium mt-4"
            >
              {isLoading ? "در حال ارسال..." : "ارسال درخواست"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CoachApplicationForm;
