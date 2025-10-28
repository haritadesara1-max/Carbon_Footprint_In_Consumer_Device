-- Fix notifications INSERT policy to prevent unauthorized insertions
-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Only service role can insert notifications" ON public.notifications;

-- Create a restrictive policy that denies all INSERT operations for regular users
-- Only service role will be able to insert notifications
CREATE POLICY "Only service role can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Note: Service role bypasses RLS, so it can still insert notifications
-- This prevents regular authenticated users from creating notifications for other users