import Dexie, { Table } from "dexie";

export enum Player {
  None = "None",
  X = "X",
  O = "O",
}

export type Board = Player[][];

export interface Move {
  player: Player;
  row: number;
  col: number;
}

export interface GameRound {
  id?: number;
  gameMode: "pvp" | "pve";
  currentPlayer: Player;
  status: "playing" | "end";
  winner: Player | null;
  moves: Move[];
  board: Board;
}

class Database extends Dexie {
  gamerounds!: Table<GameRound>;

  constructor() {
    super("db");
    this.version(1).stores({
      gamerounds: "++id, gameMode, currentPlayer, winner, status",
    });
  }
}

export const db = new Database();

export const clearGameRoundsRecord = () => {
  return db.gamerounds.clear();
};

export const newGameRoundFactory = (
  gameMode: GameRound["gameMode"]
): GameRound => ({
  gameMode,
  status: "playing",
  winner: null,
  moves: [],
  board: Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => Player.None)
  ),
  currentPlayer: Player.O,
});

export const createNewGameRound = (gameMode: GameRound["gameMode"]) => {
  db.gamerounds.add(newGameRoundFactory(gameMode));
};
