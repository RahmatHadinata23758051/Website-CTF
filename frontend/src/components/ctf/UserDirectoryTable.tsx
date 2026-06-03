import { useNavigate } from "react-router-dom";
import type { DirectoryUser } from "../../features/users/types";

interface UserDirectoryTableProps {
  users: DirectoryUser[];
  pageOffset?: number; // to compute global rank display
}

function getRankStyle(rank: number | null, offset: number) {
  const absRank = rank ?? (offset + 1);
  if (absRank === 1) return "text-yellow-400 font-black";
  if (absRank === 2) return "text-slate-400 font-black";
  if (absRank === 3) return "text-amber-600 font-black";
  return "text-slate-600 font-bold";
}

function RankBadge({ rank, offset }: { rank: number | null; offset: number }) {
  if (rank === null) {
    return <span className="font-mono text-[10px] text-slate-700 tracking-widest">—</span>;
  }
  const style = getRankStyle(rank, offset);
  return (
    <span className={`font-mono text-[11px] tracking-wider ${style}`}>
      #{rank}
    </span>
  );
}

export function UserDirectoryTable({ users, pageOffset = 0 }: UserDirectoryTableProps) {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className="p-8 border border-slate-800/40 font-mono text-[10px] text-slate-600 uppercase tracking-widest text-center">
        [NO PLAYERS FOUND]
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-800/60">
            <th className="py-3 px-4 font-mono text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold w-16">
              RANK
            </th>
            <th className="py-3 px-4 font-mono text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">
              PLAYER
            </th>
            <th className="py-3 px-4 font-mono text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold text-right">
              SOLVES
            </th>
            <th className="py-3 px-4 font-mono text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold text-right">
              POINTS
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => {
            const isTop3 = user.rank !== null && user.rank <= 3;
            return (
              <tr
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className={`border-b border-slate-800/30 transition-colors hover:bg-slate-900/40 cursor-pointer ${isTop3 ? "bg-slate-900/20" : ""}`}
              >
                <td className="py-3.5 px-4">
                  <RankBadge rank={user.rank} offset={pageOffset + idx} />
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar initials block */}
                    <div className={`h-8 w-8 shrink-0 flex items-center justify-center font-mono font-bold text-[10px] border ${isTop3 ? "border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan" : "border-slate-800 bg-slate-900 text-slate-500"}`}>
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-[12px] text-slate-200">
                        {user.name}
                      </div>
                      {user.total_solves === 0 && (
                        <div className="font-mono text-[9px] text-slate-700 uppercase tracking-wider">
                          No solves yet
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-[12px] text-cyber-emerald font-bold">
                    {user.total_solves}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-[12px] text-cyber-cyan font-bold">
                    {user.total_points.toLocaleString()}
                  </span>
                  <span className="font-mono text-[8px] text-slate-600 uppercase tracking-widest ml-1">pts</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
