import { useState, useMemo } from "react";
import {
  MESES_LARGO,
  DIA_CORTO,
  diasDelMes,
  primerDiaDelMes,
  toISODate,
  formatoCorto,
  edadDesde,
  semanaActual,
} from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
import { colorParaCinta } from "../../data/categories";
import {
  asistenciasEnMes,
  asistenciasEnAnio,
  asistenciasEnSemana,
  clasesPosibles,
  porcentaje,
} from "../../utils/asistencia";
import { useConfig, umbralGrupo } from "../../lib/config";
import AnimatedContent from "../ui/AnimatedContent";
import AnimatedCounter from "../ui/AnimatedCounter";
import styles from "./StudentAttendance.module.css";

const dd = (n) => String(n).padStart(2, "0");

export default function StudentAttendance({ alumno, onVolver }) {
  const { config } = useConfig();
  const color = colorParaCinta(alumno.cinta);
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [semanaRef, setSemanaRef] = useState(hoy);
  const [modo, setModo] = useState("mensual");

  const totalDias = diasDelMes(anio, mes);
  const hoyISO = toISODate(hoy);
  const fechasSemana = useMemo(() => semanaActual(semanaRef), [semanaRef]);
  const fechasSemanaISO = useMemo(() => fechasSemana.map(toISODate), [fechasSemana]);

  function retroceder() {
    if (modo === "semanal") setSemanaRef((r) => new Date(r.getFullYear(), r.getMonth(), r.getDate() - 7));
    else if (modo === "anual") setAnio((a) => a - 1);
    else if (mes === 1) { setMes(12); setAnio(anio - 1); }
    else setMes(mes - 1);
  }
  function avanzar() {
    if (modo === "semanal") setSemanaRef((r) => new Date(r.getFullYear(), r.getMonth(), r.getDate() + 7));
    else if (modo === "anual") setAnio((a) => a + 1);
    else if (mes === 12) { setMes(1); setAnio(anio + 1); }
    else setMes(mes + 1);
  }

  const columnas =
    modo === "mensual"
      ? Array.from({ length: totalDias }, (_, i) => i + 1)
      : modo === "semanal"
      ? fechasSemana.map((_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);

  function asistioDia(col) {
    if (modo === "mensual") return alumno.historial.includes(`${anio}-${dd(mes)}-${dd(col)}`);
    if (modo === "semanal") return alumno.historial.includes(fechasSemanaISO[col]);
    return false;
  }
  function countMes(mesNum) {
    return alumno.historial.filter((h) => h.startsWith(`${anio}-${dd(mesNum)}`)).length;
  }
  function esFuturo(col) {
    if (modo === "mensual") return `${anio}-${dd(mes)}-${dd(col)}` > hoyISO;
    if (modo === "semanal") return fechasSemanaISO[col] > hoyISO;
    return false;
  }
  function esFinde(col) {
    if (modo === "mensual") {
      const dow = new Date(anio, mes - 1, col).getDay();
      return dow === 0 || dow === 6;
    }
    if (modo === "semanal") return col === 5 || col === 6;
    return false;
  }

  const posibles = clasesPosibles(modo, anio, mes, config.clasesPorSemana);
  const vino =
    modo === "mensual"
      ? asistenciasEnMes(alumno.historial, anio, mes)
      : modo === "semanal"
      ? asistenciasEnSemana(alumno.historial, fechasSemanaISO)
      : asistenciasEnAnio(alumno.historial, anio);
  const pct = porcentaje(vino, posibles);
  const umbral = umbralGrupo(config, alumno.grupo);
  const apto = pct >= umbral;

  const diasRestantes = alumno.proximoExamen
    ? Math.max(0, Math.ceil((new Date(alumno.proximoExamen) - hoy) / (1000 * 60 * 60 * 24)))
    : null;

  const etiquetaPeriodo =
    modo === "mensual"
      ? `${MESES_LARGO[mes - 1]} ${anio}`
      : modo === "semanal"
      ? `Semana del ${formatoCorto(fechasSemana[0])}`
      : `Año ${anio}`;

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
        <div className={styles.panelPct}>
          <div className={styles.pctBloque}>
            <AnimatedCounter className={styles.pctNumero} value={pct} suffix="%" />
            <span className={styles.pctLabel}>asistencia · {etiquetaPeriodo.toLowerCase()}</span>
            <span className={styles.pctDetalle}>vino {vino} de {posibles} clases posibles</span>
          </div>
          <div className={styles.pctLado}>
            <span className={`${styles.chipApto} ${apto ? styles["chipApto--si"] : styles["chipApto--no"]}`}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {apto ? <path d="M5 13l4 4L19 7" /> : <path d="M6 6l12 12M18 6L6 18" />}
              </svg>
              {apto ? "Apto para rendir" : `Falta para el ${umbral}%`}
            </span>
            <div className={styles.examMini}>
              <span className={styles.examMiniLabel}>Próximo examen</span>
              <span className={styles.examMiniValor}>
                {alumno.proximoExamen ? formatoCorto(alumno.proximoExamen) : "Sin definir"}
                {diasRestantes !== null && <em> · en {diasRestantes} días</em>}
              </span>
            </div>
            <div className={styles.examMini}>
              <span className={styles.examMiniLabel}>Último examen rendido</span>
              <span className={styles.examMiniValor}>
                {alumno.ultimoExamen ? formatoCorto(alumno.ultimoExamen) : "Todavía no rindió"}
              </span>
            </div>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={16} delay={0.15}>
        <div className={styles.controls}>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={retroceder}>‹</button>
            <span className={styles.periodo}>{etiquetaPeriodo}</span>
            <button className={styles.navBtn} onClick={avanzar}>›</button>
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

      <AnimatedContent distance={16} delay={0.2}>
        <div className={styles.gridWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columnas.map((col, i) => (
                  <th
                    key={i}
                    className={`${styles.th} ${esFuturo(col) ? styles["th--futuro"] : ""} ${esFinde(col) ? styles["th--finde"] : ""} ${(i + 1) % 7 === 0 ? styles["th--corteSemana"] : ""}`}
                  >
                    {modo === "mensual" && (
                      <span className={styles.thDia}>
                        <span className={styles.thLetra}>{DIA_CORTO[(primerDiaDelMes(anio, mes) + col - 1) % 7]}</span>
                        <span className={styles.thNum}>{col}</span>
                      </span>
                    )}
                    {modo === "semanal" && (
                      <span className={styles.thDia}>
                        <span className={styles.thLetra}>{DIA_CORTO[i]}</span>
                        <span className={styles.thNum}>{fechasSemana[i].getDate()}</span>
                      </span>
                    )}
                    {modo === "anual" && (
                      <span className={styles.thLetra}>{MESES_LARGO[col - 1].slice(0, 3)}</span>
                    )}
                  </th>
                ))}
                <th className={`${styles.th} ${styles["th--total"]}`}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.row}>
                {columnas.map((col, ci) => {
                  const corte = (ci + 1) % 7 === 0 ? styles["td--corteSemana"] : "";
                  if (modo === "anual") {
                    const c = countMes(col);
                    return (
                      <td key={ci} className={`${styles.td} ${styles.celdaMes} ${corte}`} data-nivel={Math.min(4, c)}>
                        {c > 0 ? c : ""}
                      </td>
                    );
                  }
                  const attended = asistioDia(col);
                  return (
                    <td
                      key={ci}
                      className={`${styles.td} ${attended ? styles["td--check"] : ""} ${esFuturo(col) ? styles["td--futuro"] : ""} ${esFinde(col) ? styles["td--finde"] : ""} ${corte}`}
                    >
                      {attended && (
                        <svg className={styles.check} viewBox="0 0 16 16">
                          <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </td>
                  );
                })}
                <td className={`${styles.td} ${styles["td--total"]} ${styles["td--totalHighlight"]}`}>{vino}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AnimatedContent>
    </div>
  );
}
