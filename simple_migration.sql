-- Create gyms table
CREATE TABLE IF NOT EXISTS gyms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    instagram VARCHAR(255),
    telegram VARCHAR(255),
    cover_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    facilities TEXT[] DEFAULT '{}',
    working_hours JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gym_memberships table
CREATE TABLE IF NOT EXISTS gym_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_months INTEGER NOT NULL DEFAULT 1,
    sessions_count INTEGER,
    includes_pool BOOLEAN DEFAULT false,
    includes_sauna BOOLEAN DEFAULT false,
    includes_personal_trainer BOOLEAN DEFAULT false,
    discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaches table
CREATE TABLE IF NOT EXISTS coaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    certifications TEXT[] DEFAULT '{}',
    profile_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    phone VARCHAR(50),
    email VARCHAR(255),
    instagram VARCHAR(255),
    telegram VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coach_programs table
CREATE TABLE IF NOT EXISTS coach_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('workout', 'nutrition', 'supplement', 'complete')),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_weeks INTEGER NOT NULL DEFAULT 4,
    includes_workout BOOLEAN DEFAULT false,
    includes_nutrition BOOLEAN DEFAULT false,
    includes_supplement BOOLEAN DEFAULT false,
    discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_cart table
CREATE TABLE IF NOT EXISTS shopping_cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('gym_membership', 'coach_program', 'product')),
    item_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Create athlete_programs table (for coach-athlete program management)
CREATE TABLE IF NOT EXISTS athlete_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    program_id UUID REFERENCES coach_programs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    workout_plan JSONB DEFAULT '{}',
    nutrition_plan JSONB DEFAULT '{}',
    supplement_plan JSONB DEFAULT '{}',
    notes TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('gym_membership', 'coach_program', 'product')),
    item_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gyms_location ON gyms(location);
CREATE INDEX IF NOT EXISTS idx_gyms_is_active ON gyms(is_active);
CREATE INDEX IF NOT EXISTS idx_gym_memberships_gym_id ON gym_memberships(gym_id);
CREATE INDEX IF NOT EXISTS idx_gym_memberships_is_active ON gym_memberships(is_active);
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_is_active ON coaches(is_active);
CREATE INDEX IF NOT EXISTS idx_coaches_rating ON coaches(rating);
CREATE INDEX IF NOT EXISTS idx_coach_programs_coach_id ON coach_programs(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_programs_type ON coach_programs(type);
CREATE INDEX IF NOT EXISTS idx_coach_programs_is_active ON coach_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user_id ON shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_item_type ON shopping_cart(item_type);
CREATE INDEX IF NOT EXISTS idx_athlete_programs_athlete_id ON athlete_programs(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_programs_coach_id ON athlete_programs(coach_id);
CREATE INDEX IF NOT EXISTS idx_athlete_programs_status ON athlete_programs(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS (Row Level Security)
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies (public read for most tables)
CREATE POLICY "Public read access" ON gyms FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON gym_memberships FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON coaches FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON coach_programs FOR SELECT USING (is_active = true);

-- Shopping cart policies (user can only access their own cart)
CREATE POLICY "Users can manage their own cart" ON shopping_cart FOR ALL USING (user_id = auth.uid());

-- Orders policies (users can access their own orders)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());

-- Order items policies (users can access their own order items)
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);
CREATE POLICY "Users can create their own order items" ON order_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);

-- Athlete programs policies
CREATE POLICY "Athletes can view their own programs" ON athlete_programs FOR SELECT USING (athlete_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON gyms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gym_memberships_updated_at BEFORE UPDATE ON gym_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coach_programs_updated_at BEFORE UPDATE ON coach_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_cart_updated_at BEFORE UPDATE ON shopping_cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athlete_programs_updated_at BEFORE UPDATE ON athlete_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing

-- Sample gyms
INSERT INTO gyms (name, description, location, address, phone, facilities) VALUES
('باشگاه آتلانتیک', 'باشگاه مدرن با امکانات کامل', 'تهران - ولیعصر', 'خیابان ولیعصر، نرسیده به پارک وی', '02122334455', ARRAY['وزنه', 'کاردیو', 'استخر', 'سونا']),
('باشگاه پاور جیم', 'تخصصی در پرورش اندام', 'تهران - نیاوران', 'خیابان نیاوران، کوچه بهار', '02133445566', ARRAY['وزنه', 'کراس فیت', 'بوکس']),
('باشگاه فیتنس پلاس', 'باشگاه خانوادگی با فضای دوستانه', 'تهران - سعادت آباد', 'سعادت آباد، خیابان اصلی', '02144556677', ARRAY['وزنه', 'کاردیو', 'یوگا', 'پیلاتس'])
ON CONFLICT DO NOTHING;

-- Sample gym memberships
INSERT INTO gym_memberships (gym_id, title, description, price, duration_months, sessions_count, includes_pool, includes_sauna) 
SELECT 
    g.id,
    'عضویت ماهانه پایه',
    'دسترسی به تمام تجهیزات باشگاه',
    1500000,
    1,
    NULL,
    false,
    false
FROM gyms g
WHERE g.name = 'باشگاه آتلانتیک'
ON CONFLICT DO NOTHING;

INSERT INTO gym_memberships (gym_id, title, description, price, duration_months, sessions_count, includes_pool, includes_sauna) 
SELECT 
    g.id,
    'عضویت ماهانه VIP',
    'دسترسی کامل + استخر + سونا',
    2500000,
    1,
    NULL,
    true,
    true
FROM gyms g
WHERE g.name = 'باشگاه آتلانتیک'
ON CONFLICT DO NOTHING;

-- Sample coaches
INSERT INTO coaches (name, bio, specialties, experience_years, rating, total_reviews, is_verified) VALUES
('احمد محمدی', 'مربی پرورش اندام با ۱۰ سال تجربه', ARRAY['پرورش اندام', 'کاهش وزن', 'تناسب اندام'], 10, 4.8, 156, true),
('سارا احمدی', 'متخصص تغذیه ورزشی و فیتنس', ARRAY['تغذیه ورزشی', 'کاردیو', 'یوگا'], 7, 4.9, 89, true),
('علی رضایی', 'مربی کراس فیت و آمادگی جسمانی', ARRAY['کراس فیت', 'آمادگی جسمانی', 'قدرتی'], 8, 4.7, 124, true)
ON CONFLICT DO NOTHING;

-- Sample coach programs
INSERT INTO coach_programs (coach_id, title, description, type, price, duration_weeks, includes_workout, includes_nutrition, includes_supplement)
SELECT 
    c.id,
    'برنامه تمرینی حرفه‌ای',
    'برنامه تمرینی کامل برای پرورش اندام',
    'workout',
    800000,
    8,
    true,
    false,
    false
FROM coaches c
WHERE c.name = 'احمد محمدی'
ON CONFLICT DO NOTHING;

INSERT INTO coach_programs (coach_id, title, description, type, price, duration_weeks, includes_workout, includes_nutrition, includes_supplement)
SELECT 
    c.id,
    'پک کامل تناسب اندام',
    'شامل برنامه تمرینی، غذایی و مکمل',
    'complete',
    1500000,
    12,
    true,
    true,
    true
FROM coaches c
WHERE c.name = 'سارا احمدی'
ON CONFLICT DO NOTHING;