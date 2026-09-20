import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";

/**
 * CurrentTasks – AI Document Audit Matrix.
 *
 * Props:
 *   documents      – array of { id, label, status }
 *   hasApplication – boolean
 */
const CurrentTasks = ({
  documents = [],
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
    <div className="flex min-w-0 flex-col">
      <h2 className="mb-3 text-base font-bold" style={{ color: theme.text }}>
        Current Tasks
      </h2>
      <Card className="flex-1 overflow-hidden">
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
            {/* AI Document Audit Matrix — internal scroll keeps card within viewport */}
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

            {/* Summary */}
            <p className="mt-3 text-xs" style={{ color: theme.textMuted }}>
              {verifiedCount}/{documents.length} documents ready
            </p>
          </>
        )}
      </Card>
    </div>
  );
};

export default CurrentTasks;
