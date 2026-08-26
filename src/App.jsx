import { useState } from "react";
import Nav from "./components/Nav/Nav";
import CheckIn from "./components/CheckIn/CheckIn";
import StudentsList from "./components/Students/StudentsList";

export default function App() {
  const [pantalla, setPantalla] = useState("registro");

  return (
    <div className="app">
      <Nav active={pantalla} onChange={setPantalla} />
      <main className="app__main">
        {pantalla === "registro" ? <CheckIn /> : <StudentsList />}
      </main>
    </div>
  );
}
