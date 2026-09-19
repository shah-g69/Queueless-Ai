import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Send,
  XCircle,
  Plus,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";
import Button from "../common/Button";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=NADRA+Mega+Center+Blue+Area+Islamabad,+Pakistan";

const getDaysUntil = (dateStr) => {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
};

const formatCountdown = (days) => {
  if (days < 0) return "Past due";
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
};

/**
 * VisitTracker – Displays upcoming visit with countdown + deadline badges.
 */
const VisitTracker = ({
  hasApplication = true,
  onCancelApplication = () => {},
  onGetDirections = () => {},
  onMenuClick = () => {},
  visitDate = "2026-09-25",
}) => {
  const { theme } = useTheme();
  const [countdown, setCountdown] = useState(() => getDaysUntil(visitDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getDaysUntil(visitDate));
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, [visitDate]);

  const handleDirections = () => {
    window.open(GOOGLE_MAPS_URL, "_blank", "noopener,noreferrer");
  };

  const isUrgent = countdown <= 3 && countdown >= 0;
  const isPast = countdown < 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold" style={{ color: theme.text }}>
          Upcoming Visit Tracker
        </h2>
        {hasApplication && (
          <button
            onClick={onMenuClick}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer hover:opacity-70 active:scale-90"
            style={{ color: theme.textMuted }}
          >
            <MoreHorizontal size={20} />
          </button>
        )}
      </div>
      <Card className="flex items-center justify-between">
        {hasApplication ? (
          <>
            <div className="flex items-center gap-4">
              {/* Countdown badge */}
              <div
                className="flex flex-col items-center justify-center rounded-xl px-3 py-2"
                style={{
                  background: isPast
                    ? "#94a3b818"
                    : isUrgent
                      ? "#ef444418"
                      : theme.accent + "12",
                  minWidth: "64px",
                }}
              >
                <span
                  className="text-lg font-bold leading-none"
                  style={{
                    color: isPast
                      ? theme.textMuted
                      : isUrgent
                        ? "#ef4444"
                        : theme.accent,
                  }}
                >
                  {countdown <= 0 ? "!" : countdown}
                </span>
                <span
                  className="text-[9px] font-semibold uppercase"
                  style={{
                    color: isPast
                      ? theme.textMuted
                      : isUrgent
                        ? "#ef4444"
                        : theme.accent,
                  }}
                >
                  {countdown <= 0 ? "past" : "days"}
                </span>
              </div>

              <div>
                <p className="text-sm font-bold" style={{ color: theme.text }}>
                  Your Visit
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: theme.textMuted }}
                  >
                    <CalendarDays size={11} />
                    {new Date(visitDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: theme.textMuted }}
                  >
                    <Clock size={11} />
                    8am-3pm
                  </span>
                </div>
                {/* Deadline badge */}
                {isUrgent && !isPast && (
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{ background: "#ef444418", color: "#ef4444" }}
                  >
                    ⚡ {formatCountdown(countdown)} — Prepare now!
                  </span>
                )}
                {countdown > 3 && (
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{ background: theme.accent + "15", color: theme.accent }}
                  >
                    📅 {formatCountdown(countdown)} remaining
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="teal"
                icon={<Send size={16} />}
                onClick={handleDirections}
                className="hover:opacity-90 active:scale-95"
              >
                Get Directions
              </Button>
              <Button
                variant="ghost"
                icon={<XCircle size={14} />}
                onClick={onCancelApplication}
                className="hover:opacity-90 active:scale-95 text-red-500"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-sm font-bold" style={{ color: theme.text }}>
                No Upcoming Visits
              </p>
              <p className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
                Start an application to schedule a visit
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default VisitTracker;
