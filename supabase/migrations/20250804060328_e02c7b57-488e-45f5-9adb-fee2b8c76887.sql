-- Update existing coaches table to use proper structure
-- Since the table exists with different column names, let's work with what we have
UPDATE public.coaches SET 
  full_name = 'احمد محمدی',
  bio = 'مربی پرورش اندام با ۱۰ سال تجربه در زمینه بدنسازی و تناسب اندام',
  expertise = 'پرورش اندام، کاهش وزن، تناسب اندام',
  experience_years = 10
WHERE id = (SELECT id FROM public.coaches ORDER BY created_at LIMIT 1);

-- Insert additional coaches using the existing structure
INSERT INTO public.coaches (full_name, bio, expertise, experience_years) VALUES
('سارا احمدی', 'متخصص تغذیه ورزشی و فیتنس', 'تغذیه ورزشی، کاردیو، یوگا', 7),
('علی رضایی', 'مربی کراس فیت و آمادگی جسمانی', 'کراس فیت، آمادگی جسمانی، قدرتی', 8),
('فاطمه کریمی', 'مربی تخصصی ایروبیک و پیلاتس', 'ایروبیک، پیلاتس، رقص ورزشی', 6),
('محمد حسینی', 'مربی پاورلیفتینگ و قدرتی', 'پاورلیفتینگ، قدرتی، بدنسازی', 12)
ON CONFLICT DO NOTHING;