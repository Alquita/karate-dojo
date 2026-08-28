import { useState } from "react";
import { colorParaCinta } from "../../data/categories";
import { formatoCorto, formatoLargo, edadDesde } from "../../utils/dates";
import { nombreCompleto } from "../../utils/format";
import styles from "./StudentDetail.module.css";

export default function StudentDetail({ alumno, onBaja, onNota, onEditar, onVerPlanilla }) {
  const [nota, setNota] = useState("");
  const [confirmarBaja, setConfirmarBaja] = useState(false);
  const color = colorParaCinta(alumno.cinta);
  const edad = edadDesde(alumno.fechaNacimiento);

  return (
    <div className={styles.detalle}>
      <div className={styles.header} style={{ animationDelay: "0.04s" }}>
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
        <div className={styles.acciones}>
          <button className="btn btn--secondary" onClick={onEditar}>
            Editar información
          </button>
          <button className="btn btn--danger-ghost" onClick={() => setConfirmarBaja(true)}>
            Dar de baja
          </button>
        </div>
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

      <div className={styles.seccion} style={{ animationDelay: "0.1s" }}>
        <p className="section-label">Datos personales</p>
        <dl className={styles.campos}>
          <Campo label="Nacimiento" valor={fechaOGuion(alumno.fechaNacimiento)} />
          <Campo label="Edad" valor={edad !== "" ? `${edad} años` : "—"} />
          <Campo label="Sexo" valor={alumno.sexo || "—"} />
          <Campo label="Ocupación" valor={alumno.ocupacion || "—"} />
        </dl>
      </div>

      <div className={styles.seccion} style={{ animationDelay: "0.16s" }}>
        <p className="section-label">Contacto</p>
        <dl className={styles.campos}>
          <Campo label="Documento" valor={alumno.dni} mono />
          <Campo label="Teléfono" valor={alumno.telefono || alumno.contacto || "—"} mono />
          <Campo label="Correo electrónico" valor={alumno.email || "—"} ancho />
          <Campo label="Dirección" valor={alumno.direccion || "—"} ancho />
        </dl>
      </div>

      <div className={styles.seccion} style={{ animationDelay: "0.22s" }}>
        <p className="section-label">En el dojo</p>
        <dl className={styles.campos}>
          <Campo
            label="Ingreso al dojo"
            valor={fechaOGuion(alumno.fechaIngreso || alumno.ingreso)}
          />
          <Campo label="Asistencias totales" valor={alumno.totalAsistencias} mono />
          <Campo
            label="Próximo examen"
            valor={alumno.proximoExamen ? formatoCorto(alumno.proximoExamen) : "Sin definir"}
          />
          <Campo
            label="Último examen"
            valor={alumno.ultimoExamen ? formatoCorto(alumno.ultimoExamen) : "Todavía no rindió"}
          />
        </dl>
      </div>

      {alumno.observaciones && (
        <div className={styles.seccion} style={{ animationDelay: "0.28s" }}>
          <p className="section-label">Observaciones generales / médicas</p>
          <p className={styles.observacionesTexto}>{alumno.observaciones}</p>
        </div>
      )}

      <button
        className={`btn btn--primary ${styles.planillaBtn}`}
        onClick={onVerPlanilla}
        style={{ animationDelay: "0.32s" }}
      >
        Ver planilla de asistencia
      </button>

      <div className={styles.notas} style={{ animationDelay: "0.36s" }}>
        <p className="section-label">Notas (solo las ve el profesor)</p>
        {alumno.notas.length === 0 && <p className={styles.vacio}>Sin notas todavía.</p>}
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
  );
}

function fechaOGuion(iso) {
  if (!iso) return "—";
  return formatoLargo(iso);
}

function Campo({ label, valor, mono, ancho }) {
  return (
    <div className={`${styles.campo} ${ancho ? styles.campoAncho : ""}`}>
      <dt className={styles.campoLabel}>{label}</dt>
      <dd className={`${styles.campoValor} ${mono ? styles.mono : ""}`}>{valor}</dd>
    </div>
  );
}
