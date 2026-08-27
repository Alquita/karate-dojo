import { colorParaCinta } from "../../data/categories";
import { edadDesde } from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
import SpotlightCard from "../ui/SpotlightCard";
import styles from "./StudentCard.module.css";

export default function StudentCard({ alumno, onClick }) {
  const color = colorParaCinta(alumno.cinta);
  const edad = edadDesde(alumno.fechaNacimiento);

  return (
    <SpotlightCard spotlightColor="rgba(211, 32, 42, 0.14)">
      <button
        className={styles.card}
        onClick={onClick}
        style={{ borderLeftColor: color.border }}
      >
        <span className={styles.belt} style={{ background: color.border }} aria-hidden="true" />
        <div className={styles.top}>
          <p className={styles.nombre}>{nombreCompleto(alumno)}</p>
          <span
            className="badge badge--sm"
            style={{ background: color.bg, color: color.fg, borderColor: color.border }}
          >
            {alumno.cinta}
          </span>
        </div>
        <p className={styles.meta}>
          {alumno.grupo}{edad !== "" ? ` · ${edad} años` : ""}
        </p>
        <p className={styles.asistencias}>{alumno.totalAsistencias} asistencias totales</p>
      </button>
    </SpotlightCard>
  );
}
