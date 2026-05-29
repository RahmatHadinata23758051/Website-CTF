import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { TerminalPanel } from "../components/ctf/TerminalPanel";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Button } from "../components/ui/Button";
import { useOverviewStats } from "../features/stats/hooks";

const categoryMetaMap: Record<string, { title: string; desc: string; marker: string }> = {
  "Web": { title: "Web Exploitation", desc: "Audit JWT protocols, prototype corruption, and parameter injection.", marker: "WEB" },
  "Reverse": { title: "Reverse Engineering", desc: "Analyze native binaries, trace assembly segments, and decode structures.", marker: "REV" },
  "Crypto": { title: "Cryptography", desc: "Leak server keys, test symmetric constraints, and resolve entropy gaps.", marker: "CRYPTO" },
  "Pwn": { title: "Pwn & Binary", desc: "Manipulate pointers, bypass system protections, and craft payloads.", marker: "PWN" },
  "OSINT": { title: "OSINT Footprints", desc: "Map geo coordinates, harvest open index databases, and assemble files.", marker: "OSINT" },
  "Forensics": { title: "Forensic Triage", desc: "Trace network capture files, parse RAM logs, and reconstruct magic bytes.", marker: "FORENSICS" },
  "Steganography": { title: "Steganography", desc: "Identify pixel least-significant values and render audio spectrographs.", marker: "STEG" },
  "Misc": { title: "Security General", desc: "Evaluate misconfigurations, logic controls, and simple script codes.", marker: "MISC" }
};

export function DashboardPage() {
  const { data: statsRes } = useOverviewStats();
  const stats = statsRes?.data;

  const totalChallenges = stats?.total_challenges ?? 0;
  const totalCategories = stats?.total_categories ?? 0;
  const totalPlayers = stats?.total_players ?? 0;

  // Build real category list dynamically from stats breakdown
  const activeCategories = stats?.categories ? stats.categories.map((cat) => {
    const meta = categoryMetaMap[cat.name] || { 
      title: cat.name, 
      desc: "Investigate and solve specialized security tasks in this domain.", 
      marker: cat.name.substring(0, 3).toUpperCase() 
    };
    return {
      title: meta.title,
      desc: meta.desc,
      count: cat.challenge_count,
      marker: meta.marker
    };
  }) : [];

  return (
    <div className="space-y-24 text-left relative overflow-hidden select-text">
      {/* Background radial soft lights */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-cyber-cyan/3 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* ─── HERO ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-4 sm:pt-8">
        
        {/* Left Column: Brand Typography */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan font-bold select-none">
            <span className="w-6 h-[1px] bg-cyber-cyan inline-block"></span>
            CTF Lab // Online
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-slate-100 uppercase select-none">
            BREAK<br />
            <span className="text-slate-650">THE</span><br />
            <span className="text-cyber-cyan relative inline-block">
              LAB.
              <span className="animate-pulse ml-1 font-light">_</span>
            </span>
          </h1>

          <p className="font-sans text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
            A cybersecurity challenge lab for solving CTF tasks across web exploitation, cryptography, forensics, reverse engineering, OSINT, and binary exploitation. Submit flags. Climb the scoreboard.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/challenges">
              <Button variant="primary" className="flex items-center gap-2 py-3 px-6 select-none">
                Enter the Lab
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link to="/scoreboard">
              <Button variant="secondary" className="py-3 px-6 select-none">
                View Scoreboard
              </Button>
            </Link>
          </div>

          {/* Micro Stats Segment */}
          <div className="flex gap-12 pt-8 border-t border-slate-800/80">
            <div>
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-slate-150">{totalChallenges}</span>
              <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1 font-bold">CHALLENGES</span>
            </div>
            <div className="w-[1px] bg-slate-800/60 my-2"></div>
            <div>
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-slate-150">{totalCategories}</span>
              <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1 font-bold">CATEGORIES</span>
            </div>
            <div className="w-[1px] bg-slate-800/60 my-2"></div>
            <div>
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-slate-150">{totalPlayers}</span>
              <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1 font-bold">PLAYERS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Exploit Terminal */}
        <div className="flex items-center justify-center lg:pl-8 select-none">
          <TerminalPanel />
        </div>

      </div>

      {/* ─── CATEGORY VECTORS INDEX ─── */}
      <div className="space-y-8">
        <SectionHeader
          index="02"
          title="CHALLENGE VECTORS"
          description="Explore security instances compiled by real industry penetration testers, categorized logically."
          aside={
            <Link to="/challenges" className="text-cyber-cyan hover:text-slate-200 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 font-bold select-none">
              Browse All Vectors
              <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />

        {activeCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCategories.map((cat, idx) => (
              <Link to="/challenges" key={idx} className="group">
                <Card className="min-h-[160px] group">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-wider text-slate-600 uppercase font-bold">#{cat.marker}-0{idx + 1}</span>
                    <span className="font-mono text-[9px] text-cyber-cyan group-hover:text-slate-100 transition-colors uppercase tracking-widest bg-cyber-cyan/5 border border-cyber-cyan/15 px-2 py-0.5 font-bold">
                      {cat.count} TASKS
                    </span>
                  </div>
                  <div className="mt-4 text-left">
                    <h3 className="font-display font-bold text-sm text-slate-100 tracking-wide uppercase">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-[#0c0c0c] border border-white/[0.04] text-center select-none py-12">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              [!] NO ACTIVE CHALLENGE CATEGORIES AVAILABLE YET
            </p>
          </div>
        )}
      </div>

      {/* ─── LAB PROGRESSION WORKFLOW ─── */}
      <div className="space-y-8">
        <SectionHeader
          index="03"
          title="LAB PROGRESSION WORKFLOW"
          description="A straightforward process optimized to reduce distraction and make flag capturing simple."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { num: "01", title: "Target Selection", text: "Filter challenges by points, solve ratios, or categories in the main list catalog." },
            { num: "02", title: "Sandbox Environment", text: "Download package attachments or run curl endpoints to connect directly to vulnerable sandboxes." },
            { num: "03", title: "Deconstruct Vectors", text: "Evaluate logic loops, intercept keys, recover metadata indicators, and find the flag hash." },
            { num: "04", title: "Verify Flag", text: "Submit the captured hash inside the challenge workstation console to instantly update your score." }
          ].map((step, idx) => (
            <div key={idx} className="relative space-y-3 font-sans text-left">
              <span className="font-mono text-4xl font-black text-slate-800 select-none block tracking-tighter">{step.num}</span>
              <h4 className="font-display font-bold text-slate-200 text-xs tracking-wider uppercase">{step.title}</h4>
              <p className="text-xs text-slate-555 leading-relaxed">{step.text}</p>
              {idx < 3 && <div className="hidden md:block absolute top-4 -right-4 w-8 h-[1px] bg-slate-800"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* ─── CALL TO ACTION ─── */}
      <div className="p-8 md:p-12 bg-[#111111] border border-white/[0.04] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left select-none">
        <div className="absolute inset-0 bg-dot-matrix opacity-10 pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10 max-w-xl">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-100 uppercase tracking-tight">
            Begin your challenges now.
          </h3>
          <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed">
            Log in to preserve your progress, track your stats curve, and update your scoreboard rank in real time.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10 shrink-0">
          <Link to="/challenges">
            <Button variant="primary" className="w-full py-3.5 px-6">
              Enter Challenges
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" className="w-full py-3.5 px-6">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
