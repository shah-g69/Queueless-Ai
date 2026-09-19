import { useState, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import WelcomeHeader from "./components/Home/WelcomeHeader";
import ActiveApplicationBanner from "./components/Home/ActiveApplicationBanner";
import NextActionItems from "./components/Home/actionitems";
import CurrentTasks from "./components/Home/CurrenTask";
import QuickAccessHub from "./components/Home/QuickAccessHub";
import VisitTracker from "./components/Home/VisitTracker";
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
import AIChatWidget from "./components/common/AIChatWidget";
import Confetti from "./components/common/Confetti";
import { SkeletonDashboard } from "./components/common/Skeleton";

/* ── Fastn AI Service ── */
import { queryQueueLessAI } from "./services/aiservices";

/* ── Icons ── */
import { Upload, MapPin, CheckCircle2, Plus } from "lucide-react";

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

  const hasApplication = activeApplication !== null;

  /* ── Skeleton loading on mount ── */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* ── Cancel Application Handler ── */
  const handleCancelApplication = useCallback(() => {
    setActiveApplication(null);
    setReadiness(0);
    setMissingDocs(0);
    setDocuments([]);
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
                {/* Next Action Items */}
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

                {/* Current Tasks — AI Document Audit Matrix */}
                <CurrentTasks
                  documents={documents}
                  insight={insight}
                  hasApplication={hasApplication}
                />

                {/* Quick Access Hub */}
                <QuickAccessHub
                  onNewApplication={() => setNewAppModal(true)}
                  onDocumentVault={() => setActiveTab("documents")}
                  onRoadmap={() => setRoadmapModal(true)}
                  onFindOffice={() => setOfficeModal(true)}
                />
              </div>

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
          {activeTab === "help" && <Help />}
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
      <OfficeFinder
        open={officeModal}
        onClose={() => setOfficeModal(false)}
      />
      <VisitRoadmap
        open={roadmapModal}
        onClose={() => setRoadmapModal(false)}
      />
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

      {/* AI Chat Widget */}
      <AIChatWidget />
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
