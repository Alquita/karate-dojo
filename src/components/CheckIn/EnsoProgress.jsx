import { useState, useEffect } from "react";
import styles from "./EnsoProgress.module.css";

const SIZE = 128;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUNFERENCIA = 2 * Math.PI * RADIUS;
const DURACION = 1400;
const ARRANQUE = 450;

export default function EnsoProgress({ asistidas, meta }) {
  const pct = meta > 0 ? Math.min(100, Math.round((asistidas / meta) * 100)) : 0;
  const [valor, setValor] = useState(0);

  useEffect(() => {
    let rafId;
    const timeoutId = setTimeout(() => {
      const inicio = performance.now();
      const tick = (ahora) => {
        const t = Math.min((ahora - inicio) / DURACION, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValor(pct * eased);
        if (t < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, ARRANQUE);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [pct]);

  const offset = CIRCUNFERENCIA * (1 - valor / 100);

  return (
    <div className={styles.enso} style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          className={styles.pista}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className={styles.trazo}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <div className={styles.centro}>
        <span className={styles.numero}>{Math.round(valor)}%</span>
        <span className={styles.etiqueta}>esta semana</span>
      </div>
    </div>
  );
}
