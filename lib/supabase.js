import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://guznbdjfyftwlpnecilx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1em5iZGpmeWZ0d2xwbmVjaWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI3MjgwMDIsImV4cCI6MTk3ODMwNDAwMn0.DQuJoMTUD9eaGMveESbfl9oi-Ndt-LSnrWmQFEnKmAc";

const __supabase = createClient(supabaseUrl, supabaseKey);

export default __supabase;
