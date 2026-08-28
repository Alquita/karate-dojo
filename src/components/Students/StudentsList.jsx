import { useEffect, useMemo, useState } from "react";
import { useNavigate, useMatch, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { getStudents, addStudent, updateStudent, removeStudent, addNota } from "../../lib/dataClient";
import Filters from "./Filters";
import StudentCard from "./StudentCard";
import NuevoAlumnoForm from "./NuevoAlumnoForm";
import StudentDetail from "./StudentDetail";
import AttendanceSheet from "./AttendanceSheet";
import StudentAttendance from "./StudentAttendance";
import AnimatedContent from "../ui/AnimatedContent";
import ScrollFade from "../ui/ScrollFade";
import BlurText from "../ui/BlurText";
import AnimatedCounter from "../ui/AnimatedCounter";
import { GRUPOS } from "../../data/categories";
import { nombreCompleto } from "../../utils/format";
import styles from "./StudentsList.module.css";

const soloDigitos = (v) => String(v || "").replace(/\D/g, "");
const normalizar = (v) =>
  String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export default function StudentsList() {
  const navigate = useNavigate();
  const matchPlanillaGeneral = useMatch("/alumnos/planilla-general");
  const matchPlanillaIndividual = useMatch("/alumnos/:id/planilla");
  const matchFicha = useMatch("/alumnos/:id");

  const idPlanilla = matchPlanillaIndividual?.params.id || null;
  const idFicha =
    matchFicha && matchFicha.params.id !== "planilla-general" ? matchFicha.params.id : null;
  const seleccionadoId = idFicha || idPlanilla || null;

  const [students, setStudents] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCinta, setFiltroCinta] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [formMode, setFormMode] = useState(null); // null | "nuevo" | "editar"

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    if (!formMode) return;
    const onKey = (e) => { if (e.key === "Escape") setFormMode(null); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [formMode]);

  async function cargar() {
    setCargando(true);
    const data = await getStudents();
    setStudents(data);
    setCargando(false);
  }

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const qDigitos = soloDigitos(busqueda);
    return students.filter((s) => {
      if (filtroCinta && s.cinta !== filtroCinta) return false;
      if (filtroGrupo && s.grupo !== filtroGrupo) return false;
      if (q) {
        const nombre = normalizar(nombreCompleto(s));
        const coincideNombre = nombre.includes(q);
        const coincideDni = qDigitos && soloDigitos(s.dni).includes(qDigitos);
        if (!coincideNombre && !coincideDni) return false;
      }
      return true;
    });
  }, [students, filtroCinta, filtroGrupo, busqueda]);

  const seleccionado = students.find((s) => s.id === seleccionadoId) || null;
  const noExiste = !cargando && seleccionadoId && !seleccionado;

  const gruposConocidos = GRUPOS.filter((g) => filtrados.some((s) => s.grupo === g));
  const gruposExtra = [...new Set(filtrados.map((s) => s.grupo).filter((g) => !GRUPOS.includes(g)))];
  const gruposOrdenados = [...gruposConocidos, ...gruposExtra];

  async function handleBaja(id) {
    await removeStudent(id);
    navigate("/alumnos");
    cargar();
  }

  async function handleNota(id, texto) {
    if (!texto.trim()) return;
    await addNota(id, texto.trim());
    cargar();
  }

  async function handleNuevoAlumno(datos) {
    await addStudent(datos);
    setFormMode(null);
    cargar();
  }

  async function handleEditar(datos) {
    await updateStudent(seleccionadoId, datos);
    setFormMode(null);
    cargar();
  }

  if (matchPlanillaGeneral) {
    return <AttendanceSheet students={students} onVolver={() => navigate("/alumnos")} />;
  }

  if (idPlanilla) {
    const alumno = students.find((s) => s.id === idPlanilla);
    if (cargando) {
      return (
        <div className={styles.students}>
          <p className={styles.vacio}>Cargando…</p>
        </div>
      );
    }
    if (!alumno) {
      return (
        <div className={styles.students}>
          <p className={styles.vacio}>
            Ese alumno no existe. <Link to="/alumnos">Volver a la lista</Link>
          </p>
        </div>
      );
    }
    return (
      <StudentAttendance alumno={alumno} onVolver={() => navigate(`/alumnos/${alumno.id}`)} />
    );
  }

  return (
    <div className={styles.students}>
      <div className={styles.header}>
        <div>
          <p className="eyebrow">Dojo</p>
          <BlurText key="alumnos" className="title" text="Alumnos" animateBy="letters" />
        </div>
        <div className={styles.headerRight}>
          <p className={styles.contador}>
            <AnimatedCounter value={filtrados.length} /> de {students.length}
          </p>
          <button
            className="btn btn--primary"
            onClick={() => navigate("/alumnos/planilla-general")}
          >
            Ver planilla general
          </button>
        </div>
      </div>

      <Filters
        cinta={filtroCinta}
        grupo={filtroGrupo}
        onCintaChange={setFiltroCinta}
        onGrupoChange={setFiltroGrupo}
        onNuevoAlumno={() => setFormMode((m) => (m === "nuevo" ? null : "nuevo"))}
      />

      <div className={styles.buscador}>
        <svg
          className={styles.buscadorIcono}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.buscadorInput}
          type="search"
          placeholder="Buscar alumno por nombre o documento"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <AnimatePresence>
          {busqueda && (
            <motion.button
              key="limpiar"
              className={styles.buscadorLimpiar}
              onClick={() => setBusqueda("")}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              aria-label="Limpiar busqueda"
            >
              ×
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {formMode && (
        <div className={styles.modalOverlay} onClick={() => setFormMode(null)}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
            <NuevoAlumnoForm
              alumno={formMode === "editar" ? seleccionado : undefined}
              onCancelar={() => setFormMode(null)}
              onGuardar={formMode === "editar" ? handleEditar : handleNuevoAlumno}
            />
          </div>
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.grid}>
          {cargando && <p className={styles.vacio}>Cargando…</p>}
          {!cargando && filtrados.length === 0 && (
            <motion.p
              className={styles.vacio}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {busqueda
                ? `Ningun alumno coincide con "${busqueda}".`
                : "Ningun alumno coincide con este filtro."}
            </motion.p>
          )}
          {!cargando && gruposOrdenados.map((grupo, gi) => {
            const delGrupo = filtrados.filter((s) => s.grupo === grupo);
            return (
              <AnimatedContent
                key={grupo}
                as="section"
                className={styles.grupo}
                distance={18}
                duration={0.5}
                delay={Math.min(gi, 6) * 0.06}
              >
                <div
                  className={styles.grupoBanda}
                  data-variant={gi % 2 === 0 ? "rojo" : "negro"}
                >
                  <span className={styles.grupoNombre}>{grupo || "Sin grupo"}</span>
                  <span className={styles.grupoContador}>{delGrupo.length}</span>
                </div>
                <ScrollFade className={styles.grupoCards} maxHeight={filtroGrupo ? null : 440}>
                  <AnimatePresence initial={false}>
                    {delGrupo.map((alumno) => (
                      <motion.div
                        key={alumno.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <StudentCard
                          alumno={alumno}
                          seleccionado={alumno.id === seleccionadoId}
                          onClick={() =>
                            navigate(
                              alumno.id === seleccionadoId
                                ? "/alumnos"
                                : `/alumnos/${alumno.id}`
                            )
                          }
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ScrollFade>
              </AnimatedContent>
            );
          })}
        </div>

        <div className={styles.detalle}>
          <AnimatePresence mode="wait">
            {seleccionado ? (
              <motion.div
                key={seleccionado.id}
                initial={{ opacity: 0, x: 26, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -18, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <StudentDetail
                  alumno={seleccionado}
                  onBaja={handleBaja}
                  onNota={handleNota}
                  onEditar={() => setFormMode("editar")}
                  onVerPlanilla={() => navigate(`/alumnos/${seleccionado.id}/planilla`)}
                />
              </motion.div>
            ) : (
              <motion.p
                key="vacio"
                className={styles.vacio}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {noExiste
                  ? "Ese alumno no existe o fue dado de baja."
                  : "Tocá un alumno para ver la ficha completa."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
