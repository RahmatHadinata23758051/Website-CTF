import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { TerminalPanel } from "../components/ctf/TerminalPanel";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Button } from "../components/ui/Button";

export function DashboardPage() {
  const registeredUsers = 2847;
  const verifiedChallengesCount = 48;
  const prizePool = "$12K";

  const categories = [
    { title: "Web Exploitation", desc: "Audit JWT protocols, prototype corruption, and parameter injection.", count: 12, marker: "WEB" },
    { title: "Reverse Engineering", desc: "Analyze native binaries, trace assembly segments, and decode structures.", count: 8, marker: "REV" },
    { title: "Cryptography", desc: "Leak server keys, test symmetric constraints, and resolve entropy gaps.", count: 9, marker: "CRYPTO" },
    { title: "Pwn & Binary", desc: "Manipulate pointers, bypass system protections, and craft payloads.", count: 6, marker: "PWN" },
    { title: "OSINT Footprints", desc: "Map geo coordinates, harvest open index databases, and assemble files.", count: 7, marker: "OSINT" },
    { title: "Forensic Triage", desc: "Trace network capture files, parse RAM logs, and reconstruct magic bytes.", count: 8, marker: "FORENSICS" },
    { title: "Steganography", desc: "Identify pixel least-significant values and render audio spectrographs.", count: 5, marker: "STEG" },
    { title: "Security General", desc: "Evaluate misconfigurations, logic controls, and simple script codes.", count: 11, marker: "MISC" }
  ];

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
            Season 04 // Live Now
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tighter text-slate-100 uppercase select-none">
            BREAK<br />
            <span className="text-slate-650">EVERY</span><br />
            <span className="text-cyber-cyan relative inline-block">
              SYSTEM
              <span className="animate-pulse ml-1 font-light">_</span>
            </span>
          </h1>

          <p className="font-sans text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
            Elite capture-the-flag competition for security researchers, reverse engineers,
            and exploit developers. 48 challenges across 8 distinct categories. Ready your setups.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/challenges">
              <Button variant="primary" className="flex items-center gap-2 py-3 px-6 select-none">
                Enter Arena
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
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-slate-150">{registeredUsers.toLocaleString()}</span>
              <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1 font-bold">OPERATORS</span>
            </div>
            <div className="w-[1px] bg-slate-800/60 my-2"></div>
            <div>
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-slate-150">{verifiedChallengesCount}</span>
              <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1 font-bold">CHALLENGES</span>
            </div>
            <div className="w-[1px] bg-slate-800/60 my-2"></div>
            <div>
              <span className="block font-mono text-2xl sm:text-3xl font-bold text-cyber-cyan">{prizePool}</span>
              <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mt-1 font-bold">PRIZE POOL</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
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
      </div>

      {/* ─── ARENA PROGRESSION WORKFLOW ─── */}
      <div className="space-y-8">
        <SectionHeader
          index="03"
          title="ARENA PROGRESSION WORKFLOW"
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
          <Link to="/login">
            <Button variant="secondary" className="w-full py-3.5 px-6">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
