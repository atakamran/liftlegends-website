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

        const response = await axios.post("/api/zarinpal/verify", verifyData);

        if (
          response.data.data &&
          (response.data.data.code === 100 || response.data.data.code === 101)
        ) {
          // Payment was successful
          setSuccess(true);
          setMessage(`پرداخت با موفقیت انجام شد. کد پیگیری: ${response.data.data.ref_id}`);

          // Update user subscription in database
          await updateUserSubscription(paymentInfo.plan_id, paymentInfo.user_id, paymentInfo.plan_period);
        } else {
          // Payment failed
          setSuccess(false);
          setMessage(
            response.data.errors?.message || "خطا در تایید پرداخت. لطفاً با پشتیبانی تماس بگیرید"
          );
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
      // Calculate subscription end date based on plan and period
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      // Set end date based on subscription period
      if (period === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (period === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      // Update user profile with new subscription details
      const { error } = await supabase
        .from("user_profiles")
        .update({
          subscription_plan: planId,
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);
        
      if (error) throw error;
      
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