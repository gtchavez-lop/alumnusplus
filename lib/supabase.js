import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    multiTab: false,
  }
);

export default _supabase;
