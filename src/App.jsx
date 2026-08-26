import { useState, useEffect } from "react";
import Nav from "./components/Nav/Nav";
import CheckIn from "./components/CheckIn/CheckIn";
import StudentsList from "./components/Students/StudentsList";
import Noise from "./components/ui/Noise";
import ErrorBoundary from "./components/ui/ErrorBoundary";

export default function App() {
  const [pantalla, setPantalla] = useState("registro");
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
      <Noise patternAlpha={6} patternRefreshInterval={4} />
      <Nav active={pantalla} onChange={setPantalla} isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />
      <main className="app__main">
        <ErrorBoundary>
          {pantalla === "registro" ? <CheckIn /> : <StudentsList />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
