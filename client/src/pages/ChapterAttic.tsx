import { useState } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameButton } from "@/components/game/GameButton";
import { Star } from "@/components/game/Star";
import { Sparkles, Box, Lamp } from "lucide-react";

const dialogues = [
  {
    speaker: "Рассказчик",
    text: "В пыльных уголках бабушкиного чердака, среди забытых вещей и выцветших воспоминаний, рука Айназик касается чего-то холодного и знакомого...",
  },
  {
    speaker: "Айназик",
    text: "Что это? О! Это же старая новогодняя звезда! Помню, как ярко она сияла на вершине нашей ёлки...",
  },
  {
    speaker: "Звезда",
    text: "Айназик... ты нашла меня. Годы я ждала, становясь всё тусклее с каждой зимой. Мой свет угас, потому что мои Кристаллы Памяти были рассеяны по всему городу.",
  },
  {
    speaker: "Айназик",
    text: "Кристаллы Памяти? Никогда о таких не слышала.",
  },
  {
    speaker: "Звезда",
    text: "Есть четыре кристалла, каждый хранит важную память: Доброту с Уютной Улицы, Воспоминания с Рыночной Площади, Смелость из Зимнего Леса и Единство с Площади Праздника.",
  },
  {
    speaker: "Айназик",
    text: "Я найду их все! Город нуждается в твоём свете для новогоднего праздника.",
  },
  {
    speaker: "Звезда",
    text: "Спасибо тебе, Айназик. Твоё путешествие начинается сейчас. Пусть тепло в твоём сердце станет твоим проводником...",
  },
];

export default function ChapterAttic() {
  const { goToChapter, completeChapter } = useGame();
  const [currentDialogue, setCurrentDialogue] = useState(0);

  const handleNext = () => {
    if (currentDialogue < dialogues.length - 1) {
      setCurrentDialogue(currentDialogue + 1);
    } else {
      completeChapter("attic");
      goToChapter("cozyStreet");
    }
  };

  const dialogue = dialogues[currentDialogue];
  const isLastDialogue = currentDialogue === dialogues.length - 1;

  return (
    <SceneWrapper
      showSnow={false}
      backgroundClass="bg-gradient-to-b from-green-950/90 via-red-900 to-red-950"
    >
      <div className="min-h-screen flex flex-col items-center justify-between px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-amber-900/50 rounded-full text-amber-300 text-sm font-medium mb-2">
            Chapter 1
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-amber-100" data-testid="text-chapter-title">
            Чердак
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-4xl w-full">
          <div className="relative flex items-center justify-center gap-8 mb-4">
            <Box className="w-12 h-12 text-amber-800/60 animate-float" style={{ animationDelay: "0s" }} />
            <Star lit={false} size="lg" />
            <Lamp className="w-12 h-12 text-amber-800/60 animate-float" style={{ animationDelay: "0.5s" }} />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute w-4 h-4 text-amber-400/30 animate-twinkle"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <DialogueBox speaker={dialogue.speaker} className="max-w-2xl">
            <p data-testid="text-dialogue">{dialogue.text}</p>
          </DialogueBox>

          <div className="flex items-center gap-3 mt-4">
            {dialogues.map((_, i) => (
              <div
                key={i}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${i === currentDialogue ? "bg-amber-400 scale-125" : i < currentDialogue ? "bg-amber-600" : "bg-amber-900"}
                `}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <GameButton
            onClick={handleNext}
            size="lg"
            icon="next"
            data-testid="button-next-dialogue"
          >
            {isLastDialogue ? "Начать путешествие" : "Продолжить"}
          </GameButton>
        </div>
      </div>
    </SceneWrapper>
  );
}
