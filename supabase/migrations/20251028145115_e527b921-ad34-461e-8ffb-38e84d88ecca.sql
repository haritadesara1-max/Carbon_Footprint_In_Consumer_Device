-- Create trigger to prevent user_type modifications after account creation
CREATE OR REPLACE FUNCTION public.prevent_user_type_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow changes if user_type is NULL (initial creation) or if it's the same value
  IF OLD.user_type IS NOT NULL AND NEW.user_type != OLD.user_type THEN
    RAISE EXCEPTION 'Cannot change user_type after account creation';
  END IF;
  RETURN NEW;
END;
$$;

-- Add trigger to profiles table
DROP TRIGGER IF EXISTS prevent_user_type_change_trigger ON public.profiles;
CREATE TRIGGER prevent_user_type_change_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_type_change();