import { useTicTacToe } from "../hooks/useTicTacToe";
import { clearGameRoundsRecord, createNewGameRound } from "../db";
import GameBoard from "./GameBoard";

function GamePlayground() {
  const { currentGameRound, makeMove } = useTicTacToe();

  const move = async (index: number) => {
    const sequence = index + 1;
    const row = Math.ceil(sequence / 3) - 1;
    const col = index % 3;
    makeMove(row, col);
  };

  return (
    <section className="col-span-10 row-span-1 flex flex-col items-center justify-center">
      {currentGameRound && (
        <>
          <div data-testid="active-game-round">
            <div className="text-white">status: {currentGameRound.status}</div>
            <div className="text-white">winner: {currentGameRound.winner}</div>
            <GameBoard
              move={move}
              size={"large"}
              board={currentGameRound.board}
            ></GameBoard>
          </div>
          <div className="text-white">
            {"Click new game button could restart a new game"}
          </div>
        </>
      )}
      {!currentGameRound && (
        <div className="text-white">
          {"Please click NEW GAME (PVE) or NEW GAME (PVE) to start a game"}
        </div>
      )}
      <div className="mt-3">
        <button
          className="rounded bg-blue-500 p-3 text-white mr-5"
          onClick={() => createNewGameRound("pve")}
        >
          {"NEW GAME (PVE)"}
        </button>
        <button
          className="rounded bg-blue-500 p-3 text-white mr-5"
          onClick={() => createNewGameRound("pvp")}
        >
          {"NEW GAME (PVP)"}
        </button>
        <button
          className="rounded bg-blue-500 p-3 text-white"
          onClick={() => clearGameRoundsRecord()}
        >
          Clear All Record
        </button>
      </div>
    </section>
  );
}

export default GamePlayground;
