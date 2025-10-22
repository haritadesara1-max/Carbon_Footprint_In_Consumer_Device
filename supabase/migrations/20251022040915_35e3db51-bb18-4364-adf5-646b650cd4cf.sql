-- Make bills bucket private to protect user privacy
UPDATE storage.buckets 
SET public = false 
WHERE name = 'bills';

-- Add INSERT policy for notifications (only service role or system can create)
CREATE POLICY "Only service role can insert notifications"
ON notifications FOR INSERT
TO service_role
WITH CHECK (true);