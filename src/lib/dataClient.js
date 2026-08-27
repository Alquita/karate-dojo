import { mockStudents } from "../data/mockStudents";
import { toISODate } from "../utils/dates";

// Copia mutable en memoria. El día que conectemos Supabase, cada función
// de acá abajo pasa a hacer un select/insert/update real, pero la firma
// (async, mismos parámetros, misma forma de respuesta) queda igual, así
// que ningún componente tiene que cambiar.
let students = mockStudents.map((s) => ({ ...s }));

function delay(value, ms = 420) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getStudents() {
  return delay([...students]);
}

export async function findByDni(dni) {
  const alumno = students.find((s) => s.dni === dni.trim());
  return delay(alumno ? { ...alumno } : null);
}

export async function registerAttendance(dni) {
  const hoy = toISODate(new Date());
  const idx = students.findIndex((s) => s.dni === dni.trim());
  if (idx === -1) return delay(null);

  const alumno = students[idx];
  const yaRegistrado = alumno.historial.includes(hoy);
  const historial = yaRegistrado ? alumno.historial : [hoy, ...alumno.historial];
  const totalAsistencias = yaRegistrado
    ? alumno.totalAsistencias
    : alumno.totalAsistencias + 1;

  students[idx] = { ...alumno, historial, totalAsistencias };
  return delay({ ...students[idx], yaRegistrado });
}

export async function addStudent(datos) {
  const nuevo = {
    id: crypto.randomUUID(),
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    sexo: "",
    ocupacion: "",
    grupo: "",
    cinta: "Blanco",
    email: "",
    direccion: "",
    telefono: "",
    fechaIngreso: "",
    metaSemanal: 3,
    totalAsistencias: 0,
    historial: [],
    proximoExamen: null,
    ultimoExamen: null,
    observaciones: "",
    notas: [],
    ...datos,
  };
  students = [...students, nuevo];
  return delay({ ...nuevo });
}

export async function removeStudent(id) {
  students = students.filter((s) => s.id !== id);
  return delay(true);
}

export async function addNota(id, texto) {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return delay(null);
  students[idx] = { ...students[idx], notas: [...students[idx].notas, texto] };
  return delay({ ...students[idx] });
}
