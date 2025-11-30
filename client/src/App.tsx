import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider, useGame } from "@/lib/game-context";
import StartScreen from "@/pages/StartScreen";
import ChapterAttic from "@/pages/ChapterAttic";
import ChapterCozyStreet from "@/pages/ChapterCozyStreet";
import ChapterMarket from "@/pages/ChapterMarket";
import ChapterForest from "@/pages/ChapterForest";
import ChapterSquare from "@/pages/ChapterSquare";
import FinalScene from "@/pages/FinalScene";
import CollectionPage from "@/pages/CollectionPage";

function GameRouter() {
  const { gameState, isShowingStartScreen } = useGame();

  if (isShowingStartScreen) {
    return (
      <div className="min-h-screen" data-testid="game-container">
        <StartScreen />
      </div>
    );
  }

  const renderChapter = () => {
    switch (gameState.currentChapter) {
      case "start":
        return <StartScreen />;
      case "attic":
        return <ChapterAttic />;
      case "cozyStreet":
        return <ChapterCozyStreet />;
      case "market":
        return <ChapterMarket />;
      case "forest":
        return <ChapterForest />;
      case "square":
        return <ChapterSquare />;
      case "final":
        return <FinalScene />;
      case "collection":
        return <CollectionPage />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="min-h-screen" data-testid="game-container">
      {renderChapter()}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <GameRouter />
          <Toaster />
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
