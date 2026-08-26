const TABS = [
  { id: "registro", label: "Registro de asistencia" },
  { id: "alumnos", label: "Alumnos" },
];

export default function Nav({ active, onChange }) {
  return (
    <nav className="nav">
      <div className="nav__brand">
        <svg className="nav__brand-mark" viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M20 4 C 29.4 4 37 11.4 37 20.6 C 37 29.6 29.6 37 20.4 37 C 12 37 5 30.6 4.2 22.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <p className="nav__brand-title">KarateDoMiyazato</p>
          <p className="nav__brand-sub">Panel del profesor</p>
        </div>
      </div>
      <div className="nav__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav__tab ${active === tab.id ? "nav__tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
