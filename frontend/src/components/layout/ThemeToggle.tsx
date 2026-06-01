import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore } from "../../stores/themeStore";

const CYCLE: Array<"dark" | "light" | "system"> = ["dark", "light", "system"];

const ICON = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

const LABEL = {
  dark: "Dark mode",
  light: "Light mode",
  system: "System theme",
};

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const handleClick = () => {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
    setTheme(next);
  };

  const Icon = ICON[theme];

  return (
    <button
      onClick={handleClick}
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
      className="p-2 w-9 h-9 rounded-none bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-500 hover:text-slate-200 transition-all flex items-center justify-center cursor-pointer light:bg-zinc-100 light:border-zinc-300 light:text-zinc-600 light:hover:border-zinc-500 light:hover:text-zinc-800"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
