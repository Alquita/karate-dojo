import { colorParaCinta } from "../../data/categories";

export default function StudentCard({ alumno, onClick }) {
  const color = colorParaCinta(alumno.cinta);

  return (
    <button className="student-card" onClick={onClick} style={{ borderLeftColor: color.border }}>
      <div className="student-card__top">
        <p className="student-card__nombre">{alumno.nombre}</p>
        <span
          className="badge badge--sm"
          style={{ background: color.bg, color: color.fg, borderColor: color.border }}
        >
          {alumno.cinta}
        </span>
      </div>
      <p className="student-card__meta">
        {alumno.grupo} · {alumno.edad} años
      </p>
      <p className="student-card__asistencias">{alumno.totalAsistencias} asistencias totales</p>
    </button>
  );
}
