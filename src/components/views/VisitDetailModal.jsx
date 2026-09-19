import {
  MapPin,
  Clock,
  Calendar,
  FileText,
  Navigation,
  AlertCircle,
  Printer,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";

const getGoogleMapsUrl = (office, address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office}, Pakistan`)}`;

const VisitDetailModal = ({ open, onClose, visit }) => {
  const { theme } = useTheme();
  if (!visit) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const handleDirections = () => {
    window.open(getGoogleMapsUrl(visit.office, visit.address), "_blank", "noopener,noreferrer");
  };

  return (
    <Modal open={open} onClose={onClose} title="Visit Details" width="max-w-xl">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-bold" style={{ color: theme.text }}>
              {visit.service}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: theme.textMuted }}>
              {visit.office}
            </p>
          </div>
          <StatusBadge variant={visit.status === "upcoming" ? "blue" : visit.status === "completed" ? "green" : "gray"}>
            {visit.status}
          </StatusBadge>
        </div>

        {/* Info grid */}
        <div
          className="grid grid-cols-2 gap-3 rounded-xl p-3"
          style={{ background: theme.surfaceAlt }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: theme.accent }} />
            <div>
              <p className="text-[10px] font-semibold uppercase" style={{ color: theme.textMuted }}>Date</p>
              <p className="text-xs font-medium" style={{ color: theme.text }}>{formatDate(visit.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: theme.accent }} />
            <div>
              <p className="text-[10px] font-semibold uppercase" style={{ color: theme.textMuted }}>Time</p>
              <p className="text-xs font-medium" style={{ color: theme.text }}>{visit.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: theme.accent }} />
            <div>
              <p className="text-[10px] font-semibold uppercase" style={{ color: theme.textMuted }}>Address</p>
              <p className="text-xs font-medium" style={{ color: theme.text }}>{visit.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={14} style={{ color: theme.accent }} />
            <div>
              <p className="text-[10px] font-semibold uppercase" style={{ color: theme.textMuted }}>Gate / Counter</p>
              <p className="text-xs font-medium" style={{ color: theme.text }}>{visit.gate}</p>
            </div>
          </div>
        </div>

        {/* Required documents */}
        <div>
          <p className="mb-2 text-xs font-semibold" style={{ color: theme.textMuted }}>
            Required Documents
          </p>
          <div className="flex flex-wrap gap-1.5">
            {visit.documents?.map((doc, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ background: theme.surfaceAlt, color: theme.text }}
              >
                <FileText size={10} style={{ color: theme.accent }} />
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {visit.notes && (
          <div
            className="rounded-xl p-3"
            style={{ background: theme.accent + "08", border: `1px solid ${theme.accent}20` }}
          >
            <p className="text-xs font-semibold" style={{ color: theme.accent }}>
              Notes
            </p>
            <p className="mt-0.5 text-xs" style={{ color: theme.text }}>
              {visit.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {visit.status === "upcoming" && (
            <>
              <Button variant="ghost" icon={<Printer size={14} />}>
                Print Plan
              </Button>
              <Button variant="teal" icon={<Navigation size={14} />} onClick={handleDirections} className="hover:opacity-90 active:scale-95">
                Get Directions
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VisitDetailModal;
