import { createClient } from "@supabase/supabase-js";

// Config vía .env.local (no se sube al repo):
//   VITE_SUPABASE_URL=https://xxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=sb_publishable_...
// Si no están, la app funciona en modo demo con datos mock en memoria.

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const HAY_SUPABASE = Boolean(supabase);
