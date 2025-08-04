-- Fix the ID column default and insert sample data properly
ALTER TABLE public.coaches ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Insert coaches with explicit ID generation
INSERT INTO public.coaches (id, full_name, bio, expertise, experience_years) VALUES
(gen_random_uuid(), 'سارا احمدی', 'متخصص تغذیه ورزشی و فیتنس', 'تغذیه ورزشی، کاردیو، یوگا', 7),
(gen_random_uuid(), 'علی رضایی', 'مربی کراس فیت و آمادگی جسمانی', 'کراس فیت، آمادگی جسمانی، قدرتی', 8),
(gen_random_uuid(), 'فاطمه کریمی', 'مربی تخصصی ایروبیک و پیلاتس', 'ایروبیک، پیلاتس، رقص ورزشی', 6),
(gen_random_uuid(), 'محمد حسینی', 'مربی پاورلیفتینگ و قدرتی', 'پاورلیفتینگ، قدرتی، بدنسازی', 12)
ON CONFLICT (full_name) DO NOTHING;

-- Also fix gyms table and add sample gyms
INSERT INTO public.gyms (id, name, description, address, phone, email, facilities, working_hours, pricing, capacity) VALUES
(gen_random_uuid(), 'باشگاه قهرمان', 'یکی از بهترین باشگاه‌های بدنسازی تهران با تجهیزات مدرن', 'تهران، خیابان ولیعصر، پلاک ۱۲۳', '02122334455', 'info@qahremangym.ir', 
 ARRAY['وزنه', 'کاردیو', 'استخر', 'پارکینگ', 'سونا'], 
 '{"saturday": "6:00-23:00", "sunday": "6:00-23:00", "monday": "6:00-23:00", "tuesday": "6:00-23:00", "wednesday": "6:00-23:00", "thursday": "6:00-23:00", "friday": "14:00-23:00"}'::jsonb,
 '{"monthly": 2500000, "quarterly": 6000000, "yearly": 20000000}'::jsonb,
 200),
 
(gen_random_uuid(), 'باشگاه آتلانتیک', 'باشگاه تخصصی کراس فیت و آمادگی جسمانی', 'تهران، خیابان نیاوران، پلاک ۴۵', '02133445566', 'contact@atlantic.ir',
 ARRAY['کراس فیت', 'آمادگی جسمانی', 'یوگا', 'پارکینگ', 'رختکن'],
 '{"saturday": "7:00-22:00", "sunday": "7:00-22:00", "monday": "7:00-22:00", "tuesday": "7:00-22:00", "wednesday": "7:00-22:00", "thursday": "7:00-22:00", "friday": "16:00-22:00"}'::jsonb,
 '{"monthly": 3000000, "quarterly": 8000000, "yearly": 28000000}'::jsonb,
 150),

(gen_random_uuid(), 'باشگاه فیت لایف', 'باشگاه بانوان با فضای مدرن و امکانات کامل', 'تهران، خیابان شریعتی، پلاک ۷۸', '02144556677', 'info@fitlife.ir',
 ARRAY['وزنه بانوان', 'کاردیو', 'ایروبیک', 'پیلاتس', 'پارکینگ'],
 '{"saturday": "8:00-21:00", "sunday": "8:00-21:00", "monday": "8:00-21:00", "tuesday": "8:00-21:00", "wednesday": "8:00-21:00", "thursday": "8:00-21:00", "friday": "14:00-21:00"}'::jsonb,
 '{"monthly": 2000000, "quarterly": 5500000, "yearly": 18000000}'::jsonb,
 120)
ON CONFLICT (name) DO NOTHING;