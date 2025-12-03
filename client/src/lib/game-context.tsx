import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type GameState, type ChapterKey, type ThemeColor, type CrystalType, defaultGameState } from "@shared/schema";

interface GameContextType {
  gameState: GameState;
  savedProgress: ChapterKey | null;
  isShowingStartScreen: boolean;
  goToChapter: (chapter: ChapterKey) => void;
  continueGame: () => void;
  collectCrystal: (crystal: CrystalType) => void;
  completeChapter: (chapter: ChapterKey) => void;
  setThemeColor: (color: ThemeColor) => void;
  resetGame: () => void;
  completeGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = "ainazik-game-state";

export function GameProvider({ children }: { children: ReactNode }) {
  const [savedProgress, setSavedProgress] = useState<ChapterKey | null>(null);
  const [isShowingStartScreen, setIsShowingStartScreen] = useState(true);

  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...parsed, currentChapter: "start" as ChapterKey };
        } catch {
          return defaultGameState;
        }
      }
    }
    return defaultGameState;
  });

  // Применяем тему при загрузке и изменении
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      // Удаляем все предыдущие классы темы
      root.classList.remove("theme-blue", "theme-pink", "theme-purple", "theme-mint");
      // Добавляем новый класс темы
      root.classList.add(`theme-${gameState.themeColor}`);
    }
  }, [gameState.themeColor]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.currentChapter && parsed.currentChapter !== "start") {
            setSavedProgress(parsed.currentChapter);
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = isShowingStartScreen
      ? { ...gameState, currentChapter: savedProgress || gameState.currentChapter }
      : gameState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [gameState, isShowingStartScreen, savedProgress]);

  const goToChapter = (chapter: ChapterKey) => {
    if (chapter === "start") {
      setIsShowingStartScreen(true);
    } else {
      setIsShowingStartScreen(false);
    }
    setGameState((prev) => ({ ...prev, currentChapter: chapter }));
    if (chapter !== "start") {
      setSavedProgress(chapter);
    }
  };

  const continueGame = () => {
    if (savedProgress) {
      setIsShowingStartScreen(false);
      setGameState((prev) => ({ ...prev, currentChapter: savedProgress }));
    }
  };

  const collectCrystal = (crystal: CrystalType) => {
    setGameState((prev) => ({
      ...prev,
      crystals: { ...prev.crystals, [crystal]: true },
    }));
  };

  const completeChapter = (chapter: ChapterKey) => {
    setGameState((prev) => ({
      ...prev,
      completedChapters: prev.completedChapters.includes(chapter)
        ? prev.completedChapters
        : [...prev.completedChapters, chapter],
    }));
  };

  const setThemeColor = (color: ThemeColor) => {
    setGameState((prev) => ({ ...prev, themeColor: color }));
  };

  const resetGame = () => {
    setGameState(defaultGameState);
    setSavedProgress(null);
    setIsShowingStartScreen(true);
  };

  const completeGame = () => {
    setGameState((prev) => ({ ...prev, gameCompleted: true }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        savedProgress,
        isShowingStartScreen,
        goToChapter,
        continueGame,
        collectCrystal,
        completeChapter,
        setThemeColor,
        resetGame,
        completeGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
