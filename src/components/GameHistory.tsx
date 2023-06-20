import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/index";
import GameBoard from "./GameBoard";
function GameHistory() {
  const GameRounds = useLiveQuery(
    async () => await db.gamerounds.orderBy("id").reverse().toArray()
  );
  return (
    <section className="col-span-2 overflow-y-scroll">
      <h2 className="p-2 text-white">Game History</h2>
      {GameRounds &&
        GameRounds.map((round) => (
          <div
            key={round.id}
            className="border-2 p-2 rounded m-2"
            data-testid={`game-history-${round.id}`}
          >
            <div className="text-white">Game ID: {round.id}</div>
            <div className="text-white">Winner: {round.winner}</div>
            <div className="flex justify-center p-3">
              <GameBoard size="small" board={round.board}></GameBoard>
            </div>
          </div>
        ))}
    </section>
  );
}

export default GameHistory;
