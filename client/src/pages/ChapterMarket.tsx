import { useState, useEffect } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameButton } from "@/components/game/GameButton";
import { CrystalDisplay } from "@/components/game/CrystalDisplay";
import {
  ShoppingBag,
  Gift,
  Cookie,
  Coffee,
  Candy,
  Apple,
  Check,
  Sparkles,
  Heart,
  Music,
  Snowflake,
  Lightbulb,
  Package,
  X
} from "lucide-react";

interface MarketItem {
  id: string;
  name: string;
  icon: typeof ShoppingBag;
  found: boolean;
  position: { x: number; y: number };
  required?: boolean;
  wrong?: boolean;
}

const shoppingList = ["Подарочная коробка", "Печенье", "Горячее какао", "Конфета", "Яблоко"];

const initialItems: MarketItem[] = [
  { id: "gift", name: "Подарочная коробка", icon: Gift, found: false, position: { x: 15, y: 30 }, required: true },
  { id: "cookie", name: "Печенье", icon: Cookie, found: false, position: { x: 70, y: 45 }, required: true },
  { id: "cocoa", name: "Горячее какао", icon: Coffee, found: false, position: { x: 45, y: 65 }, required: true },
  { id: "candy", name: "Карамельная трость", icon: Candy, found: false, position: { x: 25, y: 55 }, required: true },
  { id: "apple", name: "Яблоко", icon: Apple, found: false, position: { x: 80, y: 25 }, required: true },

  // Бонусные предметы
  { id: "ornament", name: "Ёлочная игрушка", icon: Sparkles, found: false, position: { x: 35, y: 20 }, required: false },
  { id: "bell", name: "Колокольчик", icon: Music, found: false, position: { x: 60, y: 35 }, required: false },
  { id: "snowflake", name: "Снежинка", icon: Snowflake, found: false, position: { x: 50, y: 50 }, required: false },
  { id: "ribbon", name: "Лента", icon: Heart, found: false, position: { x: 75, y: 60 }, required: false },
  { id: "lantern", name: "Фонарь", icon: Lightbulb, found: false, position: { x: 10, y: 70 }, required: false },
  { id: "wrapping", name: "Упаковочная бумага", icon: Package, found: false, position: { x: 88, y: 50 }, required: false },
];

type GamePhase = "intro" | "game" | "success";

export default function ChapterMarket() {
  const { goToChapter, completeChapter, collectCrystal } = useGame();
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [items, setItems] = useState<MarketItem[]>(initialItems);
  const [showCrystal, setShowCrystal] = useState(false);
  const [foundCount, setFoundCount] = useState(0);

  const handleItemClick = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || item.found) return;

    const isRequired = item.required !== false;

    if (!isRequired) {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, wrong: true } : i))
      );
      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, wrong: false } : i))
        );
      }, 1500);
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, found: true } : i))
    );

    const requiredItems = items.filter((i) => i.required !== false);
    const foundRequiredCount = items.filter((i) => i.found || i.id === itemId).filter((i) => i.required !== false).length;

    const newCount = foundRequiredCount;
    setFoundCount(newCount);

    if (newCount === requiredItems.length) {
      setTimeout(() => {
        setShowCrystal(true);
        setTimeout(() => {
          collectCrystal("memories");
          setPhase("success");
        }, 1500);
      }, 500);
    }
  };

  const handleContinue = () => {
    completeChapter("market");
    goToChapter("forest");
  };

  return (
    <SceneWrapper backgroundClass="bg-gradient-to-b from-green-900 via-red-950 to-red-900">
      <div className="min-h-screen flex flex-col items-center px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-purple-800/50 rounded-full text-purple-300 text-sm font-medium mb-2">
            Глава 3
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-purple-100" data-testid="text-chapter-title">
            Рынок
          </h2>
        </div>

        {phase === "intro" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <DialogueBox speaker="Рассказчик">
              <p>
                Зимний рынок оживает — торговцы наперебой предлагают товар, в воздухе витает запах
                свежей выпечки, а цветные украшения тихо звенят на ветру. Продавцу нужна помощь —
                он собирает праздничную корзину к Новому году.
              </p>
            </DialogueBox>
            <DialogueBox speaker="Продавец">
              <p>
                "Айназик! Я узнал тебя сразу. Ты приходила сюда вместе с бабушкой каждый Новый год.
                Поможешь мне найти эти вещи? Глаза уже не те..."
              </p>
            </DialogueBox>
            <GameButton onClick={() => setPhase("game")} data-testid="button-start-game">
              Помочь продавцу
            </GameButton>
          </div>
        )}

        {phase === "game" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up w-full max-w-4xl">
            <div className="flex flex-wrap justify-center gap-2 mb-4 p-4 bg-slate-800/50 rounded-2xl">
              <span className="text-purple-200 font-medium mr-2">Список покупок:</span>
              {shoppingList.map((item, i) => {
                const isFound = items.find((it) => it.name === item)?.found;
                return (
                  <span
                    key={i}
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium transition-all
                      ${isFound
                        ? "bg-green-500/30 text-green-300 line-through"
                        : "bg-purple-800/50 text-purple-200"
                      }
                    `}
                  >
                    {item}
                  </span>
                );
              })}
            </div>

            <div
              className="relative w-full h-80 md:h-96 bg-gradient-to-b from-purple-800/30 to-slate-800/50 rounded-3xl border border-purple-500/20 overflow-hidden"
              data-testid="market-scene"
            >
              <div className="absolute inset-0 flex items-end justify-around pb-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-16 md:w-16 md:h-20 bg-purple-900/50 rounded-t-lg border-t-4 border-amber-500/50"
                    style={{ height: `${60 + Math.random() * 30}px` }}
                  />
                ))}
              </div>

              <div className="absolute top-4 left-0 right-0 flex justify-center gap-8">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-300 animate-twinkle"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>

              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    disabled={item.found || item.wrong}
                    className={`
                      absolute p-3 rounded-xl transition-all duration-300 transform
                      ${item.wrong
                        ? "bg-red-500/50 scale-110 cursor-default"
                        : item.found
                          ? "bg-green-500/30 scale-90 cursor-default"
                          : "bg-purple-500/40 hover:bg-purple-400/50 hover:scale-110 cursor-pointer"
                      }
                    `}
                    style={{
                      left: `${item.position.x}%`,
                      top: `${item.position.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    data-testid={`market-item-${item.id}`}
                  >
                    {item.wrong ? (
                      <X className="w-6 h-6 md:w-8 md:h-8 text-red-100" />
                    ) : item.found ? (
                      <Check className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                    ) : (
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-purple-100" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-purple-300 font-medium">
              Найдено: {foundCount}/{items.filter((i) => i.required !== false).length}
              {items.filter((i) => !i.required && i.found).length > 0 && (
                <span className="text-amber-300 ml-2">
                  +{items.filter((i) => !i.required && i.found).length} бонус!
                </span>
              )}
            </p>

            {showCrystal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in-up">
                <div className="flex flex-col items-center gap-4 p-8 bg-card/95 rounded-3xl">
                  <CrystalDisplay type="memories" collected size="lg" animate />
                  <p className="font-display text-xl text-foreground">Кристалл Воспоминаний найден!</p>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up max-w-2xl">
            <CrystalDisplay type="memories" collected size="lg" />
            <DialogueBox speaker="Продавец">
              <p>
                "Прекрасно! Ты нашла всё. Эти вещи напоминают мне о тех корзинах, которые твоя
                бабушка собирала каждый год. Она говорила, что лучшие подарки — это те, что сделаны
                с любовью и воспоминаниями. Возьми этот кристалл — в нём все тёплые моменты рынков
                прошлого."
              </p>
            </DialogueBox>
            <GameButton onClick={handleContinue} size="lg" data-testid="button-continue">
              Продолжить в Лес
            </GameButton>
          </div>
        )}
      </div>
    </SceneWrapper>
  );
}
