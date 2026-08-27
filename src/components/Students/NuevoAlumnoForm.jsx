import { useState } from "react";
import { KYU_BELTS, DAN_LEVELS, GRUPOS, SEXOS } from "../../data/categories";
import styles from "./NuevoAlumnoForm.module.css";

const VACIO = {
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  dni: "",
  sexo: "",
  ocupacion: "",
  cinta: KYU_BELTS[0],
  grupo: "",
  email: "",
  direccion: "",
  telefono: "",
  fechaIngreso: "",
  observaciones: "",
};

function desdeAlumno(a) {
  return {
    nombre: a.nombre || "",
    apellido: a.apellido || "",
    fechaNacimiento: a.fechaNacimiento || "",
    dni: a.dni || "",
    sexo: a.sexo || "",
    ocupacion: a.ocupacion || "",
    cinta: a.cinta || KYU_BELTS[0],
    grupo: a.grupo || "",
    email: a.email || "",
    direccion: a.direccion || "",
    telefono: a.telefono || "",
    fechaIngreso: a.fechaIngreso || "",
    observaciones: a.observaciones || "",
  };
}

export default function NuevoAlumnoForm({ alumno, onCancelar, onGuardar }) {
  const edicion = Boolean(alumno);
  const [datos, setDatos] = useState(() => (edicion ? desdeAlumno(alumno) : VACIO));
  const [error, setError] = useState("");

  const set = (campo) => (e) =>
    setDatos((d) => ({ ...d, [campo]: e.target.value }));

  function handleGuardar() {
    // Los datos llegan de a poco (Julio los pasa por partes), así que sólo
    // exigimos lo estructural; el resto se completa después editando.
    const obligatorios = { nombre: "Nombre", apellido: "Apellido", dni: "Número de documento" };
    const falta = Object.entries(obligatorios).find(
      ([campo]) => !String(datos[campo]).trim()
    );
    if (falta) {
      setError(`Falta completar: ${falta[1]}.`);
      return;
    }
    setError("");
    onGuardar({
      ...datos,
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      dni: datos.dni.trim(),
      email: datos.email.trim(),
      ocupacion: datos.ocupacion.trim(),
      direccion: datos.direccion.trim(),
      telefono: datos.telefono.trim(),
      observaciones: datos.observaciones.trim(),
    });
  }

  return (
    <div className={styles.form}>
      <p className={styles.titulo}>
        {edicion ? `Editar información — ${alumno.apellido}, ${alumno.nombre}` : "Nuevo alumno"}
      </p>

      <p className="section-label">Datos personales</p>
      <div className={styles.grid}>
        <Campo label="Nombre" req>
          <input className="input" value={datos.nombre} onChange={set("nombre")} />
        </Campo>
        <Campo label="Apellido" req>
          <input className="input" value={datos.apellido} onChange={set("apellido")} />
        </Campo>
        <Campo label="Número de documento" req>
          <input className="input" inputMode="numeric" value={datos.dni} onChange={set("dni")} />
        </Campo>
        <Campo label="Fecha de nacimiento">
          <input className="input" type="date" value={datos.fechaNacimiento} onChange={set("fechaNacimiento")} />
        </Campo>
        <Campo label="Sexo">
          <div className={styles.radios}>
            {SEXOS.map((s) => (
              <label key={s} className={styles.radio}>
                <input
                  type="radio"
                  name="sexo"
                  value={s}
                  checked={datos.sexo === s}
                  onChange={set("sexo")}
                />
                {s}
              </label>
            ))}
          </div>
        </Campo>
        <Campo label="Ocupación / profesión">
          <input className="input" value={datos.ocupacion} onChange={set("ocupacion")} />
        </Campo>
      </div>

      <p className="section-label">Categoría en el dojo</p>
      <div className={styles.grid}>
        <Campo label="Cinturón / categoría" req>
          <select className="select" value={datos.cinta} onChange={set("cinta")}>
            <optgroup label="Kyu">
              {KYU_BELTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <optgroup label="Dan">
              {DAN_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
          </select>
        </Campo>
        <Campo label="Grupo">
          <select className="select" value={datos.grupo} onChange={set("grupo")}>
            <option value="">— Sin asignar —</option>
            {GRUPOS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Campo>
        <Campo label="Fecha de ingreso al dojo">
          <input className="input" type="date" value={datos.fechaIngreso} onChange={set("fechaIngreso")} />
        </Campo>
      </div>

      <p className="section-label">Contacto</p>
      <div className={styles.grid}>
        <Campo label="Correo electrónico">
          <input className="input" type="email" value={datos.email} onChange={set("email")} />
        </Campo>
        <Campo label="Teléfono">
          <input className="input" value={datos.telefono} onChange={set("telefono")} />
        </Campo>
        <Campo label="Dirección" full>
          <input className="input" value={datos.direccion} onChange={set("direccion")} />
        </Campo>
      </div>

      <p className="section-label">Observaciones generales / médicas</p>
      <textarea
        className={`input ${styles.textarea}`}
        rows={3}
        value={datos.observaciones}
        onChange={set("observaciones")}
        placeholder="Lesiones, alergias, medicación, contacto de emergencia…"
      />

      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttons}>
        <button className="btn btn--primary" onClick={handleGuardar}>
          {edicion ? "Guardar cambios" : "Guardar alumno"}
        </button>
        <button className="btn btn--secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}

function Campo({ label, req, full, children }) {
  return (
    <label className={`${styles.campo} ${full ? styles.campoFull : ""}`}>
      <span className={styles.campoLabel}>
        {label} {req && <span className={styles.req}>*</span>}
      </span>
      {children}
    </label>
  );
}
