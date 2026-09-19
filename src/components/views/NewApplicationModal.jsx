import { useState } from "react";
import {
  CreditCard,
  FileText,
  Car,
  Home,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";

const SERVICES = [
  { id: "cnic", label: "CNIC Update / Renewal", desc: "National Identity Card", icon: CreditCard },
  { id: "passport", label: "Passport Application", desc: "New or Renewal", icon: FileText },
  { id: "license", label: "Driving License", desc: "New, Renewal, or Transfer", icon: Car },
  { id: "property", label: "Property Registration", desc: "Transfer & Title Deed", icon: Home },
  { id: "education", label: "Education Certificates", desc: "Attestation & Verification", icon: GraduationCap },
];

/**
 * NewApplicationModal – Service picker that notifies parent on selection.
 *
 * Props:
 *   open, onClose
 *   onStartApplication – callback(service) called when user confirms
 */
const NewApplicationModal = ({ open, onClose, onStartApplication = () => {} }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(null);

  const handleStart = () => {
    if (!selected) return;
    const service = SERVICES.find((s) => s.id === selected);
    onStartApplication(service);
    setSelected(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { setSelected(null); onClose(); }} title="Start New Application" width="max-w-lg">
      <div className="flex flex-col gap-2">
        <p className="mb-1 text-sm" style={{ color: theme.textMuted }}>
          Select the government service you need help with:
        </p>
        {SERVICES.map((svc) => {
          const Icon = svc.icon;
          const isActive = selected === svc.id;
          return (
            <button
              key={svc.id}
              onClick={() => setSelected(svc.id)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors cursor-pointer"
              style={{
                background: isActive ? theme.accent + "15" : theme.surfaceAlt,
                border: `1.5px solid ${isActive ? theme.accent : theme.border}`,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: isActive ? theme.accent + "25" : theme.border }}
              >
                <Icon size={18} style={{ color: isActive ? theme.accent : theme.textMuted }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: isActive ? theme.accent : theme.text }}>
                  {svc.label}
                </p>
                <p className="text-xs" style={{ color: theme.textMuted }}>{svc.desc}</p>
              </div>
              <ChevronRight size={16} style={{ color: isActive ? theme.accent : theme.textMuted }} />
            </button>
          );
        })}

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => { setSelected(null); onClose(); }}>
            Cancel
          </Button>
          <Button variant="teal" onClick={handleStart} disabled={!selected}>
            Start Application
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewApplicationModal;
