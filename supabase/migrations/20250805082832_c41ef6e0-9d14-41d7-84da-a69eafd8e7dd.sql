-- Fix coaches table to have auto-generated UUID
ALTER TABLE public.coaches 
ALTER COLUMN id SET DEFAULT gen_random_uuid();