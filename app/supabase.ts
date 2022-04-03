import { createClient } from "@supabase/supabase-js";

const isServer = typeof window === "undefined";

const supabaseUrl = isServer
  ? process.env.SUPABASE_URL
  : window.env.SUPABASE_URL;

const supabaseKey = isServer
  ? process.env.SUPABASE_KEY
  : window.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_KEY env vars not set. Please set them in your .env file."
  );
}

export default createClient(supabaseUrl, supabaseKey);
