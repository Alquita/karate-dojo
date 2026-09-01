// Categorías tomadas de las planillas reales del dojo (KarateDoMiyazato).
// Los nombres y el orden se pueden ajustar cuando Julio confirme el criterio exacto
// de progresión de su federación (Okinawa Shorin-Ryu Shidokan).

// Orden real del dojo, de 7º kyu (menor) a 1º kyu (mayor):
export const KYU_BELTS = [
  "Blanco",   // 7º kyu
  "Celeste",  // 6º kyu
  "Amarillo", // 5º kyu
  "Naranja",  // 4º kyu
  "Verde",    // 3º kyu
  "Azul",     // 2º kyu
  "Marrón",   // 1º kyu
];

export const DAN_LEVELS = [
  "Primer Dan",
  "Segundo Dan",
  "Tercer Dan",
  "Cuarto Dan",
  "Quinto Dan",
  "Séptimo Dan",
  "Noveno Dan",
  "Primer Dan Cadete",
  "Primer Dan Juvenil",
  "Segundo Dan Juvenil",
];

// Une kyu + dan en un solo listado para el filtro de "cinta / categoría"
export const TODAS_LAS_CINTAS = [...KYU_BELTS, ...DAN_LEVELS];

export const SEXOS = ["Masculino", "Femenino"];

export const GRUPOS = [
  "Menores 6 a 8 años",
  "Menores 9 a 12 años",
  "Juveniles",
  "Mayores",
];

// Color funcional por cinta — no es la paleta de marca, es para que la
// insignia de cada alumno se lea de un vistazo como en un dojo real.
// `bg` = fondo suave de la insignia · `fg` = texto legible sobre ese fondo ·
// `border` = el color "fuerte" del cinturón (se usa para el borde de la insignia,
// la franja de la tarjeta y el puntito del filtro).
export const COLOR_CINTA = {
  Blanco: { bg: "#F4F3EF", fg: "#4A4842", border: "#B4B0A5" },
  Amarillo: { bg: "#FBEBAF", fg: "#6B5200", border: "#E8B71E" },
  Naranja: { bg: "#FBD9BC", fg: "#8A3D0B", border: "#E5751B" },
  Celeste: { bg: "#CFE9F7", fg: "#0F4C68", border: "#3EA9DB" },
  Verde: { bg: "#CDE9D3", fg: "#1E5B33", border: "#2E9E4F" },
  Azul: { bg: "#CBD9F2", fg: "#1B3B85", border: "#2159C4" },
  Marrón: { bg: "#E4CDBA", fg: "#5A3115", border: "#8A5230" },
};

// Cinturón negro: la "linita" de la cinta cambia según la categoría.
//  - Dan adulto  → dorada
//  - Dan cadete  → blanca (tono frío, distinto del Blanco kyu)
//  - Dan juvenil → celeste apagado (distinto del Celeste kyu)
const DAN_ADULTO = { bg: "#26241F", fg: "#E8C567", border: "#0A0A0A" };
const DAN_CADETE = { bg: "#242424", fg: "#ECECEC", border: "#0A0A0A" };
const DAN_JUVENIL = { bg: "#1E2429", fg: "#AED6E8", border: "#0A0A0A" };

export const ACCENT_DAN_ADULTO = "#E8C567";
export const ACCENT_DAN_CADETE = "#D6DBDF";
export const ACCENT_DAN_JUVENIL = "#9DC3D4";

export function esDan(cinta) {
  return Boolean(cinta) && !COLOR_CINTA[cinta];
}

// Progresión kyu → dan para el botón "Ascender".
const DAN_ORDEN = [
  "Primer Dan", "Segundo Dan", "Tercer Dan", "Cuarto Dan", "Quinto Dan",
  "Sexto Dan", "Séptimo Dan", "Octavo Dan", "Noveno Dan",
];
const ESCALERA = [...KYU_BELTS, ...DAN_ORDEN];

export function siguienteCinta(cinta) {
  const i = ESCALERA.indexOf(cinta);
  if (i === -1 || i === ESCALERA.length - 1) return null;
  return ESCALERA[i + 1];
}

// Número de dan según el ordinal del nombre ("Segundo Dan" → 2,
// "Primer Dan Juvenil" → 1). 0 si no es dan.
const ORDINAL_DAN = {
  Primer: 1, Segundo: 2, Tercer: 3, Cuarto: 4, Quinto: 5,
  Sexto: 6, "Séptimo": 7, Octavo: 8, Noveno: 9,
};

export function danNumero(cinta) {
  if (!esDan(cinta)) return 0;
  return ORDINAL_DAN[String(cinta).split(" ")[0]] || 1;
}

// Categoría en el formato que usa la federación para el reporte mensual de activos:
// los kyu llevan " - Nto Kyu"; los dan van tal cual.
const FED_KYU = {
  Blanco: "Blanco - 7mo Kyu",
  Celeste: "Celeste - 6to Kyu",
  Amarillo: "Amarillo - 5to Kyu",
  Naranja: "Naranja - 4to Kyu",
  Verde: "Verde - 3er Kyu",
  Azul: "Azul - 2do Kyu",
  "Marrón": "Marron - 1er Kyu",
};

export function categoriaFederacion(cinta) {
  return FED_KYU[cinta] || cinta || "";
}

export function colorParaCinta(cinta) {
  if (COLOR_CINTA[cinta]) return COLOR_CINTA[cinta];
  if (/juvenil/i.test(cinta)) return DAN_JUVENIL;
  if (/cadete/i.test(cinta)) return DAN_CADETE;
  return DAN_ADULTO;
}

// Color de la "linita" del cinturón: para la franja de la tarjeta y el punto del filtro.
export function accentParaCinta(cinta) {
  if (COLOR_CINTA[cinta]) return COLOR_CINTA[cinta].border;
  if (/juvenil/i.test(cinta)) return ACCENT_DAN_JUVENIL;
  if (/cadete/i.test(cinta)) return ACCENT_DAN_CADETE;
  return ACCENT_DAN_ADULTO;
}
