import { useGame } from "@/lib/game-context";
import { type ThemeColor } from "@shared/schema";

const themeColors: { value: ThemeColor; label: string; gradient: string }[] = [
  { value: "blue", label: "Winter Blue", gradient: "from-sky-400 to-blue-500" },
  { value: "pink", label: "Rose Pink", gradient: "from-pink-400 to-rose-500" },
  { value: "purple", label: "Twilight Purple", gradient: "from-purple-400 to-violet-500" },
  { value: "mint", label: "Mint Green", gradient: "from-emerald-400 to-teal-500" },
];

export function ThemeSelector() {
  const { gameState, setThemeColor } = useGame();

  return (
    <div className="flex items-center gap-3" data-testid="theme-selector">
      <span className="text-sm text-muted-foreground font-medium">Theme:</span>
      <div className="flex gap-2">
        {themeColors.map((theme) => (
          <button
            key={theme.value}
            onClick={() => setThemeColor(theme.value)}
            className={`
              w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient}
              transition-all duration-300
              ${gameState.themeColor === theme.value
                ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                : "hover:scale-105 opacity-70 hover:opacity-100"
              }
            `}
            aria-label={theme.label}
            data-testid={`theme-${theme.value}`}
          />
        ))}
      </div>
    </div>
  );
}
