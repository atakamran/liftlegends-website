-- Create gyms table
CREATE TABLE public.gyms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    location text,
    contact_phone text,
    contact_email text,
    image_url text,
    facilities text[],
    operating_hours jsonb,
    membership_types jsonb,
    price_range text,
    rating numeric(3,2) DEFAULT 0.00,
    total_reviews integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;

-- Create policies for gyms
CREATE POLICY "Anyone can view active gyms" 
ON public.gyms 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage gyms" 
ON public.gyms 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_gyms_updated_at
    BEFORE UPDATE ON public.gyms
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample gym data
INSERT INTO public.gyms (name, description, location, contact_phone, contact_email, image_url, facilities, operating_hours, membership_types, price_range, rating, total_reviews) VALUES
('باشگاه ورزشی الیت', 'باشگاه کامل با امکانات پیشرفته', 'تهران، میدان ولیعصر', '02112345678', 'info@elitegym.ir', '/images/gym1.jpg', ARRAY['وزنه', 'کاردیو', 'استخر', 'سونا'], '{"monday": "6:00-22:00", "tuesday": "6:00-22:00", "wednesday": "6:00-22:00", "thursday": "6:00-22:00", "friday": "6:00-22:00", "saturday": "8:00-20:00", "sunday": "8:00-20:00"}'::jsonb, '{"monthly": 500000, "3_months": 1400000, "6_months": 2700000, "yearly": 5000000}'::jsonb, '500-800 هزار تومان', 4.5, 125),
('باشگاه ورزشی فیت نس پلاس', 'باشگاه مدرن با تجهیزات حرفه‌ای', 'تهران، پاسداران', '02187654321', 'contact@fitnessplus.ir', '/images/gym2.jpg', ARRAY['وزنه', 'کاردیو', 'یوگا', 'پیلاتس'], '{"monday": "5:30-23:00", "tuesday": "5:30-23:00", "wednesday": "5:30-23:00", "thursday": "5:30-23:00", "friday": "5:30-23:00", "saturday": "7:00-21:00", "sunday": "7:00-21:00"}'::jsonb, '{"monthly": 400000, "3_months": 1100000, "6_months": 2100000, "yearly": 4000000}'::jsonb, '400-600 هزار تومان', 4.2, 89),
('باشگاه ورزشی پاور هاوس', 'باشگاه تخصصی بدنسازی', 'تهران، سعادت آباد', '02155555555', 'info@powerhouse.ir', '/images/gym3.jpg', ARRAY['وزنه', 'کراس فیت', 'بوکس'], '{"monday": "6:00-22:30", "tuesday": "6:00-22:30", "wednesday": "6:00-22:30", "thursday": "6:00-22:30", "friday": "6:00-22:30", "saturday": "8:00-20:00", "sunday": "closed"}'::jsonb, '{"monthly": 350000, "3_months": 950000, "6_months": 1800000, "yearly": 3500000}'::jsonb, '350-500 هزار تومان', 4.0, 67);