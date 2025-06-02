import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Lock } from "lucide-react";

interface PurchasePromptProps {
  programId: string;
  programTitle: string;
  description?: string;
}

const PurchasePrompt: React.FC<PurchasePromptProps> = ({ 
  programId, 
  programTitle,
  description = "برای دسترسی به محتوای کامل این برنامه، لطفاً آن را خریداری کنید."
}) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate(`/product/${programId}`);
  };

  return (
    <Card className="mt-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500/50 via-gold-500 to-gold-500/50"></div>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-gold-500" />
          <CardTitle className="text-gold-500">محتوای قفل شده</CardTitle>
        </div>
        <CardDescription>
          برای مشاهده جزئیات کامل برنامه {programTitle} نیاز به خرید دارید
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-gray-300">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-gold-500"></div>
          <span>دسترسی آنی پس از خرید</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-gold-500"></div>
          <span>برنامه کامل و جامع با جزئیات دقیق</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-gold-500"></div>
          <span>پشتیبانی و راهنمایی در صورت نیاز</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePurchase} 
          className="w-full bg-gold-500 hover:bg-gold-600 text-black"
        >
          <ShoppingCart className="ml-2 h-4 w-4" />
          خرید برنامه
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PurchasePrompt;