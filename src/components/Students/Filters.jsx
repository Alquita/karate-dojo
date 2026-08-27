import { KYU_BELTS, DAN_LEVELS, GRUPOS, colorParaCinta } from "../../data/categories";
import styles from "./Filters.module.css";

const GRUPO_OPCIONES = ["", ...GRUPOS];
const CINTA_OPCIONES = ["", ...KYU_BELTS, ...DAN_LEVELS];

export default function Filters({ cinta, grupo, onCintaChange, onGrupoChange, onNuevoAlumno }) {
  return (
    <div className={styles.filters}>
      <div className={styles.fila}>
        <div className={styles.segmented} role="group" aria-label="Filtrar por grupo">
          {GRUPO_OPCIONES.map((g) => (
            <button
              key={g || "todos"}
              className={`${styles.seg} ${grupo === g ? styles.segActivo : ""}`}
              onClick={() => onGrupoChange(g)}
            >
              {g || "Todos"}
            </button>
          ))}
        </div>
        <button className={`btn btn--primary ${styles.nuevo}`} onClick={onNuevoAlumno}>
          Nuevo alumno
        </button>
      </div>

      <div className={styles.cintaFila}>
        <span className={styles.cintaLabel}>Cinta</span>
        <div className={styles.chips} role="group" aria-label="Filtrar por cinta">
          {CINTA_OPCIONES.map((c) => {
            const activo = cinta === c;
            const col = c ? colorParaCinta(c) : null;
            return (
              <button
                key={c || "todas"}
                className={`${styles.chip} ${activo ? styles.chipActivo : ""}`}
                onClick={() => onCintaChange(c)}
              >
                {col && (
                  <span className={styles.dot} style={{ background: col.border }} />
                )}
                {c || "Todas"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
