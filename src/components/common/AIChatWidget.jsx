import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageCircle, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const QUICK_QUESTIONS = [
  "What documents do I need for CNIC?",
  "How long does passport processing take?",
  "Where is the nearest NADRA office?",
  "What are the office hours?",
];

const AI_RESPONSES = {
  "What documents do I need for CNIC?":
    "For a CNIC update/renewal, you need: (1) Original CNIC, (2) Passport-size photos (2 copies), (3) Proof of address (utility bill < 3 months old), (4) Birth certificate or B-Form. All originals + photocopies required.",
  "How long does passport processing take?":
    "Standard passport processing takes 7-10 working days. Executive processing is available for 3-5 days at select offices. You'll receive an SMS when your passport is ready for collection.",
  "Where is the nearest NADRA office?":
    "Based on your location, the nearest NADRA Mega Center is at Blue Area, Islamabad. Use the 'Find Office' feature in the Quick Access Hub for directions and token times.",
  "What are the office hours?":
    "Most government offices operate Mon-Fri, 8:00 AM - 4:00 PM. NADRA Mega Centers have extended hours until 5:00 PM. It's best to arrive before 10:00 AM to avoid long queues.",
};

const AIChatWidget = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Hello! I'm your QueueLess AI assistant. How can I help you with your government service visit today?",
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

  const simulateAIResponse = (userMessage) => {
    setIsTyping(true);
    const response =
      AI_RESPONSES[userMessage] ||
      `I understand you're asking about "${userMessage}". Let me help you with that. For the most accurate information, I recommend checking the specific service requirements in the Quick Access Hub or visiting the office directly.`;

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", text: response },
      ]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: msg },
    ]);
    setInput("");
    simulateAIResponse(msg);
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
          className="fixed bottom-24 right-5 z-[90] flex w-[360px] flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            height: "min(520px, 70vh)",
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
                <p className="text-sm font-bold text-white">QueueLess AI</p>
                <p className="text-[10px] text-white/70">Always online</p>
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
                  className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={{
                    background:
                      msg.role === "user" ? theme.accent : theme.surfaceAlt,
                    color:
                      msg.role === "user" ? "#ffffff" : theme.text,
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
                    background: theme.accent + "12",
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
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
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
