import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Sun, Moon, Eclipse } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * ThemeToggle – Dropdown to switch between Light / Dark / Midnight themes.
 */
const ThemeToggle = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = [
    { key: "light", label: "Light", Icon: Sun },
    { key: "dark", label: "Dark", Icon: Moon },
    { key: "midnight", label: "Midnight Blue", Icon: Eclipse },
  ];

  const current = options.find((o) => o.key === mode);
  const CurrentIcon = current.Icon;

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
        style={{
          borderColor: theme.border,
          background: theme.surfaceAlt,
          color: theme.text,
        }}
      >
        <CurrentIcon size={15} />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border py-1 shadow-lg"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          {options.map((opt) => {
            const OptIcon = opt.Icon;
            return (
              <button
                key={opt.key}
                onClick={() => {
                  toggleTheme(opt.key);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                style={{
                  color: mode === opt.key ? theme.accent : theme.text,
                  background:
                    mode === opt.key ? `${theme.accent}15` : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    mode === opt.key ? `${theme.accent}25` : theme.surfaceAlt;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    mode === opt.key ? `${theme.accent}15` : "transparent";
                }}
              >
                <OptIcon size={16} />
                <span>{opt.label}</span>
                {mode === opt.key && (
                  <Check size={16} className="ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
