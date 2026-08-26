import { useState } from "react";
import { findByDni, registerAttendance } from "../../lib/dataClient";
import { colorParaCinta } from "../../data/categories";
import { formatoCorto, semanaActual, toISODate } from "../../utils/dates";
import WeekTimeline from "./WeekTimeline";
import EnsoProgress from "./EnsoProgress";

export default function CheckIn() {
  const [dni, setDni] = useState("");
  const [alumno, setAlumno] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleRegistrar() {
    const valor = dni.trim();
    if (!valor) {
      setError("Ingresa un documento primero.");
      return;
    }

    setCargando(true);
    setError("");
    const existe = await findByDni(valor);
    if (!existe) {
      setError("No se encontro ningun alumno con ese documento.");
      setAlumno(null);
      setCargando(false);
      return;
    }

    const actualizado = await registerAttendance(valor);
    setAlumno(actualizado);
    setDni("");
    setCargando(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleRegistrar();
  }

  const color = alumno ? colorParaCinta(alumno.cinta) : null;

  return (
    <div className="checkin">
      <div className="checkin__panel">
        <p className="checkin__eyebrow">Entrada al dojo</p>
        <h1 className="checkin__title">Registrar asistencia</h1>
        <div className="checkin__form">
          <input
            className="checkin__input"
            type="text"
            inputMode="numeric"
            placeholder="Documento"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="btn btn--primary" onClick={handleRegistrar} disabled={cargando}>
            {cargando ? "Buscando…" : "Registrar"}
          </button>
        </div>
        {error && <p className="checkin__error">{error}</p>}
      </div>

      {alumno && (
        <div className="ficha" key={alumno.id + alumno.historial.length}>
          <div className="ficha__header">
            <div>
              <p className="ficha__grupo">{alumno.grupo}</p>
              <h2 className="ficha__nombre">{alumno.nombre}</h2>
              <span
                className="badge"
                style={{
                  background: color.bg,
                  color: color.fg,
                  borderColor: color.border,
                }}
              >
                {alumno.cinta}
              </span>
            </div>
            <EnsoProgress asistidas={contarEstaSemana(alumno.historial)} meta={alumno.metaSemanal} />
          </div>

          <div className="ficha__semana">
            <p className="ficha__seccion-label">Asistencias de la semana</p>
            <WeekTimeline historial={alumno.historial} />
          </div>

          <div className="ficha__datos">
            <Dato label="Ultima clase" valor={alumno.historial[0] ? formatoCorto(alumno.historial[0]) : "Sin registros"} />
            <Dato label="Proximo examen" valor={alumno.proximoExamen ? formatoCorto(alumno.proximoExamen) : "Sin definir"} />
            <Dato label="Ultimo examen rendido" valor={alumno.ultimoExamen ? formatoCorto(alumno.ultimoExamen) : "Todavia no rindio"} />
          </div>
        </div>
      )}
    </div>
  );
}

function Dato({ label, valor }) {
  return (
    <div className="ficha__dato">
      <p className="ficha__dato-label">{label}</p>
      <p className="ficha__dato-valor">{valor}</p>
    </div>
  );
}

function contarEstaSemana(historial) {
  // el timeline ya filtra por la semana visualmente; acá contamos cuántos
  // de los últimos registros caen dentro de la semana actual para el anillo
  const isos = semanaActual().map((d) => toISODate(d));
  return historial.filter((h) => isos.includes(h)).length;
}
