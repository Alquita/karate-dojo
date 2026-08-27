import { mockStudents } from "../data/mockStudents";
import { toISODate } from "../utils/dates";

// ─────────────────────────────────────────────────────────────────────────
// MODO PRUEBA (activo). Datos falsos en memoria: lo que cargues se pierde
// al recargar la página. No toca ninguna base de datos.
//
// La conexión real a Supabase está lista pero comentada al final de este
// archivo. Para activarla ver las instrucciones en supabaseClient.js.
// ─────────────────────────────────────────────────────────────────────────

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

/* ═══════════════════════════════════════════════════════════════════════════
   CONEXIÓN SUPABASE — LISTA PERO DESACTIVADA.

   Para activar cuando lleguen los datos reales de Julio:
     1. Crear .env.local con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
        (ver supabaseClient.js) y descomentar el createClient de ahí.
     2. Borrar TODO el bloque MODO PRUEBA de arriba (desde `let students` hasta
        la función addNota).
     3. Descomentar todo este bloque.
   Los componentes no cambian: mismas 6 funciones, misma forma de respuesta.
   Esquema de la base: ver docs/esquema.sql (o el SQL pegado en Supabase).
   ═══════════════════════════════════════════════════════════════════════════

import { supabase } from "./supabaseClient";

const SELECT_ALUMNO = "*, asistencias(fecha), notas(id, texto, creado_en)";

function mapearAlumno(row, resumen) {
  const historial = (row.asistencias || []).map((a) => a.fecha).sort().reverse();
  const notas = (row.notas || [])
    .slice()
    .sort((a, b) => String(a.creado_en).localeCompare(String(b.creado_en)))
    .map((n) => n.texto);

  return {
    id: row.id,
    dni: row.documento,
    nombre: row.nombre || "",
    apellido: row.apellido || "",
    fechaNacimiento: row.fecha_nacimiento || "",
    sexo: row.sexo || "",
    ocupacion: row.ocupacion || "",
    grupo: row.grupo || "",
    cinta: row.cinta || "Blanco",
    email: row.email || "",
    direccion: row.direccion || "",
    telefono: row.telefono || "",
    fechaIngreso: row.fecha_ingreso || "",
    observaciones: row.observaciones || "",
    metaSemanal: row.meta_semanal ?? 3,
    proximoExamen: row.proximo_examen || null,
    ultimoExamen: row.ultimo_examen || null,
    historial,
    totalAsistencias: resumen?.total_asistencias ?? historial.length,
    asistenciasSemana: resumen?.asistencias_semana ?? 0,
    promedioSemanal: resumen?.promedio_semanal ?? 0,
    notas,
  };
}

function alumnoParaInsert(datos) {
  return {
    documento: (datos.dni || "").trim(),
    nombre: (datos.nombre || "").trim(),
    apellido: (datos.apellido || "").trim(),
    fecha_nacimiento: datos.fechaNacimiento || null,
    sexo: datos.sexo || null,
    ocupacion: datos.ocupacion || "",
    grupo: datos.grupo || "",
    cinta: datos.cinta || "Blanco",
    email: datos.email || "",
    direccion: datos.direccion || "",
    telefono: datos.telefono || "",
    fecha_ingreso: datos.fechaIngreso || null,
    observaciones: datos.observaciones || "",
    meta_semanal: datos.metaSemanal || 3,
  };
}

async function resumenPorId() {
  const { data, error } = await supabase.from("alumnos_resumen").select("*");
  if (error) throw error;
  return Object.fromEntries((data || []).map((r) => [r.alumno_id, r]));
}

export async function getStudents() {
  const [{ data: rows, error }, resumen] = await Promise.all([
    supabase.from("alumnos").select(SELECT_ALUMNO).eq("activo", true),
    resumenPorId(),
  ]);
  if (error) throw error;
  return (rows || [])
    .map((r) => mapearAlumno(r, resumen[r.id]))
    .sort((a, b) =>
      `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`)
    );
}

export async function findByDni(dni) {
  const { data, error } = await supabase
    .from("alumnos")
    .select(SELECT_ALUMNO)
    .eq("documento", dni.trim())
    .eq("activo", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const resumen = await resumenPorId();
  return mapearAlumno(data, resumen[data.id]);
}

export async function registerAttendance(dni) {
  const alumno = await findByDni(dni);
  if (!alumno) return null;

  const hoy = toISODate(new Date());
  const yaRegistrado = alumno.historial.includes(hoy);

  if (!yaRegistrado) {
    const { error } = await supabase
      .from("asistencias")
      .upsert(
        { alumno_id: alumno.id, fecha: hoy },
        { onConflict: "alumno_id,fecha", ignoreDuplicates: true }
      );
    if (error) throw error;
  }

  const actualizado = await findByDni(dni);
  return { ...actualizado, yaRegistrado };
}

export async function addStudent(datos) {
  const { data, error } = await supabase
    .from("alumnos")
    .insert(alumnoParaInsert(datos))
    .select(SELECT_ALUMNO)
    .single();
  if (error) throw error;
  return mapearAlumno(data, null);
}

export async function removeStudent(id) {
  const { error } = await supabase
    .from("alumnos")
    .update({ activo: false })
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function addNota(id, texto) {
  const { error } = await supabase.from("notas").insert({ alumno_id: id, texto });
  if (error) throw error;
  return true;
}

═══════════════════════════════════════════════════════════════════════════ */
