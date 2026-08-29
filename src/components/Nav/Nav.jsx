import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import styles from "./Nav.module.css";

const TABS = [
  { id: "registro", label: "Registro de asistencia", to: "/registro" },
  { id: "alumnos", label: "Alumnos", to: "/alumnos" },
];

export default function Nav({ isDark, onToggleTheme, onToggleConfig, configAbierta }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = pathname.startsWith("/alumnos") ? "alumnos" : "registro";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles["nav--scrolled"] : ""} ${configAbierta ? styles["nav--config"] : ""}`}>
      <div className={styles.brand}>
        <img
          className={styles.brand__logo}
          src="/logo.png"
          alt="KarateDoMiyazato"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div>
          <p className={styles.brand__title}>KarateDoMiyazato</p>
          <p className={styles.brand__sub}>Panel del profesor</p>
        </div>
      </div>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${active === tab.id ? styles["tab--active"] : ""}`}
            onClick={() => navigate(tab.to)}
          >
            {active === tab.id && (
              <motion.span
                layoutId="navTabPill"
                className={styles.tabPill}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.acciones}>
      <button
        className={`${styles.themeToggle} ${configAbierta ? styles["config--activo"] : ""}`}
        onClick={onToggleConfig}
        title="Configuración"
        aria-label={configAbierta ? "Cerrar configuración" : "Abrir configuración"}
        aria-expanded={configAbierta}
      >
        <motion.svg
          animate={{ rotate: configAbierta ? 360 : 0 }}
          transition={
            configAbierta
              ? { rotate: { repeat: Infinity, duration: 6, ease: "linear" } }
              : { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
          }
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.14.75.22 1.11.22H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </motion.svg>
      </button>
      <button
        className={styles.themeToggle}
        onClick={onToggleTheme}
        title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
        aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
      </div>
    </nav>
  );
}
