import { createClient } from '@supabase/supabase-js';

const supabase_url = 'https://guznbdjfyftwlpnecilx.supabase.co';
const supabase_publicSafe_key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1em5iZGpmeWZ0d2xwbmVjaWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI3MjgwMDIsImV4cCI6MTk3ODMwNDAwMn0.DQuJoMTUD9eaGMveESbfl9oi-Ndt-LSnrWmQFEnKmAc';

const _supabase = createClient(supabase_url, supabase_publicSafe_key);

export default _supabase;
