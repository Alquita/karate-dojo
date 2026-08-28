import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Nav from "./components/Nav/Nav";
import CheckIn from "./components/CheckIn/CheckIn";
import StudentsList from "./components/Students/StudentsList";
import Noise from "./components/ui/Noise";
import ErrorBoundary from "./components/ui/ErrorBoundary";

export default function App() {
  const location = useLocation();
  const esAlumnos = location.pathname.startsWith("/alumnos");
  const seccion = esAlumnos ? "alumnos" : "registro";

  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
    } catch {}
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  return (
    <div className="app">
      {/* Fondo del dojo: fijo a nivel app y fuera del wrapper animado, para que
          cubra todo el viewport (un transform/filter en un ancestro lo recortaría). */}
      <div className="dojo-bg" data-visible={!esAlumnos} aria-hidden="true" />
      <Noise patternAlpha={6} patternRefreshInterval={4} />
      <Nav isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />
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
    </div>
  );
}
