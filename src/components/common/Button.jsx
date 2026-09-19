import { useTheme } from "../../context/ThemeContext";

/**
 * Button – Theme-aware button with hover/active feedback.
 *
 * Props:
 *   variant   – "primary" | "teal" | "ghost" (default "primary")
 *   icon      – optional JSX icon element rendered before label
 *   children  – button text
 *   className – extra classes
 *   ...rest   – forwarded native button props
 */
const Button = ({
  variant = "primary",
  icon,
  children,
  className = "",
  ...rest
}) => {
  const { theme } = useTheme();
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 cursor-pointer select-none whitespace-nowrap hover:opacity-90 active:scale-95";

  const variantStyles = {
    primary: {
      background: "#22c55e",
      color: "#ffffff",
      hoverBg: "#16a34a",
    },
    teal: {
      background: theme.accent,
      color: theme.accentText,
      hoverBg: theme.accentHover,
    },
    ghost: {
      background: theme.surfaceAlt,
      color: theme.text,
      hoverBg: theme.border,
    },
  };

  const v = variantStyles[variant] ?? variantStyles.primary;

  return (
    <button
      className={`${base} ${className}`}
      style={{ background: v.background, color: v.color }}
      onMouseEnter={(e) => (e.currentTarget.style.background = v.hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = v.background)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
