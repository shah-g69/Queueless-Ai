import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Inbox,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";

/**
 * CurrentTasks – AI Document Audit Matrix with agent insight.
 *
 * Props:
 *   documents      – array of { id, label, status }
 *   insight        – { message }
 *   hasApplication – boolean
 */
const CurrentTasks = ({
  documents = [],
  insight = { message: "" },
  hasApplication = true,
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
    <div>
      <h2 className="mb-3 text-base font-bold" style={{ color: theme.text }}>
        Current Tasks
      </h2>
      <Card>
        {/* ── Empty state ── */}
        {!hasApplication || documents.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full mb-3"
              style={{ background: theme.surfaceAlt }}
            >
              <Inbox size={24} style={{ color: theme.textMuted }} />
            </div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              No Active Tasks
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
              Start an application to see your document audit
            </p>
          </div>
        ) : (
          <>
            {/* AI Document Audit Matrix */}
            <div className="mb-4 flex flex-col gap-1">
              {documents.map((doc) => {
                const cfg = statusConfig[doc.status] ?? statusConfig.missing;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5"
                    style={{ background: theme.surfaceAlt }}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} style={{ color: theme.textMuted }} />
                      <span className="text-sm font-medium" style={{ color: theme.text }}>
                        {doc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {cfg.Icon && <cfg.Icon size={14} style={{ color: cfg.color }} />}
                      <StatusBadge variant={cfg.variant}>{cfg.label}</StatusBadge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <p className="mb-3 text-xs" style={{ color: theme.textMuted }}>
              {verifiedCount}/{documents.length} documents ready
            </p>

            {/* AI Agent Insight */}
            {insight && (
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: theme.accent + "10", border: `1px solid ${theme.accent}25` }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: theme.accent + "20" }}
                >
                  <Bot size={16} style={{ color: theme.accent }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: theme.accent }}>
                    AI Agent Insight
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: theme.text }}>
                    {insight.message}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default CurrentTasks;
