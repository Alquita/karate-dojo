import { colorParaCinta } from "../../data/categories";
import SpotlightCard from "../ui/SpotlightCard";
import styles from "./StudentCard.module.css";

export default function StudentCard({ alumno, onClick }) {
  const color = colorParaCinta(alumno.cinta);

  return (
    <SpotlightCard spotlightColor="rgba(43, 58, 85, 0.12)">
      <button
        className={styles.card}
        onClick={onClick}
        style={{ borderLeftColor: color.border }}
      >
        <div className={styles.top}>
          <p className={styles.nombre}>{alumno.nombre}</p>
          <span
            className="badge badge--sm"
            style={{ background: color.bg, color: color.fg, borderColor: color.border }}
          >
            {alumno.cinta}
          </span>
        </div>
        <p className={styles.meta}>
          {alumno.grupo} · {alumno.edad} años
        </p>
        <p className={styles.asistencias}>{alumno.totalAsistencias} asistencias totales</p>
      </button>
    </SpotlightCard>
  );
}
