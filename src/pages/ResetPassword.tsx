
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({
    message: "لطفا ایمیل معتبر وارد کنید",
  }),
});

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // استفاده از آدرس کامل برای بازگشت
      const redirectUrl = `${window.location.origin}/update-password`;
      console.log("Redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        console.error("Supabase error:", error);
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success("لینک تغییر رمز عبور به ایمیل شما ارسال شد");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("خطا در بازیابی رمز عبور");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-morphism bg-black/60 border-white/10 text-white">
        <CardHeader>
          <Button 
            variant="ghost" 
            className="w-8 h-8 p-0 absolute top-4 right-4" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center">
            بازیابی رمز عبور
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            لطفا ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <p className="text-muted-foreground">
                لینک بازیابی رمز عبور به ایمیل شما ارسال شد. لطفا ایمیل خود را بررسی کنید.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ایمیل</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        ایمیلی که با آن ثبت نام کرده‌اید را وارد کنید
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gold-500 hover:bg-gold-600 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "در حال ارسال..." : "ارسال لینک بازیابی"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-white"
          >
            بازگشت به صفحه اصلی
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
