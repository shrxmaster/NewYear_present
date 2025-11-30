import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { GameButton } from "@/components/game/GameButton";
import { CrystalDisplay } from "@/components/game/CrystalDisplay";
import { Star } from "@/components/game/Star";
import { type CrystalType, crystalInfo } from "@shared/schema";
import { Heart, Camera, Shield, Users, ArrowLeft } from "lucide-react";

const crystalIcons: Record<CrystalType, typeof Heart> = {
  kindness: Heart,
  memories: Camera,
  courage: Shield,
  unity: Users,
};

const crystalStories: Record<CrystalType, string> = {
  kindness:
    "Found on the Cozy Street, where neighbors shared acts of kindness and warmth. The memory matching game revealed the beautiful connections between giving and receiving.",
  memories:
    "Discovered at the bustling Market, where the friendly vendor remembered years of New Year traditions. Each found item brought back precious memories of celebrations past.",
  courage:
    "Retrieved from the quiet Winter Forest, where the frozen path required patience and bravery. The sliding puzzle taught that courage means taking one step at a time.",
  unity:
    "Earned at the Celebration Square, where the whole town came together to create a harmonious light show. Unity means moving as one toward a shared goal.",
};

export default function CollectionPage() {
  const { goToChapter, gameState } = useGame();
  const crystalTypes: CrystalType[] = ["kindness", "memories", "courage", "unity"];

  const collectedCount = Object.values(gameState.crystals).filter(Boolean).length;
  const allCollected = collectedCount === 4;

  return (
    <SceneWrapper
      showProgress={false}
      backgroundClass="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900"
    >
      <div className="min-h-screen flex flex-col px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <GameButton
            onClick={() => goToChapter(gameState.gameCompleted ? "final" : "start")}
            variant="secondary"
            icon="none"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </GameButton>

          <h1
            className="font-display text-3xl md:text-4xl font-bold text-amber-100"
            data-testid="text-collection-title"
          >
            Crystal Collection
          </h1>

          <div className="w-24" />
        </div>

        <div className="flex-1 flex flex-col items-center gap-8">
          <div className="text-center mb-4">
            <Star lit={allCollected} size="lg" />
            <p className="mt-4 text-lg text-slate-300 font-medium">
              {collectedCount}/4 Crystals Collected
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
            data-testid="crystal-collection-grid"
          >
            {crystalTypes.map((type) => {
              const collected = gameState.crystals[type];
              const info = crystalInfo[type];
              const Icon = crystalIcons[type];

              return (
                <div
                  key={type}
                  className={`
                    relative overflow-hidden rounded-3xl p-6
                    transition-all duration-500
                    ${collected
                      ? "bg-card/80 dark:bg-card/60 backdrop-blur-md border border-border/50"
                      : "bg-slate-800/30 border border-slate-700/30"
                    }
                  `}
                  data-testid={`collection-card-${type}`}
                >
                  {collected && (
                    <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 opacity-20">
                      <div
                        className={`
                          w-full h-full rounded-full blur-2xl
                          ${type === "kindness" ? "bg-pink-400" : ""}
                          ${type === "memories" ? "bg-purple-400" : ""}
                          ${type === "courage" ? "bg-blue-400" : ""}
                          ${type === "unity" ? "bg-amber-400" : ""}
                        `}
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <CrystalDisplay type={type} collected={collected} size="md" />

                    <div className="flex-1">
                      <h3
                        className={`
                          font-display text-xl font-semibold mb-2
                          ${collected ? "text-foreground" : "text-slate-500"}
                        `}
                      >
                        {info.name}
                      </h3>

                      <p
                        className={`
                          font-story text-sm leading-relaxed
                          ${collected ? "text-muted-foreground" : "text-slate-600"}
                        `}
                      >
                        {collected ? crystalStories[type] : "Not yet discovered..."}
                      </p>
                    </div>
                  </div>

                  {!collected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-700/50 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-500 font-medium">Locked</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allCollected && (
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-900/30 via-orange-900/30 to-amber-900/30 rounded-3xl border border-amber-500/20 max-w-2xl text-center animate-fade-in-up">
              <h3 className="font-display text-2xl text-amber-200 mb-3">
                Collection Complete!
              </h3>
              <p className="font-story text-amber-100/80 leading-relaxed">
                Ainazik has gathered all four Memory Crystals and restored the Star's magical glow.
                The spirit of New Year lives on through kindness, cherished memories, courage, and
                the unity of loved ones.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Thank you for playing "Ainazik and the Star's Glow"
          </p>
        </div>
      </div>
    </SceneWrapper>
  );
}
