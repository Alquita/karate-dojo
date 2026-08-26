// Cuando crees el proyecto en supabase.com, agregá un archivo .env con:
//
//   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
//   VITE_SUPABASE_ANON_KEY=tu-anon-key
//
// y descomentá lo de abajo. dataClient.js es el único lugar que necesita
// tocarse para pasar de datos mock a datos reales — el resto de la app no
// sabe ni le importa de dónde vienen los datos.

// import { createClient } from "@supabase/supabase-js";
//
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );

export const supabase = null;
