import { Bot, ChevronRight, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * ActiveApplicationBanner – Shows active application or empty state.
 *
 * Props:
 *   application    – string or null
 *   hasApplication – boolean
 *   subtitle       – optional
 *   onClick        – callback
 */
const ActiveApplicationBanner = ({
  application = "NADRA CNIC Address Update",
  hasApplication = true,
  subtitle,
  onClick = () => {},
}) => {
  const { theme } = useTheme();

  const defaultSubtitle = hasApplication
    ? "Your preparation is being guided by 4 AI agents"
    : "Select a service from Quick Access Hub to start a new plan";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-all hover:border-teal-500 hover:shadow-md"
      style={{
        background: hasApplication ? theme.accent + "10" : theme.surfaceAlt,
        border: `1px solid ${hasApplication ? theme.accent + "30" : theme.border}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: hasApplication ? theme.accent + "20" : theme.border,
          }}
        >
          {hasApplication ? (
            <Bot size={16} style={{ color: theme.accent }} />
          ) : (
            <Plus size={16} style={{ color: theme.textMuted }} />
          )}
        </div>
        <div>
          <p
            className="text-xs font-semibold"
            style={{ color: theme.textMuted }}
          >
            {hasApplication ? "Active Application" : "No Active Application"}
          </p>
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: hasApplication ? theme.text : theme.textMuted }}
          >
            {hasApplication ? application : "Select a Public Service"}
          </p>
          <p className="text-[11px]" style={{ color: theme.textMuted }}>
            {subtitle ?? defaultSubtitle}
          </p>
        </div>
      </div>
      <ChevronRight
        size={16}
        style={{ color: hasApplication ? theme.accent : theme.textMuted }}
      />
    </div>
  );
};

export default ActiveApplicationBanner;
