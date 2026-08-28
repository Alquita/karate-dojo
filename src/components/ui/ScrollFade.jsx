import { useRef, useState, useCallback, useEffect } from "react";
import styles from "./ScrollFade.module.css";

/* Contenedor con scroll y degradados arriba/abajo que aparecen segun
   cuanto scrolleaste. Inspirado en el AnimatedList de React Bits, adaptado
   a la paleta del dojo. */
export default function ScrollFade({ children, className = "", maxHeight = 440 }) {
  const ref = useRef(null);
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);

  const recalcular = useCallback((el) => {
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const hayScroll = scrollHeight - clientHeight > 1;
    setTop(Math.min(scrollTop / 36, 1));
    const distanciaAbajo = scrollHeight - (scrollTop + clientHeight);
    setBottom(hayScroll ? Math.min(distanciaAbajo / 36, 1) : 0);
  }, []);

  const onScroll = useCallback((e) => recalcular(e.currentTarget), [recalcular]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    recalcular(el);
    const ro = new ResizeObserver(() => recalcular(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, [recalcular, children]);

  return (
    <div className={styles.wrap}>
      <div
        ref={ref}
        className={`${styles.scroll} ${className}`}
        style={maxHeight ? { maxHeight } : { maxHeight: "none", overflowY: "visible" }}
        onScroll={onScroll}
      >
        {children}
      </div>
      <div className={styles.fadeTop} style={{ opacity: top }} aria-hidden="true" />
      <div className={styles.fadeBottom} style={{ opacity: bottom }} aria-hidden="true" />
    </div>
  );
}
