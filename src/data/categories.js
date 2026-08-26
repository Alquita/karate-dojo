// Categorías tomadas de las planillas reales del dojo (KarateDoMiyazato).
// Los nombres y el orden se pueden ajustar cuando Julio confirme el criterio exacto
// de progresión de su federación (Okinawa Shorin-Ryu Shidokan).

export const KYU_BELTS = [
  "Blanco",
  "Amarillo",
  "Naranja",
  "Celeste",
  "Verde",
  "Azul",
  "Marrón",
];

export const DAN_LEVELS = [
  "Primer Dan",
  "Segundo Dan",
  "Tercer Dan",
  "Cuarto Dan",
  "Quinto Dan",
  "Séptimo Dan",
  "Noveno Dan",
  "Primer Dan Juvenil",
  "Segundo Dan Juvenil",
];

// Une kyu + dan en un solo listado para el filtro de "cinta / categoría"
export const TODAS_LAS_CINTAS = [...KYU_BELTS, ...DAN_LEVELS];

export const GRUPOS = [
  "Menores 6 a 8 años",
  "Menores 9 a 12 años",
  "Juveniles",
  "Mayores",
];

// Color funcional por cinta — no es la paleta de marca, es para que la
// insignia de cada alumno se lea de un vistazo como en un dojo real.
export const COLOR_CINTA = {
  Blanco: { bg: "#F1ECE0", fg: "#514E45", border: "#D9D0BC" },
  Amarillo: { bg: "#F6E4B0", fg: "#7A5A0A", border: "#D4A017" },
  Naranja: { bg: "#F3D2B8", fg: "#8A4218", border: "#C9622B" },
  Celeste: { bg: "#D3E6EF", fg: "#255066", border: "#4C8CB0" },
  Verde: { bg: "#DCE9DC", fg: "#2E4C30", border: "#4B7A4E" },
  Azul: { bg: "#D6DEEC", fg: "#22314F", border: "#35558C" },
  Marrón: { bg: "#E2D3C8", fg: "#4A2F1F", border: "#6B4A34" },
};

export function colorParaCinta(cinta) {
  if (COLOR_CINTA[cinta]) return COLOR_CINTA[cinta];
  // cualquier variante de Dan cae acá (negro con detalle dorado)
  return { bg: "#1C1B19", fg: "#E8D9A8", border: "#1C1B19" };
}
