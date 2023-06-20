import circleSvg from "../assets/circle.svg";
import crossSvg from "../assets/cross.svg";
import { useTicTacToe } from "../hooks/useTicTacToe";
import { Player, clearGameRoundsRecord, createNewGameRound } from "../db";
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
    <section className="col-span-10 row-span-1">
      {currentGameRound && (
        <div>
          <div>status: {currentGameRound.status}</div>
          <div>winner: {currentGameRound.winner}</div>
          <GameBoard
            move={move}
            size={"large"}
            board={currentGameRound.board}
          ></GameBoard>
        </div>
      )}

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
    </section>
  );
}

export default GamePlayground;
