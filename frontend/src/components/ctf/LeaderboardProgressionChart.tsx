import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp, RefreshCw, AlertTriangle, Trophy } from "lucide-react";
import { useScoreboardProgression } from "../../features/scoreboard/progressionHooks";
import { LoadingSpinner } from "../ui/LoadingSpinner";

// Cyberpunk-themed high-contrast neon colors
const CyberColors = [
  "#C8FF00", // Nullbyte Lime/Yellow
  "#00E5CC", // Vibrant Teal / Emerald
  "#8c76f9", // Intel Violet
  "#FF3D3D", // Threat Red
  "#FFAA1D", // Warning Amber
  "#00f0ff", // Bright Cyan
  "#bd00ff", // Neon Purple
  "#39ff14", // Acid Green
  "#ec4899", // Neon Pink
  "#3b82f6", // Electric Blue
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    // Filter and sort players by score descending
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    return (
      <div className="bg-[#09090b] border border-white/[0.08] p-3 font-mono text-[10px] sm:text-xs shadow-xl rounded-sm cyber-glow-cyan max-w-[280px]">
        <p className="text-slate-500 mb-2 border-b border-white/[0.04] pb-1 uppercase tracking-wider">
          {label}
        </p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {sortedPayload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-200 truncate font-semibold">{entry.name}</span>
              </span>
              <span className="text-cyber-cyan font-bold tabular-nums shrink-0">{entry.value} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function LeaderboardProgressionChart() {
  const { data, isLoading, error, refetch, isFetching } = useScoreboardProgression();

  const players = data?.data?.players || [];

  // Transform players progression into unified timeline format for Recharts
  const { chartData, uniquePlayerNames } = useMemo(() => {
    if (!players || players.length === 0) {
      return { chartData: [], uniquePlayerNames: [] };
    }

    // 1. Gather all timestamps from all player series
    const allTimestampsSet = new Set<number>();
    const names: string[] = [];

    players.forEach((p) => {
      names.push(p.name);
      p.series.forEach((pt) => {
        allTimestampsSet.add(new Date(pt.timestamp).getTime());
      });
    });

    const sortedTimes = Array.from(allTimestampsSet).sort((a, b) => a - b);

    if (sortedTimes.length === 0) {
      return { chartData: [], uniquePlayerNames: names };
    }

    // 2. Add an initial baseline 0-point time coordinate 1 hour before first solve
    const firstSolveTime = sortedTimes[0];
    const startTimeBaseline = firstSolveTime - 60 * 60 * 1000;
    const unifiedTimes = [startTimeBaseline, ...sortedTimes];

    // 3. Map each timestamp to dynamic player points (reconstructing points-at-time state)
    const dataPoints = unifiedTimes.map((t) => {
      const date = new Date(t);
      const formattedTime = `${date.getMonth() + 1}/${date.getDate()} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      const point: any = {
        timestamp: t,
        formattedTime,
      };

      players.forEach((p) => {
        // Find latest cumulative score up to time 't'
        let score = 0;
        for (let i = p.series.length - 1; i >= 0; i--) {
          const solveTime = new Date(p.series[i].timestamp).getTime();
          if (solveTime <= t) {
            score = p.series[i].points;
            break;
          }
        }
        point[p.name] = score;
      });

      return point;
    });

    return { chartData: dataPoints, uniquePlayerNames: names };
  }, [players]);

  if (isLoading) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center border border-white/[0.04] bg-[#0d0d0d] p-8 text-center">
        <LoadingSpinner />
        <span className="mt-4 font-mono text-xs text-slate-500 uppercase tracking-widest animate-pulse">
          INITIALIZING INTEL SCORE TIMELINES...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center border border-dashed border-cyber-crimson/30 bg-[#0d0d0d] p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-cyber-crimson mb-3 animate-pulse" />
        <h4 className="font-display font-medium text-sm text-slate-200 uppercase tracking-wide">
          Timeline Connection Compromised
        </h4>
        <p className="mt-1 text-xs text-slate-500 max-w-sm font-sans">
          Failed to compile historical solve intervals from Postgres databases.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 border border-cyber-crimson/50 hover:border-cyber-crimson hover:text-cyber-crimson transition-all text-xs font-mono text-slate-300 rounded cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
        >
          <RefreshCw className="h-3 w-3" /> RECONNECT FEED
        </button>
      </div>
    );
  }

  if (players.length === 0 || chartData.length === 0) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center border border-dashed border-slate-800 bg-[#0d0d0d]/30 p-8 text-center">
        <div className="h-10 w-10 bg-slate-900 border border-slate-800 text-slate-500 rounded flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-5 w-5" />
        </div>
        <h4 className="font-display font-medium text-sm text-slate-300 uppercase tracking-wide">
          No Score Progression Yet
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed font-sans">
          Solve active challenge nodes to trace cumulative points progress timelines inside these analytics tools.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 border border-slate-700 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors text-xs font-mono text-slate-400 rounded cursor-pointer uppercase tracking-wider"
        >
          REFRESH ANALYTICS
        </button>
      </div>
    );
  }

  return (
    <div className="w-full border border-white/[0.04] bg-[#0d0d0d] p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between">
      {/* Visual cyber accent glows */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent"></div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 border-b border-white/[0.04] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyber-cyan" />
            <h3 className="font-display font-semibold text-xs sm:text-sm text-slate-200 uppercase tracking-wider">
              SCOREBOARD PROGRESSION ANALYTICS
            </h3>
            {isFetching && (
              <RefreshCw className="h-3 w-3 text-cyber-cyan animate-spin shrink-0 ml-1" />
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 font-sans mt-0.5">
            Chronological cumulative point aggregation for the Top 10 ranked nodes.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-3 py-1.5 border border-white/[0.08] hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-colors text-[10px] font-mono text-slate-400 rounded uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} /> SYNC FEED
        </button>
      </div>

      <div className="w-full h-[320px] sm:h-[400px] mt-2 font-mono text-[9px] sm:text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.02)"
              vertical={false}
            />
            <XAxis
              dataKey="formattedTime"
              stroke="#475569"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#475569"
              tickLine={false}
              axisLine={false}
              dx={-5}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(200, 255, 0, 0.15)", strokeWidth: 1 }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "10px",
                fontFamily: "Space Mono, monospace",
              }}
            />
            {uniquePlayerNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                name={name}
                stroke={CyberColors[index % CyberColors.length]}
                strokeWidth={2}
                dot={{
                  r: 3,
                  strokeWidth: 1,
                  fill: "#09090b",
                  stroke: CyberColors[index % CyberColors.length],
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  fill: CyberColors[index % CyberColors.length],
                  stroke: "#09090b",
                }}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
