interface ChallengeMetaProps {
  author: string;
  solveCount: number;
}

export function ChallengeMeta({ author, solveCount }: ChallengeMetaProps) {
  return (
    <div className="mt-4 pt-3 border-t border-white/[0.03] flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider select-none text-left">
      <span>DEPLOYED AUTHOR: @{author}</span>
      <span>•</span>
      <span>VERIFIED SOLVES: {solveCount}</span>
    </div>
  );
}
