import { useState } from "react";
import {
  Search,
  Upload,
  FileText,
  Shield,
  CreditCard,
  Stethoscope,
  Scale,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Filter,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import FileUploadModal from "../components/views/FileUploadModal";
import DocumentViewer from "../components/views/DocumentViewer";
import Toast from "../components/common/Toast";

/* ──────────── Mock Data ──────────── */
const DOCUMENTS = [
  { id: 1, name: "National ID Card", description: "Government-issued identity document", category: "identity", status: "verified", date: "2026-08-12", icon: Shield },
  { id: 2, name: "Passport", description: "International travel document", category: "identity", status: "verified", date: "2026-07-20", icon: Shield },
  { id: 3, name: "Birth Certificate", description: "Official record of birth", category: "identity", status: "pending", date: "2026-09-01", icon: Shield },
  { id: 4, name: "Tax Clearance Certificate", description: "Proof of tax compliance", category: "financial", status: "verified", date: "2026-06-15", icon: CreditCard },
  { id: 5, name: "Bank Statement", description: "Last 3 months financial summary", category: "financial", status: "missing", date: null, icon: CreditCard },
  { id: 6, name: "Proof of Income", description: "Salary slips or employment letter", category: "financial", status: "pending", date: "2026-09-10", icon: CreditCard },
  { id: 7, name: "Medical Fitness Certificate", description: "Health clearance from registered physician", category: "medical", status: "expired", date: "2025-12-01", icon: Stethoscope },
  { id: 8, name: "Vaccination Record", description: "Immunization history document", category: "medical", status: "verified", date: "2026-03-22", icon: Stethoscope },
  { id: 9, name: "Power of Attorney", description: "Legal authorization document", category: "legal", status: "missing", date: null, icon: Scale },
  { id: 10, name: "Residence Permit", description: "Proof of residential address", category: "identity", status: "verified", date: "2026-05-18", icon: Shield },
];

const CATEGORIES = [
  { key: "all", label: "All Documents", icon: FileText },
  { key: "identity", label: "Identity", icon: Shield },
  { key: "financial", label: "Financial", icon: CreditCard },
  { key: "medical", label: "Medical", icon: Stethoscope },
  { key: "legal", label: "Legal", icon: Scale },
];

const STATUS_CONFIG = {
  verified: { variant: "green", label: "Verified", Icon: CheckCircle2 },
  pending: { variant: "yellow", label: "Pending", Icon: Clock },
  missing: { variant: "gray", label: "Missing", Icon: AlertTriangle },
  expired: { variant: "blue", label: "Expired", Icon: XCircle },
};

/* ──────────── Component ──────────── */
const Documents = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [docs, setDocs] = useState(DOCUMENTS);

  const filtered = docs.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: docs.length,
    verified: docs.filter((d) => d.status === "verified").length,
    pending: docs.filter((d) => d.status === "pending").length,
    missing: docs.filter((d) => d.status === "missing").length,
  };

  const handleVerify = (docId) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, status: "verified", date: new Date().toISOString().split("T")[0] }
          : d,
      ),
    );
    setToast({ message: "Document verified by AI agent", type: "success" });
  };

  const handleDownload = (doc) => {
    setToast({ message: `Downloading "${doc.name}"`, type: "success" });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: theme.text }}>Document Vault</h1>
          <p className="mt-0.5 text-sm" style={{ color: theme.textMuted }}>Manage and track all your important documents</p>
        </div>
        <Button variant="teal" icon={<Upload size={16} />} className="self-start sm:self-auto" onClick={() => setUploadOpen(true)}>
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, color: theme.accent },
          { label: "Verified", value: stats.verified, color: "#22c55e" },
          { label: "Pending", value: stats.pending, color: "#eab308" },
          { label: "Missing", value: stats.missing, color: theme.textMuted },
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
            <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:opacity-50" style={{ color: theme.text }} />
            {search && (
              <button onClick={() => setSearch("")} className="cursor-pointer" style={{ color: theme.textMuted }}>
                <XCircle size={16} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              const CatIcon = cat.icon;
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer" style={{ background: isActive ? theme.accent : theme.surfaceAlt, color: isActive ? theme.accentText : theme.textMuted, border: `1px solid ${isActive ? theme.accent : theme.border}` }}>
                  <CatIcon size={13} />
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: theme.textMuted }} />
            <div className="flex flex-wrap gap-1.5">
              {["all", "verified", "pending", "missing", "expired"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors cursor-pointer" style={{ background: statusFilter === s ? theme.accent + "20" : "transparent", color: statusFilter === s ? theme.accent : theme.textMuted }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Document List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <Card className="flex flex-col items-center py-12 text-center">
            <FileText size={40} strokeWidth={1.2} className="mb-3" style={{ color: theme.textMuted }} />
            <p className="text-sm font-medium" style={{ color: theme.textMuted }}>No documents match your filters.</p>
          </Card>
        )}

        {filtered.map((doc) => {
          const statusInfo = STATUS_CONFIG[doc.status];
          const DocIcon = doc.icon;
          return (
            <Card key={doc.id} className="flex items-center gap-4 transition-shadow hover:shadow-md" padding="p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: theme.accent + "12" }}>
                <DocIcon size={20} style={{ color: theme.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold" style={{ color: theme.text }}>{doc.name}</p>
                  <StatusBadge variant={statusInfo.variant}>
                    <statusInfo.Icon size={10} className="mr-1 inline" />
                    {statusInfo.label}
                  </StatusBadge>
                </div>
                <p className="mt-0.5 truncate text-xs" style={{ color: theme.textMuted }}>{doc.description}</p>
                {doc.date && (
                  <p className="mt-1 text-[11px]" style={{ color: theme.textMuted + "aa" }}>
                    {new Date(doc.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button onClick={() => setViewerDoc(doc)} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-black/5" style={{ color: theme.textMuted }} title="View">
                  <Eye size={16} />
                </button>
                {doc.status === "verified" && (
                  <button onClick={() => handleDownload(doc)} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-black/5" style={{ color: theme.textMuted }} title="Download">
                    <Download size={16} />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs" style={{ color: theme.textMuted }}>
        Showing {filtered.length} of {DOCUMENTS.length} documents
      </p>

      {/* Modals */}
      <FileUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document" onUpload={(files) => { setToast({ message: `${files.length} document(s) uploaded successfully`, type: "success" }); setUploadOpen(false); }} />
      <DocumentViewer open={!!viewerDoc} onClose={() => setViewerDoc(null)} document={viewerDoc} onVerify={handleVerify} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </div>
  );
};

export default Documents;
