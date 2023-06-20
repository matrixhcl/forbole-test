import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { Player, GameRound } from "../../db";
import GamePlayground from "../../components/GamePlayground";

const data1: GameRound = vi.hoisted(() => ({
  id: 1,
  gameMode: "pve",
  status: "playing",
  winner: null,
  moves: [],
  board: [
    ["O", "X", "O"],
    ["X", "O", "X"],
    ["X", "X", "O"],
  ] as Player[][],
  currentPlayer: "O" as Player.O,
}));

const mockMoveFn = vi.hoisted(() => vi.fn());
const mockCreateNewGameRoundFn = vi.hoisted(() => vi.fn());
const mockClearDataFn = vi.hoisted(() => vi.fn());
vi.mock("../../hooks/useTicTacToe", () => {
  return {
    useTicTacToe: vi.fn().mockReturnValue({
      currentGameRound: data1,
      makeMove: mockMoveFn,
    }),
  };
});

vi.mock("../../db", async () => {
  const actual = await vi.importActual<typeof import("../../../db")>(
    "../../db"
  );
  return {
    ...actual,
    createNewGameRound: mockCreateNewGameRoundFn,
    clearGameRoundsRecord: mockClearDataFn,
  };
});

describe("GamePlayground", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("should send correct parameter to create new game when clicking new game pve button", async () => {
    render(<GamePlayground></GamePlayground>);
    const pveNewGameBtn = screen.getByText("NEW GAME (PVE)");
    fireEvent.click(pveNewGameBtn);
    expect(mockCreateNewGameRoundFn).toHaveBeenCalled();
    expect(mockCreateNewGameRoundFn).toHaveBeenCalledWith("pve");
  });
  it("should send correct parameter to create new game when clicking new game pvp button", async () => {
    render(<GamePlayground></GamePlayground>);
    const pvpNewGameBtn = screen.getByText("NEW GAME (PVP)");
    fireEvent.click(pvpNewGameBtn);
    expect(mockCreateNewGameRoundFn).toHaveBeenCalled();
    expect(mockCreateNewGameRoundFn).toHaveBeenCalledWith("pvp");
  });
  it("should invoke clear data function when clicking clear all data button", async () => {
    render(<GamePlayground></GamePlayground>);
    const clearDataBtn = screen.getByText("Clear All Record");
    fireEvent.click(clearDataBtn);
    expect(mockClearDataFn).toHaveBeenCalled();
  });
});
