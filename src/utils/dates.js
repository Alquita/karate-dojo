const DIA_CORTO = ["L", "M", "M", "J", "V", "S", "D"];
const DIAS_LARGO = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
const MESES_CORTO = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
const MESES_LARGO = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toISODate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function semanaActual(referencia = new Date()) {
  const ref = new Date(referencia);
  const diaSemana = ref.getDay();
  const offsetHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  const lunes = new Date(ref);
  lunes.setDate(ref.getDate() + offsetHastaLunes);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return d;
  });
}

function formatoCorto(isoOrDate) {
  const d = new Date(isoOrDate);
  return `${d.getDate()} ${MESES_CORTO[d.getMonth()]}`;
}

function formatoLargo(isoOrDate) {
  const d = new Date(isoOrDate);
  return `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} ${d.getFullYear()}`;
}

function esMismoDia(a, b) {
  return toISODate(a) === toISODate(b);
}

function diasDelMes(anio, mes) {
  return new Date(anio, mes, 0).getDate();
}

function primerDiaDelMes(anio, mes) {
  const d = new Date(anio, mes - 1, 1);
  let dia = d.getDay();
  return dia === 0 ? 6 : dia - 1;
}

function semanaActualReferencia(referencia = new Date()) {
  const ref = new Date(referencia);
  const diaSemana = ref.getDay();
  const offsetHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  const lunes = new Date(ref);
  lunes.setDate(ref.getDate() + offsetHastaLunes);
  return lunes;
}

function semanasDelMes(anio, mes) {
  const totalDias = diasDelMes(anio, mes);
  const offsetPrimerDia = primerDiaDelMes(anio, mes);
  const totalSlots = offsetPrimerDia + totalDias;
  return Math.ceil(totalSlots / 7);
}

function edadDesde(fechaNacimiento) {
  if (!fechaNacimiento) return "";
  const nac = new Date(fechaNacimiento);
  if (Number.isNaN(nac.getTime())) return "";
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function horasDesde(fechaISO) {
  const ahora = new Date();
  const fecha = new Date(fechaISO);
  const diff = ahora - fecha;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export {
  DIA_CORTO,
  DIAS_LARGO,
  MESES_CORTO,
  MESES_LARGO,
  toISODate,
  semanaActual,
  formatoCorto,
  formatoLargo,
  esMismoDia,
  edadDesde,
  diasDelMes,
  primerDiaDelMes,
  semanaActualReferencia,
  semanasDelMes,
  horasDesde,
};
