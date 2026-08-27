// Nombre completo tolerante: algunos alumnos viejos sólo tienen `nombre`.
export function nombreCompleto(alumno) {
  if (!alumno) return "";
  return [alumno.nombre, alumno.apellido].filter(Boolean).join(" ");
}
