import { useState, useEffect } from "react";
import {
  CreditCard,
  FileText,
  Car,
  Home,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Languages,
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

const ENGLISH_PRESETS = [
  { label: "Lost CNIC (Going Alone)", text: "Lost CNIC, no birth certificate, going alone", serviceId: "cnic" },
  { label: "CNIC Renewal After Expiry", text: "Renewal of CNIC after expiry, details unchanged", serviceId: "cnic" },
  { label: "Urgent Passport Renewal", text: "Passport expiring next month, need urgent renewal", serviceId: "passport" },
  { label: "Driving License 42-day", text: "42 days passed since learner permit, need permanent test", serviceId: "license" },
];

const URDU_PRESETS = [
  { label: "Mera CNIC Gum Hogaya (Akela)", text: "Mera CNIC gum ho gaya hai, purani copy hai lekin mai akela ja raha hoon koi relative sath nahi hai", serviceId: "cnic" },
  { label: "Smart Card Expiry Renewal", text: "Mera Smart Card expire ho chuka hai, details sab same hain renew karwana hai", serviceId: "cnic" },
  { label: "Urgent Passport Banwana Hai", text: "Mujhe urgent 5-year passport banwana hai, online fee jama karwayi hai", serviceId: "passport" },
  { label: "Driving License Permanent Test", text: "Learner permit ko 42 din guzar chuke hain, permanent driving test dena hai", serviceId: "license" },
];

const getDefaultSituation = (serviceId, lang) => {
  if (lang === "urdu") {
    if (serviceId === "passport") return "Mujhe urgent 5-year passport banwana hai, online fee jama karwayi hai";
    if (serviceId === "license") return "Learner permit ko 42 din guzar chuke hain, permanent driving test dena hai";
    if (serviceId === "property") return "Property transfer aur registry ke papers ki tasdeeq karwani hai";
    if (serviceId === "education") return "Degrees aur certificates ki attestation aur verification karwani hai";
    return "Mera CNIC gum ho gaya hai, purani copy hai lekin mai akela ja raha hoon koi relative sath nahi hai";
  } else {
    if (serviceId === "passport") return "Passport expiring next month, need urgent renewal";
    if (serviceId === "license") return "42 days passed since learner permit, need permanent test";
    if (serviceId === "property") return "Property registry transfer, need required NOC and stamp duty details";
    if (serviceId === "education") return "Educational degree attestation, need IBCC and HEC verification checklist";
    return "Lost CNIC, no birth certificate, going alone";
  }
};

const NewApplicationModal = ({ open, onClose, onStartApplication = () => {}, isAnalyzing = false }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState("cnic");
  const [presetLang, setPresetLang] = useState("urdu");
  const [situation, setSituation] = useState(getDefaultSituation("cnic", "urdu"));
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const handleSelectService = (serviceId) => {
    setSelected(serviceId);
    setSituation(getDefaultSituation(serviceId, presetLang));
  };

  const handleChangeLang = (newLang) => {
    setPresetLang(newLang);
    setSituation(getDefaultSituation(selected, newLang));
  };

  const getDynamicPlaceholder = () => {
    if (selected === "passport") {
      return presetLang === "urdu"
        ? "e.g. Urgent passport banwana hai, fee receipt jama hai ya nahi..."
        : "e.g. Passport renewal, urgent 5-year or 10-year, appointment and fee...";
    }
    if (selected === "license") {
      return presetLang === "urdu"
        ? "e.g. Learner license expired, permanent driving test ki date..."
        : "e.g. Learner driving permit 42 days passed, need sign test and track test...";
    }
    if (selected === "property") {
      return presetLang === "urdu"
        ? "e.g. Plot ki registry transfer karwani hai, fard aur stamp duty..."
        : "e.g. Property transfer, need Fard, NOC and stamp paper verification...";
    }
    if (selected === "education") {
      return presetLang === "urdu"
        ? "e.g. Matric / Inter ya University degree attest karwani hai..."
        : "e.g. Degree attestation, need IBCC / HEC verification checklist...";
    }
    return presetLang === "urdu"
      ? "e.g. Mera CNIC gum ho gaya hai, purani copy hai lekin mai akela ja raha hoon..."
      : "e.g. Lost CNIC, have photocopy, father is abroad, need urgent card...";
  };

  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is supported in Google Chrome & Edge. Please open in Chrome/Edge or type your text.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = presetLang === "urdu" ? "ur-PK" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event?.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setSituation((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

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
                  onClick={() => handleSelectService(svc.id)}
                  className="flex items-center gap-3 rounded-xl p-3 text-left transition-all cursor-pointer"
                  style={{
                    background: isActive ? theme.accent + "18" : theme.inputBg,
                    border: `1.5px solid ${isActive ? theme.accent : theme.borderSoft}`,
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: isActive ? theme.accent : theme.border }}
                  >
                    <Icon size={18} style={{ color: isActive ? theme.accentText : theme.textMuted }} />
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

        {/* Quick Demo Chips with Language Toggle */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>
              Quick Demo Scenarios:
            </p>
            <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: theme.inputBg, border: `1px solid ${theme.borderSoft}` }}>
              <button
                type="button"
                onClick={() => handleChangeLang("urdu")}
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer"
                style={{
                  background: presetLang === "urdu" ? theme.accent : "transparent",
                  color: presetLang === "urdu" ? theme.accentText : theme.textMuted,
                }}
              >
                🇵🇰 Roman Urdu
              </button>
              <button
                type="button"
                onClick={() => handleChangeLang("english")}
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer"
                style={{
                  background: presetLang === "english" ? theme.accent : "transparent",
                  color: presetLang === "english" ? theme.accentText : theme.textMuted,
                }}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(presetLang === "urdu" ? URDU_PRESETS : ENGLISH_PRESETS).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-all hover:opacity-80 cursor-pointer"
                style={{
                  background: situation === preset.text ? theme.accent : theme.inputBg,
                  color: situation === preset.text ? theme.accentText : theme.textMuted,
                  border: `1px solid ${situation === preset.text ? theme.accent : theme.borderSoft}`,
                }}
              >
                ⚡ {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Situation Input with Voice Mic */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>
              2. Describe Citizen Situation & Documents:
            </label>
            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer shadow-xs"
                style={{
                  background: isListening ? "rgba(239, 68, 68, 0.15)" : theme.surfaceAlt,
                  color: isListening ? "#ef4444" : theme.accent,
                  border: `1px solid ${isListening ? "#ef4444" : theme.accent + "40"}`,
                }}
                title="Speak in Urdu or English to dictate"
              >
                {isListening ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                    <span className="font-bold">Listening... (Bolein)</span>
                  </>
                ) : (
                  <>
                    <Mic size={13} />
                    <span>Voice Dictate (🎙️ بولیں)</span>
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={3}
            placeholder={getDynamicPlaceholder()}
            className="w-full rounded-xl p-3 text-xs leading-relaxed outline-none transition-all"
            style={{
              background: theme.inputBg,
              border: `1px solid ${theme.borderSoft}`,
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
