import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const rawUrl = process.env.SUPABASE_URL?.trim() || "";
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const supabaseKey = process.env.SUPABASE_KEY?.trim() || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[TempoMatch API] Warning: SUPABASE_URL or SUPABASE_KEY is not set in .env"
  );
}

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

