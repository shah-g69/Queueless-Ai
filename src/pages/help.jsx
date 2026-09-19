import { useState, useRef, useEffect } from "react";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Bot,
  Search,
  FileText,
  Shield,
  Calendar,
  CreditCard,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const FAQ_DATA = [
  {
    id: 1,
    category: "Getting Started",
    icon: FileText,
    question: "How do I start a new application?",
    answer:
      "Tap 'Start New Application' from the Quick Access Hub on the home screen. Select the government service you need (CNIC, Passport, License, etc.), and our AI agents will generate a personalized preparation checklist for you.",
  },
  {
    id: 2,
    category: "Documents",
    icon: Shield,
    question: "How do I upload documents?",
    answer:
      "Navigate to the Document Vault from the home screen or bottom navigation. Tap 'Upload Document' and drag-and-drop your files or click to browse. Supported formats: JPG, PNG, PDF (max 10MB each).",
  },
  {
    id: 3,
    category: "Visits",
    icon: Calendar,
    question: "How does the visit roadmap work?",
    answer:
      "Once you start an application, our Visit Preparation Agent creates a step-by-step roadmap. It shows exactly what documents to gather, fees to pay, which office to visit, and which gate/counter to go to.",
  },
  {
    id: 4,
    category: "AI Features",
    icon: Bot,
    question: "What do the AI agents do?",
    answer:
      "QueueLess AI uses 4 specialized agents: (1) Document Checklist Agent prepares your document list. (2) Missing Information Agent identifies incomplete details. (3) Visit Preparation Agent generates your step-by-step plan. (4) Reminder Agent sends follow-up reminders.",
  },
  {
    id: 5,
    category: "Payments",
    icon: CreditCard,
    question: "Can I pay fees through the app?",
    answer:
      "Currently, fee payment information is displayed for reference. Full online payment integration is coming soon. Note the required fees and prepare payment for your office visit.",
  },
  {
    id: 6,
    category: "Getting Started",
    icon: HelpCircle,
    question: "What is QueueLess AI?",
    answer:
      "QueueLess AI is a smart public service visit planner that converts confusing government administrative procedures into personalized, step-by-step preparation workflows.",
  },
];

const QUICK_QUESTIONS = [
  "What documents do I need for NADRA CNIC update?",
  "How do I reset my visit appointment?",
  "Where is Gate 2 at the Executive Center?",
];

const AI_RESPONSES = {
  "What documents do I need for NADRA CNIC update?":
    "For a NADRA CNIC update, you need: (1) Original CNIC, (2) 2 passport-size photos, (3) Proof of address (utility bill less than 3 months old), (4) Birth Certificate or B-Form. Bring both originals and photocopies. Fee: PKR 1,500 for normal, PKR 2,500 for executive.",
  "How do I reset my visit appointment?":
    "To reset your visit appointment: Go to the Visits tab → find your upcoming visit → click 'Cancel Visit' → confirm. Then start a new application from the Quick Access Hub to schedule a fresh appointment. Your tracking token will be regenerated.",
  "Where is Gate 2 at the Executive Center?":
    "Gate 2 at the NADRA Mega Center (Executive) in Blue Area, Islamabad is the main entrance for CNIC services. Enter through Gate 2, proceed to the Token Counter, then follow signs to Biometric Desk 4. Arrive 15 minutes before your scheduled time.",
};

const Help = () => {
  const { theme } = useTheme();
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
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

  /* Lock body scroll when chat is open */
  useEffect(() => {
    if (!isChatOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isChatOpen]);

  const filtered = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatTyping]);

  const simulateResponse = (msg) => {
    setChatTyping(true);
    const response =
      AI_RESPONSES[msg] ||
      `That's a great question about "${msg}". For the most accurate guidance, I recommend checking the specific service requirements in the Quick Access Hub or visiting the nearest office. Our AI agents will prepare a personalized checklist for you.`;
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", text: response },
      ]);
      setChatTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const handleChatSend = (text) => {
    const msg = text || chatInput.trim();
    if (!msg) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: msg },
    ]);
    setChatInput("");
    simulateResponse(msg);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: theme.text }}>
          Help &amp; Support
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: theme.textMuted }}>
          Get answers or reach out to our support team
        </p>
      </div>

      {/* AI Assistant Banner */}
      <Card className="flex items-center gap-4" padding="p-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: theme.accent + "18" }}
        >
          <Bot size={24} style={{ color: theme.accent }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: theme.text }}>
            AI Assistant
          </p>
          <p className="text-xs" style={{ color: theme.textMuted }}>
            Ask me anything about your application or visit preparation
          </p>
        </div>
        <Button
          variant="teal"
          icon={<MessageCircle size={14} />}
          onClick={() => setIsChatOpen(true)}
          className="hover:opacity-90 active:scale-95"
        >
          Start Chat
        </Button>
      </Card>

      {/* Quick Contact */}
      <div className="grid grid-cols-3 gap-3">
        {/* Chat with AI Assistant */}
        <Card
          className="flex flex-col items-center gap-2 py-4 text-center cursor-pointer transition-shadow hover:shadow-md"
          padding="p-3"
          onClick={() => setIsChatOpen(true)}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "#0d948815" }}
          >
            <Bot size={18} style={{ color: "#0d9488" }} />
          </div>
          <span
            className="text-[11px] font-semibold leading-tight"
            style={{ color: theme.text }}
          >
            Chat with AI Assistant
          </span>
        </Card>

        {/* Email Support */}
        <a href="mailto:support@queueless.ai" className="no-underline">
          <Card
            className="flex flex-col items-center gap-2 py-4 text-center cursor-pointer transition-shadow hover:shadow-md"
            padding="p-3"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "#2563eb15" }}
            >
              <Mail size={18} style={{ color: "#2563eb" }} />
            </div>
            <span
              className="text-[11px] font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Email Support
            </span>
          </Card>
        </a>

        {/* Call Helpline */}
        <a href="tel:+9251111786100" className="no-underline">
          <Card
            className="flex flex-col items-center gap-2 py-4 text-center cursor-pointer transition-shadow hover:shadow-md"
            padding="p-3"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "#16a34a15" }}
            >
              <Phone size={18} style={{ color: "#16a34a" }} />
            </div>
            <span
              className="text-[11px] font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              Call Helpline
            </span>
          </Card>
        </a>
      </div>

      {/* FAQ Search */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{
          background: theme.surfaceAlt,
          border: `1px solid ${theme.border}`,
        }}
      >
        <Search size={16} style={{ color: theme.textMuted }} />
        <input
          type="text"
          placeholder="Search frequently asked questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:opacity-50"
          style={{ color: theme.text }}
        />
      </div>

      {/* FAQ Accordion */}
      <div>
        <h2 className="mb-3 text-base font-bold" style={{ color: theme.text }}>
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-2">
          {filtered.map((faq) => {
            const isOpen = openId === faq.id;
            const FaqIcon = faq.icon;
            return (
              <Card key={faq.id} padding="p-0">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left cursor-pointer"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: theme.accent + "12" }}
                  >
                    <FaqIcon size={14} style={{ color: theme.accent }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-bold"
                      style={{ color: theme.text }}
                    >
                      {faq.question}
                    </p>
                    <p
                      className="text-[10px] font-medium"
                      style={{ color: theme.accent }}
                    >
                      {faq.category}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform"
                    style={{
                      color: theme.textMuted,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                {isOpen && (
                  <div
                    className="border-t px-4 pb-4 pt-3"
                    style={{ borderColor: theme.border }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.textMuted }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <Card className="flex flex-col items-center py-10 text-center">
              <HelpCircle
                size={36}
                strokeWidth={1.2}
                className="mb-3"
                style={{ color: theme.textMuted }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: theme.textMuted }}
              >
                No questions match your search.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs" style={{ color: theme.textMuted }}>
        Still need help? Contact us at{" "}
        <a
          href="mailto:support@queueless.ai"
          className="font-semibold underline"
          style={{ color: theme.accent }}
        >
          support@queueless.ai
        </a>{" "}
        or call{" "}
        <a
          href="tel:+9251111786100"
          className="font-semibold underline"
          style={{ color: theme.accent }}
        >
          +92-51-111-786-100
        </a>
      </p>

      {/* ═══════════════════════════════════════════════════════
          AI CHAT MODAL
          ═══════════════════════════════════════════════════════ */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-20 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsChatOpen(false)}
        >
          <div
            className="flex w-full max-h-[80vh] flex-col justify-between overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              maxWidth: "440px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: theme.accent }}
            >
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-white" />
                <div>
                  <p className="text-sm font-bold text-white">
                    QueueLess AI Support Assistant
                  </p>
                  <p className="text-[10px] text-white/70">
                    AI-powered • Instant responses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                    style={{
                      background:
                        msg.role === "user" ? theme.accent : theme.surfaceAlt,
                      color: msg.role === "user" ? "#ffffff" : theme.text,
                      borderBottomRightRadius:
                        msg.role === "user" ? "6px" : "16px",
                      borderBottomLeftRadius:
                        msg.role === "ai" ? "6px" : "16px",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {chatTyping && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3"
                    style={{ background: theme.surfaceAlt }}
                  >
                    <Loader2
                      size={14}
                      className="animate-spin"
                      style={{ color: theme.accent }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: theme.textMuted }}
                    >
                      AI thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick reply chips */}
            {chatMessages.length <= 2 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleChatSend(q)}
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors cursor-pointer"
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

            {/* Input */}
            <div
              className="flex items-center gap-2 border-t px-3 py-2.5"
              style={{ borderColor: theme.border }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Ask about documents, visits, offices..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                style={{ color: theme.text }}
              />
              <button
                onClick={() => handleChatSend()}
                disabled={!chatInput.trim() || chatTyping}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-30"
                style={{ background: theme.accent }}
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
