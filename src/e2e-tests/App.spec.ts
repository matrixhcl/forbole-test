import { test, expect } from "@playwright/test";
import { Player } from "../db";
test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("TicTacToe");
});

test("create new pvp game and the game should be playable when clicking pvp new game button", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText("NEW GAME (PVP)", { exact: true }).click();
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
  await page.getByText("NEW GAME (PVE)", { exact: true }).click();
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
  await page.getByText("NEW GAME (PVP)", { exact: true }).click();
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

test("history should be updated correctly when game is created", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText("NEW GAME (PVP)", { exact: true }).click();
  let firstGameHistoryContainer = await page.getByTestId("game-history-1");
  await expect(firstGameHistoryContainer).toBeInViewport();
  await page.getByText("NEW GAME (PVP)", { exact: true }).click();
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
  await page.getByText("NEW GAME (PVP)", { exact: true }).click();
  await page.getByText("NEW GAME (PVP)", { exact: true }).click();
  await expect(page.getByTestId("game-history-1")).toHaveCount(1);
  await expect(page.getByTestId("game-history-2")).toHaveCount(1);
  // click the clear record button, both history should be removed from the UI
  await page.getByText("Clear All Record").click();
  await expect(page.getByTestId("game-history-1")).toHaveCount(0);
  await expect(page.getByTestId("game-history-2")).toHaveCount(0);
});
