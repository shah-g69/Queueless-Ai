import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Banknote,
  Lightbulb,
  Bell,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";

export default function AIResultsDashboard({ plan, onFindOffice }) {
  const { theme } = useTheme();

  if (!plan) return null;

  const {
    service = "NADRA Smart CNIC",
    readiness_score = "75%",
    documents_checklist = [],
    missing_critical_info = [],
    step_by_step_plan = [],
    estimated_fee = "PKR 1,500 - PKR 3,000",
    pro_tip = "",
  } = plan;

  const scoreNum = parseInt(readiness_score) || 75;
  const isHighRisk = scoreNum < 60;

  return (
    <div className="mt-6 flex flex-col gap-5">
      {/* ── 1. Top Readiness & Summary Banner ── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-5 border shadow-sm"
        style={{
          background: isHighRisk ? "#fef2f2" : "#f0fdf4",
          borderColor: isHighRisk ? "#fecaca" : "#bbf7d0",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-lg"
            style={{
              background: isHighRisk ? "#ef4444" : "#16a34a",
              color: "#ffffff",
            }}
          >
            {readiness_score}
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: isHighRisk ? "#991b1b" : "#166534" }}>
              {service} — Preparation Blueprint
            </h3>
            <p className="text-xs" style={{ color: isHighRisk ? "#b91c1c" : "#15803d" }}>
              {isHighRisk
                ? "⚠️ High Risk of Counter Rejection: Missing critical requirements"
                : "✅ Good Readiness: Follow the counter roadmap below"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
            style={{
              background: "#6366f118",
              color: "#4f46e5",
            }}
          >
            <Bell size={13} />
            Reminder Agent: Brevo Queued
          </span>
        </div>
      </div>

      {/* ── 2. Critical Roadblock Alert (Red/Amber Box) ── */}
      {missing_critical_info && missing_critical_info.length > 0 && (
        <div
          className="rounded-2xl p-5 border shadow-sm"
          style={{
            background: "#fffbeb",
            borderColor: "#fde68a",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={20} className="text-amber-600" />
            <h4 className="text-sm font-bold text-amber-900">
              Critical Roadblocks — What Is Missing:
            </h4>
          </div>
          <ul className="flex flex-col gap-2 pl-2">
            {missing_critical_info.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-amber-900">
                <span className="font-black text-amber-600">✕</span>
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 3. Two Column Grid: Documents Needed vs Counter Roadmap ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Column A: Document Checklist */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold" style={{ color: theme.text }}>
              📋 What Documents You Need
            </h4>
            <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
              {documents_checklist.length} items
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {documents_checklist.map((doc, idx) => {
              const isMissing = doc.status?.toLowerCase().includes("missing") || doc.status?.toLowerCase().includes("need");
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl p-3 border"
                  style={{
                    background: theme.surfaceAlt,
                    borderColor: isMissing ? "#fca5a5" : theme.border,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {isMissing ? (
                      <XCircle size={17} className="text-red-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />
                    )}
                    <span
                      className="text-xs font-medium leading-snug"
                      style={{ color: isMissing ? "#dc2626" : theme.text }}
                    >
                      {doc.item}
                    </span>
                  </div>
                  <span
                    className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{
                      background: isMissing ? "#fee2e2" : "#dcfce7",
                      color: isMissing ? "#b91c1c" : "#15803d",
                    }}
                  >
                    {isMissing ? "Missing" : "Ready"}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Column B: Step-by-Step Counter Roadmap */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold" style={{ color: theme.text }}>
              🗺️ Step-by-Step Visit Walkthrough
            </h4>
            <button
              onClick={onFindOffice}
              className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline cursor-pointer"
            >
              <MapPin size={12} />
              View Office Map
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {step_by_step_plan.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
                  style={{
                    background: theme.accent,
                    color: "#ffffff",
                  }}
                >
                  {idx + 1}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: theme.text }}>
                  {step.replace(/^Step \d+:\s*/i, "")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 4. Bottom Logistics Bar (Fees & Pro-Tip) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fees */}
        <div
          className="rounded-2xl p-4 border flex items-start gap-3"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Banknote size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Government Fee Tiers:
            </p>
            <p className="text-xs font-bold mt-0.5" style={{ color: theme.accent }}>
              {estimated_fee}
            </p>
          </div>
        </div>

        {/* Pro Tip */}
        <div
          className="rounded-2xl p-4 border flex items-start gap-3"
          style={{
            background: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Lightbulb size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Insider Public Office Hack:
            </p>
            <p className="text-xs font-medium mt-0.5 leading-relaxed" style={{ color: theme.text }}>
              {pro_tip || "Arrive 15 minutes before opening or visit the 24/7 Mega Center in Blue Area after 9 PM to bypass daytime queues."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
