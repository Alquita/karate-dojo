import { mockStudents } from "../data/mockStudents";
import { toISODate } from "../utils/dates";
import { supabase, HAY_SUPABASE } from "./supabaseClient";

// Única capa de datos. Todos los componentes la usan con estas 7 funciones async.
// Con Supabase configurado (.env.local) pega contra la base real; si no, usa una
// copia mock en memoria (modo demo). La firma y la forma de respuesta son iguales
// en los dos casos, así que ningún componente cambia.

// ─────────────────────────────────────────────────────────────────────────
// Supabase
// ─────────────────────────────────────────────────────────────────────────

const SELECT_ALUMNO = "*, asistencias(fecha), notas(id, texto, creado_en)";

// El DNI se guarda solo con números. Al buscar (check-in) el alumno lo puede
// tipear con puntos o espacios ("25.698.881") y lo mismo lo encuentra.
const soloDigitos = (v) => String(v || "").replace(/\D/g, "");
const docParaGuardar = (dni) => soloDigitos(dni) || String(dni || "").trim();

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

function alumnoParaGuardar(datos) {
  return {
    documento: docParaGuardar(datos.dni),
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

const sb = {
  async getStudents() {
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
  },

  async findByDni(dni) {
    const { data, error } = await supabase
      .from("alumnos")
      .select(SELECT_ALUMNO)
      .eq("documento", soloDigitos(dni))
      .eq("activo", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const resumen = await resumenPorId();
    return mapearAlumno(data, resumen[data.id]);
  },

  async registerAttendance(dni) {
    const alumno = await sb.findByDni(dni);
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

    const actualizado = await sb.findByDni(dni);
    return { ...actualizado, yaRegistrado };
  },

  async addStudent(datos) {
    const { data, error } = await supabase
      .from("alumnos")
      .insert(alumnoParaGuardar(datos))
      .select(SELECT_ALUMNO)
      .single();
    if (error) throw error;
    return mapearAlumno(data, null);
  },

  async updateStudent(id, datos) {
    const { data, error } = await supabase
      .from("alumnos")
      .update(alumnoParaGuardar(datos))
      .eq("id", id)
      .select(SELECT_ALUMNO)
      .single();
    if (error) throw error;
    return mapearAlumno(data, null);
  },

  async removeStudent(id) {
    const { error } = await supabase
      .from("alumnos")
      .update({ activo: false })
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  async addNota(id, texto) {
    const { error } = await supabase.from("notas").insert({ alumno_id: id, texto });
    if (error) throw error;
    return true;
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Mock en memoria (modo demo, sin Supabase configurado)
// ─────────────────────────────────────────────────────────────────────────

let students = mockStudents.map((s) => ({ ...s }));

function delay(value, ms = 420) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const mock = {
  async getStudents() {
    return delay([...students]);
  },

  async findByDni(dni) {
    const buscado = soloDigitos(dni);
    const alumno = students.find((s) => soloDigitos(s.dni) === buscado);
    return delay(alumno ? { ...alumno } : null);
  },

  async registerAttendance(dni) {
    const hoy = toISODate(new Date());
    const buscado = soloDigitos(dni);
    const idx = students.findIndex((s) => soloDigitos(s.dni) === buscado);
    if (idx === -1) return delay(null);

    const alumno = students[idx];
    const yaRegistrado = alumno.historial.includes(hoy);
    const historial = yaRegistrado ? alumno.historial : [hoy, ...alumno.historial];
    const totalAsistencias = yaRegistrado
      ? alumno.totalAsistencias
      : alumno.totalAsistencias + 1;

    students[idx] = { ...alumno, historial, totalAsistencias };
    return delay({ ...students[idx], yaRegistrado });
  },

  async addStudent(datos) {
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
  },

  async updateStudent(id, datos) {
    const idx = students.findIndex((s) => s.id === id);
    if (idx === -1) return delay(null);
    students[idx] = { ...students[idx], ...datos };
    return delay({ ...students[idx] });
  },

  async removeStudent(id) {
    students = students.filter((s) => s.id !== id);
    return delay(true);
  },

  async addNota(id, texto) {
    const idx = students.findIndex((s) => s.id === id);
    if (idx === -1) return delay(null);
    students[idx] = { ...students[idx], notas: [...students[idx].notas, texto] };
    return delay({ ...students[idx] });
  },
};

// ─────────────────────────────────────────────────────────────────────────

const impl = HAY_SUPABASE ? sb : mock;

export const getStudents = (...a) => impl.getStudents(...a);
export const findByDni = (...a) => impl.findByDni(...a);
export const registerAttendance = (...a) => impl.registerAttendance(...a);
export const addStudent = (...a) => impl.addStudent(...a);
export const updateStudent = (...a) => impl.updateStudent(...a);
export const removeStudent = (...a) => impl.removeStudent(...a);
export const addNota = (...a) => impl.addNota(...a);
