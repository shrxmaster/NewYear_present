import { Sparkles, Moon, Sun } from "lucide-react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { ThemeSelector } from "@/components/game/ThemeSelector";
import { GameButton } from "@/components/game/GameButton";
import { Star } from "@/components/game/Star";
import { useState, useEffect } from "react";

export default function StartScreen() {
  const { goToChapter, savedProgress, continueGame, resetGame, gameState } = useGame();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleStart = () => {
    resetGame();
    goToChapter("attic");
  };

  const handleContinue = () => {
    continueGame();
  };

  const hasSavedProgress = savedProgress !== null && savedProgress !== "start";

  return (
    <SceneWrapper
      showProgress={false}
      backgroundClass="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950"
    >
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors"
          data-testid="button-theme-toggle"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-300" />
          )}
        </button>

        <div className="flex flex-col items-center text-center max-w-2xl animate-fade-in-up">
          <div className="relative mb-6">
            <Star lit={false} size="xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-400/50 animate-twinkle" />
            </div>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
            data-testid="text-game-title"
          >
            Ainazik and the Star's Glow
          </h1>

          <p className="font-story text-lg md:text-xl text-slate-300 dark:text-slate-400 leading-relaxed mb-8 max-w-xl">
            While searching the attic, Ainazik finds a family New Year star that has lost its
            light. To restore it, she must find four Memory Crystals hidden around the town.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <ThemeSelector />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <GameButton
              onClick={handleStart}
              variant="magical"
              size="lg"
              icon="sparkle"
              data-testid="button-start-game"
            >
              {hasSavedProgress ? "New Game" : "Begin Journey"}
            </GameButton>

            {hasSavedProgress && (
              <GameButton
                onClick={handleContinue}
                variant="secondary"
                size="lg"
                icon="next"
                data-testid="button-continue-game"
              >
                Continue
              </GameButton>
            )}
          </div>

          {hasSavedProgress && (
            <button
              onClick={resetGame}
              className="mt-6 text-sm text-slate-500 hover:text-slate-400 transition-colors underline underline-offset-4"
              data-testid="button-reset-game"
            >
              Reset Progress
            </button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="flex gap-1">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="w-4 md:w-8 bg-gradient-to-t from-slate-800 to-slate-700 dark:from-slate-900 dark:to-slate-800 rounded-t-sm"
                style={{
                  height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 10}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}
