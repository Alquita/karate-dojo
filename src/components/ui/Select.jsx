import { useEffect, useRef, useState } from "react";
import styles from "./Select.module.css";

// Dropdown propio (el <select> nativo no se puede estilar).
// options: [{ value, label, color? }]
export default function Select({ value, onChange, options, ariaLabel, className = "" }) {
  const [abierto, setAbierto] = useState(false);
  const [foco, setFoco] = useState(-1);
  const ref = useRef(null);
  const listaRef = useRef(null);

  const seleccionada = options.find((o) => o.value === value) || null;

  useEffect(() => {
    if (!abierto) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") { setAbierto(false); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setFoco((i) => Math.min(options.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setFoco((i) => Math.max(0, i - 1)); }
      if (e.key === "Enter" && foco >= 0) {
        e.preventDefault();
        onChange(options[foco].value);
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [abierto, foco, options, onChange]);

  useEffect(() => {
    if (abierto) {
      listaRef.current?.querySelector('[data-sel="true"]')?.scrollIntoView({ block: "nearest" });
    }
  }, [abierto]);

  function alternar() {
    const abrir = !abierto;
    setAbierto(abrir);
    if (abrir) setFoco(options.findIndex((o) => o.value === value));
  }

  return (
    <div className={`${styles.wrap} ${className}`} ref={ref}>
      <button
        type="button"
        className={styles.boton}
        data-open={abierto || undefined}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={ariaLabel}
        onClick={alternar}
      >
        {seleccionada?.color && (
          <span className={styles.dot} style={{ background: seleccionada.color }} />
        )}
        <span className={styles.valor}>{seleccionada?.label ?? "Elegir…"}</span>
        <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {abierto && (
        <ul className={styles.panel} role="listbox" ref={listaRef}>
          {options.map((o, i) => (
            <li key={o.value}>
              <button
                type="button"
                className={styles.opcion}
                role="option"
                aria-selected={o.value === value}
                data-sel={o.value === value}
                data-foco={i === foco || undefined}
                onMouseEnter={() => setFoco(i)}
                onClick={() => { onChange(o.value); setAbierto(false); }}
              >
                {o.color && <span className={styles.dot} style={{ background: o.color }} />}
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
