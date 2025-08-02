import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { validateInput, sanitizeInput, ValidationRule } from "@/components/ui/input-validator";

const SecureWorkApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    motivation: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validationRules: Record<string, ValidationRule> = {
    fullName: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, email: true },
    phone: { required: true, phone: true },
    position: { required: true, minLength: 2, maxLength: 100 },
    experience: { required: true, minLength: 10, maxLength: 1000 },
    motivation: { required: true, minLength: 10, maxLength: 1000 },
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateInput(value, validationRules[field] || {});
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "خطا در اعتبارسنجی",
        description: "لطفاً اطلاعات را بررسی کنید",
      });
      return;
    }

    setLoading(true);

    try {
      // Insert work application data
      const { error } = await supabase
        .from('coach_applications') // Reusing the same table
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          experience_years: 0, // Default for work applications
          expertise: `${formData.position} - ${formData.experience}`,
          message: `موقعیت مورد نظر: ${formData.position}\n\nانگیزه: ${formData.motivation}`,
          status: 'pending'
        });

      if (error) {
        throw new Error(`خطا در ارسال درخواست: ${error.message}`);
      }

      toast({
        title: "درخواست ارسال شد",
        description: "درخواست همکاری شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        motivation: "",
      });

    } catch (error) {
      console.error("Error submitting work application:", error);
      toast({
        variant: "destructive",
        title: "خطا در ارسال",
        description: error instanceof Error ? error.message : "خطای غیرمنتظره رخ داد",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/30">
      <h2 className="text-2xl font-bold text-gold-500 mb-6 text-center">
        فرم درخواست همکاری
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-white">نام و نام خانوادگی *</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white"
            placeholder="نام کامل خود را وارد کنید"
          />
          {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-white">ایمیل *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white"
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="text-white">شماره موبایل *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white"
            placeholder="09123456789"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="position" className="text-white">موقعیت مورد نظر *</Label>
          <Input
            id="position"
            type="text"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white"
            placeholder="مثال: توسعه‌دهنده فرانت‌اند، طراح UI/UX، مارکتینگ"
          />
          {errors.position && <p className="text-red-400 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <Label htmlFor="experience" className="text-white">تجربیات و مهارت‌ها *</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
            placeholder="تجربیات کاری، مهارت‌های فنی، پروژه‌های انجام شده و..."
          />
          {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
        </div>

        <div>
          <Label htmlFor="motivation" className="text-white">انگیزه همکاری *</Label>
          <Textarea
            id="motivation"
            value={formData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
            placeholder="چرا می‌خواهید با ما همکاری کنید؟ اهداف و انتظارات شما چیست؟"
          />
          {errors.motivation && <p className="text-red-400 text-sm mt-1">{errors.motivation}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 hover:bg-gold-600 text-black font-medium py-3 rounded-xl transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
        >
          {loading ? "در حال ارسال..." : "ارسال درخواست همکاری"}
        </Button>
      </form>
    </div>
  );
};

export default SecureWorkApplicationForm;