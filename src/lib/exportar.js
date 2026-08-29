// Exportaciones. El reporte de activos sale en el mismo formato que el Excel que
// Julio pasa cada mes a la federación (Numero · Ape. · Nom. · Cat. Reporte · Cat. Actual).
// Se arma como una tabla HTML con mimetype de Excel: abre en Excel/LibreOffice con
// título y encabezados, sin ninguna librería.

import { MESES_LARGO } from "../utils/dates";
import { categoriaFederacion } from "../data/categories";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// [Numero, Apellido, Nombre, Cat. Reporte, Cat. Actual] — activos, ordenado por apellido.
export function filasActivos(students) {
  return [...students]
    .filter((s) => s.activo !== false)
    .sort((a, b) =>
      `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, "es")
    )
    .map((s, i) => {
      const cat = categoriaFederacion(s.cinta);
      return [i + 1, s.apellido || "", s.nombre || "", cat, cat];
    });
}

export function descargarXLS(nombreArchivo, { titulo, encabezados, filas }) {
  const cols = encabezados.length;
  const thead = `<tr>${encabezados
    .map(
      (h) =>
        `<th style="background:#1C1B19;color:#fff;font-weight:bold;border:1px solid #999;padding:4px 8px">${esc(h)}</th>`
    )
    .join("")}</tr>`;
  const tbody = filas
    .map(
      (fila) =>
        `<tr>${fila
          .map((c) => `<td style="border:1px solid #ccc;padding:3px 8px">${esc(c)}</td>`)
          .join("")}</tr>`
    )
    .join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">
<tr><td colspan="${cols}" style="font-size:14px;font-weight:bold;text-align:center;padding:6px">${esc(titulo)}</td></tr>
<tr>${Array.from({ length: cols }, () => "<td></td>").join("")}</tr>
${thead}
${tbody}
</table></body></html>`;

  const blob = new Blob(["﻿" + html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo.endsWith(".xls") ? nombreArchivo : `${nombreArchivo}.xls`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportarActivos(students, anio, mes) {
  const mesNombre = MESES_LARGO[mes - 1];
  descargarXLS(`Activos ${mesNombre} ${anio}`, {
    titulo: `Alumnos activos — ${mesNombre} ${anio}`,
    encabezados: ["Numero", "Ape. Alumno", "Nom. Alumno", "Cat. Reporte", "Cat. Actual"],
    filas: filasActivos(students),
  });
}
