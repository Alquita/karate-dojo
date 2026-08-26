import { useEffect, useState } from "react";
import { getStudents, addStudent, removeStudent, addNota } from "../../lib/dataClient";
import { KYU_BELTS, DAN_LEVELS, GRUPOS, colorParaCinta } from "../../data/categories";
import { formatoCorto } from "../../utils/dates";
import Filters from "./Filters";
import StudentCard from "./StudentCard";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCinta, setFiltroCinta] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

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

  return (
    <div className="students">
      <div className="students__header">
        <div>
          <p className="checkin__eyebrow">Clientes</p>
          <h1 className="checkin__title">Alumnos</h1>
        </div>
        <p className="students__contador">{filtrados.length} de {students.length}</p>
      </div>

      <Filters
        cinta={filtroCinta}
        grupo={filtroGrupo}
        onCintaChange={setFiltroCinta}
        onGrupoChange={setFiltroGrupo}
        onNuevoAlumno={() => setMostrarForm((v) => !v)}
      />

      {mostrarForm && (
        <NuevoAlumnoForm onCancelar={() => setMostrarForm(false)} onGuardar={handleNuevoAlumno} />
      )}

      <div className="students__body">
        <div className="students__grid">
          {cargando && <p className="students__vacio">Cargando…</p>}
          {!cargando && filtrados.length === 0 && (
            <p className="students__vacio">Ningun alumno coincide con este filtro.</p>
          )}
          {filtrados.map((alumno) => (
            <StudentCard
              key={alumno.id}
              alumno={alumno}
              onClick={() => setSeleccionadoId(alumno.id)}
            />
          ))}
        </div>

        <div className="students__detalle">
          {seleccionado ? (
            <DetalleAlumno alumno={seleccionado} onBaja={handleBaja} onNota={handleNota} />
          ) : (
            <p className="students__vacio">Toca un alumno para ver la ficha completa.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetalleAlumno({ alumno, onBaja, onNota }) {
  const [nota, setNota] = useState("");
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const color = colorParaCinta(alumno.cinta);

  return (
    <div className="detalle">
      <div className="detalle__header">
        <div>
          <p className="detalle__grupo">{alumno.grupo}</p>
          <h2 className="detalle__nombre">{alumno.nombre}</h2>
          <span
            className="badge"
            style={{ background: color.bg, color: color.fg, borderColor: color.border }}
          >
            {alumno.cinta}
          </span>
        </div>
        <button className="btn btn--danger-ghost" onClick={() => setConfirmarBaja(true)}>
          Dar de baja
        </button>
      </div>

      {confirmarBaja && (
        <div className="detalle__confirm">
          <p>Dar de baja a {alumno.nombre} del sistema.</p>
          <div className="detalle__confirm-botones">
            <button className="btn btn--danger" onClick={() => onBaja(alumno.id)}>
              Confirmar baja
            </button>
            <button className="btn btn--secondary" onClick={() => setConfirmarBaja(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <dl className="detalle__lista">
        <Fila label="Documento" valor={alumno.dni} />
        <Fila label="Edad" valor={alumno.edad ? `${alumno.edad} años` : "-"} />
        <Fila label="Contacto" valor={alumno.contacto || "-"} />
        <Fila label="Asistencias totales" valor={alumno.totalAsistencias} />
        <Fila
          label="Proximo examen"
          valor={alumno.proximoExamen ? formatoCorto(alumno.proximoExamen) : "Sin definir"}
        />
        <Fila
          label="Ultimo examen rendido"
          valor={alumno.ultimoExamen ? formatoCorto(alumno.ultimoExamen) : "Todavia no rindio"}
        />
      </dl>

      <div className="detalle__notas">
        <p className="ficha__seccion-label">Notas (solo las ve el profesor)</p>
        {alumno.notas.length === 0 && <p className="students__vacio">Sin notas todavia.</p>}
        {alumno.notas.map((n, i) => (
          <p key={i} className="detalle__nota">
            {n}
          </p>
        ))}
        <div className="detalle__nota-form">
          <input
            className="checkin__input"
            placeholder="Recordar mejorar la guardia baja"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
          <button
            className="btn btn--secondary"
            onClick={() => {
              onNota(alumno.id, nota);
              setNota("");
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

function Fila({ label, valor }) {
  return (
    <div className="detalle__fila">
      <dt>{label}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

function NuevoAlumnoForm({ onCancelar, onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [edad, setEdad] = useState("");
  const [grupo, setGrupo] = useState(GRUPOS[0]);
  const [cinta, setCinta] = useState(KYU_BELTS[0]);
  const [contacto, setContacto] = useState("");
  const [error, setError] = useState("");

  function handleGuardar() {
    if (!nombre.trim() || !dni.trim()) {
      setError("Nombre y documento son obligatorios.");
      return;
    }
    onGuardar({ nombre: nombre.trim(), dni: dni.trim(), edad: edad.trim(), grupo, cinta, contacto: contacto.trim() });
  }

  return (
    <div className="nuevo-alumno">
      <div className="nuevo-alumno__grid">
        <input className="checkin__input" placeholder="Nombre y apellido" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input className="checkin__input" placeholder="Documento" value={dni} onChange={(e) => setDni(e.target.value)} />
        <input className="checkin__input" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
        <select className="select" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
          {GRUPOS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select className="select" value={cinta} onChange={(e) => setCinta(e.target.value)}>
          <optgroup label="Kyu">
            {KYU_BELTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Dan">
            {DAN_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
          </optgroup>
        </select>
        <input className="checkin__input" placeholder="Contacto" value={contacto} onChange={(e) => setContacto(e.target.value)} />
      </div>
      {error && <p className="checkin__error">{error}</p>}
      <div className="nuevo-alumno__botones">
        <button className="btn btn--primary" onClick={handleGuardar}>Guardar alumno</button>
        <button className="btn btn--secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}
