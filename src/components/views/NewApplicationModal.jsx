import { useState } from "react";
import {
  CreditCard,
  FileText,
  Car,
  Home,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";

const SERVICES = [
  { id: "cnic", label: "NADRA Smart CNIC", desc: "CNIC Renewal, Lost Card, New 18+", icon: CreditCard },
  { id: "passport", label: "Passport Application", desc: "Directorate of Passports Renewal / Urgent", icon: FileText },
  { id: "license", label: "Driving License", desc: "Traffic Police Learner / Permanent", icon: Car },
  { id: "property", label: "Property Registration", desc: "Transfer & Title Deed", icon: Home },
  { id: "education", label: "Education Certificates", desc: "Attestation & Verification", icon: GraduationCap },
];

const DEMO_PRESETS = [
  { label: "Lost CNIC (Going Alone)", text: "Lost CNIC, no birth certificate, going alone", serviceId: "cnic" },
  { label: "CNIC Renewal After Expiry", text: "Renewal of CNIC after expiry, details unchanged", serviceId: "cnic" },
  { label: "Urgent Passport Renewal", text: "Passport expiring next month, need urgent renewal", serviceId: "passport" },
  { label: "Driving License 42-day", text: "42 days passed since learner permit, need permanent test", serviceId: "license" },
];

const NewApplicationModal = ({ open, onClose, onStartApplication = () => {}, isAnalyzing = false }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState("cnic");
  const [situation, setSituation] = useState("Lost CNIC, no birth certificate, going alone");

  const handleStart = () => {
    if (!selected) return;
    const service = SERVICES.find((s) => s.id === selected) || SERVICES[0];
    onStartApplication(service, situation);
  };

  const handleApplyPreset = (preset) => {
    setSelected(preset.serviceId);
    setSituation(preset.text);
  };

  return (
    <Modal open={open} onClose={() => { onClose(); }} title="QueueLess AI — Start New Application" width="max-w-xl">
      <div className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>
            1. Select Public Service:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              const isActive = selected === svc.id;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setSelected(svc.id)}
                  className="flex items-center gap-3 rounded-xl p-3 text-left transition-all cursor-pointer"
                  style={{
                    background: isActive ? theme.accent + "18" : theme.surfaceAlt,
                    border: `1.5px solid ${isActive ? theme.accent : theme.border}`,
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: isActive ? theme.accent : theme.border }}
                  >
                    <Icon size={18} style={{ color: isActive ? "#ffffff" : theme.textMuted }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: isActive ? theme.accent : theme.text }}>
                      {svc.label}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: theme.textMuted }}>{svc.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Demo Chips */}
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>
            Quick Demo Scenarios (One-Click Test):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-all hover:opacity-80 cursor-pointer"
                style={{
                  background: situation === preset.text ? theme.accent : theme.surfaceAlt,
                  color: situation === preset.text ? "#ffffff" : theme.textMuted,
                  border: `1px solid ${theme.border}`,
                }}
              >
                ⚡ {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Situation Input */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>
            2. Describe Citizen Situation & Current Documents:
          </label>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={3}
            placeholder="e.g. Lost CNIC, have photocopy, father is abroad, need urgent card..."
            className="w-full rounded-xl p-3 text-xs leading-relaxed outline-none transition-all"
            style={{
              background: theme.surfaceAlt,
              border: `1px solid ${theme.border}`,
              color: theme.text,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between border-t pt-3" style={{ borderColor: theme.border }}>
          <p className="text-[11px]" style={{ color: theme.textMuted }}>
            Powered by Fastn Multi-Agent Workflow
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isAnalyzing}>
              Cancel
            </Button>
            <Button
              variant="teal"
              onClick={handleStart}
              disabled={!selected || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Running AI Agents...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analyze with AI Agents
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewApplicationModal;
