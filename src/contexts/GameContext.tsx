import React, { createContext, useContext, useState, useEffect } from "react";
import { GameType, GameResult, Game } from "@/types/game";

interface GameContextProps {
  games: Game[];
  gameResults: GameResult[];
  saveGameResult: (result: GameResult) => void;
  getGameHighScore: (gameId: GameType) => number | undefined;
  getGameBestTime: (gameId: GameType) => number | undefined;
  getDailyChallenge: () => Game;
  streak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

const GAMES: Game[] = [
  {
    id: "colorCatch",
    name: "Color Catch",
    description: "Tap circles of a specific color",
    instructions: "Tap only the circles of the specified color as they appear.",
    icon: "⭕️",
  },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [gameResults, setGameResults] = useState<GameResult[]>(() => {
    const savedResults = localStorage.getItem("gameResults");
    return savedResults ? JSON.parse(savedResults) : [];
  });
  
  const [streak, setStreak] = useState<number>(() => {
    const savedStreak = localStorage.getItem("streak");
    return savedStreak ? parseInt(savedStreak, 10) : 0;
  });

  const [dailyChallenge, setDailyChallenge] = useState<Game>(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("dailyChallengeDate");
    
    if (savedDate === today) {
      const savedChallenge = localStorage.getItem("dailyChallenge");
      if (savedChallenge) {
        return JSON.parse(savedChallenge);
      }
    }
    
    // Generate a new daily challenge
    const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
    localStorage.setItem("dailyChallengeDate", today);
    localStorage.setItem("dailyChallenge", JSON.stringify(randomGame));
    return randomGame;
  });

  useEffect(() => {
    localStorage.setItem("gameResults", JSON.stringify(gameResults));
  }, [gameResults]);

  useEffect(() => {
    localStorage.setItem("streak", streak.toString());
  }, [streak]);

  // Save game result
  const saveGameResult = (result: GameResult) => {
    setGameResults(prevResults => [...prevResults, result]);
  };

  // Get high score for a specific game
  const getGameHighScore = (gameId: GameType): number | undefined => {
    const results = gameResults.filter(result => result.gameId === gameId);
    if (results.length === 0) return undefined;
    
    return Math.max(...results.map(result => result.score));
  };

  // Get best time for a specific game
  const getGameBestTime = (gameId: GameType): number | undefined => {
    const results = gameResults.filter(result => result.gameId === gameId);
    if (results.length === 0) return undefined;
    
    return Math.min(...results.map(result => result.time));
  };

  // Get daily challenge
  const getDailyChallenge = (): Game => {
    return dailyChallenge;
  };

  // Increment streak
  const incrementStreak = () => {
    setStreak(prev => prev + 1);
  };

  // Reset streak
  const resetStreak = () => {
    setStreak(0);
  };

  // Add high scores and best times to games
  const gamesWithStats = GAMES.map(game => ({
    ...game,
    highScore: getGameHighScore(game.id),
    bestTime: getGameBestTime(game.id)
  }));

  return (
    <GameContext.Provider
      value={{
        games: gamesWithStats,
        gameResults,
        saveGameResult,
        getGameHighScore,
        getGameBestTime,
        getDailyChallenge,
        streak,
        incrementStreak,
        resetStreak
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
