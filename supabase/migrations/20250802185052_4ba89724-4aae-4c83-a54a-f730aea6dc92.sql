-- Fix remaining RLS and function security issues

-- Enable RLS on remaining tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs_sale ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Fix all function search paths
CREATE OR REPLACE FUNCTION public.cleanup_expired_web_auth_tokens()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    DELETE FROM web_auth_tokens 
    WHERE expires_at < NOW() OR used = TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_web_auth_tokens_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_bundle_total_price(bundle_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    total_price INTEGER := 0;
BEGIN
    SELECT COALESCE(SUM(ps.price), 0) INTO total_price
    FROM bundle_items bi
    JOIN programs_sale ps ON bi.program_id = ps.id
    WHERE bi.bundle_id = bundle_uuid;
    
    RETURN total_price;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_bundle_discount_amount(bundle_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    bundle_price INTEGER;
    discount_percent INTEGER;
    discount_amount INTEGER := 0;
BEGIN
    SELECT price, discount_percentage INTO bundle_price, discount_percent
    FROM product_bundles
    WHERE id = bundle_uuid;
    
    IF discount_percent IS NOT NULL AND discount_percent > 0 THEN
        discount_amount := ROUND(bundle_price * discount_percent / 100.0);
    END IF;
    
    RETURN discount_amount;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_bundle_final_price(bundle_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    bundle_price INTEGER;
    discount_amount INTEGER;
BEGIN
    SELECT price INTO bundle_price FROM product_bundles WHERE id = bundle_uuid;
    SELECT get_bundle_discount_amount(bundle_uuid) INTO discount_amount;
    
    RETURN bundle_price - discount_amount;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_aggregate_ratings(p_product_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    v_avg_rating DECIMAL(3,2);
    v_total_reviews INTEGER;
    v_rating_counts INTEGER[];
    v_verified_count INTEGER;
    v_avg_verified_rating DECIMAL(3,2);
    v_recommend_count INTEGER;
    v_not_recommend_count INTEGER;
    v_helpful_votes INTEGER;
    v_total_votes INTEGER;
    v_last_review_date TIMESTAMPTZ;
BEGIN
    -- Get basic statistics
    SELECT 
        COALESCE(AVG(rating), 0)::DECIMAL(3,2),
        COUNT(*),
        COUNT(*) FILTER (WHERE verified_purchase = true),
        COALESCE(AVG(rating) FILTER (WHERE verified_purchase = true), 0)::DECIMAL(3,2),
        COUNT(*) FILTER (WHERE would_recommend = true),
        COUNT(*) FILTER (WHERE would_recommend = false),
        COALESCE(SUM(helpful_votes), 0),
        COALESCE(SUM(total_votes), 0),
        MAX(review_date)
    INTO 
        v_avg_rating, v_total_reviews, v_verified_count, v_avg_verified_rating,
        v_recommend_count, v_not_recommend_count, v_helpful_votes, v_total_votes,
        v_last_review_date
    FROM reviews 
    WHERE product_id = p_product_id AND status = 'approved';
    
    -- Get rating distribution
    SELECT ARRAY[
        COUNT(*) FILTER (WHERE rating = 5),
        COUNT(*) FILTER (WHERE rating = 4),
        COUNT(*) FILTER (WHERE rating = 3),
        COUNT(*) FILTER (WHERE rating = 2),
        COUNT(*) FILTER (WHERE rating = 1)
    ]
    INTO v_rating_counts
    FROM reviews 
    WHERE product_id = p_product_id AND status = 'approved';
    
    -- Insert or update aggregate ratings
    INSERT INTO aggregate_ratings (
        product_id, average_rating, total_reviews,
        rating_5_count, rating_4_count, rating_3_count, rating_2_count, rating_1_count,
        verified_reviews_count, average_verified_rating,
        would_recommend_count, would_not_recommend_count,
        recommendation_percentage,
        helpful_votes_total, total_votes_total,
        last_updated, last_review_date
    ) VALUES (
        p_product_id, v_avg_rating, v_total_reviews,
        v_rating_counts[1], v_rating_counts[2], v_rating_counts[3], v_rating_counts[4], v_rating_counts[5],
        v_verified_count, v_avg_verified_rating,
        v_recommend_count, v_not_recommend_count,
        CASE WHEN (v_recommend_count + v_not_recommend_count) > 0 
             THEN (v_recommend_count::DECIMAL / (v_recommend_count + v_not_recommend_count) * 100)::DECIMAL(5,2)
             ELSE 0 END,
        v_helpful_votes, v_total_votes,
        NOW(), v_last_review_date
    )
    ON CONFLICT (product_id) DO UPDATE SET
        average_rating = EXCLUDED.average_rating,
        total_reviews = EXCLUDED.total_reviews,
        rating_5_count = EXCLUDED.rating_5_count,
        rating_4_count = EXCLUDED.rating_4_count,
        rating_3_count = EXCLUDED.rating_3_count,
        rating_2_count = EXCLUDED.rating_2_count,
        rating_1_count = EXCLUDED.rating_1_count,
        verified_reviews_count = EXCLUDED.verified_reviews_count,
        average_verified_rating = EXCLUDED.average_verified_rating,
        would_recommend_count = EXCLUDED.would_recommend_count,
        would_not_recommend_count = EXCLUDED.would_not_recommend_count,
        recommendation_percentage = EXCLUDED.recommendation_percentage,
        helpful_votes_total = EXCLUDED.helpful_votes_total,
        total_votes_total = EXCLUDED.total_votes_total,
        last_updated = NOW(),
        last_review_date = EXCLUDED.last_review_date;
END;
$function$;