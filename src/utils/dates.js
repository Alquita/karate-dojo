const DIA_CORTO = ["L", "M", "M", "J", "V", "S", "D"];
const MESES_CORTO = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function toISODate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Devuelve los 7 días (lunes a domingo) de la semana que contiene `referencia`
function semanaActual(referencia = new Date()) {
  const ref = new Date(referencia);
  const diaSemana = ref.getDay(); // 0 = domingo
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

function esMismoDia(a, b) {
  return toISODate(a) === toISODate(b);
}

export { DIA_CORTO, toISODate, semanaActual, formatoCorto, esMismoDia };
