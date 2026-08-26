import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./BounceCards.css";

export default function BounceCards({
  className = "",
  children = [],
  animationDelay = 0.3,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bounce-card",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  return (
    <div ref={containerRef} className={`bounce-cards ${className}`}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} className="bounce-card">
              {child}
            </div>
          ))
        : <div className="bounce-card">{children}</div>}
    </div>
  );
}
