import { useEffect, useState, useCallback } from "react";
import { ConfigContext, DEFAULTS, getConfig, saveConfig } from "./config";

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULTS);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    getConfig()
      .then((c) => { if (vivo) setConfig(c); })
      .catch(() => {})
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);

  const guardarConfig = useCallback(async (parcial) => {
    setConfig((prev) => ({ ...prev, ...parcial })); // optimista
    try {
      setConfig(await saveConfig(parcial));
    } catch {
      try { setConfig(await getConfig()); } catch {}
    }
  }, []);

  return (
    <ConfigContext.Provider value={{ config, guardarConfig, cargando }}>
      {children}
    </ConfigContext.Provider>
  );
}
