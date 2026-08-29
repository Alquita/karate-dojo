import { useState, useMemo } from "react";
import {
  MESES_LARGO,
  DIA_CORTO,
  diasDelMes,
  primerDiaDelMes,
  toISODate,
  formatoCorto,
  semanaActual,
} from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
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
import styles from "./AttendanceSheet.module.css";

const dd = (n) => String(n).padStart(2, "0");

export default function AttendanceSheet({ students, onVolver }) {
  const { config } = useConfig();
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [semanaRef, setSemanaRef] = useState(hoy);
  const [modo, setModo] = useState("mensual");
  const [busqueda, setBusqueda] = useState("");

  const totalDias = diasDelMes(anio, mes);
  const hoyISO = toISODate(hoy);
  const fechasSemana = useMemo(() => semanaActual(semanaRef), [semanaRef]);
  const fechasSemanaISO = useMemo(() => fechasSemana.map(toISODate), [fechasSemana]);

  const filtrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    return students.filter((s) => !texto || nombreCompleto(s).toLowerCase().includes(texto));
  }, [students, busqueda]);

  function retroceder() {
    if (modo === "semanal") {
      setSemanaRef((r) => new Date(r.getFullYear(), r.getMonth(), r.getDate() - 7));
    } else if (modo === "anual") {
      setAnio((a) => a - 1);
    } else if (mes === 1) { setMes(12); setAnio(anio - 1); }
    else setMes(mes - 1);
  }

  function avanzar() {
    if (modo === "semanal") {
      setSemanaRef((r) => new Date(r.getFullYear(), r.getMonth(), r.getDate() + 7));
    } else if (modo === "anual") {
      setAnio((a) => a + 1);
    } else if (mes === 12) { setMes(1); setAnio(anio + 1); }
    else setMes(mes + 1);
  }

  const columnas =
    modo === "mensual"
      ? Array.from({ length: totalDias }, (_, i) => i + 1)
      : modo === "semanal"
      ? fechasSemana.map((_, i) => i)
      : Array.from({ length: 12 }, (_, i) => i + 1);

  function asistioDia(alumno, col) {
    if (modo === "mensual") return alumno.historial.includes(`${anio}-${dd(mes)}-${dd(col)}`);
    if (modo === "semanal") return alumno.historial.includes(fechasSemanaISO[col]);
    return false;
  }

  function countMes(alumno, mesNum) {
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

  function vino(alumno) {
    if (modo === "mensual") return asistenciasEnMes(alumno.historial, anio, mes);
    if (modo === "semanal") return asistenciasEnSemana(alumno.historial, fechasSemanaISO);
    return asistenciasEnAnio(alumno.historial, anio);
  }

  function totalColumna(col) {
    if (modo === "anual") return filtrados.reduce((s, a) => s + countMes(a, col), 0);
    return filtrados.filter((a) => asistioDia(a, col)).length;
  }

  const totalVino = filtrados.reduce((s, a) => s + vino(a), 0);
  const promedioPct = porcentaje(totalVino, filtrados.length * posibles);
  const aptos = filtrados.filter(
    (a) => porcentaje(vino(a), posibles) >= umbralGrupo(config, a.grupo)
  ).length;

  const etiquetaPeriodo =
    modo === "mensual"
      ? `${MESES_LARGO[mes - 1]} ${anio}`
      : modo === "semanal"
      ? `Semana del ${formatoCorto(fechasSemana[0])}`
      : `Año ${anio}`;

  return (
    <div className={styles.sheet}>
      <div className={styles.header}>
        <button className="btn btn--secondary" onClick={onVolver}>← Volver a alumnos</button>
        <h1 className={styles.title}>Planilla general</h1>
      </div>

      <AnimatedContent distance={16} delay={0.05}>
        <div className={styles.resumen}>
          <div className={styles.pctBloque}>
            <AnimatedCounter className={styles.pctNumero} value={promedioPct} suffix="%" />
            <span className={styles.pctLabel}>asistencia promedio · {etiquetaPeriodo.toLowerCase()}</span>
          </div>
          <div className={styles.resumenMeta}>
            <span><strong>{filtrados.length}</strong> alumnos</span>
            <span><strong>{aptos}</strong> aptos para rendir</span>
            <span><strong>{totalVino}</strong> asistencias</span>
          </div>
        </div>

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

      <AnimatedContent distance={20} delay={0.12}>
        <div className={styles.gridWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles["th--sticky"]} ${styles["th--num"]}`}>#</th>
                <th className={`${styles.th} ${styles["th--sticky"]} ${styles["th--name"]}`}>Alumno</th>
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
                <th className={`${styles.th} ${styles["th--total"]}`}>%</th>
                <th className={`${styles.th} ${styles["th--total"]}`}>Apto</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((alumno, i) => {
                const v = vino(alumno);
                const pct = porcentaje(v, posibles);
                const apto = pct >= umbralGrupo(config, alumno.grupo);
                return (
                  <tr key={alumno.id} className={styles.row}>
                    <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--num"]}`}>{i + 1}</td>
                    <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--name"]}`}>
                      {nombreCompleto(alumno)}
                    </td>
                    {columnas.map((col, ci) => {
                      const corte = (ci + 1) % 7 === 0 ? styles["td--corteSemana"] : "";
                      if (modo === "anual") {
                        const c = countMes(alumno, col);
                        return (
                          <td key={ci} className={`${styles.td} ${styles.celdaMes} ${corte}`} data-nivel={Math.min(4, c)}>
                            {c > 0 ? c : ""}
                          </td>
                        );
                      }
                      const attended = asistioDia(alumno, col);
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
                    <td className={`${styles.td} ${styles["td--total"]}`}>{v}</td>
                    <td className={`${styles.td} ${styles["td--total"]} ${styles.pctCelda}`} data-apto={apto}>
                      {pct}%
                    </td>
                    <td className={`${styles.td} ${styles.aptoCelda}`} data-apto={apto}>
                      <MarcaApto apto={apto} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={styles.footer}>
                <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--num"]}`} />
                <td className={`${styles.td} ${styles["td--sticky"]} ${styles["td--name"]} ${styles.footerLabel}`}>Total</td>
                {columnas.map((col, ci) => {
                  const t = totalColumna(col);
                  return (
                    <td
                      key={ci}
                      className={`${styles.td} ${styles.footerCelda} ${(ci + 1) % 7 === 0 ? styles["td--corteSemana"] : ""}`}
                      data-cero={t === 0}
                    >
                      {t}
                    </td>
                  );
                })}
                <td className={`${styles.td} ${styles.footerTotal}`}>{totalVino}</td>
                <td className={`${styles.td} ${styles.footerTotal}`}>{promedioPct}%</td>
                <td className={`${styles.td} ${styles.footerTotal}`}>{aptos}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </AnimatedContent>
    </div>
  );
}

export function MarcaApto({ apto }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-label={apto ? "Apto" : "No apto"}>
      {apto ? <path d="M5 13l4 4L19 7" /> : <path d="M6 6l12 12M18 6L6 18" />}
    </svg>
  );
}
