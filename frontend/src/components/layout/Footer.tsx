export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#0c0c0c] py-8 mt-auto text-left select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border border-cyber-cyan flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-cyber-cyan" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}></div>
          </div>
          <span className="font-mono font-bold text-slate-400 text-xs tracking-widest uppercase">RBLXSEC LABS © 2026</span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[9px] text-slate-600">
          <a href="#rules" className="hover:text-cyber-cyan transition-colors uppercase">Rules</a>
          <a href="#tos" className="hover:text-cyber-cyan transition-colors uppercase">Terms of Service</a>
          <a href="#privacy" className="hover:text-cyber-cyan transition-colors uppercase">Privacy</a>
          <span className="text-slate-800">|</span>
          <span className="text-slate-600 uppercase tracking-widest">STABLE OPERATIONAL DIRECTIVE // RBLXSEC PLATFORM</span>
        </div>
      </div>
    </footer>
  );
}
