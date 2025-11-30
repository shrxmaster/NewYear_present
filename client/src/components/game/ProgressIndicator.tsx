import { Star } from "lucide-react";
import { useGame } from "@/lib/game-context";
import { chapterInfo, type ChapterKey } from "@shared/schema";

const progressChapters: ChapterKey[] = ["start", "attic", "cozyStreet", "market", "forest", "square", "final"];

export function ProgressIndicator() {
  const { gameState } = useGame();

  const currentIndex = progressChapters.indexOf(gameState.currentChapter);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2 bg-card/80 dark:bg-card/90 backdrop-blur-md rounded-full border border-border/50 shadow-lg">
        {progressChapters.map((chapter, index) => {
          const isCompleted = gameState.completedChapters.includes(chapter);
          const isCurrent = gameState.currentChapter === chapter;
          const isPast = index < currentIndex;

          return (
            <div key={chapter} className="flex items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCurrent
                    ? "bg-primary text-primary-foreground scale-110 shadow-md"
                    : isCompleted || isPast
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                `}
                data-testid={`progress-indicator-${chapter}`}
              >
                <Star
                  className={`w-4 h-4 ${isCompleted || isPast ? "fill-current" : ""} ${isCurrent ? "animate-twinkle" : ""}`}
                />
              </div>
              {index < progressChapters.length - 1 && (
                <div
                  className={`
                    w-4 h-0.5 transition-colors duration-300
                    ${isPast || isCompleted ? "bg-accent" : "bg-muted"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
