-- Add state column to carbon_tracking table
ALTER TABLE public.carbon_tracking 
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS manual_units_input BOOLEAN DEFAULT false;