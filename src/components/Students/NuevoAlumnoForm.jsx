import { useState } from "react";
import { KYU_BELTS, DAN_LEVELS, GRUPOS } from "../../data/categories";
import styles from "./NuevoAlumnoForm.module.css";

export default function NuevoAlumnoForm({ onCancelar, onGuardar }) {
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
    onGuardar({
      nombre: nombre.trim(),
      dni: dni.trim(),
      edad: edad.trim(),
      grupo,
      cinta,
      contacto: contacto.trim(),
    });
  }

  return (
    <div className={styles.form}>
      <div className={styles.grid}>
        <input
          className="input"
          placeholder="Nombre y apellido"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="input"
          placeholder="Documento"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
        <input
          className="input"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
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
        <input
          className="input"
          placeholder="Contacto"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttons}>
        <button className="btn btn--primary" onClick={handleGuardar}>Guardar alumno</button>
        <button className="btn btn--secondary" onClick={onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}
