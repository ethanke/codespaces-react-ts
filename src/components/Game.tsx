import React from "react";
import { useGame } from "./hooks/useGame";
import "./Game.css";

const Game: React.FC = () => {
  const { players, buildings, handleMouseMove, handleBuildingClick } =
    useGame();

  return (
    <div
      className="game"
      onMouseMove={handleMouseMove}
      onClick={handleBuildingClick}
    >
      {players.map((player) => (
        <div
          key={player.id}
          className="player"
          style={{ left: player.x, top: player.y }}
        />
      ))}
      {buildings.map((building) => (
        <div
          key={building.id}
          className="building"
          style={{ left: building.x, top: building.y }}
        />
      ))}
    </div>
  );
};

export default Game;
