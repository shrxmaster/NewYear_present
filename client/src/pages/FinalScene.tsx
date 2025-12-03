import { useState, useEffect, useRef } from "react";
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
  const fireworksAudioRef = useRef<HTMLAudioElement | null>(null);

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
          // Play fireworks sound with proper error handling
          const playFireworksSound = async () => {
            try {
              const audio = new Audio(`${import.meta.env.BASE_URL}sounds/fireworks.mp3`);
              audio.volume = 0.6;
              const playPromise = audio.play();
              
              if (playPromise !== undefined) {
                await playPromise;
                fireworksAudioRef.current = audio;
              }
            } catch (error) {
              console.error('Fireworks sound error:', error);
            }
          };

          playFireworksSound();
          
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
    // Unlock audio playback with user interaction
    const dummy = new Audio();
    dummy.play().catch(() => {});
    
    setPhase("lighting");
  };

  const handleViewCollection = () => {
    goToChapter("collection");
  };

  const handlePlayAgain = () => {
    goToChapter("start");
  };

  const handleViewGratitude = () => {
    goToChapter("gratitude");
  };

  return (
    <SceneWrapper
      backgroundClass={`transition-all duration-2000 ${
        starLit
          ? "bg-gradient-to-b from-yellow-800/80 via-red-900 to-green-900"
          : "bg-gradient-to-b from-red-950 via-green-950 to-red-950"
      }`}
    >
      <div className="min-h-screen flex flex-col items-center px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-amber-800/50 rounded-full text-amber-300 text-sm font-medium mb-2">
            Финальная глава
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-amber-100" data-testid="text-chapter-title">
            Сияние звезды
          </h2>
        </div>

        {phase === "placing" && (
          <div className="flex flex-col items-center gap-8 animate-fade-in-up max-w-2xl">
            <Star lit={false} size="xl" />

            <DialogueBox speaker="Айназик">
              <p>
                «Я собрала все четыре Кристалла Памяти! Кристалл Доброты с Уютной улицы, Кристалл Воспоминаний с Рынка, Кристалл Смелости из Зимнего леса и Кристалл Единства с Площади Празднования».
              </p>
            </DialogueBox>

            <div className="my-4">
              <CrystalCollection crystals={gameState.crystals} size="md" />
            </div>

            <DialogueBox speaker="Звезда">
              <p>
                «Ты справилась, Айназик! Помести кристаллы на меня, и вместе мы вновь принесём свет и надежду в город».
              </p>
            </DialogueBox>

            <GameButton onClick={handlePlaceCrystals} size="lg" icon="sparkle" data-testid="button-place-crystals">
              Поместить кристаллы
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
              {starLit ? "Звезда снова сияет..." : "Размещаем кристаллы..."}
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
                С Новым годом, Айназик!
              </h3>
              <PartyPopper className="w-8 h-8 text-amber-400 scale-x-[-1]" />
            </div>

            <DialogueBox speaker="Звезда">
              <p>
                «Спасибо, дорогая Айназик. Ты показала, что истинная магия Нового года заключается не в огнях или украшениях, а в доброте, дорогих воспоминаниях, смелости и единстве близких. Пусть этот свет ведёт тебя на протяжении всех лет».
              </p>
            </DialogueBox>

            <DialogueBox speaker="Айназик">
              <p>
                «Это было самое волшебное приключение! Я никогда не забуду уроки, которые я извлекла, и друзей, которых встретила. С Новым годом всех!»
              </p>
            </DialogueBox>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <GameButton onClick={handleViewGratitude} size="lg" icon="sparkle" data-testid="button-view-gratitude">
                Далее
              </GameButton>
              <GameButton onClick={handlePlayAgain} variant="secondary" icon="restart" data-testid="button-play-again">
                Играть снова
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
