import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#0c0c0c] py-8 mt-auto text-left select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="RBLXSec logo"
            className="h-8 w-8 object-contain group-hover:brightness-110 transition-all duration-300 select-none"
          />
          <span className="font-mono font-bold text-slate-400 text-xs tracking-widest uppercase">RBLXSEC LABS © 2026</span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[9px] text-slate-600">
          <Link to="/rules" className="hover:text-cyber-cyan transition-colors uppercase">Rules</Link>
          <Link to="/terms" className="hover:text-cyber-cyan transition-colors uppercase">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-cyber-cyan transition-colors uppercase">Privacy</Link>
          <span className="text-slate-800">|</span>
          <span className="text-slate-600 uppercase tracking-widest">STABLE OPERATIONAL DIRECTIVE // RBLXSEC PLATFORM</span>
        </div>
      </div>
    </footer>
  );
}

