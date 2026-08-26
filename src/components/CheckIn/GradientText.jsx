import { motion, useMotionValue, useAnimationFrame, useTransform } from "motion/react";
import { useRef } from "react";
import styles from "./GradientText.module.css";

export default function GradientText({
  children,
  className = "",
  colors = ["#2B3A55", "#3D8B5F", "#2B3A55"],
  speed = 4,
}) {
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);

  const animationDuration = speed * 1000;

  useAnimationFrame((time) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;
    const cycleTime = elapsedRef.current % (animationDuration * 2);
    if (cycleTime < animationDuration) {
      progress.set((cycleTime / animationDuration) * 100);
    } else {
      progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
    }
  });

  const backgroundPosition = useTransform(progress, (p) => `${p}% 50%`);

  const gradientColors = [...colors, colors[0]].join(", ");
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${gradientColors})`,
    backgroundSize: "300% 100%",
    backgroundRepeat: "repeat",
  };

  return (
    <motion.span className={`${styles.content} ${className}`} style={{ ...gradientStyle, backgroundPosition }}>
      {children}
    </motion.span>
  );
}
