import {
  Bot,
  FileCheck,
  Search,
  Map,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";

const AGENTS = [
  {
    id: 1,
    name: "Document Checklist Agent",
    icon: FileCheck,
    status: "Verified",
    detail: "3/4 rules checked",
    color: "#22c55e",
    statusType: "success",
  },
  {
    id: 2,
    name: "Missing Info Agent",
    icon: Search,
    status: "Active",
    detail: "Detected outdated utility bill",
    color: "#eab308",
    statusType: "warning",
  },
  {
    id: 3,
    name: "Visit Prep Agent",
    icon: Map,
    status: "Ready",
    detail: "Gate 2, Counter 5 route mapped",
    color: "#0d9488",
    statusType: "success",
  },
  {
    id: 4,
    name: "Reminder Agent",
    icon: Bell,
    status: "Scheduled",
    detail: "Follow-up SMS queued for visit day",
    color: "#6366f1",
    statusType: "info",
  },
];

const STATUS_ICON = {
  success: <CheckCircle2 size={13} />,
  warning: <AlertTriangle size={13} />,
  info: <Clock size={13} />,
};

/**
 * AgentStatusModal – Shows the AI agent swarm execution status.
 *
 * Props:
 *   open, onClose
 *   onStartNewApplication – callback
 */
const AgentStatusModal = ({ open, onClose, onStartNewApplication = () => {} }) => {
  const { theme } = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Active Agent Swarm Execution"
      width="max-w-lg"
    >
      <div className="flex flex-col gap-3">
        {/* Agent list */}
        {AGENTS.map((agent) => {
          const AgentIcon = agent.icon;
          return (
            <div
              key={agent.id}
              className="flex items-start gap-3 rounded-xl p-3"
              style={{
                background: theme.surfaceAlt,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Agent icon */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: agent.color + "15" }}
              >
                <AgentIcon size={18} style={{ color: agent.color }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold"
                  style={{ color: theme.text }}
                >
                  {agent.name}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: agent.color + "18",
                      color: agent.color,
                    }}
                  >
                    {STATUS_ICON[agent.statusType]}
                    {agent.status}
                  </span>
                </div>
                <p
                  className="mt-1 text-xs"
                  style={{ color: theme.textMuted }}
                >
                  {agent.detail}
                </p>
              </div>
            </div>
          );
        })}

        {/* Actions */}
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="teal"
            icon={<ArrowRight size={14} />}
            onClick={() => {
              onClose();
              onStartNewApplication();
            }}
            className="hover:opacity-90 active:scale-95"
          >
            Start New Application
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AgentStatusModal;
