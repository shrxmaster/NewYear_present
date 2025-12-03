import { useState, useEffect } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameButton } from "@/components/game/GameButton";
import { CrystalDisplay } from "@/components/game/CrystalDisplay";
import { TreePine, Snowflake } from "lucide-react";

type GamePhase = "intro" | "game" | "success";

function createSolvedPuzzle(): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 0];
}

function shufflePuzzle(puzzle: number[]): number[] {
  const shuffled = [...puzzle];
  for (let i = 0; i < 100; i++) {
    const emptyIndex = shuffled.indexOf(0);
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    const moves: number[] = [];
    if (row > 0) moves.push(emptyIndex - 3);
    if (row < 2) moves.push(emptyIndex + 3);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < 2) moves.push(emptyIndex + 1);

    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    [shuffled[emptyIndex], shuffled[randomMove]] = [
      shuffled[randomMove],
      shuffled[emptyIndex],
    ];
  }
  return shuffled;
}

function isSolved(puzzle: number[]): boolean {
  const solved = createSolvedPuzzle();
  return puzzle.every((val, idx) => val === solved[idx]);
}

export default function ChapterForest() {
  const { goToChapter, completeChapter, collectCrystal } = useGame();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showCrystal, setShowCrystal] = useState(false);

  useEffect(() => {
    setPuzzle(shufflePuzzle(createSolvedPuzzle()));
  }, []);

  const handleTileClick = (index: number) => {
    const emptyIndex = puzzle.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[emptyIndex]] = [
        newPuzzle[emptyIndex],
        newPuzzle[index],
      ];
      setPuzzle(newPuzzle);
      setMoves(moves + 1);

      if (isSolved(newPuzzle)) {
        setTimeout(() => {
          setShowCrystal(true);
          setTimeout(() => {
            collectCrystal("courage");
            setPhase("success");
          }, 1500);
        }, 500);
      }
    }
  };

  const handleContinue = () => {
    completeChapter("forest");
    goToChapter("square");
  };

  const tileColors = [
    "",
    "from-sky-400 to-blue-500",
    "from-sky-400 to-blue-500",
    "from-sky-400 to-blue-500",
    "from-sky-400 to-blue-500",
    "from-sky-400 to-blue-500",
    "from-sky-400 to-blue-500",
    "from-sky-400 to-blue-500",
    "from-sky-400 to-blue-500",
  ];

  return (
    <SceneWrapper backgroundClass="bg-gradient-to-b from-red-950 via-green-950 to-red-950">
      <div className="min-h-screen flex flex-col items-center px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-medium mb-2">
            Глава 4
          </span>
          <h2
            className="font-display text-4xl md:text-5xl font-bold text-blue-100"
            data-testid="text-chapter-title"
          >
            Зимний лес
          </h2>
        </div>

        {/* Декор */}
        <div className="relative mb-8">
          <div className="flex gap-4 justify-center">
            {[...Array(5)].map((_, i) => (
              <TreePine
                key={i}
                className={`text-emerald-700/80 ${
                  i % 2 === 0 ? "w-10 h-10" : "w-8 h-8"
                }`}
                style={{
                  transform: `translateY(${i % 2 === 0 ? 0 : 8}px)`,
                }}
              />
            ))}
          </div>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 opacity-80 blur-sm" />
          </div>
        </div>

        {/* Интро */}
        {phase === "intro" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <DialogueBox speaker="Рассказчик">
              <p>
                Зимний лес стоит тихий и неподвижный, укрытый свежим снегом. Лунный свет проходит
                сквозь замёрзшие ветви, оставляя серебристые тени на земле. Но дальше путь
                перекрыт ледяной головоломкой…
              </p>
            </DialogueBox>

            <DialogueBox speaker="Айназик">
              <p>
                «Эта головоломка выглядит сложной… но я должна быть смелой. Бабушка всегда
                говорила: смелость — это не отсутствие страха, а шаг вперёд, несмотря на него».
              </p>
            </DialogueBox>

            <GameButton
              onClick={() => setPhase("game")}
              data-testid="button-start-game"
            >
              Расчистить путь
            </GameButton>
          </div>
        )}

        {/* Игра */}
        {phase === "game" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <p className="text-blue-200 font-medium mb-2">
              Передвигай плитки, чтобы пройти по замёрзшей тропе (Ходы: {moves})
            </p>

            <div
              className="grid grid-cols-3 gap-2 p-4 bg-slate-800/50 rounded-2xl border border-blue-500/20"
              data-testid="sliding-puzzle"
            >
              {puzzle.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  disabled={tile === 0}
                  className={`
                    w-20 h-20 md:w-24 md:h-24 rounded-xl
                    flex items-center justify-center
                    font-display text-2xl md:text-3xl font-bold
                    transition-all duration-200
                    ${
                      tile === 0
                        ? "bg-slate-900/50 cursor-default"
                        : `bg-gradient-to-br ${tileColors[tile]} text-white shadow-lg hover:scale-105 cursor-pointer`
                    }
                  `}
                  data-testid={`puzzle-tile-${index}`}
                >
                  {tile !== 0 && (
                    <span className="flex items-center gap-1">
                      <Snowflake className="w-4 h-4 opacity-50" />
                      {tile}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <p className="text-blue-300/70 text-sm">
              Собери плитки 1–8 по порядку, оставив пустую клетку внизу справа
            </p>

            {showCrystal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in-up">
                <div className="flex flex-col items-center gap-4 p-8 bg-card/95 rounded-3xl">
                  <CrystalDisplay type="courage" collected size="lg" animate />
                  <p className="font-display text-xl text-foreground">
                    Кристалл Смелости найден!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Успех */}
        {phase === "success" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <CrystalDisplay type="courage" collected size="lg" />

            <DialogueBox speaker="Рассказчик">
              <p>
                Проявив терпение и настойчивость, Айназик разгадала ледяную головоломку. Путь
                расчистился, открыв сияющий Кристалл Смелости — награду тем, кто не боится идти
                вперёд, даже если дорога кажется неподъёмной.
              </p>
            </DialogueBox>

            <DialogueBox speaker="Айназик">
              <p>
                «Я смогла! Даже когда казалось невозможно — я продолжала пробовать. Наверное, в
                этом и есть настоящая смелость».
              </p>
            </DialogueBox>

            <GameButton
              onClick={handleContinue}
              size="lg"
              data-testid="button-continue"
            >
              Продолжить к Площади
            </GameButton>
          </div>
        )}
      </div>
    </SceneWrapper>
  );
}
