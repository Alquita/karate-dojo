import styles from "./Spinner.module.css";

export default function Spinner({ size = 56 }) {
  return (
    <span className={styles.spinner} style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50" width={size} height={size}>
        <circle
          className={styles.track}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
        <circle
          className={styles.arc}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="90 150"
        />
      </svg>
    </span>
  );
}
