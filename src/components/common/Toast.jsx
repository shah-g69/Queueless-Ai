import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Toast – Auto-dismissing notification bar.
 *
 * Props:
 *   message  – string
 *   type     – "success" | "info" | "error"
 *   duration – ms before auto-close (default 3000)
 *   onClose  – callback
 */
const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const colors = {
    success: { bg: "#22c55e", icon: <CheckCircle2 size={16} className="text-white" /> },
    info: { bg: theme.accent, icon: null },
    error: { bg: "#ef4444", icon: null },
  };
  const c = colors[type] ?? colors.success;

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 shadow-xl transition-all"
      style={{
        background: c.bg,
        color: "#ffffff",
        animation: "toast-in 0.3s ease",
      }}
    >
      {c.icon}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 cursor-pointer text-white/70 hover:text-white">
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
