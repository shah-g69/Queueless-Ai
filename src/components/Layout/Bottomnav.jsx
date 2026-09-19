import { Home, FileText, Calendar, HelpCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * BottomNav – Theme-aware fixed bottom navigation bar.
 */
const Bottomnav = ({ activeTab = "home", onTabClick = () => {} }) => {
  const { theme } = useTheme();

  const tabs = [
    { key: "home", label: "HOME", icon: Home },
    { key: "documents", label: "DOCUMENTS", icon: FileText },
    { key: "visits", label: "VISITS", icon: Calendar },
    { key: "help", label: "HELP", icon: HelpCircle },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full"
      style={{
        background: theme.navBg,
        borderTop: `1px solid ${theme.border}`,
      }}
    >
      <div className="mx-auto flex max-w-[900px] items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onTabClick(tab.key)}
              className="flex flex-1 flex-col items-center gap-0.5 px-2 py-1 transition-colors cursor-pointer"
              style={{ color: isActive ? theme.accent : theme.textMuted }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-semibold leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Bottomnav;
