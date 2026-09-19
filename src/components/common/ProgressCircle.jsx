/**
 * ProgressCircle – SVG-based circular progress indicator.
 *
 * Props:
 *   progress    – number 0-100 (default 0)
 *   size        – diameter in px (default 64)
 *   strokeWidth – ring thickness in px (default 6)
 *   color       – stroke colour for the filled arc
 *   trackColor  – stroke colour for the background ring
 */
const ProgressCircle = ({
  progress = 0,
  size = 64,
  strokeWidth = 6,
  color,
  trackColor,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

  // Fallback colours if not provided via theme
  const filled = color || "#0d9488";
  const track = trackColor || "#e0f4f4";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
      aria-label={`${clampedProgress}% complete`}
      role="img"
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={track}
        strokeWidth={strokeWidth}
      />
      {/* Filled arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={filled}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
};

export default ProgressCircle;
