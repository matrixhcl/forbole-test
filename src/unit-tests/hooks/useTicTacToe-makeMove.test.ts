import { expect, it, describe, vi } from "vitest";
import { makeMove } from "../../hooks/useTicTacToe";
import { GameRound, Player, newGameRoundFactory } from "../../db";

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

describe("useTicTacToe makeMove function", () => {
  it("should handle a full pvp game correctly", async () => {
    const initData = newGameRoundFactory("pvp");
    initData.id = 1;

    //step 1
    const step1Data: GameRound = {
      ...initData,
      moves: [
        {
          col: 0,
          row: 0,
          player: Player.O,
        },
      ],
      board: [
        [Player.O, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
      ],
      currentPlayer: Player.X,
    };
    const step1Result = makeMove(0, 0, initData);
    expect(step1Result).toStrictEqual(step1Data);

    //step 2
    const step2Result = makeMove(0, 1, step1Data);
    const step2Data: GameRound = {
      ...step1Data,
      moves: [
        {
          col: 0,
          row: 0,
          player: Player.O,
        },
        {
          col: 1,
          row: 0,
          player: Player.X,
        },
      ],
      board: [
        [Player.O, Player.X, Player.None],
        [Player.None, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
      ],
      currentPlayer: Player.O,
    };
    expect(step2Result).toStrictEqual(step2Data);
    //step 3
    const step3Result = makeMove(1, 0, step2Data);
    const step3Data: GameRound = {
      ...step1Data,
      moves: [
        {
          col: 0,
          row: 0,
          player: Player.O,
        },
        {
          col: 1,
          row: 0,
          player: Player.X,
        },
        {
          col: 0,
          row: 1,
          player: Player.O,
        },
      ],
      board: [
        [Player.O, Player.X, Player.None],
        [Player.O, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
      ],
      currentPlayer: Player.X,
    };
    expect(step3Result).toStrictEqual(step3Data);
    //step 4
    const step4Result = makeMove(1, 1, step3Data);
    const step4Data: GameRound = {
      ...step1Data,
      moves: [
        {
          col: 0,
          row: 0,
          player: Player.O,
        },
        {
          col: 1,
          row: 0,
          player: Player.X,
        },
        {
          col: 0,
          row: 1,
          player: Player.O,
        },
        {
          col: 1,
          row: 1,
          player: Player.X,
        },
      ],
      board: [
        [Player.O, Player.X, Player.None],
        [Player.O, Player.X, Player.None],
        [Player.None, Player.None, Player.None],
      ],
      currentPlayer: Player.O,
    };
    expect(step4Result).toStrictEqual(step4Data);
    //step 5, game end and O should win
    const step5Result = makeMove(2, 0, step4Data);
    const step5Data: GameRound = {
      ...step1Data,
      winner: Player.O,
      moves: [
        {
          col: 0,
          row: 0,
          player: Player.O,
        },
        {
          col: 1,
          row: 0,
          player: Player.X,
        },
        {
          col: 0,
          row: 1,
          player: Player.O,
        },
        {
          col: 1,
          row: 1,
          player: Player.X,
        },
        {
          col: 0,
          row: 2,
          player: Player.O,
        },
      ],
      board: [
        [Player.O, Player.X, Player.None],
        [Player.O, Player.X, Player.None],
        [Player.O, Player.None, Player.None],
      ],
      currentPlayer: Player.O,
    };
    expect(step5Result).toStrictEqual(step5Data);
  });

  it("should not allow placing on same box twice, regardless of player", () => {
    const initData = newGameRoundFactory("pvp");
    initData.id = 1;

    //step 1 data, assume O has placed to box 0,0
    const step1Data: GameRound = {
      ...initData,
      moves: [
        {
          col: 0,
          row: 0,
          player: Player.O,
        },
      ],
      board: [
        [Player.O, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
        [Player.None, Player.None, Player.None],
      ],
      currentPlayer: Player.X,
    };
    //step2 should return false as it try to place on an occupied box
    expect(makeMove(0, 0, step1Data)).toBe(false);
  });

  it("should set the winner to none if moves count is already 9", () => {
    const initData = newGameRoundFactory("pvp");
    initData.id = 1;

    //create data that already proceed 8 moves
    const step8Data: GameRound = {
      ...initData,
      moves: [
        {
          col: 0,
          row: 0,
          player: Player.O,
        },
        {
          col: 1,
          row: 0,
          player: Player.X,
        },
        {
          col: 2,
          row: 0,
          player: Player.O,
        },
        {
          col: 0,
          row: 1,
          player: Player.X,
        },
        {
          col: 2,
          row: 1,
          player: Player.O,
        },
        {
          col: 1,
          row: 1,
          player: Player.X,
        },
        {
          col: 0,
          row: 2,
          player: Player.O,
        },
        {
          col: 2,
          row: 2,
          player: Player.X,
        },
      ],
      board: [
        [Player.O, Player.X, Player.O],
        [Player.X, Player.X, Player.O],
        [Player.O, Player.None, Player.X],
      ],
      currentPlayer: Player.O,
    };
    // add no. 9 moves, the winner should turn to none
    const step9Result = makeMove(2, 1, step8Data);
    expect(step9Result).toEqual({
      ...step8Data,
      moves: [
        ...step8Data.moves,
        {
          col: 1,
          row: 2,
          player: Player.O,
        },
      ],
      board: [
        [Player.O, Player.X, Player.O],
        [Player.X, Player.X, Player.O],
        [Player.O, Player.O, Player.X],
      ],
      winner: Player.None,
    });
  });
});
