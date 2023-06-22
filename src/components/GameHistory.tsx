import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/index";
import GameBoard from "./GameBoard";
function GameHistory() {
  const GameRounds = useLiveQuery(
    async () => await db.gamerounds.orderBy("id").reverse().toArray()
  );
  return (
    <section className="col-span-4 overflow-y-scroll lg:col-span-2">
      <h2 className="sticky top-0 bg-gray-600 p-2 text-white">Game History</h2>
      {GameRounds &&
        GameRounds.map((round) => (
          <div
            key={round.id}
            className="m-2 rounded border-2 p-2"
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
