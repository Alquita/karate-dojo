import { useState } from "react";
import { colorParaCinta } from "../../data/categories";
import { formatoCorto, formatoLargo, edadDesde } from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
import FadeContent from "../ui/FadeContent";
import styles from "./StudentDetail.module.css";

export default function StudentDetail({ alumno, onBaja, onNota, onVerPlanilla }) {
  const [nota, setNota] = useState("");
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const color = colorParaCinta(alumno.cinta);

  return (
    <FadeContent>
      <div className={styles.detalle}>
        <div className={styles.header}>
          <div>
            <p className={styles.grupo}>{alumno.grupo}</p>
            <h2 className={styles.nombre}>{nombreCompleto(alumno)}</h2>
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
          <div className={styles.confirm}>
            <p>Dar de baja a {alumno.nombre} del sistema.</p>
            <div className={styles.confirmButtons}>
              <button className="btn btn--danger" onClick={() => onBaja(alumno.id)}>
                Confirmar baja
              </button>
              <button className="btn btn--secondary" onClick={() => setConfirmarBaja(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <dl className={styles.lista}>
          <Fila label="Documento" valor={alumno.dni} />
          <Fila label="Fecha de nacimiento" valor={fechaOGuion(alumno.fechaNacimiento)} />
          <Fila label="Edad" valor={edadDesde(alumno.fechaNacimiento) !== "" ? `${edadDesde(alumno.fechaNacimiento)} años` : "-"} />
          <Fila label="Sexo" valor={alumno.sexo || "-"} />
          <Fila label="Ocupacion / profesion" valor={alumno.ocupacion || "-"} />
          <Fila label="Correo electronico" valor={alumno.email || "-"} />
          <Fila label="Telefono" valor={alumno.telefono || alumno.contacto || "-"} />
          <Fila label="Direccion" valor={alumno.direccion || "-"} />
          <Fila label="Ingreso al dojo" valor={fechaOGuion(alumno.fechaIngreso || alumno.ingreso)} />
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

        {alumno.observaciones && (
          <div className={styles.observaciones}>
            <p className="section-label">Observaciones generales / medicas</p>
            <p className={styles.observacionesTexto}>{alumno.observaciones}</p>
          </div>
        )}

        <button className={`btn btn--primary ${styles.planillaBtn}`} onClick={onVerPlanilla}>
          Ver planilla de asistencia
        </button>

        <div className={styles.notas}>
          <p className="section-label">Notas (solo las ve el profesor)</p>
          {alumno.notas.length === 0 && <p className={styles.vacio}>Sin notas todavia.</p>}
          {alumno.notas.map((n, i) => (
            <p key={i} className={styles.nota}>{n}</p>
          ))}
          <div className={styles.notaForm}>
            <input
              className="input"
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
    </FadeContent>
  );
}

function fechaOGuion(iso) {
  if (!iso) return "-";
  return formatoLargo(iso);
}

function Fila({ label, valor }) {
  return (
    <div className={styles.fila}>
      <dt>{label}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
