import { useState } from "react";
import {
  MESES_LARGO,
  DIA_CORTO,
  DIAS_LARGO,
  diasDelMes,
  primerDiaDelMes,
  toISODate,
  formatoCorto,
  edadDesde,
} from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
import { colorParaCinta } from "../../data/categories";
import AnimatedContent from "../ui/AnimatedContent";
import styles from "./StudentAttendance.module.css";

export default function StudentAttendance({ alumno, onVolver }) {
  const ahora = new Date();
  const [mes, setMes] = useState(ahora.getMonth() + 1);
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [modo, setModo] = useState("mensual");
  const color = colorParaCinta(alumno.cinta);

  const totalDias = diasDelMes(anio, mes);
  const offsetPrimerDia = primerDiaDelMes(anio, mes);
  const hoyISO = toISODate(new Date());

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

  function asistio(dia) {
    if (modo === "mensual") {
      const iso = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      return alumno.historial.includes(iso);
    }
    if (modo === "semanal") {
      const fecha = new Date(anio, mes - 1, dia);
      return alumno.historial.includes(toISODate(fecha));
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

  function totalAsistencias() {
    return diasColumnas.filter((d) => asistio(d)).length;
  }

  const total = totalAsistencias();
  const meta = alumno.metaSemanal || 3;
  const pct = meta > 0 ? Math.min(100, Math.round((total / meta) * 100)) : 0;

  const diasRestantes = alumno.proximoExamen
    ? Math.max(0, Math.ceil((new Date(alumno.proximoExamen) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className={styles.sheet}>
      <div className={styles.header}>
        <button className="btn btn--secondary" onClick={onVolver}>← Volver</button>
        <h1 className={styles.title}>Planilla de {nombreCompleto(alumno)}</h1>
      </div>

      <AnimatedContent distance={16} delay={0.05}>
        <div className={styles.studentInfo}>
          <div className={styles.studentBadge} style={{ background: color.bg, color: color.fg, borderColor: color.border }}>
            {alumno.cinta}
          </div>
          <div className={styles.studentMeta}>
            <span>{alumno.grupo}</span>
            <span className={styles.separator}>·</span>
            <span>{edadDesde(alumno.fechaNacimiento)} años</span>
            <span className={styles.separator}>·</span>
            <span>{alumno.totalAsistencias} asistencias totales</span>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={16} delay={0.1}>
        <div className={styles.examCards}>
          <div className={styles.examCard}>
            <p className={styles.examLabel}>Proximo examen</p>
            <p className={styles.examValue}>
              {alumno.proximoExamen ? formatoCorto(alumno.proximoExamen) : "Sin definir"}
            </p>
            {diasRestantes !== null && (
              <p className={styles.examCountdown}>en {diasRestantes} dias</p>
            )}
          </div>
          <div className={styles.examCard}>
            <p className={styles.examLabel}>Ultimo examen rendido</p>
            <p className={styles.examValue}>
              {alumno.ultimoExamen ? formatoCorto(alumno.ultimoExamen) : "Todavia no rindio"}
            </p>
          </div>
          <div className={styles.examCard}>
            <p className={styles.examLabel}>Meta semanal</p>
            <p className={styles.examValue}>{meta} clases</p>
            <p className={styles.examCountdown}>{pct}% cumplida este mes</p>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={16} delay={0.15}>
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
        </div>
      </AnimatedContent>

      <div className={styles.gridWrapper}>
          <table className={`${styles.table} ${styles["table--single"]}`}>
            <thead>
              <tr>
                {modo === "mensual" &&
                  diasColumnas.map((d) => (
                    <th key={d} className={`${styles.th} ${esFuturo(d) ? styles["th--futuro"] : ""}`}>
                      <span className={styles.thDia}>
                        <span>{DIA_CORTO[(offsetPrimerDia + d - 1) % 7]}</span>
                        <span className={styles.thNum}>{d}</span>
                      </span>
                    </th>
                  ))}
                {modo === "semanal" &&
                  diasColumnas.map((d) => (
                    <th key={d} className={styles.th}>
                      <span className={styles.thDia}>{DIAS_LARGO[d]}</span>
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
              <tr className={`${styles.row} ${styles["row--single"]}`}>
                {diasColumnas.map((d) => {
                  const attended = asistio(d);
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
                <td className={`${styles.td} ${styles["td--total"]} ${styles["td--totalHighlight"]}`}>
                  {total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  );
}
