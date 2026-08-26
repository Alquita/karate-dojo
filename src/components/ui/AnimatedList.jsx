import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import "./AnimatedList.css";

function AnimatedItem({ children, delay = 0, index, onMouseEnter, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.85, opacity: 0, y: 20 }}
      animate={
        inView
          ? { scale: 1, opacity: 1, y: 0 }
          : { scale: 0.85, opacity: 0, y: 20 }
      }
      transition={{ duration: 0.3, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AnimatedList({
  items = [],
  onItemSelect,
  className = "",
  itemClassName = "",
  animationDelay = 0.04,
  children,
}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleItemMouseEnter = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback(
    (item, index) => {
      setSelectedIndex(index);
      if (onItemSelect) onItemSelect(item, index);
    },
    [onItemSelect]
  );

  const content = children || items;

  return (
    <div className={`animated-list ${className}`}>
      {Array.isArray(content)
        ? content.map((item, index) => (
            <AnimatedItem
              key={item?.key ?? index}
              delay={index * animationDelay}
              index={index}
              onMouseEnter={() => handleItemMouseEnter(index)}
              onClick={() => handleItemClick(item, index)}
            >
              <div
                className={`animated-list__item ${
                  selectedIndex === index ? "animated-list__item--selected" : ""
                } ${itemClassName}`}
              >
                {typeof item === "string" ? <p>{item}</p> : item}
              </div>
            </AnimatedItem>
          ))
        : content}
    </div>
  );
}
