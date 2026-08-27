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

export function colorParaCinta(cinta) {
  if (COLOR_CINTA[cinta]) return COLOR_CINTA[cinta];
  // cualquier variante de Dan cae acá (negro con detalle dorado)
  return { bg: "#26241F", fg: "#E8C567", border: "#0A0A0A" };
}
