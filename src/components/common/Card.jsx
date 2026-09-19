import { useTheme } from "../../context/ThemeContext";

/**
 * Card – Theme-aware white rounded card container.
 *
 * Props:
 *   className – additional classes
 *   children  – card content
 *   padding   – custom padding (default "p-5")
 */
const Card = ({ className = "", children, padding = "p-5" }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-2xl ${padding} ${className}`}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.cardShadow,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
