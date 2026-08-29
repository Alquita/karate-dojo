// Cálculo de asistencia — una sola fuente para las planillas, la ficha y el resumen.
// El "historial" de cada alumno es un array de fechas ISO ("2026-03-14").

import { toISODate, semanaActual, semanasDelMes } from "./dates";

const dosDigitos = (n) => String(n).padStart(2, "0");

// Fechas ISO (lunes a domingo) de la semana que contiene `referencia`.
export function fechasSemana(referencia = new Date()) {
  return semanaActual(referencia).map((d) => toISODate(d));
}

export function asistenciasEnSemana(historial, fechasIso) {
  const set = new Set(fechasIso);
  return historial.filter((h) => set.has(h)).length;
}

export function asistenciasEnMes(historial, anio, mes) {
  const prefijo = `${anio}-${dosDigitos(mes)}`;
  return historial.filter((h) => h.startsWith(prefijo)).length;
}

export function asistenciasEnAnio(historial, anio) {
  const prefijo = `${anio}-`;
  return historial.filter((h) => h.startsWith(prefijo)).length;
}

// Cuántas clases "podría" haber tenido en el período, según las clases por semana
// configuradas por el profesor.
export function clasesPosibles(modo, anio, mes, clasesPorSemana) {
  const cpw = Math.max(1, Number(clasesPorSemana) || 3);
  if (modo === "semanal") return cpw;
  if (modo === "anual") return cpw * 52;
  return cpw * semanasDelMes(anio, mes); // mensual
}

export function porcentaje(vino, posibles) {
  if (!posibles || posibles <= 0) return 0;
  return Math.min(100, Math.round((vino / posibles) * 100));
}

// Semanas completas transcurridas del año (mín. 1). Para el % anual "al día":
// dividir por esto en vez de por 52 fijo, así en marzo el número tiene sentido.
export function semanasTranscurridasAnio(anio) {
  const hoy = new Date();
  const inicio = new Date(anio, 0, 1);
  if (hoy < inicio) return 1;
  const dias = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.ceil(dias / 7));
}

export function clasesPosiblesAlDia(anio, clasesPorSemana) {
  const cpw = Math.max(1, Number(clasesPorSemana) || 3);
  return cpw * semanasTranscurridasAnio(anio);
}
