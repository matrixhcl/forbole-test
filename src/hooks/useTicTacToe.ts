import { db } from "../db";
import { useLiveQuery } from "dexie-react-hooks";
import { GameRound, Player } from "../db/index";

const randomNumber = (min: number, max: number) => {
  const range = max - min + 1;
  const bytes_needed = Math.ceil(Math.log2(range) / 8);
  const cutoff = Math.floor(256 ** bytes_needed / range) * range;
  const bytes = new Uint8Array(bytes_needed);
  let value;
  do {
    crypto.getRandomValues(bytes);
    value = bytes.reduce((acc, x, n) => acc + x * 256 ** n, 0);
  } while (value >= cutoff);
  return min + (value % range);
};

export const checkWin = (
  board: GameRound["board"],
  row: number,
  col: number
): boolean => {
  const currentPlayerRow = board[row];
  const currentPlayer = board[row]?.[col];
  if (!currentPlayer || !currentPlayerRow) return false;
  // Check row
  if (
    currentPlayerRow[0] === currentPlayer &&
    currentPlayerRow[1] === currentPlayer &&
    currentPlayerRow[2] === currentPlayer
  ) {
    return true;
  }

  // Check column
  if (
    board[0]?.[col] === currentPlayer &&
    board[1]?.[col] === currentPlayer &&
    board[2]?.[col] === currentPlayer
  ) {
    return true;
  }

  // Check diagonal
  if (row === col) {
    if (
      board[0]?.[0] === currentPlayer &&
      board[1]?.[1] === currentPlayer &&
      board[2]?.[2] === currentPlayer
    ) {
      return true;
    }
  }

  // Check reverse diagonal
  if (row + col === 2) {
    if (
      board[0]?.[2] === currentPlayer &&
      board[1]?.[1] === currentPlayer &&
      board[2]?.[0] === currentPlayer
    ) {
      return true;
    }
  }

  return false;
};

export const makeMove = (
  row: number,
  col: number,
  lastEditedGameRound?: GameRound
): GameRound | false => {
  // since code below use recursive function to achieve bot movement
  // so when this function called recursively, the data from useLiveQuery hooks will not be refreshed
  // so when bot movement invoke this function
  // it will use the data passed from function parameter instead of using data from hooks
  const gameRound = lastEditedGameRound;

  // prevent this function from invoking if the data is not ready yet
  if (!gameRound) return false;
  if (!gameRound.id) {
    throw new Error(
      "game round id doesn't exist, which shouldn't be possible if data structure is correct"
    );
  }
  const { board, currentPlayer, winner } = gameRound;
  // when there's already winner, not allowed to add move
  if (winner !== null) {
    return false;
  }
  // if the cell is not empty, not allowed to add move
  if (board[row]?.[col] !== Player.None) {
    return false;
  }

  // structured clone only works in pretty new browser so polyfill is needed
  const editingGameRound = structuredClone(gameRound);
  const newBoardRow = editingGameRound.board[row];
  if (!newBoardRow) {
    throw new Error(
      `board row ${row} doest exist, which shouldn't be possible if data structure is correct`
    );
  }
  newBoardRow[col] = currentPlayer;

  editingGameRound.moves.push({
    player: currentPlayer,
    row,
    col,
  });
  if (checkWin(editingGameRound.board, row, col)) {
    editingGameRound.winner = currentPlayer;
    editingGameRound.status = "end";
  } else if (editingGameRound.moves.length === 9) {
    editingGameRound.winner = Player.None;
    editingGameRound.status = "end";
  } else {
    editingGameRound.currentPlayer =
      currentPlayer === Player.X ? Player.O : Player.X;
  }

  // handle bot move in pve mode
  if (
    editingGameRound.gameMode === "pve" &&
    editingGameRound.currentPlayer === Player.X &&
    editingGameRound.winner === null
  ) {
    let botResult: false | GameRound = false;
    while (botResult === false) {
      // retry until return true
      // worst case scenario is just O(8) it's fine for modern computer
      botResult = makeMove(
        randomNumber(0, 9),
        randomNumber(0, 9),
        editingGameRound
      );
    }
    return botResult;
  }

  //return modified gameround so it could be stored to indexDB
  return editingGameRound;
};

export const useTicTacToe = () => {
  const currentGameRounds =
    useLiveQuery(async () => {
      return await db.gamerounds.limit(1).reverse().toArray();
    }) ?? [];
  const currentGameRound = currentGameRounds[0];
  const saveMove = async (
    row: number,
    col: number,
    lastEditedGameRound?: GameRound
  ) => {
    const gameround = lastEditedGameRound ?? currentGameRound;
    const moveResult = makeMove(row, col, gameround);
    if (!moveResult) return false;
    if (!moveResult.id) {
      throw new Error(
        "game round id doesn't exist, which shouldn't be possible if data structure is correct"
      );
    }
    await db.gamerounds.put(moveResult, [moveResult.id]);
    // add bot move in pve mode
    return true;
  };

  return {
    currentGameRound,
    makeMove: saveMove,
  };
};
