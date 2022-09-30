const { createClient } = require("@supabase/supabase-js");

const __supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANONKEY
);

export default __supabase;
