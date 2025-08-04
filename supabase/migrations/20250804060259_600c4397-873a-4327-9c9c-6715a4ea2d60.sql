-- First, let's clean up and restructure properly
DELETE FROM public.coaches WHERE id IS NULL;

-- Make sure id column has proper default
ALTER TABLE public.coaches ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Insert sample coaches with proper structure
INSERT INTO public.coaches (id, name, bio, specialties, experience_years, certifications, phone, email, instagram, telegram, rating, total_reviews, is_verified, is_active) 
VALUES
  (gen_random_uuid(), 'احمد محمدی', 'مربی پرورش اندام با ۱۰ سال تجربه در زمینه بدنسازی و تناسب اندام', 
   ARRAY['پرورش اندام', 'کاهش وزن', 'تناسب اندام'], 10, 
   ARRAY['مربی بدنسازی درجه یک', 'متخصص تغذیه ورزشی'], 
   '09121234567', 'ahmad.mohammadi@example.com', '@ahmad_coach', '@ahmad_coach', 4.8, 156, true, true),

  (gen_random_uuid(), 'سارا احمدی', 'متخصص تغذیه ورزشی و فیتنس با تمرکز بر برنامه‌های کاهش وزن', 
   ARRAY['تغذیه ورزشی', 'کاردیو', 'یوگا'], 7, 
   ARRAY['متخصص تغذیه ورزشی', 'مربی یوگا'], 
   '09129876543', 'sara.ahmadi@example.com', '@sara_nutrition', '@sara_nutrition', 4.9, 89, true, true),
  
  (gen_random_uuid(), 'علی رضایی', 'مربی کراس فیت و آمادگی جسمانی با رویکرد علمی و مدرن', 
   ARRAY['کراس فیت', 'آمادگی جسمانی', 'قدرتی'], 8, 
   ARRAY['مربی کراس فیت', 'مربی آمادگی جسمانی'], 
   '09123456789', 'ali.rezaei@example.com', '@ali_crossfit', '@ali_crossfit', 4.7, 124, true, true),
  
  (gen_random_uuid(), 'فاطمه کریمی', 'مربی تخصصی ایروبیک و پیلاتس برای بانوان', 
   ARRAY['ایروبیک', 'پیلاتس', 'رقص ورزشی'], 6, 
   ARRAY['مربی ایروبیک بین‌المللی', 'مربی پیلاتس'], 
   '09134567890', 'fateme.karimi@example.com', '@fateme_fitness', '@fateme_fitness', 4.6, 67, true, true),
  
  (gen_random_uuid(), 'محمد حسینی', 'مربی پاورلیفتینگ و قدرتی با سابقه مسابقات ملی', 
   ARRAY['پاورلیفتینگ', 'قدرتی', 'بدنسازی'], 12, 
   ARRAY['مربی پاورلیفتینگ درجه یک', 'داور فدراسیون'], 
   '09145678901', 'mohammad.hosseini@example.com', '@mohammad_power', '@mohammad_power', 4.9, 203, true, true)
ON CONFLICT (name) DO NOTHING;