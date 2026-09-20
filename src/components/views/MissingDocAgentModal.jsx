import { useState, useRef } from "react";
import {
  AlertTriangle,
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  CalendarX,
  MapPin,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../common/Modal";
import Button from "../common/Button";

/**
 * MissingDocAgentModal – AI Missing Information Agent dialog.
 *
 * Props:
 *   open, onClose
 *   onComplete – callback fired after AI scan succeeds
 */
const MissingDocAgentModal = ({ open, onClose, onComplete = () => {} }) => {
  const { theme } = useTheme();
  const [phase, setPhase] = useState("select"); // select | scanning | verified
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
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

  const handleSimulateAI = async () => {
    setPhase("scanning");
    // 1.5s scanning simulation
    await new Promise((r) => setTimeout(r, 1500));
    setPhase("verified");
    // Brief success display, then complete
    await new Promise((r) => setTimeout(r, 1000));
    onComplete();
    // Reset for next open
    setFiles([]);
    setPhase("select");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setFiles([]);
        setPhase("select");
        onClose();
      }}
      title="AI Missing Information Agent"
      width="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        {/* ── Scanning state ── */}
        {phase === "scanning" && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: theme.accent }}
            />
            <p className="text-sm font-bold" style={{ color: theme.text }}>
              Scanning document dates &amp; address...
            </p>
            <p className="text-xs" style={{ color: theme.textMuted }}>
              AI verifying bill freshness and address match
            </p>
            <div
              className="mt-2 h-1.5 w-48 overflow-hidden rounded-full"
              style={{ background: theme.surfaceAlt }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: "60%", background: theme.accent }}
              />
            </div>
          </div>
        )}

        {/* ── Verified state ── */}
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
              Address matches • Bill dated within 90 days
            </p>
          </div>
        )}

        {/* ── Select state ── */}
        {phase === "select" && (
          <>
            {/* What's missing */}
            <div
              className="rounded-xl p-3"
              style={{
                background: theme.alertBg,
                border: `1px solid ${theme.alertBorder}`,
              }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: theme.alertText }}
                />
                <div>
                  <p
                    className="text-xs font-bold"
                    style={{ color: theme.alertText }}
                  >
                    Missing Document
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: theme.alertText, opacity: 0.85 }}
                  >
                    <strong>Required:</strong> Utility Bill under 3 months old
                    or Registered Lease Agreement
                  </p>
                </div>
              </div>
            </div>

            {/* Why flagged */}
            <div
              className="rounded-xl p-3"
              style={{
                background: theme.innerBg,
                border: `1px solid ${theme.accent}25`,
              }}
            >
              <div className="flex items-start gap-2">
                <CalendarX
                  size={16}
                  className="mt-0.5 shrink-0"
                  style={{ color: theme.accent }}
                />
                <div>
                  <p
                    className="text-xs font-bold"
                    style={{ color: theme.accent }}
                  >
                    Why This Was Flagged
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: theme.text }}
                  >
                    Current bill dated over 90 days ago. Recent proof of
                    residence is required by NADRA for address verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Drop zone */}
            <div
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition-colors cursor-pointer"
              style={{
                borderColor: dragOver ? theme.accent : theme.border,
                background: dragOver
                  ? theme.accent + "08"
                  : theme.surfaceAlt,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <Upload
                size={28}
                strokeWidth={1.5}
                className="mb-2"
                style={{
                  color: dragOver ? theme.accent : theme.textMuted,
                }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: theme.text }}
              >
                Drop your Utility Bill or Lease Agreement
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: theme.textMuted }}
              >
                JPG, PNG, or PDF — max 10MB
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={handleSelect}
            />

            {/* Selected files */}
            {files.length > 0 && (
              <div className="flex flex-col gap-2">
                <p
                  className="text-xs font-semibold"
                  style={{ color: theme.textMuted }}
                >
                  Selected Files
                </p>
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: theme.surfaceAlt }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText
                        size={14}
                        style={{ color: theme.accent }}
                      />
                      <span
                        className="max-w-[180px] truncate text-xs font-medium"
                        style={{ color: theme.text }}
                      >
                        {file.name}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: theme.textMuted }}
                      >
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
            <Button
              variant="ghost"
              onClick={() => {
                setFiles([]);
                onClose();
              }}
            >
              Cancel
            </Button>
            {files.length > 0 && (
              <Button
                variant="primary"
                icon={<Loader2 size={14} />}
                onClick={handleSimulateAI}
                className="hover:opacity-90 active:scale-95"
              >
                Simulate AI Scan
              </Button>
            )}
            <Button
              variant="teal"
              icon={<Upload size={14} />}
              onClick={() => {
                if (files.length > 0) handleSimulateAI();
              }}
              disabled={files.length === 0}
              className="hover:opacity-90 active:scale-95"
            >
              Upload &amp; Verify
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MissingDocAgentModal;
