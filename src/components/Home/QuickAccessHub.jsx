import { CalendarPlus, FolderOpen, Map, Clock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";

/**
 * QuickAccessHub – 2×2 grid of actionable quick-access cards.
 *
 * Props:
 *   onNewApplication  – callback
 *   onDocumentVault   – callback
 *   onRoadmap         – callback
 *   onFindOffice      – callback
 */
const QuickAccessHub = ({
  onNewApplication = () => {},
  onDocumentVault = () => {},
  onRoadmap = () => {},
  onFindOffice = () => {},
}) => {
  const { theme } = useTheme();

  const items = [
    {
      id: 1,
      label: "Start New Application",
      icon: <CalendarPlus size={26} style={{ color: theme.accent }} />,
      onClick: onNewApplication,
    },
    {
      id: 2,
      label: "Document Vault",
      sub: "3 Saved",
      icon: <FolderOpen size={26} style={{ color: theme.accent }} />,
      onClick: onDocumentVault,
    },
    {
      id: 3,
      label: "Step-by-Step Visit Roadmap",
      icon: <Map size={26} style={{ color: theme.accent }} />,
      onClick: onRoadmap,
    },
    {
      id: 4,
      label: "Find Office / Token Times",
      icon: <Clock size={26} style={{ color: theme.accent }} />,
      onClick: onFindOffice,
    },
  ];

  return (
    <div className="flex min-w-0 flex-col">
      <h2 className="mb-3 text-base font-bold" style={{ color: theme.text }}>
        Quick Access Hub
      </h2>
      <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-3">
        {items.map((item) => (
          <Card
            key={item.id}
            onClick={item.onClick}
            className="flex flex-col items-center justify-center gap-2 py-5 text-center cursor-pointer transition-shadow hover:shadow-md"
            padding="p-4"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: theme.accent + "15" }}
            >
              {item.icon}
            </div>
            <span
              className="text-xs font-bold leading-tight"
              style={{ color: theme.text }}
            >
              {item.label}
            </span>
            {item.sub && (
              <span
                className="text-[10px] font-medium"
                style={{ color: theme.textMuted }}
              >
                {item.sub}
              </span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessHub;
