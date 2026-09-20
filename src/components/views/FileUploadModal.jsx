import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";

/**
 * FileUploadModal – Drag-and-drop upload with optional AI verification simulation.
 *
 * Props:
 *   open, onClose, title, accept, onUpload, onSimulateAI
 */
const FileUploadModal = ({
  open,
  onClose,
  title = "Upload Document",
  accept = ".jpg,.jpeg,.png,.pdf",
  onUpload = () => {},
  onSimulateAI = null, // pass callback to enable AI verify button
}) => {
  const { theme } = useTheme();
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [phase, setPhase] = useState("select"); // select | scanning | verified
  const inputRef = useRef(null);

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

  const handleUpload = async () => {
    setPhase("scanning");
    await new Promise((r) => setTimeout(r, 2000));
    onUpload(files);
    setFiles([]);
    setPhase("select");
    onClose();
  };

  const handleSimulateAI = async () => {
    setPhase("scanning");
    // Simulate 2.5s AI scanning
    await new Promise((r) => setTimeout(r, 2500));
    setPhase("verified");
    // Wait 1s showing success, then close and update parent state
    await new Promise((r) => setTimeout(r, 1200));
    onSimulateAI?.();
    setFiles([]);
    setPhase("select");
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { setPhase("select"); onClose(); }} title={title}>
      <div className="flex flex-col gap-4">
        {/* ── Scanning Overlay ── */}
        {phase === "scanning" && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: theme.accent }}
            />
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              AI Scanning Document...
            </p>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              Verifying authenticity and format
            </p>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full" style={{ background: theme.surfaceAlt }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: "70%", background: theme.accent }}
              />
            </div>
          </div>
        )}

        {/* ── Verified State ── */}
        {phase === "verified" && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "#22c55e18" }}
            >
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

        {/* ── File Select State ── */}
        {phase === "select" && (
          <>
            {/* Drop zone */}
            <div
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 transition-colors cursor-pointer"
              style={{
                borderColor: dragOver ? theme.accent : theme.borderSoft,
                background: dragOver ? theme.accent + "08" : theme.inputBg,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              {files.length > 0 ? (
                <>
                  <div
                    className="mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: "#22c55e18" }}
                  >
                    <CheckCircle2 size={22} style={{ color: "#22c55e" }} />
                  </div>
                  <p className="max-w-[220px] truncate text-sm font-semibold" style={{ color: theme.text }}>
                    {files[0].name}
                  </p>
                  {files.length > 1 && (
                    <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                      +{files.length - 1} more file{files.length > 2 ? "s" : ""}
                    </p>
                  )}
                  <p className="mt-2 text-xs" style={{ color: theme.accent }}>
                    Tap to add more files
                  </p>
                </>
              ) : (
                <>
                  <Upload
                    size={32}
                    strokeWidth={1.5}
                    className="mb-2"
                    style={{ color: dragOver ? theme.accent : theme.textMuted }}
                  />
                  <p className="text-sm font-medium" style={{ color: theme.text }}>
                    Drag &amp; drop files here
                  </p>
                  <p className="mt-1 text-xs" style={{ color: theme.textMuted }}>
                    or click to browse
                  </p>
                  <p className="mt-1 text-[10px]" style={{ color: theme.textMuted }}>
                    JPG, PNG, or PDF — max 10MB
                  </p>
                </>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={handleSelect}
            />

            {/* Selected files */}
            {files.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                  Selected Files
                </p>
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                    style={{
                      background: theme.inputBg,
                      borderColor: theme.borderSoft,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} style={{ color: theme.accent }} />
                      <span
                        className="max-w-[180px] truncate text-xs font-medium"
                        style={{ color: theme.text }}
                      >
                        {file.name}
                      </span>
                      <span className="text-[10px]" style={{ color: theme.textMuted }}>
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="cursor-pointer"
                      style={{ color: theme.textMuted }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Actions ── */}
        {phase === "select" && (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {onSimulateAI && files.length > 0 && (
              <Button
                variant="primary"
                icon={<Loader2 size={14} />}
                onClick={handleSimulateAI}
              >
                Simulate AI Verification
              </Button>
            )}
            <Button
              variant="teal"
              icon={<Upload size={14} />}
              onClick={handleUpload}
              disabled={files.length === 0}
            >
              Upload {files.length > 0 ? `(${files.length})` : ""}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileUploadModal;
