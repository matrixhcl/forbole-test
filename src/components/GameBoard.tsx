import circleSvg from "../assets/circle.svg";
import crossSvg from "../assets/cross.svg";
import { GameRound, Player } from "../db";
interface Props {
  board: GameRound["board"];
  size: "small" | "large";
  move?: (index: number) => void;
}

function GameBoard(props: Props) {
  const { board, move, size } = props;
  const sizeClasses = size === "large" ? "gap-3 w-80 h-80" : "gap-1 w-32 h-32";
  return (
    <div
      data-testid={`gameboard-${size}`}
      className={`grid grid-cols-3 grid-rows-3 bg-[#c3c5eb] ${sizeClasses}`}
    >
      {board.flat().map((boardPiece, index) => (
        <div
          data-testid={`gameboard-piece-${index}`}
          className="bg-gray-600 p-1"
          onClick={() => {
            if (move) move(index);
          }}
          key={`${boardPiece}${index}`}
        >
          {boardPiece !== Player.None && (
            <img
              src={boardPiece === Player.O ? circleSvg : crossSvg}
              alt={boardPiece}
            ></img>
          )}
        </div>
      ))}
    </div>
  );
}
export default GameBoard;
