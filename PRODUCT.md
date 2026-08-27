# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Julio — el instructor / profesor del dojo.** Usuario principal y único operador. Carga y edita alumnos, revisa quién asiste y con qué frecuencia, mira las planillas y los promedios de asistencia, y registra exámenes de grado y promociones de cinturón. Trabaja desde su propia computadora, entre clases o al terminar. Sin login por ahora — un solo usuario de confianza.
- **Los alumnos — secundario, contacto mínimo.** Edades de ~6 años a adultos, repartidos en cuatro grupos por edad. Su única interacción es el **auto check-in en una tablet / tótem en la entrada del dojo**: llegan, escriben su número de documento, ven una bienvenida con su asistencia de la semana, y siguen.

## Product Purpose

Reemplazar las planillas de asistencia escritas a mano del dojo por un sistema digital. El alumno ficha solo al entrar; el instructor obtiene el historial de asistencia, el seguimiento de la meta semanal y promedios calculados por alumno, más un lugar para registrar exámenes y promociones de cinturón. Éxito = Julio deja de llevar planillas en papel y puede ver de un vistazo quién está asistiendo, quién está listo para examen, y la asistencia clase por clase.

## Positioning

Es la herramienta propia del dojo, calcada de su estructura federativa real (Okinawa Shorin-Ryu Shidokan — KarateDoMiyazato, Hombu Dojo Córdoba). Las categorías de cinturón (kyu + dan) y los grupos por edad son los reales, tomados de las planillas del dojo. A diferencia de un check-in de gimnasio genérico, habla el idioma del dojo —cinturones, katas, grupos por edad, exámenes de grado— y su modelo de datos sigue la progresión de la federación.

## Operating Context

- **Estación de check-in:** una tablet o computadora en la entrada del dojo. El alumno llega, tipea su documento, ve una confirmación con su asistencia de la semana. Rápido, legible a distancia, en un pasillo con luz variable (existen temas claro y oscuro).
- **Panel del instructor:** Julio en su computadora. Recorre la lista de alumnos (agrupada por grupo de edad, filtrable por cinturón), abre un alumno para ver la ficha completa y sus notas privadas, consulta la planilla de asistencia individual o grupal (grilla semanal / mensual / anual), y da de alta alumnos nuevos con un formulario completo.
- **Datos de origen:** las planillas escritas a mano del dojo y un Excel que Julio va a pasar. Los alumnos se cargan en lote desde ahí, no se tipean de a uno.
- **Federación real:** Okinawa Shorin-Ryu Shidokan. La organización tiene un sitio público (miyazatodojo.com) y una "Plataforma Instructores" aparte.

## Capabilities and Constraints

**Confirmado y ya construido:**
- Auto check-in de asistencia por número de documento. Un registro por alumno por día; fichar dos veces el mismo día no hace nada.
- ABM de alumnos: alta por formulario completo, baja (borrado lógico), notas privadas por alumno.
- Lista de alumnos agrupada por grupo, filtrable por cinturón y grupo.
- Planilla de asistencia individual (grilla semanal / mensual / anual) y planilla grupal.
- Anillo de meta semanal y promedio de asistencia calculado por alumno.

**Confirmado en alcance, modelado parcialmente:**
- Exámenes de cinturón y promociones — registrar exámenes rendidos, aprobación, cambio de cinta, historial de graduaciones. Hoy solo existen los campos informativos `próximo examen` / `último examen`; la feature real de exámenes es trabajo futuro para el que el diseño debe dejar lugar.

**Restricciones técnicas:**
- Una sola capa de datos: `src/lib/dataClient.js` (6 funciones async). Hoy es mock en memoria (modo demo, no persiste nada); la implementación Supabase está escrita y comentada, lista para activar.
- Backend: proyecto Supabase `miyazato-dojo` (São Paulo). Tablas `alumnos`, `asistencias` (única por alumno+fecha), `notas`; vista `alumnos_resumen` calcula asistencia total / semanal / promedio. RLS abierto a la anon key (MVP sin login).
- Sin autenticación todavía; un único usuario de confianza.
- Stack: React 19 + Vite 8 + CSS Modules; `motion` y `gsap` disponibles; lint con oxlint.
- Idioma: español (Argentina) en toda la interfaz.

**Terminología:** alumno, cinta / cinturón (kyu: Blanco…Marrón; dan: Primer Dan…), grupo (Menores 6 a 8, Menores 9 a 12, Juveniles, Mayores), grado, examen, planilla, asistencia, meta semanal.

**Campos por alumno:** documento, nombre, apellido, fecha de nacimiento, sexo, ocupación, grupo, cinturón, email, dirección, teléfono, fecha de ingreso al dojo, observaciones generales / médicas.

**Explícitamente sin decidir:** multi-instructor y autenticación (por ahora un solo usuario); modelo de datos definitivo de exámenes; destino de despliegue.

## Brand Commitments

- **Nombre:** KarateDoMiyazato. Línea federativa: "Okinawa Shorin-Ryu Shidokan". "Hombu Dojo Córdoba Argentina". Lema: "…Sin Fronteras".
- **Logo:** flor de sakura (cerezo) con una "K" roja y contorno amarillo. Asset en `public/logo.png` (recortado, fondo transparente).
- **Foto:** Sensei Masatoshi Miyazato con alumnos, bajo la cúpula del dojo. Asset en `public/dojo.jpg`.
- **Subtítulo en la app:** "Panel del profesor".
- **Incumbente (implementación actual, no fijada como intocable):** paleta rojo karate (#D3202A) / negro / crema, con colores funcionales por cinturón; tipografías Shippori Mincho (display), IBM Plex Sans (texto), IBM Plex Mono (números). Es el sistema visual existente; una redefinición visual se decide en new-work, no acá.

## Evidence on Hand

- **Real:** categorías de cinturón y grupos por edad del dojo (de planillas fotografiadas); logo y foto del dojo (`public/`); el sitio público de la organización y su plataforma de instructores como referencia (capturas aportadas por el usuario).
- **Placeholder / a reemplazar:** los 10 alumnos de muestra en `src/data/mockStudents.js` son ficticios a propósito — los nombres reales vienen del Excel de Julio, todavía no entregado. No hay datos de asistencia reales aún.
- **No inventar:** alumnos, asistencias, testimonios, métricas, cantidad de alumnos del dojo, precios ni afirmaciones de despliegue.

## Product Principles

1. **Paridad con la planilla de papel primero.** La planilla digital tiene que ser al menos tan rápida y legible como la hoja escrita a mano que reemplaza.
2. **El check-in es un acto de 3 segundos.** Un alumno en la entrada tipea un número y se va: cero fricción, confirmación legible de un vistazo.
3. **Hablar dojo, no gimnasio.** Cinturones, grados, katas, grupos por edad; la estructura real de la federación, no fitness genérico.
4. **La pregunta del instructor es "quién y cada cuánto".** Toda vista responde frecuencia de asistencia, avance de meta semanal y cercanía a examen de un vistazo.
5. **Una sola costura de datos.** Toda la persistencia pasa por `dataClient.js`; la UI nunca sabe si es mock o Supabase.

## Accessibility & Inclusion

- El check-in corre en un dispositivo compartido en la entrada, usado por alumnos desde ~6 años hasta adultos: objetivos táctiles grandes, campo de documento grande y legible, confirmación de alto contraste, funcional con luz de pasillo variable (existen temas claro y oscuro).
- Español (Argentina) en toda la interfaz.
