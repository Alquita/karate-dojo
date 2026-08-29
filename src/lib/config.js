import { createContext, useContext } from "react";
import { getConfig, saveConfig } from "./dataClient";

// Preferencias del profesor (clases por semana, % mínimo para rendir).
// Se guardan en Supabase (tabla `config`, fila única id=1), NO en localStorage.

export const DEFAULTS = { clasesPorSemana: 3, minRendirPct: 80, minRendirGrupos: {} };

// El % mínimo para rendir es por grupo; si un grupo no tiene el suyo, usa el general.
export function umbralGrupo(config, grupo) {
  const porGrupo = config?.minRendirGrupos?.[grupo];
  return typeof porGrupo === "number" ? porGrupo : config?.minRendirPct ?? 80;
}

export const ConfigContext = createContext({
  config: DEFAULTS,
  guardarConfig: async () => {},
  cargando: true,
});

export function useConfig() {
  return useContext(ConfigContext);
}

export { getConfig, saveConfig };
