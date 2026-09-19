import { useState } from "react";
import {
  FileText,
  CreditCard,
  Shield,
  DoorOpen,
  Hash,
  Fingerprint,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";

const PHASES = [
  {
    id: 1,
    title: "Phase 1 — Pre-Visit Preparation",
    subtitle: "Gather verified originals + copies",
    color: "#0d9488",
    steps: [
      { id: "p1s1", label: "Gather verified originals", icon: FileText, detail: "CNIC, Passport Photos, Proof of Address — originals + 2 photocopies each" },
      { id: "p1s2", label: "Confirm fee payment receipt", icon: CreditCard, detail: "PKR 1,500 paid via online portal — save transaction ID" },
      { id: "p1s3", label: "AI document audit passed", icon: Shield, detail: "All documents verified by Missing Info Agent" },
    ],
  },
  {
    id: 2,
    title: "Phase 2 — Desk Execution",
    subtitle: "Enter via Gate 2 → Token Counter → Biometric Desk 4",
    color: "#2563eb",
    steps: [
      { id: "p2s1", label: "Enter via Gate 2", icon: DoorOpen, detail: "Main entrance for CNIC services — arrive 15 min early" },
      { id: "p2s2", label: "Collect token at Counter", icon: Hash, detail: "Show appointment confirmation. Token will be printed automatically." },
      { id: "p2s3", label: "Biometric capture at Desk 4", icon: Fingerprint, detail: "Fingerprints + photo. Ensure hands are clean and dry." },
    ],
  },
  {
    id: 3,
    title: "Phase 3 — Tracking & Follow-up",
    subtitle: "Save Tracking Token SMS",
    color: "#7c3aed",
    steps: [
      { id: "p3s1", label: "Save tracking token SMS", icon: MessageSquare, detail: "You'll receive an SMS with tracking ID — save it immediately" },
      { id: "p3s2", label: "Monitor processing status", icon: Clock, detail: "Check status in the app every 2-3 working days" },
      { id: "p3s3", label: "Collect updated CNIC", icon: CheckCircle2, detail: "Usually ready within 7 working days. Bring old CNIC for collection." },
    ],
  },
];

const VisitRoadmap = ({ open, onClose }) => {
  const { theme } = useTheme();
  const [activePhase, setActivePhase] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (stepId) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const currentPhase = PHASES.find((p) => p.id === activePhase);
  const totalSteps = PHASES.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = completedSteps.size;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Step-by-Step Visit Roadmap"
      width="max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Progress header */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold" style={{ color: theme.textMuted }}>
              Overall Progress
            </p>
            <p className="text-xs font-bold" style={{ color: theme.accent }}>
              {doneSteps}/{totalSteps} steps
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: theme.surfaceAlt }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(doneSteps / totalSteps) * 100}%`,
                background: theme.accent,
              }}
            />
          </div>
        </div>

        {/* Phase tabs */}
        <div className="flex gap-2">
          {PHASES.map((phase) => {
            const isActive = activePhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className="flex-1 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer"
                style={{
                  background: isActive ? phase.color + "15" : theme.surfaceAlt,
                  border: `1.5px solid ${isActive ? phase.color : theme.border}`,
                }}
              >
                <p
                  className="text-[11px] font-bold"
                  style={{ color: isActive ? phase.color : theme.textMuted }}
                >
                  Phase {phase.id}
                </p>
                <p
                  className="mt-0.5 text-[10px]"
                  style={{ color: isActive ? theme.text : theme.textMuted }}
                >
                  {phase.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active phase steps */}
        {currentPhase && (
          <div className="flex flex-col gap-0">
            <p
              className="mb-3 text-sm font-bold"
              style={{ color: theme.text }}
            >
              {currentPhase.title}
            </p>
            {currentPhase.steps.map((step, i) => {
              const isDone = completedSteps.has(step.id);
              const isLast = i === currentPhase.steps.length - 1;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex gap-3">
                  {/* Timeline column */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer"
                      style={{
                        background: isDone
                          ? currentPhase.color + "20"
                          : theme.surfaceAlt,
                        border: `2px solid ${isDone ? currentPhase.color : theme.border}`,
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} style={{ color: currentPhase.color }} />
                      ) : (
                        <StepIcon size={14} style={{ color: theme.textMuted }} />
                      )}
                    </button>
                    {!isLast && (
                      <div
                        className="w-0.5 flex-1 my-1"
                        style={{
                          background: isDone ? currentPhase.color + "40" : theme.border,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className="text-sm font-bold"
                        style={{
                          color: isDone ? currentPhase.color : theme.text,
                          textDecoration: isDone ? "line-through" : "none",
                          opacity: isDone ? 0.7 : 1,
                        }}
                      >
                        {step.label}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Phase navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePhase((p) => Math.max(1, p - 1))}
            disabled={activePhase === 1}
            className="text-xs font-semibold cursor-pointer disabled:opacity-30"
            style={{ color: theme.accent }}
          >
            ← Previous Phase
          </button>
          {activePhase < 3 ? (
            <button
              onClick={() => setActivePhase((p) => Math.min(3, p + 1))}
              className="flex items-center gap-1 text-xs font-semibold cursor-pointer"
              style={{ color: theme.accent }}
            >
              Next Phase <ChevronRight size={14} />
            </button>
          ) : (
            <span
              className="text-xs font-bold"
              style={{ color: "#22c55e" }}
            >
              {doneSteps === totalSteps
                ? "✓ All steps complete!"
                : `${totalSteps - doneSteps} steps remaining`}
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VisitRoadmap;
