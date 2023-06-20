import { expect, it, describe, vi } from "vitest";
import { checkWin } from "../../hooks/useTicTacToe";
import { Player } from "../../db";

const mockData = vi.hoisted(() => ({
  id: 1,
  gameMode: "pvp",
  status: "playing",
  winner: null,
  moves: [],
  board: Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => "None")
  ),
  currentPlayer: "O",
}));

const gamerRoundsAddMock = vi.hoisted(() => vi.fn());
const gamerRoundsPutMock = vi.hoisted(() => vi.fn());
vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: vi.fn().mockReturnValueOnce([mockData]),
}));
vi.mock("../db", async () => {
  const actual = await vi.importActual<typeof import("../../db")>("../db");
  return {
    ...actual,
    db: {
      gamerounds: {
        add: gamerRoundsAddMock,
        put: gamerRoundsPutMock,
      },
    },
  };
});

describe("useTicTacToe checkWin function", () => {
  it("should return false if it's not a win move", () => {
    const check = checkWin(
      [
        [Player.O, Player.O, Player.X],
        [Player.None, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
      ],
      0,
      0
    );
    expect(check).toBe(false);
  });
  it("should be able to check row win", () => {
    const check = checkWin(
      [
        [Player.O, Player.O, Player.O],
        [Player.None, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
      ],
      0,
      0
    );
    expect(check).toBe(true);
  });
  it("should be able to check column win", () => {
    const check = checkWin(
      [
        [Player.O, Player.X, Player.X],
        [Player.O, Player.None, Player.None],
        [Player.O, Player.None, Player.None],
      ],
      0,
      0
    );
    expect(check).toBe(true);
  });
  it("should be able to check diagonal win", () => {
    const check = checkWin(
      [
        [Player.O, Player.X, Player.X],
        [Player.None, Player.O, Player.None],
        [Player.None, Player.None, Player.O],
      ],
      0,
      0
    );
    expect(check).toBe(true);
  });
  it("should be able to check reverse diagonal win", () => {
    const check = checkWin(
      [
        [Player.X, Player.X, Player.O],
        [Player.None, Player.O, Player.None],
        [Player.O, Player.None, Player.None],
      ],
      0,
      2
    );
    expect(check).toBe(true);
  });
});
