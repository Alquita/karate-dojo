import { useRef, useEffect, useState } from "react";

export default function AnimatedContent({
  children,
  distance = 40,
  direction = "vertical",
  duration = 0.6,
  delay = 0,
  className = "",
  as: Tag = "div",
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const axis = direction === "horizontal" ? "X" : "Y";
  const style = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "none"
      : `translate${axis}(${distance}px)`,
    transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
    willChange: "opacity, transform",
  };

  return (
    <Tag ref={ref} className={className} style={style} {...props}>
      {children}
    </Tag>
  );
}
