import { useState, useEffect } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameButton } from "@/components/game/GameButton";
import { CrystalDisplay } from "@/components/game/CrystalDisplay";
import { Home, Sparkles, Heart } from "lucide-react";

interface MemoryCard {
  id: number;
  value: string;
  pair: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const memoryPairs = [
  { value: "Снег", pair: "Тишина" },
  { value: "Мечта", pair: "Надежда" },
  { value: "Уют", pair: "Плед" },
  { value: "Смех", pair: "Друзья" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type GamePhase = "intro" | "game" | "success";

export default function ChapterCozyStreet() {
  const { goToChapter, completeChapter, collectCrystal } = useGame();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showCrystal, setShowCrystal] = useState(false);

  useEffect(() => {
    const allCards: MemoryCard[] = [];
    let id = 0;
    memoryPairs.forEach((pair) => {
      allCards.push({ id: id++, value: pair.value, pair: pair.pair, isFlipped: false, isMatched: false });
      allCards.push({ id: id++, value: pair.pair, pair: pair.value, isFlipped: false, isMatched: false });
    });
    setCards(shuffleArray(allCards));
  }, []);

  const handleCardClick = (cardId: number) => {
    if (isChecking || flippedCards.length >= 2) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [first, second] = newFlipped.map((id) => newCards.find((c) => c.id === id)!);

      setTimeout(() => {
        if (first.value === second.pair || first.pair === second.value) {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs((prev) => {
            const newCount = prev + 1;
            if (newCount === memoryPairs.length) {
              setTimeout(() => {
                setShowCrystal(true);
                setTimeout(() => {
                  collectCrystal("kindness");
                  setPhase("success");
                }, 1500);
              }, 500);
            }
            return newCount;
          });
        } else {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
            )
          );
        }
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const handleContinue = () => {
    completeChapter("cozyStreet");
    goToChapter("market");
  };

  return (
    <SceneWrapper backgroundClass="bg-gradient-to-b from-red-900 via-green-950 to-red-950">
      <div className="min-h-screen flex flex-col items-center px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-pink-900/50 rounded-full text-pink-300 text-sm font-medium mb-2">
            Глава 2
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-pink-100" data-testid="text-chapter-title">
            Уютная Улица
          </h2>
        </div>

        <div className="relative mb-8">
          <div className="flex gap-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <Home
                key={i}
                className="w-8 h-8 text-amber-400/60"
                style={{ transform: `translateY(${Math.sin(i) * 4}px)` }}
              />
            ))}
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-300 animate-twinkle"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>

        {phase === "intro" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <DialogueBox speaker="Рассказчик">
              <p>
                Уютная Улица полна новогоднего настроения. Соседи помогают друг другу украшать дома
                и готовить тёплые угощения. Чтобы найти Кристалл Доброты, Айназик должна
                сопоставить слова, которые отражают проявления доброты.
              </p>
            </DialogueBox>
            <GameButton onClick={() => setPhase("game")} data-testid="button-start-game">
              Играть в мемори
            </GameButton>
          </div>
        )}

        {phase === "game" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <p className="text-pink-200 font-medium mb-2">
              Найди пары слов ({matchedPairs}/{memoryPairs.length})
            </p>

            <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg" data-testid="memory-game-grid">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isMatched || isChecking}
                  className={`
                    w-16 h-20 md:w-20 md:h-24 rounded-xl
                    flex items-center justify-center
                    font-display text-sm md:text-base font-medium
                    transition-all duration-300 transform
                    ${card.isFlipped || card.isMatched
                      ? "bg-gradient-to-br from-pink-400 to-rose-500 text-white rotate-0"
                      : "bg-slate-700/80 text-transparent hover:bg-slate-600/80 hover:scale-105"
                    }
                    ${card.isMatched ? "ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900" : ""}
                  `}
                  data-testid={`memory-card-${card.id}`}
                >
                  {card.isFlipped || card.isMatched ? card.value : <Heart className="w-6 h-6 text-slate-500" />}
                </button>
              ))}
            </div>

            {showCrystal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in-up">
                <div className="flex flex-col items-center gap-4 p-8 bg-card/95 rounded-3xl">
                  <CrystalDisplay type="kindness" collected size="lg" animate />
                  <p className="font-display text-xl text-foreground">Кристалл Доброты найден!</p>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <CrystalDisplay type="kindness" collected size="lg" />
            <DialogueBox speaker="Сосед">
              <p>
                Спасибо, что помогла нам собрать эти воспоминания о доброте, Айназик! Ты напомнила
                нам всем, что делает нашу улицу такой особенной. Возьми этот кристалл — в нём тепло
                каждого доброго поступка, совершённого здесь.
              </p>
            </DialogueBox>
            <GameButton onClick={handleContinue} size="lg" data-testid="button-continue">
              Перейти к Рынку
            </GameButton>
          </div>
        )}
      </div>
    </SceneWrapper>
  );
}
