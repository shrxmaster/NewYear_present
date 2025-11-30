import { useState, useEffect } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameButton } from "@/components/game/GameButton";
import { CrystalCollection } from "@/components/game/CrystalDisplay";
import { Star } from "@/components/game/Star";
import { Sparkles, PartyPopper } from "lucide-react";

type ScenePhase = "placing" | "lighting" | "celebration";

export default function FinalScene() {
  const { goToChapter, gameState, completeChapter, completeGame } = useGame();
  const [phase, setPhase] = useState<ScenePhase>("placing");
  const [starLit, setStarLit] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const allCrystalsCollected =
    gameState.crystals.kindness &&
    gameState.crystals.memories &&
    gameState.crystals.courage &&
    gameState.crystals.unity;

  useEffect(() => {
    if (phase === "lighting") {
      const timer = setTimeout(() => {
        setStarLit(true);
        setTimeout(() => {
          setShowConfetti(true);
          setPhase("celebration");
          completeChapter("final");
          completeGame();
        }, 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, completeChapter, completeGame]);

  const handlePlaceCrystals = () => {
    setPhase("lighting");
  };

  const handleViewCollection = () => {
    goToChapter("collection");
  };

  const handlePlayAgain = () => {
    goToChapter("start");
  };

  return (
    <SceneWrapper
      backgroundClass={`transition-all duration-2000 ${
        starLit
          ? "bg-gradient-to-b from-amber-900/80 via-orange-900 to-slate-900"
          : "bg-gradient-to-b from-amber-950 via-stone-900 to-slate-950"
      }`}
    >
      <div className="min-h-screen flex flex-col items-center px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-amber-800/50 rounded-full text-amber-300 text-sm font-medium mb-2">
            Final Chapter
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-amber-100" data-testid="text-chapter-title">
            The Star's Glow
          </h2>
        </div>

        {phase === "placing" && (
          <div className="flex flex-col items-center gap-8 animate-fade-in-up max-w-2xl">
            <Star lit={false} size="xl" />

            <DialogueBox speaker="Ainazik">
              <p>
                "I've gathered all four Memory Crystals! The Crystal of Kindness from the Cozy
                Street, the Crystal of Memories from the Market, the Crystal of Courage from the
                Winter Forest, and the Crystal of Unity from the Celebration Square."
              </p>
            </DialogueBox>

            <div className="my-4">
              <CrystalCollection crystals={gameState.crystals} size="md" />
            </div>

            <DialogueBox speaker="The Star">
              <p>
                "You've done it, Ainazik! Place the crystals upon me, and together we shall bring
                light and hope to the town once more."
              </p>
            </DialogueBox>

            <GameButton onClick={handlePlaceCrystals} size="lg" icon="sparkle" data-testid="button-place-crystals">
              Place the Crystals
            </GameButton>
          </div>
        )}

        {phase === "lighting" && (
          <div className="flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="relative">
              <Star lit={starLit} size="xl" className="transition-all duration-1000" />
              {!starLit && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <p className="font-display text-xl text-amber-200 animate-pulse">
              {starLit ? "The star shines once more..." : "Placing the crystals..."}
            </p>
          </div>
        )}

        {phase === "celebration" && (
          <div className="flex flex-col items-center gap-8 animate-fade-in-up max-w-2xl">
            <div className="relative">
              <Star lit={true} size="xl" />

              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor: ["#f43f5e", "#8b5cf6", "#3b82f6", "#22c55e", "#eab308"][
                          Math.floor(Math.random() * 5)
                        ],
                        animation: `confetti ${1 + Math.random()}s ease-out forwards`,
                        animationDelay: `${Math.random() * 0.5}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <PartyPopper className="w-8 h-8 text-amber-400" />
              <h3
                className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
                data-testid="text-happy-new-year"
              >
                Happy New Year, Ainazik!
              </h3>
              <PartyPopper className="w-8 h-8 text-amber-400 scale-x-[-1]" />
            </div>

            <DialogueBox speaker="The Star">
              <p>
                "Thank you, dear Ainazik. You've shown that the true magic of New Year lies not in
                lights or decorations, but in kindness, cherished memories, courage, and the unity
                of those we love. May this light guide you through all the years to come."
              </p>
            </DialogueBox>

            <DialogueBox speaker="Ainazik">
              <p>
                "This was the most magical adventure! I'll never forget the lessons I learned and
                the friends I made along the way. Happy New Year to everyone!"
              </p>
            </DialogueBox>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <GameButton onClick={handleViewCollection} size="lg" icon="sparkle" data-testid="button-view-collection">
                View Collection
              </GameButton>
              <GameButton onClick={handlePlayAgain} variant="secondary" icon="restart" data-testid="button-play-again">
                Play Again
              </GameButton>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) rotate(720deg) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </SceneWrapper>
  );
}
