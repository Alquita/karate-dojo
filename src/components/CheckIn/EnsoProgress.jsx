import { useEffect, useState } from "react";

const SIZE = 128;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUNFERENCIA = 2 * Math.PI * RADIUS;

export default function EnsoProgress({ asistidas, meta }) {
  const pct = meta > 0 ? Math.min(100, Math.round((asistidas / meta) * 100)) : 0;
  const [dibujado, setDibujado] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDibujado(true), 60);
    return () => clearTimeout(t);
  }, []);

  const offset = CIRCUNFERENCIA * (1 - (dibujado ? pct : 0) / 100);

  return (
    <div className="enso" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          className="enso__pista"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className="enso__trazo"
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
      <div className="enso__centro">
        <span className="enso__numero">{pct}%</span>
        <span className="enso__etiqueta">esta semana</span>
      </div>
    </div>
  );
}
