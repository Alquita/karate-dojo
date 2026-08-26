import { useEffect, useState } from "react";
import { getStudents, addStudent, removeStudent, addNota } from "../../lib/dataClient";
import Filters from "./Filters";
import StudentCard from "./StudentCard";
import NuevoAlumnoForm from "./NuevoAlumnoForm";
import StudentDetail from "./StudentDetail";
import AttendanceSheet from "./AttendanceSheet";
import StudentAttendance from "./StudentAttendance";
import AnimatedContent from "../ui/AnimatedContent";
import FadeContent from "../ui/FadeContent";
import styles from "./StudentsList.module.css";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCinta, setFiltroCinta] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [vista, setVista] = useState("lista");
  const [alumnoPlanilla, setAlumnoPlanilla] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const data = await getStudents();
    setStudents(data);
    setCargando(false);
  }

  const filtrados = students.filter((s) => {
    if (filtroCinta && s.cinta !== filtroCinta) return false;
    if (filtroGrupo && s.grupo !== filtroGrupo) return false;
    return true;
  });

  const seleccionado = students.find((s) => s.id === seleccionadoId) || null;

  async function handleBaja(id) {
    await removeStudent(id);
    setSeleccionadoId(null);
    cargar();
  }

  async function handleNota(id, texto) {
    if (!texto.trim()) return;
    await addNota(id, texto.trim());
    cargar();
  }

  async function handleNuevoAlumno(datos) {
    await addStudent(datos);
    setMostrarForm(false);
    cargar();
  }

  if (vista === "planilla-grupal") {
    return <AttendanceSheet students={students} onVolver={() => setVista("lista")} />;
  }

  if (vista === "planilla-individual" && alumnoPlanilla) {
    return (
      <StudentAttendance
        alumno={alumnoPlanilla}
        onVolver={() => { setVista("lista"); setAlumnoPlanilla(null); }}
      />
    );
  }

  return (
    <div className={styles.students}>
      <div className={styles.header}>
        <div>
          <p className="eyebrow">Clientes</p>
          <h1 className="title">Alumnos</h1>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.contador}>{filtrados.length} de {students.length}</p>
          <button
            className="btn btn--primary"
            onClick={() => setVista("planilla-grupal")}
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
        onNuevoAlumno={() => setMostrarForm((v) => !v)}
      />

      {mostrarForm && (
        <FadeContent>
          <NuevoAlumnoForm onCancelar={() => setMostrarForm(false)} onGuardar={handleNuevoAlumno} />
        </FadeContent>
      )}

      <div className={styles.body}>
        <div className={styles.grid}>
          {cargando && <p className={styles.vacio}>Cargando…</p>}
          {!cargando && filtrados.length === 0 && (
            <p className={styles.vacio}>Ningun alumno coincide con este filtro.</p>
          )}
          {filtrados.map((alumno, i) => (
            <AnimatedContent key={alumno.id} distance={25} delay={i * 0.04}>
              <StudentCard
                alumno={alumno}
                onClick={() => setSeleccionadoId(alumno.id)}
              />
            </AnimatedContent>
          ))}
        </div>

        <div className={styles.detalle}>
          {seleccionado ? (
            <StudentDetail
              alumno={seleccionado}
              onBaja={handleBaja}
              onNota={handleNota}
              onVerPlanilla={() => {
                setAlumnoPlanilla(seleccionado);
                setVista("planilla-individual");
              }}
            />
          ) : (
            <p className={styles.vacio}>Toca un alumno para ver la ficha completa.</p>
          )}
        </div>
      </div>
    </div>
  );
}
