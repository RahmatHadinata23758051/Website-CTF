import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Paperclip
} from "lucide-react";
import { useChallengeDetail } from "../features/challenges/hooks";
import { mapBackendCategoryToUI } from "../features/challenges/api";
import type { Category } from "../types";
import { PageLoading } from "../components/ui/PageLoading";
import { ConnectionError } from "../components/ui/ConnectionError";
import { NotFoundPage } from "./system/NotFoundPage";
import { CategoryBadge } from "../components/ctf/CategoryBadge";
import { DifficultyBadge } from "../components/ctf/DifficultyBadge";
import { ChallengeMeta } from "../components/ctf/ChallengeMeta";
import { FlagSubmitBox } from "../components/ctf/FlagSubmitBox";
import { HintPanel } from "../components/ctf/HintPanel";

function getFullAttachmentUrl(attachmentUrl: string | null): string {
  if (!attachmentUrl) return "";
  if (attachmentUrl.startsWith("http://") || attachmentUrl.startsWith("https://")) {
    return attachmentUrl;
  }
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";
  const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "");
  return `${backendOrigin}${attachmentUrl}`;
}

function getFilenameFromUrl(url: string): string {
  if (!url) return "";
  const parts = url.split("/");
  return parts[parts.length - 1];
}

export function ChallengeDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch real challenge details from backend
  const { data, isLoading, error, refetch } = useChallengeDetail(slug || "");

  const challenge = data?.data?.challenge;

  const [copiedCode, setCopiedCode] = React.useState(false);

  const [prevSlug, setPrevSlug] = React.useState(slug);
  if (prevSlug !== slug) {
    setPrevSlug(slug);
    setCopiedCode(false);
  }

  // Loading State Display
  if (isLoading) {
    return <PageLoading message="Synchronizing target workstation..." />;
  }

  // Backend Connection Error Display
  if (error) {
    return <ConnectionError onRetry={refetch} />;
  }

  // Not Found State Display
  if (!challenge) {
    return <NotFoundPage />;
  }

  // Dynamic values
  const uiCategory = mapBackendCategoryToUI(challenge.category) as Category;

  const copyShellCommand = () => {
    if (!challenge.attachment_url) return;
    navigator.clipboard.writeText(`curl -O ${getFullAttachmentUrl(challenge.attachment_url)}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">
      {/* BACK NAVIGATION */}
      <Link 
        to="/challenges"
        className="inline-flex items-center gap-2 font-mono text-xs text-fg-subtle hover:text-cyber-cyan transition-colors group cursor-pointer select-none"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:transform group-hover:-translate-x-1 transition-all" />
        BACK TO CHALLENGE INDEX
      </Link>

      {/* ASYMMETRICAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: CORE MISSION */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* HEADING INFO */}
          <div className="p-6 bg-card-bg border border-border-ui relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[1.5px] ${challenge.is_solved ? "bg-cyber-emerald" : "bg-cyber-cyan"}`}></div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 select-none">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={uiCategory} />
                <DifficultyBadge difficulty={challenge.difficulty} />
              </div>

              <div className="font-mono text-[10px] text-fg-subtle tracking-widest uppercase font-bold flex items-center gap-1.5">
                {challenge.scoring_type === "dynamic" && (
                  <span className="px-1.5 py-0.5 border border-cyber-cyan/35 bg-cyber-cyan/5 text-cyber-cyan text-[8px] font-bold tracking-widest rounded-sm">
                    DYNAMIC
                  </span>
                )}
                VALUE: <span className={`font-black ${challenge.is_solved ? "text-fg-subtle line-through" : "text-cyber-cyan"}`}>{challenge.points} PTS</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-[9px] text-fg-subtle font-bold select-none">VECTOR REFERENCE: #{challenge.slug.toUpperCase()}</div>
              <h1 className="font-display font-black text-2xl md:text-3.5xl text-fg leading-none tracking-tight uppercase flex items-center gap-2.5">
                {challenge.title}
                {challenge.is_solved && <span className="text-cyber-emerald text-sm shrink-0">✓ Verified</span>}
              </h1>
            </div>

            {/* Render challenge metadata with real solve count */}
            <ChallengeMeta author="RBLXSec_Lab" solveCount={challenge.solve_count ?? 0} />
          </div>

          {/* SPECIFICATION DESCRIPTION */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">01 // ATTACK PROFILE</h3>
            <div className="font-sans text-fg-muted text-sm leading-relaxed space-y-3">
              <p>{challenge.description}</p>
              <p className="text-[11px] text-fg-subtle font-mono border-l border-border-ui pl-3 py-0.5 leading-normal select-none">
                SUBMISSION FORMAT SIGNATURE CONFORMS TO: <code className="font-mono text-cyber-cyan font-bold bg-bg px-1 border border-border-subtle">iet{'{secret_key}'}</code>
              </p>
            </div>
          </div>

          {/* ATTACHMENTS & SANDBOXES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Attachment Packet Panel */}
            <div className={`p-5 bg-card-bg border ${challenge.attachment_url ? "border-border-ui hover:border-cyber-cyan/20" : "border-border-subtle/50"} flex flex-col justify-between min-h-[140px] relative group transition-colors`}>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-fg-subtle uppercase tracking-widest font-bold select-none">
                  <Paperclip className="h-3 w-3" />
                  SYSTEM ATTACHMENT PACKAGE
                </div>
                {challenge.attachment_url ? (
                  <>
                    <div className="flex items-start justify-between">
                      <h4 className="font-mono font-bold text-xs text-fg truncate pr-4">
                        {getFilenameFromUrl(challenge.attachment_url).toUpperCase()}
                      </h4>
                      <a 
                        href={getFullAttachmentUrl(challenge.attachment_url)}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-bg border border-border-ui hover:border-cyber-cyan hover:text-cyber-cyan text-fg-muted transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        title="Download Challenge Attachment"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <code className="font-mono text-[8px] text-fg-subtle block truncate select-none">
                      URL: {challenge.attachment_url}
                    </code>
                  </>
                ) : (
                  <p className="font-mono text-[11px] text-fg-subtle italic pt-1">
                    No attachments deployed for this challenge vector.
                  </p>
                )}
              </div>

              {challenge.attachment_url && (
                <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between select-none">
                  <span className="font-mono text-[9px] text-fg-subtle truncate max-w-[70%]">
                    curl -O {getFullAttachmentUrl(challenge.attachment_url)}
                  </span>
                  <button 
                    onClick={copyShellCommand}
                    className="font-mono text-[9px] text-cyber-cyan hover:text-fg transition-colors flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
                  >
                    {copiedCode ? "COPIED" : "SHELL LINK"}
                  </button>
                </div>
              )}
            </div>

            {/* Sandbox Container VM Panel */}
            <div className={`p-5 bg-card-bg border ${challenge.external_link ? "border-border-ui hover:border-cyber-cyan/20" : "border-border-subtle/50"} flex flex-col justify-between min-h-[140px] transition-colors group`}>
              <div className="text-left">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-fg-subtle uppercase tracking-widest font-bold select-none">
                  <ExternalLink className="h-3 w-3" />
                  LIVE TARGET SERVICE
                </div>
                {challenge.external_link ? (
                  <>
                    <p className="font-mono font-bold text-xs text-fg mt-2 uppercase tracking-wide">Dynamic Sandbox Node</p>
                    <p className="font-sans text-[11px] text-fg-muted mt-1 leading-normal">Isolated port container spawned on secure VM infrastructure.</p>
                  </>
                ) : (
                  <p className="font-mono text-[11px] text-fg-subtle italic pt-2">
                    No external service VM deployed for this challenge vector.
                  </p>
                )}
              </div>

              {challenge.external_link && (
                <a 
                  href={challenge.external_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-4 py-2 bg-bg hover:bg-cyber-cyan/5 border border-border-ui hover:border-cyber-cyan/30 text-xs font-mono font-bold uppercase tracking-wider text-fg-muted hover:text-cyber-cyan transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  Launch Sandbox Target
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Mount real challenge hints panel */}
          <HintPanel slug={challenge.slug} />

          {/* Mount real Flag Validator submit box */}
          <FlagSubmitBox slug={challenge.slug} isSolved={challenge.is_solved} />

        </div>

        {/* COLUMN RIGHT: RADAR META */}
        <div className="lg:col-span-4 space-y-6 text-left select-none">
          
          {/* STATS MATRIX */}
          <div className="p-5 bg-card-bg border border-border-ui space-y-4">
            <h4 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase">02 // VECTOR METRICS</h4>
            
            <div className="space-y-3 font-mono text-[11px] uppercase tracking-wide">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <span className="text-fg-subtle">DIFFICULTY:</span>
                <span className="font-bold">{challenge.difficulty}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <span className="text-fg-subtle">SCORING TYPE:</span>
                <span className={`font-bold uppercase ${challenge.scoring_type === "dynamic" ? "text-cyber-cyan" : "text-fg"}`}>
                  {challenge.scoring_type || "static"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                <span className="text-fg-subtle">CURRENT VALUE:</span>
                <span className="text-cyber-cyan font-bold">{challenge.points} PTS</span>
              </div>
              {challenge.scoring_type === "dynamic" && (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-fg-subtle">INITIAL VALUE:</span>
                    <span className="text-fg font-bold">{challenge.initial_points} PTS</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-fg-subtle">MINIMUM VALUE:</span>
                    <span className="text-fg font-bold">{challenge.minimum_points} PTS</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border-subtle">
                    <span className="text-fg-subtle">DECAY THRESHOLD:</span>
                    <span className="text-fg font-bold">{challenge.decay} SOLVES</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-fg-subtle">SOLVED BY:</span>
                <span className="text-cyber-emerald font-bold">{challenge.solve_count ?? 0} {(challenge.solve_count ?? 0) === 1 ? 'PLAYER' : 'PLAYERS'}</span>
              </div>
            </div>
          </div>


        </div>

      </div>

    </div>
  );
}
