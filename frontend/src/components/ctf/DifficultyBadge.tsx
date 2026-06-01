import type { Difficulty } from "../../types";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const getDifficultyStyles = (diff: Difficulty) => {
    switch (diff) {
      case "Easy":
        return "text-cyber-emerald border-cyber-emerald/20 bg-cyber-emerald/5";
      case "Medium":
        return "text-cyber-amber border-cyber-amber/20 bg-cyber-amber/5";
      case "Hard":
        return "text-cyber-violet border-cyber-violet/20 bg-cyber-violet/5";
      case "Insane":
        return "text-cyber-crimson border-cyber-crimson/30 bg-cyber-crimson/10";
      default:
        return "text-fg-muted border-border-strong bg-surface";
    }
  };

  const filledDotsCount =
    difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : difficulty === "Hard" ? 3 : 4;

  return (
    <div className="flex items-center space-x-2 select-none">
      <span
        className={`font-mono text-[9px] font-bold border px-2 py-0.5 uppercase tracking-wider ${getDifficultyStyles(
          difficulty
        )}`}
      >
        {difficulty}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((dot) => (
          <div
            key={dot}
            className={`w-1 h-1 rounded-full ${
              dot <= filledDotsCount ? "bg-cyber-cyan" : "bg-border-strong"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
