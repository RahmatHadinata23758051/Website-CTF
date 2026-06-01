import { Link } from "react-router-dom";
import type { Challenge } from "../../features/challenges/types";
import { mapBackendCategoryToUI } from "../../features/challenges/api";
import { Card } from "../ui/Card";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";
import { SolvedBadge } from "./SolvedBadge";
import type { Category } from "../../types";

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const uiCategory = mapBackendCategoryToUI(challenge.category) as Category;

  return (
    <Link to={`/challenges/${challenge.slug}`} className="group block select-text">
      <Card
        className={`min-h-[195px] flex flex-col justify-between hover:border-cyber-cyan/35 transition-all duration-300 ${
          challenge.is_solved ? "border-cyber-emerald/25" : ""
        }`}
      >
        {/* Top header on card */}
        <div className="flex items-center justify-between mb-2 select-none">
          <CategoryBadge category={uiCategory} />
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>

        {/* Card Content */}
        <div className="space-y-1.5 flex-1 pt-1.5 text-left">
          <div className="font-mono text-[9px] text-fg-subtle font-bold tracking-wider uppercase">
            # {challenge.slug.replace(/-/g, "_").toUpperCase()}
          </div>
          <h3 className="font-display font-bold text-[17px] text-fg group-hover:text-cyber-cyan transition-colors leading-tight tracking-tight uppercase">
            {challenge.title}
          </h3>
          <p className="font-sans text-[12px] text-fg-muted group-hover:text-fg transition-colors line-clamp-2 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex items-end justify-between border-t border-border-subtle pt-4 mt-3 select-none">
          <div className="font-mono text-left">
            <div className="text-xl font-black text-fg leading-none flex items-baseline gap-0.5">
              {challenge.points}
              <span className="text-[9px] text-fg-subtle tracking-widest font-bold font-sans uppercase">
                PTS
              </span>
            </div>
            <div className="text-[9px] text-fg-muted tracking-wider mt-1 uppercase">
              {challenge.solve_count !== undefined ? challenge.solve_count : 0} solves
            </div>
          </div>

          {/* Solved marker or arrow indicator */}
          <div>
            {challenge.is_solved ? (
              <SolvedBadge />
            ) : (
              <div className="font-mono text-sm text-cyber-cyan font-bold opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250">
                →
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
