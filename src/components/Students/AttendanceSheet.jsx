import { useState, useMemo } from "react";
import {
  MESES_LARGO,
  DIA_CORTO,
  diasDelMes,
  primerDiaDelMes,
  toISODate,
  formatoCorto,
} from "../../utils/dates";
import AnimatedContent from "../ui/AnimatedContent";
import styles from "./AttendanceSheet.module.css";

export default function AttendanceSheet({ students, onVolver }) {
  const ahora = new Date();
  const [mes, setMes] = useState(ahora.getMonth() + 1);
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [modo, setModo] = useState("mensual");
  const [busqueda, setBusqueda] = useState("");

  const totalDias = diasDelMes(anio, mes);

  const filtrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return students.filter((s) => {
      if (texto && !s.nombre.toLowerCase().includes(texto)) return false;
      return true;
    });
  }, [students, busqueda]);

  function prevMonth() {
    if (mes === 1) { setMes(12); setAnio(anio - 1); }
    else setMes(mes - 1);
  }

  function nextMonth() {
    if (mes === 12) { setMes(1); setAnio(anio + 1); }
    else setMes(mes + 1);
  }

  const diasColumnas = modo === "mensual"
    ? Array.from({ length: totalDias }, (_, i) => i + 1)
    : modo === "semanal"
    ? [0, 1, 2, 3, 4, 5, 6]
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const hoyISO = toISODate(new Date());

  function asistio(alumno, dia) {
    if (modo === "mensual") {
      const iso = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      return alumno.historial.includes(iso);
    }
    if (modo === "semanal") {
      const fecha = new Date(anio, mes - 1, dia);
      const iso = toISODate(fecha);
      return alumno.historial.includes(iso);
    }
    const isoMes = `${anio}-${String(dia).padStart(2, "0")}`;
    return alumno.historial.some((h) => h.startsWith(isoMes));
  }

  function esFuturo(dia) {
    if (modo === "mensual") {
      const iso = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      return iso > hoyISO;
    }
    return false;
  }

  function totalDia(dia) {
    return filtrados.filter((a) => asistio(a, dia)).length;
  }

  function totalAlumno(alumno) {
    return diasColumnas.filter((d) => asistio(alumno, d)).length;
  }

  return (
    <div className={styles.sheet}>
      <div className={styles.header}>
        <button className="btn btn--secondary" onClick={onVolver}>
          ← Volver a alumnos
        </button>
        <h1 className={styles.title}>Planilla de asistencia</h1>
      </div>

      <AnimatedContent distance={16} delay={0.05}>
        <div className={styles.controls}>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={prevMonth}>‹</button>
            <span className={styles.periodo}>
              {modo === "mensual"
                ? `${MESES_LARGO[mes - 1]} ${anio}`
                : modo === "semanal"
                ? `Semana del ${formatoCorto(new Date(anio, mes - 1, 1))}`
                : `Anio ${anio}`}
            </span>
            <button className={styles.navBtn} onClick={nextMonth}>›</button>
          </div>

          <div className={styles.tabs}>
            {["semanal", "mensual", "anual"].map((m) => (
              <button
                key={m}
                className={`${styles.tab} ${modo === m ? styles["tab--active"] : ""}`}
                onClick={() => setModo(m)}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.search}>
            <input
              className="input"
              placeholder="Buscar alumno..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={20} delay={0.1}>
        <div className={styles.gridWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles["th--sticky"]} ${styles["th--num"]}`}>#</th>
                <th className={`${styles.th} ${styles["th--sticky"]} ${styles["th--name"]}`}>Alumno</th>
                {modo === "mensual" &&
                  diasColumnas.map((d) => (
                    <th key={d} className={`${styles.th} ${esFuturo(d) ? styles["th--futuro"] : ""}`}>
                      <span className={styles.thDia}>
                        <span>{DIA_CORTO[(primerDiaDelMes(anio, mes) + d - 1) % 7]}</span>
                        <span className={styles.thNum}>{d}</span>
                      </span>
                    </th>
                  ))}
                {modo === "semanal" &&
                  diasColumnas.map((d) => (
                    <th key={d} className={styles.th}>
                      <span className={styles.thDia}>{DIA_CORTO[d]}</span>
                    </th>
                  ))}
                {modo === "anual" &&
                  diasColumnas.map((d) => (
                    <th key={d} className={styles.th}>
                      <span className={styles.thDia}>{MESES_LARGO[d - 1].slice(0, 3)}</span>
                    </th>
                  ))}
                <th className={`${styles.th} ${styles["th--total"]}`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((alumno, i) => (
                <tr key={alumno.id} className={styles.row}>
                  <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--num"]}`}>{i + 1}</td>
                  <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--name"]}`}>
                    {alumno.nombre}
                  </td>
                  {diasColumnas.map((d) => {
                    const attended = asistio(alumno, d);
                    const futuro = esFuturo(d);
                    return (
                      <td
                        key={d}
                        className={`${styles.td} ${attended ? styles["td--check"] : ""} ${futuro ? styles["td--futuro"] : ""}`}
                      >
                        {attended && (
                          <svg className={styles.check} viewBox="0 0 16 16">
                            <path
                              d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </td>
                    );
                  })}
                  <td className={`${styles.td} ${styles["td--total"]}`}>{totalAlumno(alumno)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.footer}>
                <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--num"]}`} />
                <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--name"]} ${styles.footerLabel}`}>Total</td>
                {diasColumnas.map((d) => (
                  <td key={d} className={`${styles.td} ${styles["td--total"]}`}>{totalDia(d)}</td>
                ))}
                <td className={`${styles.td} ${styles["td--total"]} ${styles.footerTotal}`}>
                  {filtrados.reduce((sum, a) => sum + totalAlumno(a), 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </AnimatedContent>
    </div>
  );
}
