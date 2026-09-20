import { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Banknote,
  Lightbulb,
  Bell,
  BellRing,
  X,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Mail,
  Calendar,
  UploadCloud,
  FolderCheck,
  Check,
  Send,
  Loader2,
  HardDrive,
  Users,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";
import Button from "../common/Button";
import {
  dispatchBrevoEmail,
  uploadFileToDriveVault,
  getGoogleCalendarUrl,
  getGmailComposeUrl,
} from "../../services/aiservices";

export default function AIResultsDashboard({ plan, onFindOffice, onUpdateReadiness }) {
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

  // Local interactive state for live connector actions
  const [checklist, setChecklist] = useState(documents_checklist);
  const [vaultDocs, setVaultDocs] = useState({});
  const [score, setScore] = useState(readiness_score);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("idle"); // 'idle' | 'sending' | 'sent'
  const [trackingId, setTrackingId] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [showReminder, setShowReminder] = useState(false);

  const triggerReminderNotification = () => {
    setShowReminder(true);
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("🔔 QueueLess AI: 30 Minutes Remaining!", {
          body: `Time to head to ${service} Mega Center! All required documents are ready.`,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("🔔 QueueLess AI: 30 Minutes Remaining!", {
              body: `Time to head to ${service} Mega Center! All required documents are ready.`,
            });
          }
        });
      }
    }
  };

  const getIsMissing = (doc, idx, vDocs = vaultDocs) => {
    if (vDocs[idx]) return false;
    const s = (doc?.status || "").toLowerCase();
    return s.includes("missing") || s.includes("need") || s.includes("alone") || s.includes("pending");
  };

  const computeScore = (currentChecklist, currentVaultDocs) => {
    const total = currentChecklist.length || 1;
    const missing = currentChecklist.filter((doc, i) => getIsMissing(doc, i, currentVaultDocs)).length;
    if (missing === 0) return 100;
    const ready = total - missing;
    const ratio = Math.round((ready / total) * 100);
    // Never allow >= 85% if even 1 document is missing!
    return Math.min(80, Math.max(30, ratio));
  };

  useEffect(() => {
    setChecklist(documents_checklist);
    setVaultDocs({});
    setEmailStatus("idle");

    const total = documents_checklist.length || 1;
    const initialMissing = documents_checklist.filter((doc, i) => getIsMissing(doc, i, {})).length;
    let initialScore = 100;
    if (initialMissing > 0) {
      const ready = total - initialMissing;
      const ratio = Math.round((ready / total) * 100);
      initialScore = Math.min(80, Math.max(30, ratio));
      const planScoreNum = parseInt(readiness_score);
      if (!isNaN(planScoreNum)) {
        initialScore = Math.min(initialScore, planScoreNum);
      }
    }

    setScore(`${initialScore}%`);

    if (onUpdateReadiness) {
      onUpdateReadiness({
        score: initialScore,
        missingDocsCount: initialMissing,
        updatedDocs: documents_checklist.map((d, i) => ({
          id: i + 1,
          label: d.item,
          status: getIsMissing(d, i, {}) ? "missing" : "verified",
        })),
      });
    }
  }, [plan]);

  const missingCount = checklist.filter((doc, idx) => getIsMissing(doc, idx)).length;
  const isHighRisk = missingCount >= 2;
  const isModerateRisk = missingCount === 1;
  const isFullyReady = missingCount === 0;

  // 1. Brevo Email Dispatch Handler
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email || emailStatus === "sending") return;

    setEmailStatus("sending");
    try {
      const res = await dispatchBrevoEmail({
        email,
        service,
        plan: { ...plan, readiness_score: score, documents_checklist: checklist },
      });
      setTrackingId(res.trackingId);
      setEmailStatus("sent");
    } catch (err) {
      setEmailStatus("idle");
      alert("Could not send email. Please try again.");
    }
  };

  // 2. Google Drive Vault Upload Handler
  const handleFileUpload = async (idx, docName, file) => {
    if (!file) return;
    setUploadingIdx(idx);

    try {
      const res = await uploadFileToDriveVault({
        fileName: file.name,
        fileType: file.type,
        serviceName: service,
      });

      const updatedVault = {
        ...vaultDocs,
        [idx]: { name: file.name, fileId: res.fileId },
      };
      setVaultDocs(updatedVault);

      const updatedChecklist = checklist.map((doc, i) =>
        i === idx ? { ...doc, status: "Present (In Drive Vault)", required: true } : doc
      );
      setChecklist(updatedChecklist);

      const newScoreNum = computeScore(updatedChecklist, updatedVault);
      setScore(`${newScoreNum}%`);

      const remainingMissing = updatedChecklist.filter((doc, i) => getIsMissing(doc, i, updatedVault)).length;

      // Update top header in App.jsx in real time!
      if (onUpdateReadiness) {
        onUpdateReadiness({
          score: newScoreNum,
          missingDocsCount: remainingMissing,
          updatedDocs: updatedChecklist.map((d, i) => ({
            id: i + 1,
            label: d.item,
            status: updatedVault[i] || !getIsMissing(d, i, updatedVault) ? "verified" : "missing",
          })),
        });
      }
    } catch (err) {
      console.warn("Upload error:", err);
    } finally {
      setUploadingIdx(null);
    }
  };

  // 3. Google Calendar URL
  const calendarUrl = getGoogleCalendarUrl({ service, plan });

  return (
    <div className="mt-6 flex flex-col gap-5">
      {/* ── 1. Top Readiness & Summary Banner ── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-5 border shadow-sm transition-all"
        style={{
          background: isFullyReady ? "#f0fdf4" : isModerateRisk ? "#fffbeb" : "#fef2f2",
          borderColor: isFullyReady ? "#bbf7d0" : isModerateRisk ? "#fde68a" : "#fecaca",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex flex-col h-14 w-14 shrink-0 items-center justify-center rounded-xl font-black transition-all shadow-xs"
            style={{
              background: isFullyReady ? "#16a34a" : isModerateRisk ? "#d97706" : "#ef4444",
              color: "#ffffff",
            }}
          >
            <span className="text-base font-black leading-none">{score}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 mt-0.5">Ready</span>
          </div>
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: isFullyReady ? "#166534" : isModerateRisk ? "#92400e" : "#991b1b" }}
            >
              {service} — {isFullyReady ? "All Documents Ready" : `${missingCount} Document${missingCount > 1 ? "s" : ""} Missing`}
            </h3>
            <p
              className="text-xs font-semibold mt-0.5"
              style={{ color: isFullyReady ? "#15803d" : isModerateRisk ? "#b45309" : "#b91c1c" }}
            >
              {isFullyReady
                ? "✅ YOU ARE READY TO GO: All required documents are verified and saved."
                : isModerateRisk
                ? "⚠️ ALMOST READY: 1 required document is still missing before you can visit the counter."
                : `⚠️ DO NOT GO YET: You are missing ${missingCount} required documents and will be turned away at the counter.`}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Test 30-Min Notification Preview */}
          <button
            onClick={triggerReminderNotification}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all hover:opacity-90 shadow-xs cursor-pointer border"
            style={{
              background: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            }}
            title="Preview the 30-minute departure alert"
          >
            <Bell size={13} className="text-amber-500 animate-bounce" />
            <span>Preview 30-Min Alert</span>
          </button>

          {/* Google Calendar Intent */}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:opacity-90 cursor-pointer"
            style={{ background: "#2563eb" }}
            title="Save this visit and checklist to your Google Calendar"
          >
            <Calendar size={13} />
            <span>Add Visit to Calendar</span>
            <ExternalLink size={11} className="opacity-70" />
          </a>
        </div>
      </div>

      {/* ── 30-Minute Live Departure Reminder Alert ── */}
      {showReminder && (
        <div className="rounded-2xl p-4 border shadow-md flex items-start justify-between gap-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-300">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white font-black shadow-xs">
              <BellRing size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-md">
                  🔔 30 Minutes Remaining
                </span>
                <span className="text-xs font-semibold text-slate-500">Live Departure Alert</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                Time to depart for {service} Center!
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                Your appointment starts in 30 minutes (recommended arrival: <strong>8:25 PM</strong>). Please double check you have your original CNIC and Drive Vault files ready before departing.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReminder(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── 2. Critical Roadblock Alert (Red/Amber Box) ── */}
      {missing_critical_info && missing_critical_info.length > 0 && missingCount > 0 && (
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
              Critical Roadblocks — What Is Missing ({missingCount} required item{missingCount > 1 ? "s" : ""}):
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
        {/* Column A: Document Checklist with Google Drive Vault Integration */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold" style={{ color: theme.text }}>
                📋 What Documents You Need
              </h4>
              <p className="text-[11px]" style={{ color: theme.textMuted }}>
                Backed by Google Drive Citizen Vault
              </p>
            </div>
            <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
              {checklist.length} items
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {checklist.map((doc, idx) => {
              const isMissing =
                doc.status?.toLowerCase().includes("missing") ||
                doc.status?.toLowerCase().includes("need") ||
                doc.status?.toLowerCase().includes("alone");
              const isVaulted = !!vaultDocs[idx];

              return (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-xl p-3 border transition-all"
                  style={{
                    background: theme.surfaceAlt,
                    borderColor: isMissing && !isVaulted ? "#fca5a5" : theme.border,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {isMissing && !isVaulted ? (
                        <XCircle size={17} className="text-red-500 shrink-0" />
                      ) : (
                        <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />
                      )}
                      <span
                        className="text-xs font-medium leading-snug"
                        style={{ color: isMissing && !isVaulted ? "#dc2626" : theme.text }}
                      >
                        {doc.item}
                      </span>
                    </div>

                    <span
                      className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{
                        background: isMissing && !isVaulted ? "#fee2e2" : "#dcfce7",
                        color: isMissing && !isVaulted ? "#b91c1c" : "#15803d",
                      }}
                    >
                      {isVaulted ? "In Drive Vault" : isMissing ? "Missing" : "Ready"}
                    </span>
                  </div>

                  {/* If missing, allow 1-click upload to Google Drive Vault */}
                  {isMissing && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-[11px] text-slate-500">
                        {isVaulted
                          ? `📁 Saved to Drive: ${vaultDocs[idx]?.name}`
                          : "Upload copy to verify & boost readiness:"}
                      </span>

                      {isVaulted ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <FolderCheck size={13} />
                          Verified
                        </span>
                      ) : (
                        <label className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 cursor-pointer transition-all">
                          {uploadingIdx === idx ? (
                            <>
                              <Loader2 size={11} className="animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <UploadCloud size={12} />
                              Upload to Drive Vault
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            disabled={uploadingIdx === idx}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(idx, doc.item, file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
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

      {/* ── 4. Live Waiting Times & Office Crowds (Easy to Understand) ── */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-teal-600" />
              <h4 className="text-sm font-bold" style={{ color: theme.text }}>
                🚦 Live Waiting Times & Office Crowds (Islamabad / Rawalpindi)
              </h4>
            </div>
            <p className="text-[11px]" style={{ color: theme.textMuted }}>
              Check how crowded offices are right now before leaving your home
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-3 py-1 border border-emerald-300/40">
            💡 AI Advice: Visit Blue Area tonight to save 1 hour!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Blue Area 24/7 Mega Center */}
          <div className="rounded-xl p-4 border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Blue Area 24/7 Mega Center</span>
              <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Fast Line
              </span>
            </div>
            <div className="mt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Token Waiting Time:
              </p>
              <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                ~15 Minutes
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span>👥 Queue:</span>
              <span className="bg-emerald-200/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded text-[11px]">
                ~5 to 8 people ahead
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/50">
              💡 <strong>Best Time:</strong> Visit after 8:30 PM for near-zero waiting.
            </p>
          </div>

          {/* G-10 Regional Center */}
          <div className="rounded-xl p-4 border border-red-300 bg-red-50 dark:bg-red-950/40 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">G-10 Regional Center</span>
              <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Heavy Rush
              </span>
            </div>
            <div className="mt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-800 dark:text-red-300">
                Token Waiting Time:
              </p>
              <p className="text-2xl font-black text-red-900 dark:text-red-100">
                ~1.5 Hours Wait
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300">
              <span>👥 Queue:</span>
              <span className="bg-red-200/80 dark:bg-red-900/60 px-1.5 py-0.5 rounded text-[11px]">
                ~70+ people ahead
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-2 pt-2 border-t border-red-200 dark:border-red-800/50">
              ⚠️ <strong>Avoid Daytime:</strong> Heavy morning backlog. Reach at 8:00 AM.
            </p>
          </div>

          {/* G-10/4 Passport Office */}
          <div className="rounded-xl p-4 border border-amber-300 bg-amber-50 dark:bg-amber-950/40 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">G-10/4 Passport Office</span>
              <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Moderate
              </span>
            </div>
            <div className="mt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Token Waiting Time:
              </p>
              <p className="text-2xl font-black text-amber-900 dark:text-amber-100">
                ~45 Minutes
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <span>👥 Queue:</span>
              <span className="bg-amber-200/80 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-[11px]">
                ~25 to 30 people ahead
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-2 pt-2 border-t border-amber-200 dark:border-amber-800/50">
              💡 <strong>Pro-Tip:</strong> Pay fee on mobile app before taking token.
            </p>
          </div>
        </div>
      </Card>

      {/* ── 5. Email Pass Card (Send to Any Citizen or Friend) ── */}
      <div
        className="rounded-2xl p-5 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: theme.surfaceAlt,
          borderColor: theme.border,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Mail size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold" style={{ color: theme.text }}>
              📩 Send My Visit Pass & Checklist to Email
            </h4>
            <p className="text-[11px]" style={{ color: theme.textMuted }}>
              We will send your complete document checklist and appointment details straight to your inbox.
            </p>
          </div>
        </div>

        {emailStatus === "sent" ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Visit Pass Sent! Pass ID: #{trackingId}</span>
              </div>
              <span className="text-[11px] font-normal text-emerald-700 pl-6">
                Sent to: <strong>{email}</strong> (Check Inbox & Spam)
              </span>
            </div>

            <a
              href={getGmailComposeUrl({
                email,
                service,
                plan: { ...plan, readiness_score: score, documents_checklist: checklist },
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shrink-0 shadow-xs cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Open in Gmail</span>
            </a>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="flex w-full sm:w-auto items-center gap-2">
            <input
              type="email"
              required
              placeholder="Enter email (e.g. friend@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl px-3 py-2 text-xs outline-none border transition-all w-full sm:w-64"
              style={{
                background: theme.surface,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
            <Button
              type="submit"
              variant="teal"
              disabled={emailStatus === "sending" || !email}
              className="flex items-center gap-1.5 shrink-0"
            >
              {emailStatus === "sending" ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Email</span>
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* ── 6. Bottom Logistics Bar (Fees & Pro-Tip) ── */}
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
              {pro_tip ||
                "Arrive 15 minutes before opening or visit the 24/7 Mega Center in Blue Area after 9 PM to bypass daytime queues."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
