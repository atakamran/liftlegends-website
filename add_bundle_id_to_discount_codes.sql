-- Add bundle_id column to discount_codes table to support bundle-specific discount codes

-- Add the bundle_id column
ALTER TABLE discount_codes 
ADD COLUMN bundle_id UUID REFERENCES product_bundles(id);

-- Add index for better performance
CREATE INDEX idx_discount_codes_bundle_id ON discount_codes(bundle_id);

-- Add comment to explain the column
COMMENT ON COLUMN discount_codes.bundle_id IS 'Reference to product_bundles table for bundle-specific discount codes';