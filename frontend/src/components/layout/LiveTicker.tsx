import { Zap } from "lucide-react";

export function LiveTicker() {
  const events = [
    "0xVoid_Walker solved Poisoned Signature (JWT Hijack) (+100 pts)",
    "Competitor One solved Stack Smash: Kernel Return Poisoning (+600 pts)",
    "NEW OPERATOR: alice_xor entered the challenge arena",
    "nullPointer_X solved ProtoPoison: Prototype Pollution (+400 pts)",
    "Sudo_Hacks unlocked badge 'Lone Wolf Solves' (Epic)",
    "Competitor Two solved CJS Oracle: Symmetric Padding Underflow (+250 pts)",
  ];

  // Repeat events to facilitate smooth infinite looping
  const repeatedEvents = [...events, ...events, ...events];

  return (
    <div className="w-full bg-[#0d0d0d] border-b border-slate-800 text-xs py-2 overflow-hidden select-none font-mono tracking-wider select-none relative z-40">
      <div className="flex w-max items-center space-x-12 animate-ticker-scroll whitespace-nowrap">
        {repeatedEvents.map((ev, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-slate-500 hover:text-slate-400 cursor-default">
            <Zap className="h-3 w-3 text-cyber-cyan animate-pulse shrink-0" />
            <span className="text-[10px] uppercase font-bold text-slate-400">{ev}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
