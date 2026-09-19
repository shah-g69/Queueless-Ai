import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Modal – Theme-aware overlay modal rendered via React Portal.
 *
 * Props:
 *   open      – boolean
 *   onClose   – callback
 *   title     – string
 *   children  – modal body
 *   width     – max-width class (default "max-w-lg")
 */
const Modal = ({ open, onClose, title, children, width = "max-w-lg" }) => {
  const { theme } = useTheme();

  /* ── ESC to close ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* ── Lock body scroll when modal is open ── */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`${width} w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl`}
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 mb-4 flex items-center justify-between" style={{ background: theme.surface }}>
          <h3 className="text-lg font-bold" style={{ color: theme.text }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer"
            style={{ color: theme.textMuted }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
