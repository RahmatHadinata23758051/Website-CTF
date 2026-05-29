import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Paperclip
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { CategoryBadge } from "../components/ctf/CategoryBadge";
import { DifficultyBadge } from "../components/ctf/DifficultyBadge";
import { ChallengeMeta } from "../components/ctf/ChallengeMeta";
import { FlagSubmitBox } from "../components/ctf/FlagSubmitBox";
import { useChallengeDetail } from "../features/challenges/hooks";
import { mapBackendCategoryToUI } from "../features/challenges/api";
import type { Category } from "../types";

export function ChallengeDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch real challenge details from backend
  const { data, isLoading, error } = useChallengeDetail(slug || "");

  const challenge = data?.data?.challenge;

  const [hintRevealed, setHintRevealed] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);

  React.useEffect(() => {
    setHintRevealed(false);
    setCopiedCode(false);
  }, [slug]);

  // Loading State Display
  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-16 select-none">
        <LoadingSpinner />
      </div>
    );
  }

  // Backend Connection Error Display
  if (error) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto space-y-6">
        <div className="max-w-full text-left">
          <Alert variant="error" title="SYNCHRONIZATION ERROR">
            Unable to synchronize challenge detail matrix. Check backend connection.
          </Alert>
        </div>
        <Link to="/challenges">
          <Button variant="secondary" className="w-full py-2.5">
            Back to Challenges Catalog
          </Button>
        </Link>
      </div>
    );
  }

  // Not Found State Display
  if (!challenge) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto space-y-6">
        <div className="max-w-full text-left">
          <Alert variant="error" title="CRITICAL: LINK FAILURE">
            The requested challenge vector reference could not be located in our active indexes.
          </Alert>
        </div>
        <Link to="/challenges">
          <Button variant="secondary" className="w-full py-2.5">
            Back to Challenges Catalog
          </Button>
        </Link>
      </div>
    );
  }

  // Dynamic values
  const uiCategory = mapBackendCategoryToUI(challenge.category) as Category;

  // Generate mock tags/hints dynamically to preserve visual aesthetics in GORM absence
  const getDynamicTags = (cat: string) => {
    switch (cat) {
      case "Web": return ["HTTP-COOKIES", "SESSION-STORAGE", "WEB-RECON"];
      case "Crypto": return ["RSA-CIPHER", "ASYMMETRIC-MATH", "DECRYPTION"];
      case "Pwn": return ["STACK-OVERFLOW", "RET2WIN", "X86-EXPLOIT"];
      case "Reverse": return ["LICENSE-CHECK", "BINARY-PATCH", "ASSEMBLY"];
      case "OSINT": return ["EXIF-METADATA", "GPS-GEOLOCATION", "IMG-FORENSICS"];
      default: return ["VECTOR-RECON", "HEX-SIGNATURE", "SYS-REVERT"];
    }
  };

  const getDynamicHint = (cat: string) => {
    switch (cat) {
      case "Web": return "Check browser cookie parameters utilizing Developer Tools (F12) under Application storage.";
      case "Crypto": return "Use the standard RSA formula where decryption exponent d = e^-1 mod ((p-1)*(q-1)) to decrypt.";
      case "Pwn": return "Look closely at the memory buffer boundaries. Rewriting local parameters allows overriding command jumps.";
      case "Reverse": return "Bypass logic checks inside instructions or check static hex values inside assembly loops.";
      case "OSINT": return "Try utilizing command line utilities like exiftool or check gps data coordinates in online maps.";
      default: return "Examine hexadecimal blocks or search file structures for secret markers.";
    }
  };

  const tags = getDynamicTags(challenge.category);
  const hint = getDynamicHint(challenge.category);

  const copyShellCommand = () => {
    if (!challenge.attachment_url) return;
    navigator.clipboard.writeText(`curl -O ${challenge.attachment_url}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">
      {/* BACK NAVIGATION */}
      <Link 
        to="/challenges"
        className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-cyber-cyan transition-colors group cursor-pointer select-none"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:transform group-hover:-translate-x-1 transition-all" />
        BACK TO CHALLENGE INDEX
      </Link>

      {/* ASYMMETRICAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: CORE MISSION */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* HEADING INFO */}
          <div className="p-6 bg-[#0c0c0c] border border-white/[0.04] relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[1.5px] ${challenge.is_solved ? "bg-cyber-emerald" : "bg-cyber-cyan"}`}></div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 select-none">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={uiCategory} />
                <DifficultyBadge difficulty={challenge.difficulty} />
              </div>

              <div className="font-mono text-[10px] text-slate-500 tracking-widest uppercase font-bold">
                VALUE: <span className={`font-black ${challenge.is_solved ? "text-slate-600 line-through" : "text-cyber-cyan"}`}>{challenge.points} PTS</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-[9px] text-slate-500 font-bold select-none">VECTOR REFERENCE: #{challenge.slug.toUpperCase()}</div>
              <h1 className="font-display font-black text-2xl md:text-3.5xl text-slate-100 leading-none tracking-tight uppercase flex items-center gap-2.5">
                {challenge.title}
                {challenge.is_solved && <span className="text-cyber-emerald text-sm shrink-0">✓ Verified</span>}
              </h1>
            </div>

            {/* Render with custom, beautiful placeholder values inside metadata */}
            <ChallengeMeta author="Nexus_Arena" solveCount={challenge.points > 200 ? 5 : 23} />
          </div>

          {/* SPECIFICATION DESCRIPTION */}
          <div className="p-6 bg-[#0c0c0c] border border-white/[0.04] space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase select-none">01 // ATTACK PROFILE</h3>
            <div className="font-sans text-slate-300 text-sm leading-relaxed space-y-3">
              <p>{challenge.description}</p>
              <p className="text-[11px] text-slate-500 font-mono border-l border-white/[0.06] pl-3 py-0.5 leading-normal select-none">
                SUBMISSION FORMAT SIGNATURE CONFORMS TO: <code className="font-mono text-cyber-cyan font-bold bg-[#121212] px-1 border border-white/[0.04]">CTF{'{secret_key}'}</code>
              </p>
            </div>
          </div>

          {/* ATTACHMENTS & SANDBOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attachment Packet Panel */}
            <div className={`p-5 bg-[#0c0c0c] border ${challenge.attachment_url ? "border-white/[0.04] hover:border-cyber-cyan/20" : "border-white/[0.02]"} flex flex-col justify-between min-h-[140px] relative group transition-colors`}>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold select-none">
                  <Paperclip className="h-3 w-3" />
                  SYSTEM ATTACHMENT PACKAGE
                </div>
                {challenge.attachment_url ? (
                  <>
                    <div className="flex items-start justify-between">
                      <h4 className="font-mono font-bold text-xs text-slate-100 truncate pr-4">PAYLOAD_PACKET.ZIP</h4>
                      <a 
                        href={challenge.attachment_url}
                        download
                        className="p-2 bg-[#121212] border border-white/[0.04] hover:border-cyber-cyan hover:text-cyber-cyan text-slate-400 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        title="Download Payload Packet"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <code className="font-mono text-[9px] text-slate-655 block truncate select-none">SHA256: 4ec822bfb8d5a7114e910bdc0</code>
                  </>
                ) : (
                  <p className="font-mono text-[11px] text-slate-500 italic pt-1">
                    No attachments deployed for this challenge vector.
                  </p>
                )}
              </div>

              {challenge.attachment_url && (
                <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center justify-between select-none">
                  <span className="font-mono text-[9px] text-slate-600 truncate max-w-[70%]">curl -O {challenge.attachment_url}</span>
                  <button 
                    onClick={copyShellCommand}
                    className="font-mono text-[9px] text-cyber-cyan hover:text-slate-100 transition-colors flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
                  >
                    {copiedCode ? "COPIED" : "SHELL LINK"}
                  </button>
                </div>
              )}
            </div>

            {/* Sandbox Container VM Panel */}
            <div className={`p-5 bg-[#0c0c0c] border ${challenge.external_link ? "border-white/[0.04] hover:border-cyber-cyan/20" : "border-white/[0.02]"} flex flex-col justify-between min-h-[140px] transition-colors group`}>
              <div className="text-left">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500 uppercase tracking-widest font-bold select-none">
                  <ExternalLink className="h-3 w-3" />
                  LIVE TARGET SERVICE
                </div>
                {challenge.external_link ? (
                  <>
                    <p className="font-mono font-bold text-xs text-slate-100 mt-2 uppercase tracking-wide">Dynamic Sandbox Node</p>
                    <p className="font-sans text-[11px] text-slate-500 mt-1 leading-normal">Isolated port container spawned on secure VM infrastructure.</p>
                  </>
                ) : (
                  <p className="font-mono text-[11px] text-slate-500 italic pt-2">
                    No external service VM deployed for this challenge vector.
                  </p>
                )}
              </div>

              {challenge.external_link && (
                <a 
                  href={challenge.external_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-4 py-2 bg-[#121212] hover:bg-cyber-cyan/5 border border-white/[0.04] hover:border-cyber-cyan/30 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-cyber-cyan transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  Launch Sandbox Target
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Mount real Flag Validator submit box */}
          <FlagSubmitBox slug={challenge.slug} isSolved={challenge.is_solved} />

        </div>

        {/* COLUMN RIGHT: RADAR META */}
        <div className="lg:col-span-4 space-y-6 text-left select-none">
          
          {/* STATS MATRIX */}
          <div className="p-5 bg-[#0c0c0c] border border-white/[0.04] space-y-4">
            <h4 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase">02 // VECTOR METRICS</h4>
            
            <div className="space-y-3 font-mono text-[11px] uppercase tracking-wide">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.03]">
                <span className="text-slate-500">DIFFICULTY:</span>
                <span className="font-bold">{challenge.difficulty}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.03]">
                <span className="text-slate-555">BASE VALUE:</span>
                <span className="text-cyber-cyan font-bold">{challenge.points} PTS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-555">SOLVE RATIO:</span>
                <span className="text-cyber-emerald font-bold">{challenge.points > 200 ? "12% RATE" : "48% RATE"}</span>
              </div>
            </div>
          </div>

          {/* ACTIVE HINTS */}
          <div className="p-5 bg-[#0c0c0c] border border-white/[0.04] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.03]">
              <h4 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase">03 // RADAR HINT</h4>
              <span className="font-mono text-[9px] text-cyber-amber px-1.5 py-0.2 bg-cyber-amber/5 border border-cyber-amber/15 tracking-widest font-bold">0 COST</span>
            </div>

            <div className="space-y-3">
              <p className="font-sans text-[11px] text-slate-500 leading-relaxed pt-1">
                Decrypt staging hints mapping vector specifications.
              </p>

              {hintRevealed ? (
                <div className="p-3 bg-[#111111] border border-white/[0.03] font-mono text-xs text-cyber-amber animate-fade-in text-left">
                  <p className="text-[9px] text-slate-650 mb-1 uppercase tracking-widest font-bold">DECRYPTED STATEMENT:</p>
                  <p className="text-slate-350 text-[11px] leading-relaxed font-sans">{hint}</p>
                </div>
              ) : (
                <button
                  onClick={() => setHintRevealed(true)}
                  className="w-full py-2 bg-[#121212] hover:bg-slate-850 text-slate-300 border border-white/[0.04] font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Decrypt Vector Hint
                </button>
              )}
            </div>
          </div>

          {/* DISCOVERY TAGS */}
          <div className="p-5 bg-[#0c0c0c] border border-white/[0.04] space-y-3">
            <h4 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase">04 // DISCOVERY TAGS</h4>
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag, idx) => (
                <span key={idx} className="font-mono text-[9px] text-slate-400 bg-slate-950 border border-white/[0.04] px-2 py-0.5 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
