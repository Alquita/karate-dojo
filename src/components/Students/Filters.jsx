import { KYU_BELTS, DAN_LEVELS, GRUPOS, accentParaCinta } from "../../data/categories";
import styles from "./Filters.module.css";

const GRUPO_OPCIONES = ["", ...GRUPOS];

const DAN_ADULTOS = DAN_LEVELS.filter((c) => !/cadete|juvenil/i.test(c));
const DAN_CADETES = DAN_LEVELS.filter((c) => /cadete/i.test(c));
const DAN_JUVENILES = DAN_LEVELS.filter((c) => /juvenil/i.test(c));

export default function Filters({ cinta, grupo, onCintaChange, onGrupoChange, onNuevoAlumno }) {
  const chipCinta = (c) => (
    <button
      key={c}
      className={`${styles.chip} ${cinta === c ? styles.chipActivo : ""}`}
      onClick={() => onCintaChange(c)}
    >
      <span className={styles.dot} style={{ background: accentParaCinta(c) }} />
      {c}
    </button>
  );

  return (
    <div className={styles.filters}>
      <div className={styles.fila}>
        <span className={styles.filaLabel}>Grupos</span>
        <div className={styles.chips} role="group" aria-label="Filtrar por grupo">
          {GRUPO_OPCIONES.map((g) => (
            <button
              key={g || "todos"}
              className={`${styles.chip} ${grupo === g ? styles.chipActivo : ""}`}
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

      <div className={styles.fila}>
        <span className={styles.filaLabel}>Cinta</span>
        <div className={styles.chips} role="group" aria-label="Filtrar por cinta">
          <button
            className={`${styles.chip} ${cinta === "" ? styles.chipActivo : ""}`}
            onClick={() => onCintaChange("")}
          >
            Todas
          </button>

          {KYU_BELTS.map(chipCinta)}

          <span className={styles.sep} aria-hidden="true" />

          {DAN_ADULTOS.map(chipCinta)}

          <span className={styles.sep} aria-hidden="true" />

          {DAN_CADETES.map(chipCinta)}

          <span className={styles.sep} aria-hidden="true" />

          {DAN_JUVENILES.map(chipCinta)}
        </div>
      </div>
    </div>
  );
}
