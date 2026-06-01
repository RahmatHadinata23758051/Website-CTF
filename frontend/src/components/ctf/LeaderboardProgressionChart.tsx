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
import { useThemeStore } from "../../stores/themeStore";

// Cyberpunk-themed high-contrast neon colors — work on both dark and light
const CyberColors = [
  "#7aae00", // Lime/Yellow (darkened for light mode visibility)
  "#00c0a8", // Teal
  "#6b58d8", // Violet
  "#d43030", // Crimson
  "#c87700", // Amber
  "#0099cc", // Cyan
  "#8800bb", // Purple
  "#2db300", // Green
  "#c0356b", // Pink
  "#2563eb", // Blue
];

// Bright variant for dark mode
const CyberColorsDark = [
  "#C8FF00",
  "#00E5CC",
  "#8c76f9",
  "#FF3D3D",
  "#FFAA1D",
  "#00f0ff",
  "#bd00ff",
  "#39ff14",
  "#ec4899",
  "#3b82f6",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isDark?: boolean;
}

const CustomTooltip = ({ active, payload, label, isDark = true }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
    const bg = isDark ? "#09090b" : "#ffffff";
    const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
    const labelColor = isDark ? "#888" : "#666";
    const nameColor = isDark ? "#e8e4dc" : "#111";
    const accentColor = isDark ? "#C8FF00" : "#7aae00";

    return (
      <div
        style={{
          backgroundColor: bg,
          border: `1px solid ${border}`,
          padding: "12px",
          fontFamily: "Space Mono, monospace",
          fontSize: "10px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          maxWidth: "280px",
        }}
      >
        <p style={{ color: labelColor, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {label}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {sortedPayload.map((entry, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                <span
                  style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    backgroundColor: entry.color, flexShrink: 0,
                  }}
                />
                <span style={{ color: nameColor, fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {entry.name}
                </span>
              </span>
              <span style={{ color: accentColor, fontWeight: "700", whiteSpace: "nowrap" }}>
                {entry.value} pts
              </span>
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
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  const players = data?.data?.players || [];

  // Axis and grid colors based on theme
  const axisColor = isDark ? "#555" : "#999";
  const gridColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)";
  const legendColor = isDark ? "#888" : "#555";
  const colors = isDark ? CyberColorsDark : CyberColors;

  const { chartData, uniquePlayerNames } = useMemo(() => {
    if (!players || players.length === 0) {
      return { chartData: [], uniquePlayerNames: [] };
    }

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

    const firstSolveTime = sortedTimes[0];
    const startTimeBaseline = firstSolveTime - 60 * 60 * 1000;
    const unifiedTimes = [startTimeBaseline, ...sortedTimes];

    const dataPoints = unifiedTimes.map((t) => {
      const date = new Date(t);
      const formattedTime = `${date.getMonth() + 1}/${date.getDate()} ${date
        .getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      const point: any = { timestamp: t, formattedTime };

      players.forEach((p) => {
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
      <div className="min-h-[350px] flex flex-col items-center justify-center border border-border-subtle bg-card-bg p-8 text-center">
        <LoadingSpinner />
        <span className="mt-4 font-mono text-xs text-fg-muted uppercase tracking-widest animate-pulse">
          INITIALIZING INTEL SCORE TIMELINES...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center border border-dashed border-cyber-crimson/30 bg-card-bg p-8 text-center">
        <AlertTriangle className="h-8 w-8 text-cyber-crimson mb-3 animate-pulse" />
        <h4 className="font-display font-medium text-sm text-fg uppercase tracking-wide">
          Timeline Connection Compromised
        </h4>
        <p className="mt-1 text-xs text-fg-muted max-w-sm font-sans">
          Failed to compile historical solve intervals from Postgres databases.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 border border-cyber-crimson/50 hover:border-cyber-crimson hover:text-cyber-crimson transition-all text-xs font-mono text-fg-muted cursor-pointer uppercase tracking-wider flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-cyber-crimson/30"
        >
          <RefreshCw className="h-3 w-3" /> RECONNECT FEED
        </button>
      </div>
    );
  }

  if (players.length === 0 || chartData.length === 0) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center border border-dashed border-border-strong bg-card-bg/30 p-8 text-center">
        <div className="h-10 w-10 bg-elevated border border-border-ui text-fg-subtle flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-5 w-5" />
        </div>
        <h4 className="font-display font-medium text-sm text-fg uppercase tracking-wide">
          No Score Progression Yet
        </h4>
        <p className="text-xs text-fg-muted max-w-sm mx-auto mt-1 leading-relaxed font-sans">
          Solve active challenge nodes to trace cumulative points progress timelines inside these analytics tools.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 border border-border-strong hover:border-cyber-cyan hover:text-cyber-cyan transition-colors text-xs font-mono text-fg-muted cursor-pointer uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-cyber-cyan/30"
        >
          REFRESH ANALYTICS
        </button>
      </div>
    );
  }

  return (
    <div className="w-full border border-border-subtle bg-card-bg p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between transition-colors duration-200">
      {/* Visual cyber accent glows */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent"></div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyber-cyan" />
            <h3 className="font-display font-semibold text-xs sm:text-sm text-fg uppercase tracking-wider">
              SCOREBOARD PROGRESSION ANALYTICS
            </h3>
            {isFetching && (
              <RefreshCw className="h-3 w-3 text-cyber-cyan animate-spin shrink-0 ml-1" />
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-fg-muted font-sans mt-0.5">
            Chronological cumulative point aggregation for the Top 10 ranked nodes.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-3 py-1.5 border border-border-ui hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-colors text-[10px] font-mono text-fg-muted cursor-pointer uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-cyber-cyan/30"
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} /> SYNC FEED
        </button>
      </div>

      <div className="w-full h-[320px] sm:h-[400px] mt-2 font-mono text-[9px] sm:text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="formattedTime"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              dx={-5}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{ stroke: isDark ? "rgba(200,255,0,0.15)" : "rgba(0,0,0,0.1)", strokeWidth: 1 }}
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
                color: legendColor,
              }}
            />
            {uniquePlayerNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                name={name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{
                  r: 3,
                  strokeWidth: 1,
                  fill: isDark ? "#09090b" : "#ffffff",
                  stroke: colors[index % colors.length],
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  fill: colors[index % colors.length],
                  stroke: isDark ? "#09090b" : "#ffffff",
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
