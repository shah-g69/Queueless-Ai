import {
  Upload,
  MapPin,
  Sparkles,
  CheckCircle2,
  Plus,
  FileText,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";

/**
 * NextActionItems – Context-aware action items and visit prep steps.
 *
 * Props:
 *   actions        – array of { id, label, badge?, icon?, onClick }
 *   prep           – array of { id, label, icon?, onClick }
 *   documents      – array of { id, label, status } for the task checklist
 *   completed      – boolean, shows "All Tasks Complete" when true
 *   hasApplication – boolean, false shows empty state
 *   onSelectService – callback for empty state button
 */
const NextActionItems = ({
  actions = [],
  prep = [],
  documents = [],
  completed = false,
  hasApplication = true,
  onSelectService = () => {},
}) => {
  const { theme } = useTheme();

  const statusConfig = {
    verified: { variant: "green", label: "Verified", Icon: CheckCircle2, color: "#22c55e" },
    missing: { variant: "yellow", label: "Missing", Icon: AlertTriangle, color: "#eab308" },
    paid: { variant: "green", label: "Paid", Icon: CheckCircle2, color: "#22c55e" },
  };

  const verifiedCount = documents.filter(
    (d) => d.status === "verified" || d.status === "paid",
  ).length;

  return (
    <div className="flex min-w-0 flex-col">
      <h2 className="mb-3 text-base font-bold" style={{ color: theme.text }}>
        Next Action Items
      </h2>
      <Card className="flex-1 overflow-hidden">
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
              <div className="mb-5">
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

            {/* ── Task Checklist ── */}
            {documents.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-bold" style={{ color: theme.text }}>
                  Task Checklist
                </p>
                <div
                  className="flex flex-col gap-1"
                  style={{
                    maxHeight: 260,
                    overflowY: "auto",
                  }}
                >
                  {documents.map((doc) => {
                    const cfg = statusConfig[doc.status] ?? statusConfig.missing;
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5"
                        style={{ background: theme.surfaceAlt }}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                          <FileText size={16} className="shrink-0" style={{ color: theme.textMuted }} />
                          <span
                            className="min-w-0 flex-1 text-sm font-medium leading-snug"
                            style={{
                              color: theme.text,
                              overflowWrap: "break-word",
                              wordBreak: "normal",
                              hyphens: "auto",
                            }}
                          >
                            {doc.label}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {cfg.Icon && <cfg.Icon size={14} style={{ color: cfg.color }} />}
                          <StatusBadge variant={cfg.variant}>{cfg.label}</StatusBadge>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs" style={{ color: theme.textMuted }}>
                  {verifiedCount}/{documents.length} documents ready
                </p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default NextActionItems;
