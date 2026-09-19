import { Upload, MapPin, Sparkles, CheckCircle2, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";
import Button from "../common/Button";

/**
 * NextActionItems – Context-aware action items and visit prep steps.
 *
 * Props:
 *   actions        – array of { id, label, badge?, icon?, onClick }
 *   prep           – array of { id, label, icon?, onClick }
 *   completed      – boolean, shows "All Tasks Complete" when true
 *   hasApplication – boolean, false shows empty state
 *   onSelectService – callback for empty state button
 */
const NextActionItems = ({
  actions = [],
  prep = [],
  completed = false,
  hasApplication = true,
  onSelectService = () => {},
}) => {
  const { theme } = useTheme();

  return (
    <div>
      <h2 className="mb-3 text-base font-bold" style={{ color: theme.text }}>
        Next Action Items
      </h2>
      <Card>
        {/* ── No Application state ── */}
        {!hasApplication && (
          <div className="flex flex-col items-center py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full mb-3"
              style={{ background: theme.surfaceAlt }}
            >
              <Plus size={24} style={{ color: theme.textMuted }} />
            </div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              No Active Application
            </p>
            <p className="mt-1 mb-3 text-xs" style={{ color: theme.textMuted }}>
              Select a public service to get started
            </p>
            <Button
              variant="teal"
              icon={<Plus size={14} />}
              onClick={onSelectService}
              className="hover:opacity-90 active:scale-95"
            >
              Select a Public Service
            </Button>
          </div>
        )}

        {/* ── All Tasks Complete state ── */}
        {hasApplication && completed && (
          <div className="flex flex-col items-center py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full mb-3"
              style={{ background: "#22c55e18" }}
            >
              <CheckCircle2 size={28} style={{ color: "#22c55e" }} />
            </div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              All Tasks Complete
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
              All required actions have been fulfilled
            </p>
          </div>
        )}

        {/* ── Normal state ── */}
        {hasApplication && !completed && (
          <>
            {actions.length > 0 && (
              <div className="mb-5">
                <p className="mb-2 text-sm font-bold" style={{ color: theme.text }}>
                  Action Required
                </p>
                <div className="flex flex-col gap-2">
                  {actions.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1.5">
                      <Button
                        variant="primary"
                        icon={item.icon}
                        className="w-full"
                        onClick={item.onClick}
                      >
                        {item.label}
                      </Button>
                      {item.badge && (
                        <span
                          className="flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: theme.accent + "18", color: theme.accent }}
                        >
                          <Sparkles size={10} />
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {prep.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-bold" style={{ color: theme.text }}>
                  Visit Preparation
                </p>
                <div className="flex flex-col gap-2">
                  {prep.map((item) => (
                    <Button
                      key={item.id}
                      variant="teal"
                      icon={item.icon ?? <MapPin size={16} />}
                      className="w-full"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default NextActionItems;
