import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import GameHistory from "../../components/GameHistory";
import { Player, GameRound } from "../../db";

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
const data2: GameRound = vi.hoisted(() => ({
  ...structuredClone(data1),
  id: 2,
  winner: "O" as Player.O,
  gameMode: "pvp",
  status: "end",
}));

vi.mock("dexie-react-hooks", () => {
  return {
    useLiveQuery: vi.fn().mockReturnValue([data1, data2]),
  };
});

describe("GameHistory", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("should render a game history list correctly", async () => {
    render(<GameHistory></GameHistory>);
    const titleElement = screen.getByText("Game History");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toBeVisible();
    const data1IDElement = screen.getByText(`Game ID: ${data1.id}`);
    expect(data1IDElement).toBeVisible();
    const data2IDElement = screen.getByText(`Game ID: ${data2.id}`);
    expect(data2IDElement).toBeVisible();
    const data1WinnerElement = screen.getByText(`Winner:`, { exact: true });
    expect(data1WinnerElement).toBeVisible();
    const data2WinnerElement = screen.getByText(`Winner: ${data2.winner}`);
    expect(data2WinnerElement).toBeVisible();
  });
});
