import { useState } from "react";
import { Bot, ChevronRight, Inbox } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";
import Modal from "../common/Modal";

/**
 * AIAgentFeed – Right-side panel showing the live AI Agent Insight.
 * Summary is hard-clamped to 2 lines; full text opens in a modal popup
 * so the card can never grow vertically.
 *
 * Props:
 *   insight        – { message: string }
 *   hasApplication – boolean
 */
const AIAgentFeed = ({
  insight = { message: "" },
  hasApplication = true,
}) => {
  const { theme } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  const message = insight?.message || "";

  return (
    <div className="flex min-w-0 flex-col">
      <h2 className="mb-3 text-base font-bold" style={{ color: theme.text }}>
        Live AI Agent Feed
      </h2>
      <Card className="flex-1 overflow-hidden">
        {!hasApplication ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full mb-3"
              style={{ background: theme.surfaceAlt }}
            >
              <Inbox size={24} style={{ color: theme.textMuted }} />
            </div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              No Agent Activity
            </p>
            <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
              Start an application to see live insights
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{
                background: theme.accent + "10",
                border: `1px solid ${theme.accent}25`,
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: theme.accent + "20" }}
              >
                <Bot size={16} style={{ color: theme.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold" style={{ color: theme.accent }}>
                  AI Agent Insight
                </p>
                {/* Hard 2-line summary — never expands inline */}
                <p
                  className="mt-0.5 text-xs leading-relaxed"
                  style={{
                    color: theme.text,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {message}
                </p>
              </div>
            </div>

            {/* Popup trigger — keeps the card compact */}
            <button
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-1 self-start text-[11px] font-semibold transition-colors hover:opacity-80 cursor-pointer"
              style={{ color: theme.accent }}
            >
              Read Details
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </Card>

      {/* Full insight popup */}
      <Modal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        title="AI Agent Insight"
      >
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 mb-4"
          style={{
            background: theme.accent + "10",
            border: `1px solid ${theme.accent}25`,
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: theme.accent + "20" }}
          >
            <Bot size={16} style={{ color: theme.accent }} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
            {message}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AIAgentFeed;
