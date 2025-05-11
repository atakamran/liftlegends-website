
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "رمز عبور باید حداقل 6 کاراکتر باشد",
  }),
  confirmPassword: z.string().min(6, {
    message: "تکرار رمز عبور باید حداقل 6 کاراکتر باشد",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن باید یکسان باشند",
  path: ["confirmPassword"],
});

const UpdatePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success("رمز عبور با موفقیت تغییر یافت");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("خطا در تغییر رمز عبور");
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
            تغییر رمز عبور
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            لطفا رمز عبور جدید خود را وارد کنید
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
                رمز عبور شما با موفقیت تغییر یافت. تا چند لحظه دیگر به صفحه اصلی هدایت می‌شوید.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز عبور جدید</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تکرار رمز عبور جدید</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gold-500 hover:bg-gold-600 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "در حال ثبت..." : "تغییر رمز عبور"}
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

export default UpdatePassword;
