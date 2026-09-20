import { useState } from "react";
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

/**
 * Help – Help & Support page.
 *
 * Props:
 *   onOpenChat – callback to open the global chat widget
 */
const Help = ({ onOpenChat = () => {} }) => {
  const { theme } = useTheme();
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()),
  );

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
          onClick={onOpenChat}
          className="hover:opacity-90 active:scale-95"
        >
          Start Chat
        </Button>
      </Card>

      {/* Quick Contact */}
      <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
};

export default Help;
