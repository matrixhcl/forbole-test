import { test, expect } from "@playwright/test";
import { GameRound, Player } from "../db";

const newPVPGameButtonText = "NEW GAME (PVP)";
const newPVEGameButtonText = "NEW GAME (PVE)";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("TicTacToe");
});

test("create new pvp game and the game should be playable when clicking pvp new game button", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText(newPVPGameButtonText, { exact: true }).click();
  const [activeGameRoundContainer, statusTitle, winnerRow] = await Promise.all([
    page.getByTestId("active-game-round"),
    page.getByText("status: playing"),
    page.getByText("winner: ", { exact: true }),
  ]);
  const currentPlayerO = await page.getByText("current player: O");
  await expect(currentPlayerO).toBeInViewport(),
    await page
      .getByTestId("gameboard-large")
      .getByTestId("gameboard-piece-0")
      .click();
  const OImg = await page
    .getByTestId("gameboard-large")
    .getByTestId("gameboard-piece-0")
    .getByAltText("O");
  const currentPlayerX = await page.getByText("current player: X");
  await Promise.all([
    expect(activeGameRoundContainer).toBeInViewport(),
    expect(statusTitle).toBeInViewport(),
    expect(winnerRow).toBeInViewport(),
    expect(OImg).toBeInViewport(),
    expect(currentPlayerX).toBeInViewport(),
  ]);
});

test("create new pve game when clicking pve new game button is clicked, and the game should be playable ", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText(newPVEGameButtonText, { exact: true }).click();
  const [activeGameRoundContainer, statusTitle, winnerRow] = await Promise.all([
    page.getByTestId("active-game-round"),
    page.getByText("status: playing"),
    page.getByText("winner: ", { exact: true }),
  ]);
  await page
    .getByTestId("gameboard-large")
    .getByTestId("gameboard-piece-0")
    .click();
  const OImg = await page
    .getByTestId("gameboard-large")
    .getByTestId("gameboard-piece-0")
    .getByAltText(Player.O);
  // pve bot movement is random, so just use alt text for search
  const XImg = await page.getByTestId("gameboard-large").getByAltText(Player.X);
  await Promise.all([
    expect(activeGameRoundContainer).toBeInViewport(),
    expect(statusTitle).toBeInViewport(),
    expect(winnerRow).toBeInViewport(),
    expect(OImg).toBeInViewport(),
    expect(XImg).toBeInViewport(),
  ]);
});

test("should be able to finish a full pvp game", async ({ page }) => {
  await page.goto("/");
  await page.getByText(newPVPGameButtonText, { exact: true }).click();
  const [activeGameRoundContainer, gameboard] = await Promise.all([
    page.getByTestId("active-game-round"),
    page.getByTestId("gameboard-large"),
  ]);
  const clickSequence = [0, 4, 1, 5, 2];
  // O get the full first row, should win
  for (const index of clickSequence) {
    await gameboard.getByTestId(`gameboard-piece-${index}`).click();
  }
  await expect(
    activeGameRoundContainer.getByText(`winner: ${Player.O}`)
  ).toBeInViewport();
});

test("should be able to finish a full pve game", async ({ page }) => {
  await page.goto("/");
  await page.getByText(newPVEGameButtonText, { exact: true }).click();
  const [activeGameRoundContainer, gameboard] = await Promise.all([
    page.getByTestId("active-game-round"),
    page.getByTestId("gameboard-large"),
  ]);
  // O make the first step first
  await page
    .getByTestId("gameboard-large")
    .getByTestId("gameboard-piece-0")
    .click();
  // X is moved by bot so it's completely random, read move set data directly from indexeddb to determine next step
  const playWithBot = async (): Promise<{
    winner: Player;
    numberOfMoves: number;
  }> => {
    const activeGameRound = (await page.evaluate(() => {
      return new Promise((resolve) => {
        const openDBRequest = indexedDB.open("db");
        openDBRequest.onsuccess = () => {
          const db = openDBRequest.result;
          const transaction = db.transaction("gamerounds");
          const objectStore = transaction.objectStore("gamerounds");
          const request = objectStore.getAll();
          request.onsuccess = () => {
            const moves = request.result;
            resolve(moves[0]);
          };
        };
      });
    })) as GameRound;
    const { moves, winner } = activeGameRound;
    // if winner is set, end the function and return the winner and number of moves for determine who is the winner
    if (winner !== null) {
      return { winner, numberOfMoves: activeGameRound.moves.length };
    }
    // calculate next step for O
    const usedPieces = new Set<string>();
    moves.forEach((move) => usedPieces.add(`${move.row}${move.col}`));
    const rowAndColIndexRange = [0, 1, 2];
    let nextMove: { row: number; col: number } | null = null;
    rowAndColIndexRange.forEach((rowIndex) => {
      rowAndColIndexRange.forEach((colIndex) => {
        const rowColIndex = `${rowIndex}${colIndex}`;
        if (!usedPieces.has(rowColIndex)) {
          nextMove = { row: rowIndex, col: colIndex };
        }
      });
    });
    if (!nextMove) {
      throw new Error("No next move found");
    }
    const nextMoveIndex = nextMove["row"] * 3 + nextMove["col"];
    // click the next move
    await gameboard.getByTestId(`gameboard-piece-${nextMoveIndex}`).click();
    // recursive function until winner is set
    return await playWithBot();
  };
  const { winner, numberOfMoves } = await playWithBot();
  if (winner === Player.None) {
    expect(winner).toBe(Player.None);
  } else if (numberOfMoves % 2 === 0) {
    expect(winner).toBe(Player.X);
  } else if (numberOfMoves % 2 === 1) {
    expect(winner).toBe(Player.O);
  } else {
    throw new Error("Invalid winner");
  }
  await expect(
    activeGameRoundContainer.getByText(`winner: ${winner}`)
  ).toBeVisible();
});

test("history should be updated correctly when game is created", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText(newPVPGameButtonText, { exact: true }).click();
  let firstGameHistoryContainer = await page.getByTestId("game-history-1");
  await expect(firstGameHistoryContainer).toBeInViewport();
  await page.getByText(newPVPGameButtonText, { exact: true }).click();
  // both history should exist on the list
  firstGameHistoryContainer = await page.getByTestId("game-history-1");
  const secondGameHistoryContainer = await page.getByTestId("game-history-2");
  await expect(secondGameHistoryContainer).toBeInViewport();
});

test("history should be cleared when clear data button is clicked", async ({
  page,
}) => {
  await page.goto("/");
  //create 2 new games, there should be 2 history on the UI, logic is tested in previous test
  await page.getByText(newPVPGameButtonText, { exact: true }).click();
  await page.getByText(newPVPGameButtonText, { exact: true }).click();
  await expect(page.getByTestId("game-history-1")).toHaveCount(1);
  await expect(page.getByTestId("game-history-2")).toHaveCount(1);
  // click the clear record button, both history should be removed from the UI
  await page.getByText("Clear All Record").click();
  await expect(page.getByTestId("game-history-1")).toHaveCount(0);
  await expect(page.getByTestId("game-history-2")).toHaveCount(0);
});
