import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jodbbqaeimpskcbuzmmq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZGJicWFlaW1wc2tjYnV6bW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcyODE3MTEsImV4cCI6MTk4Mjg1NzcxMX0.ZflC4tazNMCydjPZJtyM1CbPIXP3Vb-3NIlNs6l5COA";
const __supabase = createClient(supabaseUrl, supabaseKey);

export default __supabase;
