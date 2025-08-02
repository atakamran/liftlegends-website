-- Fix remaining function search paths
CREATE OR REPLACE FUNCTION public.trigger_update_aggregate_ratings()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    -- Handle INSERT and UPDATE
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        PERFORM update_aggregate_ratings(NEW.product_id);
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        PERFORM update_aggregate_ratings(OLD.product_id);
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_product_with_schema_data(p_product_id uuid)
RETURNS json
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'product', row_to_json(p.*),
        'offers', COALESCE(offers_array, '[]'::json),
        'reviews', COALESCE(reviews_array, '[]'::json),
        'aggregateRating', COALESCE(rating_data, 'null'::json)
    )
    INTO result
    FROM programs_sale p
    LEFT JOIN (
        SELECT 
            product_id,
            json_agg(
                json_build_object(
                    'id', id,
                    'name', name,
                    'price', price,
                    'currency', currency,
                    'availability', availability,
                    'validFrom', valid_from,
                    'validUntil', valid_until,
                    'url', seller_url
                )
            ) as offers_array
        FROM offers 
        WHERE product_id = p_product_id AND is_active = true
        GROUP BY product_id
    ) o ON p.id = o.product_id
    LEFT JOIN (
        SELECT 
            product_id,
            json_agg(
                json_build_object(
                    'id', id,
                    'title', title,
                    'reviewBody', review_body,
                    'rating', rating,
                    'author', reviewer_name,
                    'datePublished', review_date,
                    'verifiedPurchase', verified_purchase
                )
            ) as reviews_array
        FROM reviews 
        WHERE product_id = p_product_id AND status = 'approved'
        ORDER BY review_date DESC
        LIMIT 10
    ) r ON p.id = r.product_id
    LEFT JOIN (
        SELECT 
            product_id,
            json_build_object(
                'ratingValue', average_rating,
                'reviewCount', total_reviews,
                'bestRating', 5,
                'worstRating', 1
            ) as rating_data
        FROM aggregate_ratings
        WHERE product_id = p_product_id
    ) ar ON p.id = ar.product_id
    WHERE p.id = p_product_id;
    
    RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;