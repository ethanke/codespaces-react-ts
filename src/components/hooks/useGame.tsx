import React, { createContext, useContext, useState, useEffect } from "react";
import { usePeer } from "./usePeer";
import _ from "lodash";

type Player = {
  id: string;
  x: number;
  y: number;
};

type Building = {
  id: string;
  x: number;
  y: number;
};

type GameData = {
  players: Player[];
  buildings: Building[];
};

interface GameContextType {
  players: Player[];
  buildings: Building[];
  gameData: GameData;
  updateGameData: React.Dispatch<React.SetStateAction<GameData>>;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleBuildingClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
  const [gameData, setGameData] = useState<GameData>({
    players: [],
    buildings: [],
  });

  const onData = (data: GameData) => {
    setGameData(data);
  };

  const [peer, peerId] = usePeer(true, onData);

  useEffect(() => {
    const fetchGameData = async () => {
      const data = {
        players: [
          { id: "player-1", x: 10, y: 10 },
          { id: "player-2", x: 20, y: 20 },
          { id: "player-3", x: 30, y: 30 },
        ],
        buildings: [
          { id: "building-1", x: 50, y: 50 },
          { id: "building-2", x: 100, y: 100 },
        ],
      };
      onData(data);
    };

    fetchGameData();
  }, []);

  useEffect(() => {
    if (!peer || !peerId) return;

    const updateGameData = _.throttle((data: GameData) => {
      const signalData = JSON.stringify({ peerId, data });
      peer.send(signalData);
    }, 100);

    const interval = setInterval(() => {
      updateGameData(gameData);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [peer, peerId, gameData]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // handle mouse move logic
  };

  const handleBuildingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // handle building click logic
  };

  return {
    players: gameData.players,
    buildings: gameData.buildings,
    gameData,
    updateGameData: setGameData,
    handleMouseMove,
    handleBuildingClick,
  };
};

type GameProviderProps = {
  children: React.ReactNode;
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const game = useGame();

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
