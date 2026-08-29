import { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Nav from "./components/Nav/Nav";
import CheckIn from "./components/CheckIn/CheckIn";
import StudentsList from "./components/Students/StudentsList";
import ConfigDrawer from "./components/Config/ConfigDrawer";
import Noise from "./components/ui/Noise";
import ErrorBoundary from "./components/ui/ErrorBoundary";

export default function App() {
  const location = useLocation();
  const esAlumnos = location.pathname.startsWith("/alumnos");
  const seccion = esAlumnos ? "alumnos" : "registro";

  const [configAbierta, setConfigAbierta] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
    } catch {}
    return true;
  });

  const primeraVez = useRef(true);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", !isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}

    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    // Transición suave sólo durante el cambio de tema (no permanente).
    root.classList.add("theme-transition");
    const t = setTimeout(() => root.classList.remove("theme-transition"), 500);
    return () => clearTimeout(t);
  }, [isDark]);

  return (
    <div className="app">
      {/* Fondo del dojo: fijo a nivel app y fuera del wrapper animado, para que
          cubra todo el viewport (un transform/filter en un ancestro lo recortaría). */}
      <div className="dojo-bg" data-visible={!esAlumnos} aria-hidden="true" />
      <Noise patternAlpha={6} patternRefreshInterval={4} />
      <Nav
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onToggleConfig={() => setConfigAbierta((v) => !v)}
        configAbierta={configAbierta}
      />
      <main className={`app__main ${esAlumnos ? "app__main--ancho" : ""}`}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={seccion}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/registro" replace />} />
                <Route path="/registro" element={<CheckIn />} />
                <Route path="/alumnos/*" element={<StudentsList />} />
                <Route path="*" element={<Navigate to="/registro" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <ConfigDrawer
        abierta={configAbierta}
        onCerrar={() => setConfigAbierta(false)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
      />
    </div>
  );
}
