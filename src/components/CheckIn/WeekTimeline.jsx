import { DIA_CORTO, semanaActual, toISODate, esMismoDia } from "../../utils/dates";

export default function WeekTimeline({ historial }) {
  const dias = semanaActual();
  const hoyISO = toISODate(new Date());

  return (
    <div className="week-timeline">
      {dias.map((dia, i) => {
        const iso = toISODate(dia);
        const asistio = historial.includes(iso);
        const esHoy = esMismoDia(dia, new Date());
        const esFuturo = iso > hoyISO;

        return (
          <div key={iso} className="week-timeline__day">
            <span className="week-timeline__label">{DIA_CORTO[i]}</span>
            <span
              className={[
                "week-timeline__dot",
                asistio ? "week-timeline__dot--check" : "",
                esFuturo ? "week-timeline__dot--futuro" : "",
                esHoy ? "week-timeline__dot--hoy" : "",
              ].join(" ")}
            >
              {asistio ? (
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
