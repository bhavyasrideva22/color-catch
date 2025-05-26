import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import Layout from "@/components/layout/Layout";
import GameContainer from "@/components/games/GameContainer";
import GameResult from "@/components/games/GameResult";
import { GameType } from "@/types/game";
import ColorCatchGame from "@/games/ColorCatchGame";

const STANDARD_BEST_AVERAGE_TIMINGS: Record<string, number> = {
  colorCatch: 27.00,      // 27s for color catch
};

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { games, getGameHighScore, saveGameResult } = useGame();
  const [showResults, setShowResults] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isHighScore, setIsHighScore] = useState(false);
  const navigate = useNavigate();

  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    return <div>Game not found</div>;
  }

  const handleGameStart = () => {
    setShowResults(false);
  };

  const handleGameEnd = (score: number, time: number) => {
    const highScore = getGameHighScore(game.id as GameType) || 0;
    const newHighScore = score > highScore;
    
    const result = {
      gameId: game.id as GameType,
      score,
      time,
      date: new Date().toISOString(),
      isHighScore: newHighScore
    };
    
    saveGameResult(result);
    
    setGameScore(score);
    setGameTime(time);
    setIsHighScore(newHighScore);
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    navigate(0);
  };

  const renderGame = () => {
    switch (game.id) {
      case "colorCatch":
        return <ColorCatchGame onFinish={handleGameEnd} />;
      default:
        return <div>Game component not available</div>;
    }
  };

  const standardBestAverage = STANDARD_BEST_AVERAGE_TIMINGS[game.id] ?? undefined;

  return (
    <Layout>
      {showResults ? (
        <GameResult
          title={game.name}
          score={gameScore}
          time={gameTime}
          isHighScore={isHighScore}
          onRestart={handleRestart}
          standardBestAverage={standardBestAverage}
        />
      ) : (
        <GameContainer
          title={game.name}
          instructions={game.instructions}
          onGameStart={handleGameStart}
          onGameEnd={handleGameEnd}
        >
          {renderGame()}
        </GameContainer>
      )}
    </Layout>
  );
};

export default GamePage;
