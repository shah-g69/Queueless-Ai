import { useTheme } from "../../context/ThemeContext";

/**
 * Card – Theme-aware white rounded card container.
 *
 * Props:
 *   className – additional classes
 *   children  – card content
 *   padding   – custom padding (default "p-5")
 *   onClick   – optional callback; when provided, renders as a clickable button
 */
const Card = ({ className = "", children, padding = "p-5", onClick }) => {
  const { theme } = useTheme();

  const sharedStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.cardShadow,
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`backdrop-blur-sm rounded-2xl ${padding} ${className} cursor-pointer text-left`}
        style={sharedStyle}
      >
        {children}
      </button>
    );
  }
  return (
    <div
      className={`backdrop-blur-sm rounded-2xl ${padding} ${className}`}
      style={sharedStyle}
    >
      {children}
    </div>
  );
};

export default Card;
