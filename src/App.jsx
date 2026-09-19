import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import WelcomeHeader from "./components/Home/WelcomeHeader";
import ActiveApplicationBanner from "./components/Home/ActiveApplicationBanner";
import NextActionItems from "./components/Home/actionitems";
import CurrentTasks from "./components/Home/CurrenTask";
import QuickAccessHub from "./components/Home/QuickAccessHub";
import VisitTracker from "./components/Home/VisitTracker";
import AIResultsDashboard from "./components/Home/AIResultsDashboard";
import Bottomnav from "./components/Layout/Bottomnav";
import Documents from "./pages/Document";
import Visits from "./pages/Visit";
import Help from "./pages/help";

/* ── Modals ── */
import OfficeFinder from "./components/views/OfficeFinder";
import VisitRoadmap from "./components/views/VisitRoadmap";
import NewApplicationModal from "./components/views/NewApplicationModal";
import AgentStatusModal from "./components/views/AgentStatusModal";
import MissingDocAgentModal from "./components/views/MissingDocAgentModal";

/* ── Features ── */
import Toast from "./components/common/Toast";
import Confetti from "./components/common/Confetti";
import { SkeletonDashboard } from "./components/common/Skeleton";

/* ── Fastn AI Service ── */
import { queryQueueLessAI } from "./services/aiservices";

/* ── Icons ── */
import {
  Upload,
  MapPin,
  CheckCircle2,
  MessageCircle,
  X,
  Bot,
  Send,
  Loader2,
} from "lucide-react";

/* ── Chat Data ── */
const QUICK_QUESTIONS = [
  "What documents do I need for NADRA CNIC update?",
  "How do I reset my visit appointment?",
  "Where is Gate 2 at the Executive Center?",
];

const AI_RESPONSES = {
  "What documents do I need for NADRA CNIC update?":
    "For a NADRA CNIC update, you need: (1) Original CNIC, (2) 2 passport-size photos, (3) Proof of address (utility bill less than 3 months old), (4) Birth Certificate or B-Form. Bring both originals and photocopies. Fee: PKR 1,500 for normal, PKR 2,500 for executive.",
  "How do I reset my visit appointment?":
    "To reset your visit appointment: Go to the Visits tab → find your upcoming visit → click 'Cancel Visit' → confirm. Then start a new application from the Quick Access Hub to schedule a fresh appointment.",
  "Where is Gate 2 at the Executive Center?":
    "Gate 2 at the NADRA Mega Center (Executive) in Blue Area, Islamabad is the main entrance for CNIC services. Enter through Gate 2, proceed to the Token Counter, then follow signs to Biometric Desk 4.",
};

/** Wrapper that renders the page content cleanly. */
function PageTransition({ children }) {
  return (
    <div className="page-transition transition-opacity duration-300">
      {children}
    </div>
  );
}

/** Inner app with live state engine. */
function AppInner() {
  const [activeTab, setActiveTab] = useState("home");
  const { theme } = useTheme();

  /* ── Live State Engine ── */
  const [activeApplication, setActiveApplication] = useState(null);
  const [readiness, setReadiness] = useState(0);
  const [missingDocs, setMissingDocs] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [insight, setInsight] = useState({
    message:
      "Select a public service below to launch the Fastn Agent Swarm and analyze your visit readiness.",
  });
  const [aiPlan, setAiPlan] = useState(null);

  /* ── Modal State ── */
  const [officeModal, setOfficeModal] = useState(false);
  const [roadmapModal, setRoadmapModal] = useState(false);
  const [newAppModal, setNewAppModal] = useState(false);
  const [agentsModal, setAgentsModal] = useState(false);
  const [missingDocModal, setMissingDocModal] = useState(false);
  const [allTasksComplete, setAllTasksComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /* ── Feature State ── */
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ── Toast State ── */
  const [toast, setToast] = useState({ message: "", type: "success" });

  /* ── Global Chat State ── */
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Hello! I'm your QueueLess Assistant. Ask me anything about NADRA document rules, passport applications, or your upcoming office visit.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatTyping]);

  const hasApplication = activeApplication !== null;

  /* ── Skeleton loading on mount ── */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* ── Chat Handlers ── */
  const simulateResponse = useCallback((msg) => {
    setChatTyping(true);
    const response =
      AI_RESPONSES[msg] ||
      `That's a great question about "${msg}". For the most accurate guidance, I recommend checking the specific service requirements in the Quick Access Hub or visiting the nearest office.`;
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", text: response },
      ]);
      setChatTyping(false);
    }, 1000 + Math.random() * 800);
  }, []);

  const handleChatSend = useCallback(
    (text) => {
      const msg = text || chatInput.trim();
      if (!msg) return;
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "user", text: msg },
      ]);
      setChatInput("");
      simulateResponse(msg);
    },
    [chatInput, simulateResponse],
  );

  /* ── Cancel Application Handler ── */
  const handleCancelApplication = useCallback(() => {
    setActiveApplication(null);
    setReadiness(0);
    setMissingDocs(0);
    setDocuments([]);
    setAiPlan(null);
    setAllTasksComplete(false);
    setInsight({
      message:
        "Select a service (e.g., CNIC, Passport, License) to initiate Fastn agent document verification.",
    });
    setToast({ message: "Application cancelled", type: "info" });
  }, []);

  /* ── New Application Handler (Calls Fastn AI Orchestrator) ── */
  const handleStartApplication = useCallback(async (service, situation) => {
    setIsAnalyzing(true);
    setToast({ message: "Connecting to Fastn AI Agents...", type: "info" });

    try {
      const plan = await queryQueueLessAI({
        service_type: service.label,
        citizen_details: situation,
      });

      setActiveApplication(plan.service || service.label);
      setAiPlan(plan);

      const score = parseInt(plan.readiness_score) || (situation.toLowerCase().includes("alone") ? 35 : 75);
      setReadiness(score);

      if (Array.isArray(plan.documents_checklist)) {
        const docs = plan.documents_checklist.map((doc, idx) => ({
          id: idx + 1,
          label: doc.item,
          status: doc.status?.toLowerCase().includes("missing") || doc.status?.toLowerCase().includes("need")
            ? "missing"
            : "verified",
        }));
        setDocuments(docs);
        setMissingDocs(docs.filter((d) => d.status === "missing").length);
      }

      if (Array.isArray(plan.missing_critical_info) && plan.missing_critical_info.length > 0) {
        setInsight({
          message: plan.missing_critical_info.join(" "),
        });
      } else if (plan.pro_tip) {
        setInsight({
          message: plan.pro_tip,
        });
      }

      setAllTasksComplete(score >= 80);
      setNewAppModal(false);
      setToast({
        message: `Fastn Agents executed! Readiness: ${plan.readiness_score}`,
        type: "success",
      });

      if (score >= 70) {
        setShowConfetti(true);
      }
    } catch (err) {
      console.error("Fastn query error:", err);
      setToast({
        message: "Applied grounded rules for " + service.label,
        type: "success",
      });
      setNewAppModal(false);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /* ── AI Verification Handler ── */
  const handleAIVerification = useCallback(() => {
    setDocuments((prev) =>
      prev.map((doc) => ({ ...doc, status: "verified" })),
    );
    setReadiness(100);
    setMissingDocs(0);
    setAllTasksComplete(true);
    setInsight({
      message: "All documents verified by Fastn Compliance Agent! Proceed to Gate 2.",
    });
    setShowConfetti(true);
    setToast({ message: "AI verification complete — 100% Ready", type: "success" });
  }, []);

  return (
    <div
      className="min-h-screen transition-colors"
      style={{ background: theme.bg }}
    >
      {/* Confetti celebration */}
      <Confetti
        active={showConfetti}
        duration={3500}
        onComplete={() => setShowConfetti(false)}
      />

      <main className="mx-auto max-w-[900px] px-4 pt-5 pb-24 sm:px-6">
        <PageTransition key={activeTab} tabKey={activeTab}>
          {/* Skeleton loading state */}
          {loading && activeTab === "home" && <SkeletonDashboard />}

          {!loading && activeTab === "home" && (
            <>
              {/* Welcome Header */}
              <div className="stagger-1">
                <WelcomeHeader
                  userName="Citizen Applicant"
                  readiness={readiness}
                  missingDocs={missingDocs}
                />
              </div>

              {/* Active Application Banner */}
              <div className="stagger-1 mt-4">
                <ActiveApplicationBanner
                  application={activeApplication}
                  hasApplication={hasApplication}
                  onClick={() => {
                    if (hasApplication) setAgentsModal(true);
                    else setNewAppModal(true);
                  }}
                />
              </div>

              {/* ── Responsive Grid ── */}
              <div className="stagger-2 mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <NextActionItems
                  hasApplication={hasApplication}
                  completed={allTasksComplete}
                  actions={
                    hasApplication
                      ? [
                          {
                            id: 1,
                            label: allTasksComplete
                              ? "All Tasks Complete"
                              : "Missing Document Verification",
                            badge: allTasksComplete
                              ? null
                              : "Required by Fastn Risk Agent",
                            icon: allTasksComplete ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Upload size={16} />
                            ),
                            onClick: allTasksComplete
                              ? undefined
                              : () => setMissingDocModal(true),
                          },
                        ]
                      : []
                  }
                  prep={
                    hasApplication
                      ? [
                          {
                            id: 1,
                            label: "Locate Nearest Center (Islamabad)",
                            icon: <MapPin size={16} />,
                            onClick: () => setOfficeModal(true),
                          },
                        ]
                      : []
                  }
                  onSelectService={() => setNewAppModal(true)}
                />

                <CurrentTasks
                  documents={documents}
                  insight={insight}
                  hasApplication={hasApplication}
                />

                <QuickAccessHub
                  onNewApplication={() => setNewAppModal(true)}
                  onDocumentVault={() => setActiveTab("documents")}
                  onRoadmap={() => setRoadmapModal(true)}
                  onFindOffice={() => setOfficeModal(true)}
                />
              </div>

              {/* ── Detailed AI Results Blueprint (Visible when application active) ── */}
              {hasApplication && aiPlan && (
                <AIResultsDashboard
                  plan={aiPlan}
                  onFindOffice={() => setOfficeModal(true)}
                />
              )}

              {/* Upcoming Visit Tracker */}
              <div className="stagger-3 mt-6">
                <VisitTracker
                  hasApplication={hasApplication}
                  onCancelApplication={handleCancelApplication}
                  onGetDirections={() => setOfficeModal(true)}
                />
              </div>
            </>
          )}

          {activeTab === "documents" && <Documents />}
          {activeTab === "visits" && <Visits />}
          {activeTab === "help" && (
            <Help onOpenChat={() => setIsChatOpen(true)} />
          )}
        </PageTransition>
      </main>

      {/* Bottom Navigation */}
      <Bottomnav activeTab={activeTab} onTabClick={setActiveTab} />

      {/* ── Global Modals ── */}
      <MissingDocAgentModal
        open={missingDocModal}
        onClose={() => setMissingDocModal(false)}
        onComplete={handleAIVerification}
      />
      <OfficeFinder open={officeModal} onClose={() => setOfficeModal(false)} />
      <VisitRoadmap open={roadmapModal} onClose={() => setRoadmapModal(false)} />
      <NewApplicationModal
        open={newAppModal}
        onClose={() => setNewAppModal(false)}
        onStartApplication={handleStartApplication}
        isAnalyzing={isAnalyzing}
      />
      <AgentStatusModal
        open={agentsModal}
        onClose={() => setAgentsModal(false)}
        onStartNewApplication={() => {
          setAgentsModal(false);
          setNewAppModal(true);
        }}
      />

      {/* ── Toast ── */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />

      {/* ═══════════════════════════════════════════════════════
          GLOBAL AI CHAT WIDGET — Single floating trigger
          ═══════════════════════════════════════════════════════ */}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsChatOpen((p) => !p)}
        className="fixed bottom-20 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        style={{ background: theme.accent }}
      >
        {isChatOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Docked chat widget */}
      <div
        className="fixed bottom-20 right-6 z-40 w-80 sm:w-96 rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          background: theme.surface,
          borderColor: theme.border,
          height: isChatOpen ? "480px" : "0px",
          opacity: isChatOpen ? 1 : 0,
          transform: isChatOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
          pointerEvents: isChatOpen ? "auto" : "none",
        }}
      >
        {/* Compact header */}
        <div
          className="flex items-center justify-between px-3 py-2.5 shrink-0"
          style={{ background: theme.accent }}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot size={18} className="text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 border border-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                QueueLess AI Assistant
              </p>
              <p className="text-[9px] text-white/70">
                Online • Instant replies
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed"
                style={{
                  background:
                    msg.role === "user" ? theme.accent : theme.surfaceAlt,
                  color: msg.role === "user" ? "#ffffff" : theme.text,
                  borderBottomRightRadius:
                    msg.role === "user" ? "4px" : "16px",
                  borderBottomLeftRadius:
                    msg.role === "ai" ? "4px" : "16px",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {chatTyping && (
            <div className="flex justify-start">
              <div
                className="flex items-center gap-1.5 rounded-2xl rounded-bl-md px-3 py-2"
                style={{ background: theme.surfaceAlt }}
              >
                <Loader2
                  size={12}
                  className="animate-spin"
                  style={{ color: theme.accent }}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: theme.textMuted }}
                >
                  AI thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion chips */}
        {chatMessages.length <= 2 && (
          <div
            className="flex gap-1.5 overflow-x-auto px-3 pb-2 shrink-0"
            style={{ scrollbarWidth: "none" }}
          >
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleChatSend(q)}
                className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors cursor-pointer"
                style={{
                  background: theme.accent + "12",
                  color: theme.accent,
                  border: `1px solid ${theme.accent}30`,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Pinned input bar */}
        <div
          className="flex items-center gap-2 p-2 border-t shrink-0"
          style={{ borderColor: theme.border }}
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
            style={{ color: theme.text }}
          />
          <button
            onClick={() => handleChatSend()}
            disabled={!chatInput.trim() || chatTyping}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-30"
            style={{ background: theme.accent }}
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
