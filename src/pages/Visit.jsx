import { useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  Trash2,
  FileText,
  ChevronRight,
  CalendarCheck,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import VisitDetailModal from "../components/views/VisitDetailModal";
import NewApplicationModal from "../components/views/NewApplicationModal";
import OfficeFinder from "../components/views/OfficeFinder";

/* ──────────── Mock Data ──────────── */
const VISITS = [
  { id: 1, service: "ID Card Renewal", office: "NADRA Mega Center", address: "Blue Area, Islamabad", date: "2026-09-25", time: "09:00 AM", status: "upcoming", prepProgress: 75, documents: ["National ID", "Passport Photo", "Proof of Address"], notes: "Bring original documents. Arrive 15 minutes early.", gate: "Gate 2, Counter 5" },
  { id: 2, service: "Passport Application", office: "Regional Passport Office", address: "G-10/4, Islamabad", date: "2026-09-30", time: "10:30 AM", status: "upcoming", prepProgress: 40, documents: ["Birth Certificate", "National ID", "Photos"], notes: "Biometric capture required. No appointments for minors.", gate: "Gate 1, Counter 3" },
  { id: 3, service: "Tax Clearance", office: "Excise & Taxation Department", address: "H-9, Islamabad", date: "2026-09-18", time: "02:00 PM", status: "completed", prepProgress: 100, documents: ["Tax Returns", "Bank Statements"], notes: "All documents verified. Certificate issued.", gate: "Window 12" },
  { id: 4, service: "Business Registration", office: "Companies Registry", address: "Blue Area, Islamabad", date: "2026-09-10", time: "11:00 AM", status: "completed", prepProgress: 100, documents: ["Articles of Incorporation", "ID Copies"], notes: "Registration completed successfully.", gate: "Ground Floor, Desk 8" },
  { id: 5, service: "Birth Certificate Copy", office: "NADRA Registration Center", address: "Murree Road, Rawalpindi", date: "2026-09-05", time: "08:30 AM", status: "cancelled", prepProgress: 30, documents: ["Parent IDs", "Application Form"], notes: "Cancelled due to system outage.", gate: "Desk 4" },
  { id: 6, service: "Driving License Renewal", office: "Regional Transport Office", address: "Service Center, Murree Road", date: "2026-08-20", time: "01:00 PM", status: "completed", prepProgress: 100, documents: ["Old License", "Medical Certificate", "Photos"], notes: "Vision test passed. New license mailed.", gate: "Lane 4" },
];

const STATUS_META = {
  upcoming: { variant: "blue", label: "Upcoming", Icon: CalendarCheck },
  completed: { variant: "green", label: "Completed", Icon: CheckCircle2 },
  cancelled: { variant: "gray", label: "Cancelled", Icon: XCircle },
};

const getGoogleMapsUrl = (office) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office}, Pakistan`)}`;

/* ──────────── Component ──────────── */
const Visits = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [detailVisit, setDetailVisit] = useState(null);
  const [newAppOpen, setNewAppOpen] = useState(false);
  const [officeOpen, setOfficeOpen] = useState(false);
  const [cancelledIds, setCancelledIds] = useState([]);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const filtered = VISITS.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch = v.service.toLowerCase().includes(q) || v.office.toLowerCase().includes(q) || v.address.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const notCancelled = !cancelledIds.includes(v.id);
    return matchesSearch && matchesStatus && notCancelled;
  });

  const stats = {
    upcoming: VISITS.filter((v) => v.status === "upcoming" && !cancelledIds.includes(v.id)).length,
    completed: VISITS.filter((v) => v.status === "completed").length,
    cancelled: VISITS.filter((v) => v.status === "cancelled" || cancelledIds.includes(v.id)).length,
  };

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const confirmCancel = (id) => {
    setCancelledIds((prev) => [...prev, id]);
    setCancelConfirmId(null);
    setExpandedId(null);
  };

  const handleGetDirections = (e, office) => {
    e.stopPropagation();
    window.open(getGoogleMapsUrl(office), "_blank", "noopener,noreferrer");
  };

  const handleViewPlan = (e, visit) => {
    e.stopPropagation();
    setDetailVisit(visit);
  };

  const handleCancelClick = (e, id) => {
    e.stopPropagation();
    setCancelConfirmId(id);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: theme.text }}>My Visits</h1>
          <p className="mt-0.5 text-sm" style={{ color: theme.textMuted }}>Track and manage your government office visits</p>
        </div>
        <Button variant="teal" icon={<Plus size={16} />} className="self-start sm:self-auto" onClick={() => setNewAppOpen(true)}>
          Plan New Visit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Upcoming", value: stats.upcoming, color: theme.accent },
          { label: "Completed", value: stats.completed, color: "#22c55e" },
          { label: "Cancelled", value: stats.cancelled, color: theme.textMuted },
        ].map((s) => (
          <Card key={s.label} className="flex flex-col items-center py-4">
            <span className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
            <span className="mt-0.5 text-xs font-medium" style={{ color: theme.textMuted }}>{s.label}</span>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <Card padding="p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: theme.surfaceAlt, border: `1px solid ${theme.border}` }}>
            <Search size={16} style={{ color: theme.textMuted }} />
            <input type="text" placeholder="Search visits by service, office, or address..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:opacity-50" style={{ color: theme.text }} />
            {search && (
              <button onClick={() => setSearch("")} className="cursor-pointer" style={{ color: theme.textMuted }}>
                <XCircle size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {["all", "upcoming", "completed", "cancelled"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className="rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer" style={{ background: statusFilter === s ? theme.accent + "20" : "transparent", color: statusFilter === s ? theme.accent : theme.textMuted }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Visit Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <Card className="flex flex-col items-center py-12 text-center">
            <Calendar size={40} strokeWidth={1.2} className="mb-3" style={{ color: theme.textMuted }} />
            <p className="text-sm font-medium" style={{ color: theme.textMuted }}>No visits match your filters.</p>
          </Card>
        )}

        {filtered.map((visit) => {
          const meta = STATUS_META[visit.status];
          const isExpanded = expandedId === visit.id;
          const isCancelling = cancelConfirmId === visit.id;

          return (
            <Card key={visit.id} padding="p-0">
              {/* ── Card header (toggle) ── */}
              <button onClick={() => toggleExpand(visit.id)} className="flex w-full items-center gap-4 p-4 text-left cursor-pointer">
                <div className="h-12 w-1 shrink-0 rounded-full" style={{ background: visit.status === "upcoming" ? theme.accent : visit.status === "completed" ? "#22c55e" : theme.textMuted + "60" }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="truncate text-sm font-bold" style={{ color: theme.text }}>{visit.service}</p>
                    <StatusBadge variant={meta.variant}>
                      <meta.Icon size={10} className="mr-1 inline" />
                      {meta.label}
                    </StatusBadge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-xs" style={{ color: theme.textMuted }}><MapPin size={12} />{visit.office}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: theme.textMuted }}><Calendar size={12} />{formatDate(visit.date)}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: theme.textMuted }}><Clock size={12} />{visit.time}</span>
                  </div>
                  {visit.status === "upcoming" && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: theme.surfaceAlt }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${visit.prepProgress}%`, background: theme.accent }} />
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: theme.accent }}>{visit.prepProgress}%</span>
                    </div>
                  )}
                </div>
                <ChevronRight size={18} className="shrink-0 transition-transform" style={{ color: theme.textMuted, transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }} />
              </button>

              {/* ── Expanded details ── */}
              {isExpanded && (
                <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: theme.border }}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>Office Address</p>
                        <p className="flex items-start gap-1.5 text-sm" style={{ color: theme.text }}><MapPin size={14} className="mt-0.5 shrink-0" style={{ color: theme.accent }} />{visit.address}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>Gate / Counter</p>
                        <p className="flex items-center gap-1.5 text-sm" style={{ color: theme.text }}><AlertCircle size={14} style={{ color: theme.accent }} />{visit.gate}</p>
                      </div>
                      {visit.notes && (
                        <div>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>Notes</p>
                          <p className="text-sm" style={{ color: theme.text }}>{visit.notes}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: theme.textMuted }}>Required Documents</p>
                      <div className="flex flex-col gap-1.5">
                        {visit.documents.map((doc, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: theme.surfaceAlt }}>
                            <FileText size={14} style={{ color: theme.accent }} />
                            <span className="text-xs font-medium" style={{ color: theme.text }}>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Inline cancel confirmation ── */}
                  {isCancelling && (
                    <div
                      className="mt-4 flex items-center justify-between rounded-xl px-4 py-3"
                      style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                    >
                      <p className="text-sm font-semibold text-red-600">
                        Cancel this visit?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCancelConfirmId(null);
                          }}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          No
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmCancel(visit.id);
                          }}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Action buttons (all with stopPropagation) ── */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {visit.status === "upcoming" && !isCancelling && (
                      <>
                        <Button
                          variant="teal"
                          icon={<Send size={14} />}
                          onClick={(e) => handleGetDirections(e, visit.office)}
                          className="hover:opacity-90 active:scale-95"
                        >
                          Get Directions
                        </Button>
                        <Button
                          variant="ghost"
                          icon={<Eye size={14} />}
                          onClick={(e) => handleViewPlan(e, visit)}
                          className="hover:opacity-90 active:scale-95"
                        >
                          View Full Plan
                        </Button>
                        <Button
                          variant="ghost"
                          icon={<Trash2 size={14} />}
                          onClick={(e) => handleCancelClick(e, visit.id)}
                          className="hover:opacity-90 active:scale-95 text-red-500"
                        >
                          Cancel Visit
                        </Button>
                      </>
                    )}
                    {visit.status === "completed" && (
                      <Button
                        variant="ghost"
                        icon={<Eye size={14} />}
                        onClick={(e) => handleViewPlan(e, visit)}
                        className="hover:opacity-90 active:scale-95"
                      >
                        View Summary
                      </Button>
                    )}
                    {visit.status === "cancelled" && (
                      <Button
                        variant="ghost"
                        icon={<Eye size={14} />}
                        onClick={(e) => handleViewPlan(e, visit)}
                        className="hover:opacity-90 active:scale-95"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs" style={{ color: theme.textMuted }}>
        Showing {filtered.length} of {VISITS.length} visits
      </p>

      {/* Modals */}
      <VisitDetailModal open={!!detailVisit} onClose={() => setDetailVisit(null)} visit={detailVisit} />
      <NewApplicationModal open={newAppOpen} onClose={() => setNewAppOpen(false)} />
      <OfficeFinder open={officeOpen} onClose={() => setOfficeOpen(false)} />
    </div>
  );
};

export default Visits;
