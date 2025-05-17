
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
  resume: File | null;
}

const WorkApplicationForm = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, position: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      message: "",
      resume: null,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gold-500">فرم درخواست همکاری</h2>
      
      {formSubmitted ? (
        <div className="bg-gray-900 p-8 rounded-xl border border-white/10 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={60} className="text-gold-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">درخواست شما با موفقیت ثبت شد!</h3>
          <p className="text-white/70 mb-6">
            از علاقه شما به همکاری با تیم LiftLegends متشکریم. ما در اسرع وقت درخواست شما را بررسی کرده و با شما تماس خواهیم گرفت.
          </p>
          <Button 
            onClick={() => setFormSubmitted(false)} 
            className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
          >
            ارسال درخواست جدید
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-white/10">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                نام و نام خانوادگی *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                ایمیل *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">
                شماره تماس *
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-white/80 mb-1">
                موقعیت شغلی مورد نظر *
              </label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="انتخاب موقعیت شغلی" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="frontend">توسعه‌دهنده فرانت‌اند</SelectItem>
                  <SelectItem value="backend">توسعه‌دهنده بک‌اند</SelectItem>
                  <SelectItem value="ai">متخصص هوش مصنوعی</SelectItem>
                  <SelectItem value="ui-ux">طراح UI/UX</SelectItem>
                  <SelectItem value="marketing">متخصص بازاریابی دیجیتال</SelectItem>
                  <SelectItem value="fitness">مربی بدنسازی و متخصص تغذیه</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-white/80 mb-1">
                سابقه کاری (سال) *
              </label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
                پیام / توضیحات
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-white/80 mb-1">
                آپلود رزومه (PDF) *
              </label>
              <Input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium"
              >
                ارسال درخواست
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default WorkApplicationForm;
