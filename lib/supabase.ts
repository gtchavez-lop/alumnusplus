import { createClient } from "@supabase/supabase-js";

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANONKEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const supabase = createClient(
	supabaseUrl as string,
	supabaseKey as string,
);
