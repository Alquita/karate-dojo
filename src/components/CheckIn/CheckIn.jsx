import { useState, useEffect, useRef } from "react";
import { findByDni, registerAttendance } from "../../lib/dataClient";
import { colorParaCinta } from "../../data/categories";
import { formatoCorto, semanaActual, toISODate } from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
import Spinner from "../ui/Spinner";
import BlurText from "../ui/BlurText";
import FadeContent from "../ui/FadeContent";
import WeekTimeline from "./WeekTimeline";
import EnsoProgress from "./EnsoProgress";
import styles from "./CheckIn.module.css";

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const hoyCorto = () => formatoCorto(new Date());

export default function CheckIn() {
  const [dni, setDni] = useState("");
  const [alumno, setAlumno] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const fichaRef = useRef(null);

  useEffect(() => {
    if (alumno) {
      fichaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [alumno]);

  async function handleRegistrar() {
    const valor = dni.trim();
    if (!valor) {
      setError("Ingresa un documento primero.");
      return;
    }

    setCargando(true);
    setError("");
    const [existe] = await Promise.all([findByDni(valor), espera(1100)]);
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
  const saludo = alumno?.sexo === "Femenino" ? "Bienvenida" : "Bienvenido";

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Entrada al dojo</p>
        <h1 className={`title ${styles.title}`}>
          Registrar asistencia
        </h1>
        {cargando ? (
          <div className={styles.loader}>
            <Spinner />
            <div className={styles.progress}>
              <span className={styles.progressFill} />
            </div>
            <BlurText
              key={dni}
              className={styles.loaderText}
              text="Registrando asistencia…"
              animateBy="letters"
            />
          </div>
        ) : (
          <>
            <div className={styles.form}>
              <input
                className={`input ${styles.input}`}
                type="text"
                inputMode="numeric"
                placeholder="Documento"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button className="btn btn--primary" onClick={handleRegistrar}>
                Registrar
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>

      {alumno && (
        <div ref={fichaRef} key={alumno.id + alumno.historial.length} className={styles.ficha}>
          <div className={styles.bienvenida}>
            <span className={styles.bienvenidaCheck} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M5 13 L10 18 L19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <BlurText
              className={styles.bienvenidaTexto}
              text={`¡${saludo}, ${alumno.nombre}!`}
              animateBy="words"
            />
            <p className={styles.bienvenidaSub}>Asistencia registrada · {hoyCorto()}</p>
          </div>

          <FadeContent delay={0.35} duration={0.5}>
            <div className={styles.ficha__header}>
              <div>
                <p className={styles.ficha__grupo}>{alumno.grupo}</p>
                <h2 className={styles.ficha__nombre}>{nombreCompleto(alumno)}</h2>
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

            <p className={styles["ficha__seccion-label"]}>Asistencias de la semana</p>
            <WeekTimeline historial={alumno.historial} />

            <div className={styles.ficha__datos}>
              <Dato titulo="Ultima clase" valor={alumno.historial[0] ? formatoCorto(alumno.historial[0]) : "Sin registros"} />
              <Dato titulo="Proximo examen" valor={alumno.proximoExamen ? formatoCorto(alumno.proximoExamen) : "Sin definir"} />
              <Dato titulo="Ultimo examen rendido" valor={alumno.ultimoExamen ? formatoCorto(alumno.ultimoExamen) : "Todavia no rindio"} />
            </div>
          </FadeContent>
        </div>
      )}
    </div>
  );
}

function Dato({ titulo, valor }) {
  return (
    <div className={styles.ficha__dato}>
      <p className={styles["ficha__dato-label"]}>{titulo}</p>
      <p className={styles["ficha__dato-valor"]}>{valor}</p>
    </div>
  );
}

function contarEstaSemana(historial) {
  const isos = semanaActual().map((d) => toISODate(d));
  return historial.filter((h) => isos.includes(h)).length;
}
