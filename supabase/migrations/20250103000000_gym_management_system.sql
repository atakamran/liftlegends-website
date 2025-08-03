-- Gym Management System Database Schema

-- Create gyms table
CREATE TABLE IF NOT EXISTS public.gyms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    instagram VARCHAR(255),
    telegram VARCHAR(255),
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    facilities JSONB DEFAULT '[]'::jsonb,
    working_hours JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gym_memberships table (شهریه‌های باشگاه)
CREATE TABLE IF NOT EXISTS public.gym_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_months INTEGER NOT NULL DEFAULT 1,
    sessions_count INTEGER,
    includes_pool BOOLEAN DEFAULT false,
    includes_sauna BOOLEAN DEFAULT false,
    includes_personal_trainer BOOLEAN DEFAULT false,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaches table (مربی‌ها)
CREATE TABLE IF NOT EXISTS public.coaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    specialties JSONB DEFAULT '[]'::jsonb,
    experience_years INTEGER DEFAULT 0,
    certifications JSONB DEFAULT '[]'::jsonb,
    profile_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    phone VARCHAR(20),
    email VARCHAR(255),
    instagram VARCHAR(255),
    telegram VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coach_programs table (برنامه‌های مربی)
CREATE TABLE IF NOT EXISTS public.coach_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('workout', 'nutrition', 'supplement', 'complete')),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_weeks INTEGER DEFAULT 4,
    includes_workout BOOLEAN DEFAULT false,
    includes_nutrition BOOLEAN DEFAULT false,
    includes_supplement BOOLEAN DEFAULT false,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create athlete_management table (مدیریت ورزشکار)
CREATE TABLE IF NOT EXISTS public.athlete_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.coach_programs(id) ON DELETE CASCADE,
    purchase_id UUID, -- Reference to purchase record
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    workout_plan JSONB DEFAULT '{}'::jsonb,
    nutrition_plan JSONB DEFAULT '{}'::jsonb,
    supplement_plan JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    start_date DATE,
    end_date DATE,
    progress JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_cart table (سبد خرید)
CREATE TABLE IF NOT EXISTS public.shopping_cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('gym_membership', 'coach_program', 'product')),
    item_id UUID NOT NULL,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Create purchases table (خریدها)
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('gym_membership', 'coach_program', 'product')),
    item_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coach_reviews table (نظرات مربی‌ها)
CREATE TABLE IF NOT EXISTS public.coach_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coach_id, user_id)
);

-- Create gym_reviews table (نظرات باشگاه‌ها)
CREATE TABLE IF NOT EXISTS public.gym_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(gym_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gyms_is_active ON public.gyms(is_active);
CREATE INDEX IF NOT EXISTS idx_gym_memberships_gym_id ON public.gym_memberships(gym_id);
CREATE INDEX IF NOT EXISTS idx_gym_memberships_is_active ON public.gym_memberships(is_active);
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_is_active ON public.coaches(is_active);
CREATE INDEX IF NOT EXISTS idx_coach_programs_coach_id ON public.coach_programs(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_programs_is_active ON public.coach_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_athlete_management_athlete_id ON public.athlete_management(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_management_coach_id ON public.athlete_management(coach_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON public.shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_status ON public.purchases(payment_status);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables
CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON public.gyms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gym_memberships_updated_at BEFORE UPDATE ON public.gym_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON public.coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coach_programs_updated_at BEFORE UPDATE ON public.coach_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athlete_management_updated_at BEFORE UPDATE ON public.athlete_management FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_cart_updated_at BEFORE UPDATE ON public.shopping_cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coach_reviews_updated_at BEFORE UPDATE ON public.coach_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gym_reviews_updated_at BEFORE UPDATE ON public.gym_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update coach rating
CREATE OR REPLACE FUNCTION update_coach_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.coaches 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating::DECIMAL), 0) 
            FROM public.coach_reviews 
            WHERE coach_id = COALESCE(NEW.coach_id, OLD.coach_id)
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM public.coach_reviews 
            WHERE coach_id = COALESCE(NEW.coach_id, OLD.coach_id)
        )
    WHERE id = COALESCE(NEW.coach_id, OLD.coach_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger for coach rating updates
CREATE TRIGGER update_coach_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.coach_reviews
    FOR EACH ROW EXECUTE FUNCTION update_coach_rating();

-- Enable RLS (Row Level Security)
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Gyms policies
CREATE POLICY "Anyone can view active gyms" ON public.gyms FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage gyms" ON public.gyms FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Gym memberships policies
CREATE POLICY "Anyone can view active gym memberships" ON public.gym_memberships FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage gym memberships" ON public.gym_memberships FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Coaches policies
CREATE POLICY "Anyone can view active coaches" ON public.coaches FOR SELECT USING (is_active = true);
CREATE POLICY "Coaches can update their own profile" ON public.coaches FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage coaches" ON public.coaches FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Coach programs policies
CREATE POLICY "Anyone can view active coach programs" ON public.coach_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Coaches can manage their own programs" ON public.coach_programs FOR ALL USING (
    coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all coach programs" ON public.coach_programs FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Athlete management policies
CREATE POLICY "Athletes can view their own management records" ON public.athlete_management FOR SELECT USING (athlete_id = auth.uid());
CREATE POLICY "Coaches can manage their athletes" ON public.athlete_management FOR ALL USING (
    coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all athlete records" ON public.athlete_management FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Shopping cart policies
CREATE POLICY "Users can manage their own cart" ON public.shopping_cart FOR ALL USING (user_id = auth.uid());

-- Purchases policies
CREATE POLICY "Users can view their own purchases" ON public.purchases FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own purchases" ON public.purchases FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all purchases" ON public.purchases FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.coach_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.coach_reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON public.coach_reviews FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can view gym reviews" ON public.gym_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create gym reviews" ON public.gym_reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own gym reviews" ON public.gym_reviews FOR UPDATE USING (user_id = auth.uid());