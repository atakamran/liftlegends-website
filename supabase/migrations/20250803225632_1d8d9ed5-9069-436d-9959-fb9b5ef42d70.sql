-- Create gyms table
CREATE TABLE public.gyms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  facilities TEXT[],
  working_hours JSONB,
  pricing JSONB,
  capacity INTEGER,
  is_active BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coaches table with proper structure
CREATE TABLE public.coaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[],
  experience_years INTEGER,
  certifications TEXT[],
  profile_image TEXT,
  gallery TEXT[],
  phone TEXT,
  email TEXT,
  instagram TEXT,
  telegram TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  gym_id UUID REFERENCES public.gyms(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on gyms table
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;

-- Enable RLS on coaches table  
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Create policies for gyms table
CREATE POLICY "Anyone can view active gyms" 
ON public.gyms 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage gyms" 
ON public.gyms 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Gym owners can update their gyms" 
ON public.gyms 
FOR UPDATE 
USING (auth.uid() = owner_id);

-- Create policies for coaches table
CREATE POLICY "Anyone can view active coaches" 
ON public.coaches 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage coaches" 
ON public.coaches 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Coaches can update their own profile" 
ON public.coaches 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert sample gyms
INSERT INTO public.gyms (name, description, address, phone, email, facilities, working_hours, pricing, capacity) VALUES
('باشگاه قهرمان', 'یکی از بهترین باشگاه‌های بدنسازی تهران با تجهیزات مدرن', 'تهران، خیابان ولیعصر، پلاک ۱۲۳', '02122334455', 'info@qahremangym.ir', 
 ARRAY['وزنه', 'کاردیو', 'استخر', 'پارکینگ', 'سونا'], 
 '{"saturday": "6:00-23:00", "sunday": "6:00-23:00", "monday": "6:00-23:00", "tuesday": "6:00-23:00", "wednesday": "6:00-23:00", "thursday": "6:00-23:00", "friday": "14:00-23:00"}',
 '{"monthly": 2500000, "quarterly": 6000000, "yearly": 20000000}',
 200),
 
('باشگاه آتلانتیک', 'باشگاه تخصصی کراس فیت و آمادگی جسمانی', 'تهران، خیابان نیاوران، پلاک ۴۵', '02133445566', 'contact@atlantic.ir',
 ARRAY['کراس فیت', 'آمادگی جسمانی', 'یوگا', 'پارکینگ', 'رختکن'],
 '{"saturday": "7:00-22:00", "sunday": "7:00-22:00", "monday": "7:00-22:00", "tuesday": "7:00-22:00", "wednesday": "7:00-22:00", "thursday": "7:00-22:00", "friday": "16:00-22:00"}',
 '{"monthly": 3000000, "quarterly": 8000000, "yearly": 28000000}',
 150),

('باشگاه فیت لایف', 'باشگاه بانوان با فضای مدرن و امکانات کامل', 'تهران، خیابان شریعتی، پلاک ۷۸', '02144556677', 'info@fitlife.ir',
 ARRAY['وزنه بانوان', 'کاردیو', 'ایروبیک', 'پیلاتس', 'پارکینگ'],
 '{"saturday": "8:00-21:00", "sunday": "8:00-21:00", "monday": "8:00-21:00", "tuesday": "8:00-21:00", "wednesday": "8:00-21:00", "thursday": "8:00-21:00", "friday": "14:00-21:00"}',
 '{"monthly": 2000000, "quarterly": 5500000, "yearly": 18000000}',
 120);

-- Insert sample coaches
INSERT INTO public.coaches (name, bio, specialties, experience_years, certifications, phone, email, instagram, telegram, rating, total_reviews, is_verified) VALUES
('احمد محمدی', 'مربی پرورش اندام با ۱۰ سال تجربه در زمینه بدنسازی و تناسب اندام', 
 ARRAY['پرورش اندام', 'کاهش وزن', 'تناسب اندام'], 10, 
 ARRAY['مربی بدنسازی درجه یک', 'متخصص تغذیه ورزشی'], 
 '09121234567', 'ahmad.mohammadi@example.com', '@ahmad_coach', '@ahmad_coach', 4.8, 156, true),

('سارا احمدی', 'متخصص تغذیه ورزشی و فیتنس با تمرکز بر برنامه‌های کاهش وزن', 
 ARRAY['تغذیه ورزشی', 'کاردیو', 'یوگا'], 7, 
 ARRAY['متخصص تغذیه ورزشی', 'مربی یوگا'], 
 '09129876543', 'sara.ahmadi@example.com', '@sara_nutrition', '@sara_nutrition', 4.9, 89, true),

('علی رضایی', 'مربی کراس فیت و آمادگی جسمانی با رویکرد علمی و مدرن', 
 ARRAY['کراس فیت', 'آمادگی جسمانی', 'قدرتی'], 8, 
 ARRAY['مربی کراس فیت', 'مربی آمادگی جسمانی'], 
 '09123456789', 'ali.rezaei@example.com', '@ali_crossfit', '@ali_crossfit', 4.7, 124, true),

('فاطمه کریمی', 'مربی تخصصی ایروبیک و پیلاتس برای بانوان', 
 ARRAY['ایروبیک', 'پیلاتس', 'رقص ورزشی'], 6, 
 ARRAY['مربی ایروبیک بین‌المللی', 'مربی پیلاتس'], 
 '09134567890', 'fateme.karimi@example.com', '@fateme_fitness', '@fateme_fitness', 4.6, 67, true),

('محمد حسینی', 'مربی پاورلیفتینگ و قدرتی با سابقه مسابقات ملی', 
 ARRAY['پاورلیفتینگ', 'قدرتی', 'بدنسازی'], 12, 
 ARRAY['مربی پاورلیفتینگ درجه یک', 'داور فدراسیون'], 
 '09145678901', 'mohammad.hosseini@example.com', '@mohammad_power', '@mohammad_power', 4.9, 203, true);

-- Create triggers for updated_at
CREATE TRIGGER update_gyms_updated_at
BEFORE UPDATE ON public.gyms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at
BEFORE UPDATE ON public.coaches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();