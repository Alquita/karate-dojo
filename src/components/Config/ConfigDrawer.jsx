import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { getStudents } from "../../lib/dataClient";
import { useConfig, umbralGrupo } from "../../lib/config";
import { exportarActivos } from "../../lib/exportar";
import { MESES_LARGO } from "../../utils/dates";
import { GRUPOS } from "../../data/categories";
import styles from "./ConfigDrawer.module.css";

const ahora = () => {
  const d = new Date();
  return { mes: d.getMonth() + 1, anio: d.getFullYear() };
};

const ICON = {
  reporte: "M9 17v-6h6v6M4 7h16M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9 4h6",
  calculo: "M9 7h6M9 11h6M9 15h4M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
  resumen: "M3 13h4v8H3zM10 3h4v18h-4zM17 9h4v12h-4z",
  tema: "M12 3a9 9 0 1 0 9 9c0-.5-.04-1-.13-1.5A5.5 5.5 0 0 1 12 3z",
};

function Ico({ d }) {
  return (
    <svg className={styles.ico} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function ConfigDrawer({ abierta, onCerrar, isDark, onToggleTheme }) {
  const navigate = useNavigate();
  const { config, guardarConfig } = useConfig();
  const [students, setStudents] = useState([]);
  const [{ mes, anio }, setPeriodo] = useState(ahora);

  useEffect(() => {
    if (!abierta) return;
    getStudents().then(setStudents).catch(() => {});
    const onKey = (e) => { if (e.key === "Escape") onCerrar(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [abierta, onCerrar]);

  function cambiarMes(delta) {
    setPeriodo(({ mes: m, anio: a }) => {
      let nm = m + delta;
      let na = a;
      if (nm < 1) { nm = 12; na -= 1; }
      if (nm > 12) { nm = 1; na += 1; }
      return { mes: nm, anio: na };
    });
  }

  function commitClases(valor) {
    const n = Math.min(7, Math.max(1, Math.round(Number(valor) || config.clasesPorSemana)));
    if (n !== config.clasesPorSemana) guardarConfig({ clasesPorSemana: n });
  }

  function commitUmbral(grupo, valor) {
    const actual = umbralGrupo(config, grupo);
    const n = Math.min(100, Math.max(0, Math.round(Number(valor) || actual)));
    if (n !== actual) {
      guardarConfig({ minRendirGrupos: { ...config.minRendirGrupos, [grupo]: n } });
    }
  }

  const activos = students.filter((s) => s.activo !== false).length;
  const seccion = (i) => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.32, delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <AnimatePresence>
      {abierta && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.25 }}
          onClick={onCerrar}
        >
          <motion.aside
            className={styles.panel}
            role="dialog"
            aria-label="Configuración"
            initial={{ x: "100%", opacity: 0.4, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: "100%", opacity: 0.4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.head}>
              <h2 className={styles.titulo}>Configuración</h2>
              <button className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">×</button>
            </div>

            <div className={styles.cuerpo}>
              <motion.section className={styles.bloque} {...seccion(0)}>
                <p className={styles.tituloBloque}><Ico d={ICON.reporte} /> Reporte de activos</p>
                <p className={styles.ayuda}>
                  Padrón de alumnos activos para la federación, en el mismo formato del Excel.
                </p>
                <div className={styles.periodo}>
                  <button className={styles.navMes} onClick={() => cambiarMes(-1)} aria-label="Mes anterior">‹</button>
                  <span>{MESES_LARGO[mes - 1]} {anio}</span>
                  <button className={styles.navMes} onClick={() => cambiarMes(1)} aria-label="Mes siguiente">›</button>
                </div>
                <div className={styles.acciones}>
                  <button className="btn btn--primary" onClick={() => exportarActivos(students, anio, mes)}>
                    Exportar .xls
                  </button>
                  <button
                    className="btn btn--secondary"
                    onClick={() => { onCerrar(); navigate("/alumnos/reporte-activos"); }}
                  >
                    Ver para imprimir
                  </button>
                </div>
              </motion.section>

              <motion.section className={styles.bloque} {...seccion(1)}>
                <p className={styles.tituloBloque}><Ico d={ICON.calculo} /> Cálculo de asistencia</p>
                <p className={styles.ayuda}>
                  De acá sale el porcentaje de asistencia de todas las planillas.
                </p>
                <label className={styles.campo}>
                  <span>Clases por semana</span>
                  <input
                    key={`cpw-${config.clasesPorSemana}`}
                    className="input"
                    type="number" min="1" max="7"
                    defaultValue={config.clasesPorSemana}
                    onBlur={(e) => commitClases(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                  />
                </label>

                <p className={styles.subLabel}>% mínimo para rendir, por grupo</p>
                {GRUPOS.map((grupo) => {
                  const val = umbralGrupo(config, grupo);
                  return (
                    <label key={grupo} className={styles.campo}>
                      <span>{grupo}</span>
                      <input
                        key={`u-${grupo}-${val}`}
                        className="input"
                        type="number" min="0" max="100"
                        defaultValue={val}
                        onBlur={(e) => commitUmbral(grupo, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                      />
                    </label>
                  );
                })}
              </motion.section>

              <motion.section className={styles.bloque} {...seccion(2)}>
                <p className={styles.tituloBloque}><Ico d={ICON.resumen} /> Resumen</p>
                <p className={styles.resumen}>
                  <strong>{activos}</strong> alumnos activos
                </p>
              </motion.section>

              <motion.section className={styles.bloque} {...seccion(3)}>
                <p className={styles.tituloBloque}><Ico d={ICON.tema} /> Tema</p>
                <button className="btn btn--secondary" onClick={onToggleTheme}>
                  {isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                </button>
              </motion.section>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
