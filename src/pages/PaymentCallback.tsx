import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { SubscriptionPlan } from "@/types/user";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentInfo {
  authority: string;
  amount: number;
  plan_id: SubscriptionPlan;
  plan_period: 'monthly' | 'yearly';
  user_id: string;
  timestamp: string;
}

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get URL parameters
        const searchParams = new URLSearchParams(location.search);
        const authority = searchParams.get("Authority");
        const status = searchParams.get("Status");

        // Get payment info from localStorage
        const paymentInfoStr = localStorage.getItem("payment_info");
        if (!paymentInfoStr) {
          throw new Error("اطلاعات پرداخت یافت نشد");
        }

        const paymentInfo: PaymentInfo = JSON.parse(paymentInfoStr);

        // Check if payment was successful
        if (status !== "OK" || !authority) {
          setSuccess(false);
          setMessage("پرداخت توسط کاربر لغو شد یا با خطا مواجه شد");
          setLoading(false);
          return;
        }

        // Verify payment with Zarinpal
        const verifyData = {
          merchant_id: "89999bca-a25d-4ada-9846-62ec13a250b1",
          authority: authority,
          amount: paymentInfo.amount.toString(),
        };

        console.log("Verifying payment with data:", verifyData);
        
        // Try to use the proxy endpoint first
        let response;
        try {
          response = await axios.post("http://localhost:3000/api/zarinpal/verify", verifyData);
        } catch (proxyError) {
          console.error("Error with proxy verification:", proxyError);
          console.log("Trying direct verification with Zarinpal...");
          
          // If proxy fails, try direct request as fallback
          response = await axios.post(
            "https://staging.zarinpal.com/pg/v4/payment/verify.json", 
            verifyData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );
        }
        
        console.log("Verification response:", response.data);

        // Check the response structure and status codes
        console.log("Processing verification response:", response.data);
        
        // Zarinpal returns code 100 for successful payment and 101 for verified payment
        if (
          response.data.data &&
          (response.data.data.code === 100 || response.data.data.code === 101)
        ) {
          // Payment was successful
          setSuccess(true);
          const refId = response.data.data.ref_id;
          setMessage(`پرداخت با موفقیت انجام شد. کد پیگیری: ${refId}`);
          
          console.log(`Payment successful! Reference ID: ${refId}`);

          try {
            // Update user subscription in database
            await updateUserSubscription(paymentInfo.plan_id, paymentInfo.user_id, paymentInfo.plan_period);
            
            // Show success toast
            toast({
              title: "اشتراک فعال شد",
              description: "اشتراک شما با موفقیت فعال شد و از هم‌اکنون قابل استفاده است.",
            });
          } catch (subscriptionError) {
            console.error("Error activating subscription:", subscriptionError);
            
            // Still show success for payment but note the subscription issue
            setMessage(`پرداخت با موفقیت انجام شد اما در فعال‌سازی اشتراک مشکلی پیش آمد. لطفاً با پشتیبانی تماس بگیرید. کد پیگیری: ${refId}`);
            
            toast({
              variant: "destructive",
              title: "خطا در فعال‌سازی اشتراک",
              description: "پرداخت موفق بود اما در فعال‌سازی اشتراک مشکلی پیش آمد. لطفاً با پشتیبانی تماس بگیرید.",
            });
          }
        } else {
          // Payment failed
          setSuccess(false);
          
          // Get error message from response
          let errorMessage = "خطا در تایید پرداخت. لطفاً با پشتیبانی تماس بگیرید";
          
          if (response.data.errors && response.data.errors.message) {
            errorMessage = response.data.errors.message;
          } else if (response.data.data && response.data.data.message) {
            errorMessage = response.data.data.message;
          }
          
          setMessage(errorMessage);
          console.error("Payment verification failed:", errorMessage);
          
          toast({
            variant: "destructive",
            title: "خطا در تایید پرداخت",
            description: errorMessage,
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setSuccess(false);
        setMessage(
          error instanceof Error
            ? error.message
            : "خطا در تایید پرداخت. لطفاً با پشتیبانی تماس بگیرید"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  // Function to update user subscription
  const updateUserSubscription = async (planId: SubscriptionPlan, userId: string, period: 'monthly' | 'yearly') => {
    try {
      console.log(`Activating subscription: Plan=${planId}, User=${userId}, Period=${period}`);
      
      // Calculate subscription end date based on plan and period
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      // Set end date based on subscription period
      if (period === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (period === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      console.log(`Subscription period: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // First, check if the user exists
      const { data: userData, error: userError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
        
      if (userError) {
        console.error("Error fetching user profile:", userError);
        throw new Error("User profile not found");
      }
      
      console.log("Current user profile:", userData);
      
      // Update user profile with new subscription details
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          subscription_plan: planId,
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
          is_subscription_active: true,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId)
        .select();
        
      if (error) {
        console.error("Error updating subscription in database:", error);
        throw error;
      }
      
      console.log("Subscription activated successfully:", data);
      
      // Also log the subscription transaction to subscription_logs table
      const { error: logError } = await supabase
        .from('subscription_logs')
        .insert({
          user_id: userId,
          plan_id: planId,
          period: period,
          amount: JSON.parse(localStorage.getItem("payment_info") || "{}").amount || 0,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
      if (logError) {
        console.error("Error logging subscription transaction:", logError);
        // Don't throw here, as the subscription is already activated
      }
      
      // Clear payment info from localStorage
      localStorage.removeItem("payment_info");
      
      return true;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">نتیجه پرداخت</CardTitle>
          <CardDescription className="text-center">
            {loading ? "در حال بررسی وضعیت پرداخت..." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {loading ? (
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          ) : success ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
          <p className="mt-6 text-center text-lg">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="w-full max-w-xs"
          >
            بازگشت به داشبورد
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentCallback;