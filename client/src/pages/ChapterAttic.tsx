import { useState } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameButton } from "@/components/game/GameButton";
import { Star } from "@/components/game/Star";
import { Sparkles, Box, Lamp } from "lucide-react";

const dialogues = [
  {
    speaker: "Narrator",
    text: "In the dusty corners of grandmother's attic, among forgotten treasures and faded memories, Ainazik's hand brushes against something cold and familiar...",
  },
  {
    speaker: "Ainazik",
    text: "What's this? Oh! It's the old New Year star! I remember when it used to shine so brightly at the top of our tree...",
  },
  {
    speaker: "The Star",
    text: "Ainazik... you found me. For years I have waited, growing dimmer with each passing winter. My light has faded because my Memory Crystals have been scattered across the town.",
  },
  {
    speaker: "Ainazik",
    text: "Memory Crystals? I've never heard of them before.",
  },
  {
    speaker: "The Star",
    text: "There are four crystals, each holding a precious memory: Kindness from the Cozy Street, Memories from the Market, Courage from the Winter Forest, and Unity from the Celebration Square.",
  },
  {
    speaker: "Ainazik",
    text: "I'll find them all! The town needs your light for the New Year celebration.",
  },
  {
    speaker: "The Star",
    text: "Thank you, dear Ainazik. Your journey begins now. May the warmth in your heart guide you...",
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
      backgroundClass="bg-gradient-to-b from-amber-950/90 via-stone-900 to-stone-950"
    >
      <div className="min-h-screen flex flex-col items-center justify-between px-6 py-20">
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block px-4 py-1 bg-amber-900/50 rounded-full text-amber-300 text-sm font-medium mb-2">
            Chapter 1
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-amber-100" data-testid="text-chapter-title">
            The Attic
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
            {isLastDialogue ? "Begin the Journey" : "Continue"}
          </GameButton>
        </div>
      </div>
    </SceneWrapper>
  );
}
