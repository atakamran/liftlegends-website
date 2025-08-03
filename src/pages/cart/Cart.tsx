import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ArrowRight,
  Package,
  Dumbbell,
  Users,
} from "lucide-react";

interface CartItem {
  id: string;
  user_id: string;
  item_type: "gym_membership" | "coach_program" | "product";
  item_id: string;
  quantity: number;
  price: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
  item_details?: any;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    setUser(session.user);
    fetchCartItems(session.user.id);
  };

  const fetchCartItems = async (userId: string) => {
    try {
      setLoading(true);

      const { data: cartData, error: cartError } = await supabase
        .from("shopping_cart")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (cartError) throw cartError;

      // Fetch item details for each cart item
      const itemsWithDetails = await Promise.all(
        (cartData || []).map(async (item) => {
          let itemDetails = null;

          try {
            if (item.item_type === "gym_membership") {
              const { data: membershipData } = await supabase
                .from("gym_memberships")
                .select(
                  `
                  *,
                  gyms (
                    name,
                    location
                  )
                `
                )
                .eq("id", item.item_id)
                .single();
              itemDetails = membershipData;
            } else if (item.item_type === "coach_program") {
              const { data: programData } = await supabase
                .from("coach_programs")
                .select(
                  `
                  *,
                  coaches (
                    name,
                    profile_image
                  )
                `
                )
                .eq("id", item.item_id)
                .single();
              itemDetails = programData;
            } else if (item.item_type === "product") {
              const { data: productData } = await supabase
                .from("programs_sale")
                .select("*")
                .eq("id", item.item_id)
                .single();
              itemDetails = productData;
            }
          } catch (error) {
            console.error(
              `Error fetching details for ${item.item_type}:`,
              error
            );
          }

          return {
            ...item,
            item_details: itemDetails,
          };
        })
      );

      setCartItems(itemsWithDetails);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        variant: "destructive",
        title: "خطا در بارگذاری سبد خرید",
        description: "مشکلی در دریافت اطلاعات سبد خرید رخ داد.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    try {
      setUpdating(itemId);

      const { error } = await supabase
        .from("shopping_cart")
        .update({ quantity: newQuantity })
        .eq("id", itemId);

      if (error) throw error;

      setCartItems((items) =>
        items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      toast({
        title: "بروزرسانی شد",
        description: "تعداد محصول بروزرسانی شد.",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "مشکلی در بروزرسانی تعداد رخ داد.",
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId);

      const { error } = await supabase
        .from("shopping_cart")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      setCartItems((items) => items.filter((item) => item.id !== itemId));

      toast({
        title: "حذف شد",
        description: "محصول از سبد خرید حذف شد.",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "مشکلی در حذف محصول رخ داد.",
      });
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from("shopping_cart")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setCartItems([]);

      toast({
        title: "سبد خرید خالی شد",
        description: "همه محصولات از سبد خرید حذف شدند.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "مشکلی در خالی کردن سبد خرید رخ داد.",
      });
    }
  };

  const formatPrice = (price: number): string => {
    return price === 0
      ? "رایگان"
      : `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
  };

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case "gym_membership":
        return <Dumbbell className="h-5 w-5" />;
      case "coach_program":
        return <Users className="h-5 w-5" />;
      case "product":
        return <Package className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getItemTypeLabel = (itemType: string) => {
    switch (itemType) {
      case "gym_membership":
        return "عضویت باشگاه";
      case "coach_program":
        return "برنامه مربی";
      case "product":
        return "محصول";
      default:
        return "محصول";
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = (item.price - item.discount_amount) * item.quantity;
      return total + itemPrice;
    }, 0);
  };

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      return total + item.discount_amount * item.quantity;
    }, 0);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "سبد خرید خالی",
        description: "ابتدا محصولی به سبد خرید اضافه کنید.",
      });
      return;
    }

    // Navigate to payment page
    navigate("/payment", { state: { cartItems } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بارگذاری سبد خرید...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-gold-500" />
            <h1 className="text-3xl font-bold">سبد خرید</h1>
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {cartItems.length} محصول
              </Badge>
            )}
          </div>
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              خالی کردن سبد
            </Button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-400 mb-4">
              سبد خرید شما خالی است
            </h2>
            <p className="text-gray-500 mb-8">
              محصولات مورد نظر خود را به سبد خرید اضافه کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/programs")}
                className="bg-gold-500 hover:bg-gold-600 text-black"
              >
                <Package className="h-4 w-4 ml-2" />
                مشاهده برنامه‌ها
              </Button>
              <Button
                onClick={() => navigate("/gyms")}
                variant="outline"
                className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black"
              >
                <Dumbbell className="h-4 w-4 ml-2" />
                مشاهده باشگاه‌ها
              </Button>
              <Button
                onClick={() => navigate("/coaches")}
                variant="outline"
                className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black"
              >
                <Users className="h-4 w-4 ml-2" />
                مشاهده مربی‌ها
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Item Icon/Image */}
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gold-500">
                        {item.item_details?.cover_image ||
                        item.item_details?.profile_image ||
                        item.item_details?.image_url ? (
                          <img
                            src={
                              item.item_details.cover_image ||
                              item.item_details.profile_image ||
                              item.item_details.image_url
                            }
                            alt="محصول"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          getItemIcon(item.item_type)
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="secondary" className="mb-2">
                              {getItemTypeLabel(item.item_type)}
                            </Badge>
                            <h3 className="font-semibold text-white">
                              {item.item_details?.title ||
                                item.item_details?.name ||
                                "محصول"}
                            </h3>
                            {item.item_type === "gym_membership" &&
                              item.item_details?.gyms && (
                                <p className="text-sm text-gray-400">
                                  باشگاه: {item.item_details.gyms.name}
                                </p>
                              )}
                            {item.item_type === "coach_program" &&
                              item.item_details?.coaches && (
                                <p className="text-sm text-gray-400">
                                  مربی: {item.item_details.coaches.name}
                                </p>
                              )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Description */}
                        {item.item_details?.description && (
                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                            {item.item_details.description}
                          </p>
                        )}

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={
                                updating === item.id || item.quantity <= 1
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updating === item.id}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-left">
                            {item.discount_amount > 0 && (
                              <div className="text-sm text-gray-400 line-through">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            )}
                            <div className="text-lg font-bold text-gold-500">
                              {formatPrice(
                                (item.price - item.discount_amount) *
                                  item.quantity
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-gold-500">خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">تعداد محصولات:</span>
                    <span>
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">جمع قیمت:</span>
                    <span>
                      {formatPrice(
                        cartItems.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                      )}
                    </span>
                  </div>

                  {getTotalDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>تخفیف:</span>
                      <span>-{formatPrice(getTotalDiscount())}</span>
                    </div>
                  )}

                  <hr className="border-gray-700" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>مجموع نهایی:</span>
                    <span className="text-gold-500">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>

                  <Button
                    onClick={proceedToCheckout}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 ml-2" />
                    ادامه خرید
                    <ArrowRight className="h-4 w-4 mr-2" />
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    با ادامه خرید، شرایط و قوانین سایت را می‌پذیرید
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
