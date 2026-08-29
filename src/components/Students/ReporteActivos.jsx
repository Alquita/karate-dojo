import { useMemo, useState } from "react";
import { MESES_LARGO } from "../../utils/dates";
import { categoriaFederacion } from "../../data/categories";
import { exportarActivos } from "../../lib/exportar";
import styles from "./ReporteActivos.module.css";

export default function ReporteActivos({ students, onVolver }) {
  const d = new Date();
  const [mes, setMes] = useState(d.getMonth() + 1);
  const [anio, setAnio] = useState(d.getFullYear());

  function cambiarMes(delta) {
    let nm = mes + delta;
    let na = anio;
    if (nm < 1) { nm = 12; na -= 1; }
    if (nm > 12) { nm = 1; na += 1; }
    setMes(nm);
    setAnio(na);
  }

  const filas = useMemo(
    () =>
      [...students]
        .filter((s) => s.activo !== false)
        .sort((a, b) =>
          `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, "es")
        ),
    [students]
  );

  return (
    <div className={styles.reporte}>
      <div className={`${styles.barra} ${styles.noPrint}`}>
        <button className="btn btn--secondary" onClick={onVolver}>← Volver a alumnos</button>
        <div className={styles.periodo}>
          <button className={styles.navMes} onClick={() => cambiarMes(-1)} aria-label="Mes anterior">‹</button>
          <span>{MESES_LARGO[mes - 1]} {anio}</span>
          <button className={styles.navMes} onClick={() => cambiarMes(1)} aria-label="Mes siguiente">›</button>
        </div>
        <div className={styles.derecha}>
          <button className="btn btn--secondary" onClick={() => window.print()}>Imprimir</button>
          <button className="btn btn--primary" onClick={() => exportarActivos(students, anio, mes)}>
            Descargar .xls
          </button>
        </div>
      </div>

      <div className={styles.hoja}>
        <header className={styles.hojaHead}>
          <p className={styles.dojo}>KarateDoMiyazato · Okinawa Shorin-Ryu Shidokan</p>
          <h1 className={styles.tituloHoja}>Alumnos activos — {MESES_LARGO[mes - 1]} {anio}</h1>
          <p className={styles.subtitulo}>{filas.length} alumnos</p>
        </header>

        <table className={styles.tabla}>
          <thead>
            <tr>
              <th className={styles.thNum}>Nº</th>
              <th>Ape. Alumno</th>
              <th>Nom. Alumno</th>
              <th>Cat. Reporte</th>
              <th>Cat. Actual</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((s, i) => {
              const cat = categoriaFederacion(s.cinta);
              return (
                <tr key={s.id}>
                  <td className={styles.thNum}>{i + 1}</td>
                  <td>{s.apellido}</td>
                  <td>{s.nombre}</td>
                  <td>{cat}</td>
                  <td>{cat}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
