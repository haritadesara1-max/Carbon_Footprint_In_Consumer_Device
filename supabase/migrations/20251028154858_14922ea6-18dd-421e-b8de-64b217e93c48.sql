-- Fix storage bucket access policies for 'bills' bucket
-- Add RLS policies to enforce user ownership at storage layer

CREATE POLICY "Users can only view own bills"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'bills' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bills' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only update own bills"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'bills' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can only delete own bills"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'bills' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create atomic RPC function to prevent race conditions in points updates
CREATE OR REPLACE FUNCTION public.increment_user_points(
  p_user_id UUID,
  p_points_delta INTEGER DEFAULT 0,
  p_carbon_delta NUMERIC DEFAULT 0,
  p_pickups_delta INTEGER DEFAULT 0,
  p_certs_delta INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE user_points
  SET 
    total_points = total_points + p_points_delta,
    carbon_saved = carbon_saved + p_carbon_delta,
    pickups_completed = pickups_completed + p_pickups_delta,
    certificates_earned = certificates_earned + p_certs_delta,
    updated_at = NOW()
  WHERE user_id = p_user_id;
$$;

-- Fix existing negative points before adding constraint
UPDATE user_points
SET total_points = 0
WHERE total_points < 0;

-- Add constraint to prevent negative points
ALTER TABLE user_points 
ADD CONSTRAINT positive_points CHECK (total_points >= 0);