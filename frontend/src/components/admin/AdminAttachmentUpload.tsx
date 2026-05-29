import React from "react";
import { UploadCloud, File, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useUploadChallengeAttachment } from "../../features/admin/uploads/hooks";

interface AdminAttachmentUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const allowedExtensions = [
  ".zip",
  ".txt",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".pcap",
  ".pcapng",
  ".py",
  ".js",
  ".c",
  ".cpp",
  ".go",
  ".bin",
];

export function AdminAttachmentUpload({ value, onChange }: AdminAttachmentUploadProps) {
  const uploadMutation = useUploadChallengeAttachment();
  const [error, setError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);

  // Client-side extension validation
  const validateFile = (file: File): boolean => {
    const name = file.name.toLowerCase();
    const matchesExt = allowedExtensions.some((ext) => name.endsWith(ext));
    if (!matchesExt) {
      setError(`Disallowed file extension. Safe formats: ${allowedExtensions.join(", ")}`);
      return false;
    }
    // Size check: 20 MB
    if (file.size > 20 * 1024 * 1024) {
      setError("File exceeds maximum allowed size of 20 MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;
    setError(null);

    try {
      const attachmentUrl = await uploadMutation.mutateAsync(file);
      onChange(attachmentUrl);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload file to backend";
      setError(msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    onChange("");
    setError(null);
  };

  const getFilenameFromUrl = (url: string): string => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-2 select-text text-left">
      <label className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold">
        Challenge Material Attachment
      </label>

      {value ? (
        // File Uploaded / Completed State
        <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-cyber-cyan/30 rounded text-xs font-mono">
          <div className="flex items-center gap-2 text-cyber-cyan truncate max-w-sm">
            <File className="h-4.5 w-4.5 shrink-0 animate-pulse" />
            <div className="truncate">
              <span className="font-bold text-slate-200">ATTACHED:</span>{" "}
              <span className="text-cyber-cyan font-semibold">{getFilenameFromUrl(value)}</span>
              <div className="text-[9px] text-slate-500 truncate">{value}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyber-crimson hover:text-cyber-crimson text-slate-500 rounded transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        // File Upload Drag-and-Drop Dropzone Box
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded p-5 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-cyber-violet bg-cyber-violet/5 scale-[1.01]"
              : "border-slate-850 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-950/30"
          } ${uploadMutation.isPending ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            type="file"
            onChange={handleChange}
            disabled={uploadMutation.isPending}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="h-8 w-8 text-cyber-violet animate-spin" />
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                STREAMING ATTACHMENT TO STORAGE...
              </span>
            </div>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-slate-500 animate-pulse" />
              <div className="space-y-1">
                <p className="font-mono text-slate-350 text-[10px] uppercase font-bold tracking-wider">
                  Drag & Drop Challenge File or <span className="text-cyber-violet">Browse</span>
                </p>
                <p className="text-[8px] text-slate-550 font-mono">
                  MAX SIZE: 20 MB // ALLOWED FORMATS: .ZIP, .TXT, .PDF, .PCAP, .PY, .BIN
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Feedback */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-cyber-crimson/5 border border-cyber-crimson/25 text-cyber-crimson font-mono text-[10px] rounded animate-slide-in">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
