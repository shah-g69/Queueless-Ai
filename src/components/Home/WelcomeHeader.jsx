import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../common/ThemeToggle";
import ProgressCircle from "../common/ProgressCircle";

/**
 * WelcomeHeader – Top section of the QueueLess AI home screen.
 *
 * Props:
 *   userName    – string displayed below the greeting
 *   readiness   – number 0-100 for readiness score
 *   missingDocs – number of missing documents
 */
const WelcomeHeader = ({ userName = "User", readiness = 0, missingDocs = 0 }) => {
  const { theme } = useTheme();

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section
      className="flex flex-col items-start justify-between gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-6"
      style={{
        background: theme.surface,
        border: `1.5px solid ${theme.accent}30`,
        boxShadow: theme.cardShadow,
      }}
    >
      {/* ---------- Left side ---------- */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full"
          style={{ background: theme.accent + "18" }}
        >
          <span
            className="select-none text-[18px] font-bold tracking-wide"
            style={{ color: theme.accent }}
          >
            {initials}
          </span>
        </div>
        <div>
          <p
            className="text-[22px] font-bold leading-tight"
            style={{ color: theme.text }}
          >
            Welcome Back,
          </p>
          <p className="mt-0.5 text-sm" style={{ color: theme.textMuted }}>
            {userName}
          </p>
        </div>
      </div>

      {/* ---------- Right side ---------- */}
      <div className="flex w-full items-center justify-between gap-5 sm:w-auto sm:justify-end">
        <div className="text-right sm:text-left">
          <p
            className="text-sm font-semibold"
            style={{ color: theme.textMuted }}
          >
            {readiness > 0 ? "Readiness Score:" : "No Active Application"}
          </p>
          {readiness > 0 ? (
            <>
              <p
                className="mt-0.5 text-[22px] font-bold leading-tight"
                style={{ color: theme.accent }}
              >
                {readiness}% Done
              </p>
              {missingDocs > 0 ? (
                <p
                  className="mt-0.5 text-[11px] font-medium"
                  style={{ color: "#eab308" }}
                >
                  {missingDocs} Document Missing
                </p>
              ) : readiness === 100 ? (
                <p
                  className="mt-0.5 text-[11px] font-bold"
                  style={{ color: "#22c55e" }}
                >
                  ✓ Fully Prepared
                </p>
              ) : null}
            </>
          ) : (
            <p
              className="mt-0.5 text-sm"
              style={{ color: theme.textMuted }}
            >
              Select a service to begin
            </p>
          )}
        </div>
        <div className="relative flex shrink-0 items-center justify-center">
          <ProgressCircle
            progress={readiness}
            size={72}
            strokeWidth={6}
            color={readiness > 0 ? theme.accent : theme.border}
            trackColor={theme.accent + "25"}
          />
          <span
            className="absolute text-sm font-bold"
            style={{ color: readiness > 0 ? theme.accent : theme.textMuted }}
          >
            {readiness > 0 ? `${readiness}%` : "—"}
          </span>
        </div>
        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>
    </section>
  );
};

export default WelcomeHeader;
