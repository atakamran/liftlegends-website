import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { validateInput, validateFile, sanitizeInput, ValidationRule } from "@/components/ui/input-validator";

const SecureCoachApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experienceYears: "",
    expertise: "",
    message: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validationRules: Record<string, ValidationRule> = {
    fullName: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, email: true },
    phone: { required: true, phone: true },
    experienceYears: { required: true, pattern: /^\d+$/ },
    expertise: { required: true, minLength: 10, maxLength: 500 },
    message: { maxLength: 1000 },
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([field, value]) => {
      const error = validateInput(value, validationRules[field] || {});
      if (error) {
        newErrors[field] = error;
      }
    });

    if (resumeFile) {
      const fileError = validateFile(resumeFile, {
        fileSize: 5, // 5MB
        fileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      });
      if (fileError) {
        newErrors.resume = fileError;
      }
    }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: "" }));
      }
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
      let resumeUrl = null;

      // Upload resume file if provided
      if (resumeFile) {
        const fileName = `${Date.now()}-${resumeFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('legends')
          .upload(`coach-resumes/${fileName}`, resumeFile);

        if (uploadError) {
          throw new Error(`خطا در آپلود فایل: ${uploadError.message}`);
        }

        resumeUrl = uploadData.path;
      }

      // Insert application data
      const { error } = await supabase
        .from('coach_applications')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          experience_years: parseInt(formData.experienceYears),
          expertise: formData.expertise,
          message: formData.message || null,
          resume_url: resumeUrl,
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
        experienceYears: "",
        expertise: "",
        message: "",
      });
      setResumeFile(null);

    } catch (error) {
      console.error("Error submitting application:", error);
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
        فرم درخواست همکاری مربی
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
          <Label htmlFor="experienceYears" className="text-white">سال‌های تجربه *</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            value={formData.experienceYears}
            onChange={(e) => handleInputChange('experienceYears', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white"
            placeholder="5"
          />
          {errors.experienceYears && <p className="text-red-400 text-sm mt-1">{errors.experienceYears}</p>}
        </div>

        <div>
          <Label htmlFor="expertise" className="text-white">تخصص و زمینه فعالیت *</Label>
          <Textarea
            id="expertise"
            value={formData.expertise}
            onChange={(e) => handleInputChange('expertise', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
            placeholder="بدنسازی، کراس فیت، یوگا، تغذیه ورزشی و..."
          />
          {errors.expertise && <p className="text-red-400 text-sm mt-1">{errors.expertise}</p>}
        </div>

        <div>
          <Label htmlFor="resume" className="text-white">رزومه (اختیاری)</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="bg-gray-800/50 border-gray-600 text-white file:bg-gold-500 file:text-black file:border-0 file:rounded-md file:px-3 file:py-1"
          />
          {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
          <p className="text-gray-400 text-xs mt-1">فرمت‌های مجاز: PDF, DOC, DOCX - حداکثر ۵ مگابایت</p>
        </div>

        <div>
          <Label htmlFor="message" className="text-white">پیام اضافی (اختیاری)</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white min-h-[80px]"
            placeholder="توضیحات اضافی در مورد انگیزه و هدف شما از همکاری"
          />
          {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
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

export default SecureCoachApplicationForm;