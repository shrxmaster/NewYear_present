import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameButton } from "@/components/game/GameButton";
import { CrystalDisplay } from "@/components/game/CrystalDisplay";
import { TreeDeciduous, Users, Sparkles } from "lucide-react";

type GamePhase = "intro" | "game" | "success";

interface LightNote {
  id: number;
  position: number;
  active: boolean;
  hit: boolean;
  missed: boolean;
}

export default function ChapterSquare() {
  const { goToChapter, completeChapter, collectCrystal } = useGame();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [notes, setNotes] = useState<LightNote[]>([]);
  const [score, setScore] = useState(0);
  const [targetScore] = useState(8);
  const [gameActive, setGameActive] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [showCrystal, setShowCrystal] = useState(false);
  const [missedNotes, setMissedNotes] = useState(0);

  const spawnNote = useCallback(() => {
    const lane = Math.floor(Math.random() * 4);
    setNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        position: lane,
        active: true,
        hit: false,
        missed: false,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!gameActive) return;

    const beatInterval = setInterval(() => {
      setCurrentBeat((prev) => {
        if (prev < 16) {
          if (prev % 2 === 0) {
            spawnNote();
          }
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(beatInterval);
  }, [gameActive, spawnNote]);

  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      setNotes((prev) =>
        prev.map((note) => {
          if (note.hit || note.missed) return note;
          return note;
        })
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameActive]);

  useEffect(() => {
    if (score >= targetScore && gameActive) {
      setGameActive(false);
      setTimeout(() => {
        setShowCrystal(true);
        setTimeout(() => {
          collectCrystal("unity");
          setPhase("success");
        }, 1500);
      }, 500);
    }
  }, [score, targetScore, gameActive, collectCrystal]);

  const handleLaneClick = (lane: number) => {
    if (!gameActive) return;

    const activeNotes = notes.filter((n) => n.active && !n.hit && !n.missed && n.position === lane);

    if (activeNotes.length > 0) {
      const noteToHit = activeNotes[0];
      setNotes((prev) =>
        prev.map((n) => (n.id === noteToHit.id ? { ...n, hit: true, active: false } : n))
      );
      setScore((prev) => prev + 1);
    }
  };

  const startGame = () => {
    setPhase("game");
    setGameActive(true);
    setScore(0);
    setMissedNotes(0);
    setNotes([]);
    setCurrentBeat(0);
  };

  const handleContinue = () => {
    completeChapter("square");
    goToChapter("final");
  };

  const laneColors = [
    "from-rose-400 to-pink-500",
    "from-amber-400 to-yellow-500",
    "from-emerald-400 to-green-500",
    "from-sky-400 to-blue-500",
  ];

  return (
    <SceneWrapper backgroundClass="bg-gradient-to-b from-amber-900 via-orange-950 to-slate-900">
      <div className="min-h-screen flex flex-col items-center px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-amber-800/50 rounded-full text-amber-300 text-sm font-medium mb-2">
            Chapter 5
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-amber-100" data-testid="text-chapter-title">
            Celebration Square
          </h2>
        </div>

        <div className="relative mb-8">
          <TreeDeciduous className="w-16 h-16 text-emerald-600" />
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-twinkle" />
          </div>
          <div className="absolute top-2 -left-2">
            <div className="w-3 h-3 rounded-full bg-red-400 animate-twinkle" style={{ animationDelay: "0.2s" }} />
          </div>
          <div className="absolute top-4 -right-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-twinkle" style={{ animationDelay: "0.4s" }} />
          </div>
          <div className="absolute top-8 left-0">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-twinkle" style={{ animationDelay: "0.6s" }} />
          </div>
        </div>

        {phase === "intro" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <DialogueBox speaker="Narrator">
              <p>
                The Celebration Square is alive with excitement! Townspeople are decorating the
                grand New Year tree, and festive lights are ready to be synchronized. To earn the
                Crystal of Unity, Ainazik must help coordinate the light show.
              </p>
            </DialogueBox>
            <DialogueBox speaker="Town Elder">
              <p>
                "Ainazik! The lights need to be synchronized for the countdown. Tap the colored
                lanes when the lights appear to create perfect harmony. Show us what unity means!"
              </p>
            </DialogueBox>
            <GameButton onClick={startGame} data-testid="button-start-game">
              Sync the Lights
            </GameButton>
          </div>
        )}

        {phase === "game" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-amber-200 font-medium">
                Score: {score}/{targetScore}
              </span>
              <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${(score / targetScore) * 100}%` }}
                />
              </div>
            </div>

            <div
              className="relative flex gap-3 p-4 bg-slate-800/50 rounded-2xl border border-amber-500/20"
              data-testid="rhythm-game"
            >
              {[0, 1, 2, 3].map((lane) => (
                <button
                  key={lane}
                  onClick={() => handleLaneClick(lane)}
                  className={`
                    relative w-16 h-32 md:w-20 md:h-40 rounded-xl
                    bg-gradient-to-b ${laneColors[lane]} opacity-30
                    hover:opacity-60 active:opacity-100 active:scale-95
                    transition-all duration-100
                    flex items-end justify-center pb-2
                    overflow-hidden
                  `}
                  data-testid={`rhythm-lane-${lane}`}
                >
                  {notes
                    .filter((n) => n.position === lane && n.active && !n.hit)
                    .map((note) => (
                      <div
                        key={note.id}
                        className={`
                          absolute top-0 left-0 right-0
                          h-10 rounded-lg mx-1
                          bg-gradient-to-b ${laneColors[lane]}
                          animate-slide-down
                          shadow-lg
                        `}
                        style={{
                          animation: "slideDown 1.5s linear forwards",
                        }}
                      />
                    ))}
                  <Users className="w-5 h-5 text-white/50" />
                </button>
              ))}
            </div>

            <p className="text-amber-300/70 text-sm">
              Tap the lanes when lights appear to sync the festive display!
            </p>

            {showCrystal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in-up">
                <div className="flex flex-col items-center gap-4 p-8 bg-card/95 rounded-3xl">
                  <CrystalDisplay type="unity" collected size="lg" animate />
                  <p className="font-display text-xl text-foreground">Crystal of Unity Found!</p>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <CrystalDisplay type="unity" collected size="lg" />
            <DialogueBox speaker="Town Elder">
              <p>
                "Magnificent! You've brought everyone together in perfect harmony. This is what
                unity truly means — working together, supporting each other, and creating something
                beautiful as one. Take this crystal, dear Ainazik. You've earned it."
              </p>
            </DialogueBox>
            <DialogueBox speaker="Townspeople" className="text-center">
              <p>
                "Thank you, Ainazik! Happy New Year!"
              </p>
            </DialogueBox>
            <GameButton onClick={handleContinue} size="lg" data-testid="button-continue">
              Return to the Attic
            </GameButton>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </SceneWrapper>
  );
}
