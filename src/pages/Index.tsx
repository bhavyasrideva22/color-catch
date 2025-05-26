import React from "react";
import { Link } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import Layout from "@/components/layout/Layout";
import GameCard from "@/components/games/GameCard";

const Index: React.FC = () => {
  const { games } = useGame();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">REFLEX ELITE</h1>
          <p className="mt-2 text-sm text-luxury-white/70">
            Train your cognitive reflexes
          </p>
        </div>

        {/* Game Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
