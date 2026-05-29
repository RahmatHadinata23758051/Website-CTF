import React from "react";

export function TerminalPanel() {
  const [terminalLineIdx, setTerminalLineIdx] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTerminalLineIdx((prev) => (prev < 8 ? prev + 1 : 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[500px] bg-[#111111] border border-slate-700/80 text-left overflow-hidden shadow-2xl relative z-10 select-text">
      {/* Window Header */}
      <div className="bg-[#161616] px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex gap-1.5 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
        </div>
        <span className="font-mono text-[10px] text-slate-500 select-none">operator@rblxsec — exploit-shell</span>
        <span className="w-8"></span>
      </div>

      {/* Console Body */}
      <div className="p-5 font-code text-xs sm:text-[13px] leading-relaxed min-h-[290px] space-y-2 select-text selection:bg-cyber-cyan/20">
        <div className="flex items-start gap-2">
          <span className="text-cyber-cyan font-semibold select-none">operator $</span>
          <span>./exploit.py --target web_02</span>
        </div>

        {terminalLineIdx >= 1 && (
          <div className="text-slate-400">[*] Connecting to 10.0.0.42:4444...</div>
        )}
        {terminalLineIdx >= 2 && (
          <div className="text-slate-400">
            [*] Leaked libc base: <span className="text-cyber-cyan font-mono font-bold">0x7f3c2a000000</span>
          </div>
        )}
        {terminalLineIdx >= 3 && (
          <div className="text-slate-400">[*] ROP chain assembled (14 gadgets)</div>
        )}
        {terminalLineIdx >= 4 && (
          <div className="text-slate-400">[*] Triggering buffer overflow...</div>
        )}
        {terminalLineIdx >= 5 && (
          <div className="text-cyber-emerald font-semibold">[+] Shell obtained successfully!</div>
        )}
        {terminalLineIdx >= 6 && (
          <div className="flex items-start gap-2 pt-2">
            <span className="text-cyber-emerald select-none">root@victim $</span>
            <span>cat /flag</span>
          </div>
        )}
        {terminalLineIdx >= 7 && (
          <div className="text-slate-500 font-mono text-xs py-0.5 px-2 bg-slate-950 border border-white/[0.04] inline-block">
            [redacted] — submit through the challenge panel
          </div>
        )}
        {terminalLineIdx >= 8 && (
          <div className="flex items-start gap-2 pt-1">
            <span className="text-cyber-emerald select-none">root@victim $</span>
            <span className="h-4 w-1.5 bg-cyber-cyan inline-block animate-pulse"></span>
          </div>
        )}
      </div>
    </div>
  );
}
