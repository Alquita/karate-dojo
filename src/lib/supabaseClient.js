// ─────────────────────────────────────────────────────────────────────────
// Conexión a Supabase — DESACTIVADA por ahora.
//
// Para activarla cuando tengamos los datos reales:
//   1. Crear un archivo .env.local en la raíz del proyecto con:
//        VITE_SUPABASE_URL=https://bltlvubiptzdofcylmps.supabase.co
//        VITE_SUPABASE_ANON_KEY=sb_publishable_...
//   2. Descomentar el bloque de abajo y borrar el `export const supabase = null`.
//   3. En dataClient.js, activar el bloque de Supabase (está comentado al final).
// ─────────────────────────────────────────────────────────────────────────

// import { createClient } from "@supabase/supabase-js";
//
// const url = import.meta.env.VITE_SUPABASE_URL;
// const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
//
// export const supabase = url && key ? createClient(url, key) : null;
// export const HAY_SUPABASE = Boolean(supabase);

export const supabase = null;
export const HAY_SUPABASE = false;
