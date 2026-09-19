import { useTheme } from "../../context/ThemeContext";

/**
 * StatusBadge – Theme-aware coloured badge for task status.
 *
 * Props:
 *   variant  – "green" | "blue" | "yellow" | "gray"
 *   children – badge text
 *   className – extra classes
 */
const StatusBadge = ({ variant = "green", children, className = "" }) => {
  const { theme } = useTheme();
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

  const palette = {
    green: { bg: "#dcfce7", text: "#166534" },
    blue: { bg: theme.accent + "20", text: theme.accent },
    yellow: { bg: "#fef9c3", text: "#854d0e" },
    gray: {
      bg: theme.surfaceAlt,
      text: theme.textMuted,
    },
  };

  const c = palette[variant] ?? palette.green;

  return (
    <span
      className={`${base} ${className}`}
      style={{ background: c.bg, color: c.text }}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
