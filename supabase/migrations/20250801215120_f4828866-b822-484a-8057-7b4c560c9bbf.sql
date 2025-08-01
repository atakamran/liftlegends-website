-- Phase 1: Critical Security Fixes

-- 1. Enable Row Level Security on all tables and fix policies
ALTER TABLE public.aggregate_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 2. Fix user_profiles RLS policies - allow users to manage their own profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = user_id);

-- 3. Add proper RLS policies for other tables
CREATE POLICY "Anyone can view aggregate ratings" ON public.aggregate_ratings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage aggregate ratings" ON public.aggregate_ratings
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view offers" ON public.offers
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage offers" ON public.offers
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view approved reviews" ON public.reviews
FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert reviews" ON public.reviews
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage reviews" ON public.reviews
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view program details" ON public.program_details
FOR SELECT USING (true);

CREATE POLICY "Admins can manage program details" ON public.program_details
FOR ALL USING (is_admin(auth.uid()));

-- 4. Update database functions with proper search_path for security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = _user_id AND is_admin = TRUE
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_coach(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = _user_id AND is_coach = TRUE
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_blog_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_roles 
    WHERE user_id = _user_id AND role IN ('admin', 'editor')
  );
END;
$function$;