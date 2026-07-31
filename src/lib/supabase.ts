import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Client is intentionally null until public Supabase environment variables are configured.
 * Never put a Supabase service-role key in a VITE_ variable.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
