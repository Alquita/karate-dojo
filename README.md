# KarateDoMiyazato — panel del profesor

Proyecto real (no mockup) del sistema para el dojo. Arranca con dos pantallas
funcionando sobre datos de muestra, listas para conectar a Supabase apenas
tengas el proyecto creado y el excel de Julio.

## Correrlo

```
npm install
npm run dev
```

## Cómo está armado

- `src/data/categories.js` — cintas (kyu y dan) y grupos reales, sacados de
  las planillas del dojo. Ajustá el orden/nombres cuando Julio confirme el
  criterio exacto de su federación.
- `src/data/mockStudents.js` — 10 alumnos **ficticios** de prueba, repartidos
  en los grupos y cintas reales. Cuando tengas el excel real, se reemplaza
  con el mismo patrón que ya usás en Summer Gym (openpyxl + supabase-py).
- `src/lib/dataClient.js` — toda la app lee y escribe alumnos a través de
  este archivo. Hoy trabaja sobre el mock en memoria; el día que conectes
  Supabase, es el único lugar que hay que tocar (mismas funciones, mismos
  parámetros, ahora contra la base real en vez del array).
- `src/lib/supabaseClient.js` — placeholder listo para cuando crees el
  proyecto en supabase.com. Instrucciones en el propio archivo.
- `src/components/CheckIn/` — pantalla 1: registro de asistencia por
  documento, con la línea de tiempo semanal y el anillo de porcentaje.
- `src/components/Students/` — pantalla 2: alumnos, con los dos filtros
  (cinta y grupo), alta, baja y notas.

## Próximos pasos

1. Crear el proyecto en Supabase y armar las tablas `alumnos`, `asistencias`
   y `examenes` (o similar) reflejando la forma de los objetos en
   `mockStudents.js`.
2. Reescribir las funciones de `dataClient.js` para que hagan `select` /
   `insert` / `update` contra Supabase en vez de tocar el array en memoria.
3. Armar el script de importación del excel de Julio (mismo patrón que
   Summer Gym) para la carga inicial real de alumnos.
4. Definir con Julio el sistema de puntaje por participación para
   habilitar exámenes de dan que se ve en sus planillas — todavía no está
   modelado acá.
