import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageCircle, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { queryQueueLessAI } from "../../services/aiservices";

const QUICK_QUESTIONS = [
  "Lost CNIC, no relative with me?",
  "Urgent passport processing fee?",
  "Driving license 42-day rule?",
  "What is the best time for Blue Area NADRA?",
];

const AIChatWidget = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Hello! I am your QueueLess AI citizen assistant powered by Fastn. Ask me about NADRA CNIC, Passport, or Driving License procedures!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleAIQuery = async (userMessage) => {
    setIsTyping(true);

    try {
      const data = await queryQueueLessAI({
        service_type: userMessage.toLowerCase().includes("passport")
          ? "Passport Application"
          : userMessage.toLowerCase().includes("license") || userMessage.toLowerCase().includes("driving")
          ? "Driving License"
          : "NADRA Smart CNIC",
        citizen_details: userMessage,
      });

      let reply = `📌 **Service**: ${data.service}\n📊 **Readiness Score**: ${data.readiness_score}\n\n`;

      if (data.missing_critical_info && data.missing_critical_info.length > 0) {
        reply += `⚠️ **Critical Warnings**:\n• ${data.missing_critical_info.join("\n• ")}\n\n`;
      }

      if (data.documents_checklist && data.documents_checklist.length > 0) {
        reply += `📋 **Document Requirements**:\n• ${data.documents_checklist
          .slice(0, 3)
          .map((d) => `${d.item} (${d.status})`)
          .join("\n• ")}\n\n`;
      }

      if (data.estimated_fee) {
        reply += `💰 **Fee**: ${data.estimated_fee}\n\n`;
      }

      if (data.pro_tip) {
        reply += `💡 **Pro-Tip**: ${data.pro_tip}`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", text: reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "ai",
          text: "For Pakistani public office visits, ensure you bring original CNIC, copies, and a blood relative if it is a lost card or first-time application.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: msg },
    ]);
    setInput("");
    handleAIQuery(msg);
  };

  return (
    <>
      {/* Floating bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
          style={{ background: theme.accent }}
        >
          <MessageCircle size={24} className="text-white" />
          <span
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
            style={{ background: "#ef4444" }}
          >
            1
          </span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 z-[90] flex w-[380px] flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            height: "min(560px, 75vh)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: theme.accent }}
          >
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-white" />
              <div>
                <p className="text-sm font-bold text-white">QueueLess AI Concierge</p>
                <p className="text-[10px] text-white/80">Fastn Multi-Agent Engine</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line"
                  style={{
                    background:
                      msg.role === "user" ? theme.accent : theme.surfaceAlt,
                    color:
                      msg.role === "user" ? "#ffffff" : theme.text,
                    borderBottomRightRadius:
                      msg.role === "user" ? "6px" : "16px",
                    borderBottomLeftRadius:
                      msg.role === "ai" ? "6px" : "16px",
                    border: msg.role === "ai" ? `1px solid ${theme.border}` : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3"
                  style={{ background: theme.surfaceAlt }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="inline-block h-2 w-2 rounded-full"
                        style={{
                          background: theme.textMuted,
                          animation: `bounce 1.4s ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] ml-2" style={{ color: theme.textMuted }}>
                    Fastn Agent reasoning...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors cursor-pointer"
                  style={{
                    background: theme.accent + "15",
                    color: theme.accent,
                    border: `1px solid ${theme.accent}30`,
                  }}
                >
                  <Sparkles size={9} className="mr-0.5 inline" />
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about NADRA, Passport, License..."
              className="flex-1 bg-transparent text-xs outline-none placeholder:opacity-40"
              style={{ color: theme.text }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer disabled:opacity-30"
              style={{ background: theme.accent }}
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
};

export default AIChatWidget;
