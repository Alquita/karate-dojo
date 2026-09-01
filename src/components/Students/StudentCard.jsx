import { colorParaCinta, accentParaCinta, esDan, danNumero } from "../../data/categories";
import { edadDesde } from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
import styles from "./StudentCard.module.css";

export default function StudentCard({ alumno, seleccionado, onClick }) {
  const color = colorParaCinta(alumno.cinta);
  const accent = accentParaCinta(alumno.cinta);
  const dan = esDan(alumno.cinta);
  const edad = edadDesde(alumno.fechaNacimiento);

  return (
    <button
      className={`${styles.card} ${seleccionado ? styles.seleccionado : ""}`}
      onClick={onClick}
      aria-pressed={seleccionado}
    >
      <span
        className={`${styles.belt} ${dan ? styles.beltDan : ""}`}
        style={dan ? { "--acc": accent, "--n": danNumero(alumno.cinta) || 1 } : { background: accent }}
        aria-hidden="true"
      />
      <span className={styles.info}>
        <span className={styles.nombre}>{nombreCompleto(alumno)}</span>
        <span className={styles.meta}>
          {edad !== "" ? `${edad} años` : "Edad sin cargar"}
          {" · "}
          {alumno.totalAsistencias} asist.
        </span>
      </span>
      <span
        className="badge badge--sm"
        style={{ background: color.bg, color: color.fg, borderColor: color.border }}
      >
        {alumno.cinta}
      </span>
    </button>
  );
}
