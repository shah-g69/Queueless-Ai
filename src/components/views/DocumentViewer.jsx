import { useState, useRef } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  Tag,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";

const STATUS_META = {
  verified: { variant: "green", label: "Verified", Icon: CheckCircle2, color: "#22c55e" },
  pending: { variant: "yellow", label: "Pending", Icon: Clock, color: "#eab308" },
  missing: { variant: "gray", label: "Missing", Icon: AlertTriangle, color: "#94a3b8" },
  expired: { variant: "blue", label: "Expired", Icon: XCircle, color: "#0d9488" },
};

/**
 * DocumentViewer – Document detail modal with upload zone for missing docs.
 *
 * Props:
 *   open, onClose, document
 *   onVerify – callback(docId) fired after AI scan completes
 */
const DocumentViewer = ({ open, onClose, document, onVerify = () => {} }) => {
  const { theme } = useTheme();
  const [phase, setPhase] = useState("view"); // view | scanning | verified
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  if (!document) return null;

  const meta = STATUS_META[document.status] ?? STATUS_META.missing;
  const isMissing = document.status === "missing";

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    if (files.length > 0) {
      handleSimulateAI();
    } else {
      inputRef.current?.click();
    }
  };

  const handleSimulateAI = async () => {
    setPhase("scanning");
    await new Promise((r) => setTimeout(r, 1500));
    setPhase("verified");
    await new Promise((r) => setTimeout(r, 1000));
    onVerify(document.id);
    // Reset
    setFiles([]);
    setPhase("view");
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { setFiles([]); setPhase("view"); onClose(); }} title="Document Details">
      <div className="flex flex-col gap-4">
        {/* ── Scanning state ── */}
        {phase === "scanning" && (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Loader2 size={36} className="animate-spin" style={{ color: theme.accent }} />
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              Scanning with AI Agent...
            </p>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              Verifying document authenticity and format
            </p>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full" style={{ background: theme.surfaceAlt }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: "65%", background: theme.accent }} />
            </div>
          </div>
        )}

        {/* ── Verified state ── */}
        {phase === "verified" && (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#22c55e18" }}>
              <CheckCircle2 size={32} style={{ color: "#22c55e" }} />
            </div>
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              Document Verified!
            </p>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              AI verification complete — all checks passed
            </p>
          </div>
        )}

        {/* ── View / Upload state ── */}
        {phase === "view" && (
          <>
            {/* Icon & name */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: theme.accent + "12" }}
              >
                <FileText size={22} style={{ color: theme.accent }} />
              </div>
              <div>
                <p className="text-base font-bold" style={{ color: theme.text }}>
                  {document.name}
                </p>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  {document.description}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                Status:
              </span>
              <StatusBadge variant={meta.variant}>
                <meta.Icon size={10} className="mr-1 inline" />
                {meta.label}
              </StatusBadge>
            </div>

            {/* Details grid */}
            <div
              className="grid grid-cols-2 gap-3 rounded-xl p-3"
              style={{ background: theme.surfaceAlt }}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase" style={{ color: theme.textMuted }}>
                  Category
                </p>
                <p className="flex items-center gap-1 text-xs font-medium" style={{ color: theme.text }}>
                  <Tag size={11} /> {document.category}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase" style={{ color: theme.textMuted }}>
                  {document.date ? "Date Uploaded" : "Not Uploaded"}
                </p>
                {document.date && (
                  <p className="flex items-center gap-1 text-xs font-medium" style={{ color: theme.text }}>
                    <Calendar size={11} />
                    {new Date(document.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* ── Upload zone (missing docs only) ── */}
            {isMissing && (
              <div className="flex flex-col gap-3">
                <div
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-6 transition-colors cursor-pointer"
                  style={{
                    borderColor: dragOver ? theme.accent : theme.border,
                    background: dragOver ? theme.accent + "08" : theme.surfaceAlt,
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload
                    size={24}
                    strokeWidth={1.5}
                    className="mb-2"
                    style={{ color: dragOver ? theme.accent : theme.textMuted }}
                  />
                  <p className="text-xs font-medium" style={{ color: theme.text }}>
                    Drag &amp; drop your {document.name} PDF/Image here
                  </p>
                  <p className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                    or click to browse
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {["PDF", "PNG", "JPG"].map((fmt) => (
                      <span
                        key={fmt}
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{ background: theme.accent + "15", color: theme.accent }}
                      >
                        {fmt}
                      </span>
                    ))}
                    <span className="text-[9px] self-center" style={{ color: theme.textMuted }}>
                      (Max 10MB)
                    </span>
                  </div>
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleSelect}
                />

                {/* Selected files */}
                {files.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg px-3 py-2"
                        style={{ background: theme.surfaceAlt }}
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={12} style={{ color: theme.accent }} />
                          <span className="max-w-[160px] truncate text-[11px] font-medium" style={{ color: theme.text }}>
                            {file.name}
                          </span>
                          <span className="text-[9px]" style={{ color: theme.textMuted }}>
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                        <button onClick={() => removeFile(i)} className="cursor-pointer" style={{ color: theme.textMuted }}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Actions ── */}
        {phase === "view" && (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setFiles([]); onClose(); }}>
              Close
            </Button>
            {document.status === "verified" && (
              <Button variant="teal" icon={<Download size={14} />} className="hover:opacity-90 active:scale-95">
                Download
              </Button>
            )}
            {isMissing && (
              <Button
                variant="primary"
                icon={files.length > 0 ? <Loader2 size={14} /> : <Upload size={14} />}
                onClick={handleUploadClick}
                className="hover:opacity-90 active:scale-95"
              >
                {files.length > 0 ? "Upload Now" : "Select File"}
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DocumentViewer;
