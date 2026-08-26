import { useRef, useEffect, useState } from "react";

export default function FadeContent({
  children,
  duration = 0.8,
  delay = 0,
  blur = false,
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

  const style = {
    opacity: visible ? 1 : 0,
    filter: blur ? (visible ? "blur(0px)" : "blur(8px)") : "none",
    transition: `opacity ${duration}s ease ${delay}s, filter ${duration}s ease ${delay}s`,
    willChange: "opacity, filter",
  };

  return (
    <Tag ref={ref} className={className} style={style} {...props}>
      {children}
    </Tag>
  );
}
