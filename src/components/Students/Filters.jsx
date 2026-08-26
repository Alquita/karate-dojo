import { TODAS_LAS_CINTAS, GRUPOS } from "../../data/categories";

export default function Filters({ cinta, grupo, onCintaChange, onGrupoChange, onNuevoAlumno }) {
  return (
    <div className="filters">
      <select className="select" value={cinta} onChange={(e) => onCintaChange(e.target.value)}>
        <option value="">Todas las cintas</option>
        {TODAS_LAS_CINTAS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select className="select" value={grupo} onChange={(e) => onGrupoChange(e.target.value)}>
        <option value="">Todos los grupos</option>
        {GRUPOS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <button className="btn btn--secondary filters__nuevo" onClick={onNuevoAlumno}>
        Nuevo alumno
      </button>
    </div>
  );
}
