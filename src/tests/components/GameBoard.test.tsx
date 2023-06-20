import { render, screen, fireEvent } from "@testing-library/react";
import GameBoard from "../../components/GameBoard";
import { Player } from "../../db/index";
import { vi } from "vitest";

describe("GameBoard", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it("should render a gameboard for tictactoe correctly", async () => {
    const board = [
      [Player.X, Player.X, Player.O],
      [Player.None, Player.O, Player.None],
      [Player.O, Player.None, Player.None],
    ];
    // store X and O index in array for testing move function of the component
    const XIndex = board
      .flat()
      .map((value, index) => (value === Player.X ? index : null))
      .filter((i): i is number => typeof i === "number");
    const OIndex = board
      .flat()
      .map((value, index) => (value === Player.O ? index : null))
      .filter((i): i is number => typeof i === "number");

    const mockMoveFn = vi.fn();
    render(
      <GameBoard board={board} size="small" move={mockMoveFn}></GameBoard>
    );

    const [XImgs, OImgs] = await Promise.all([
      screen.findAllByAltText(Player.X),
      screen.findAllByAltText(Player.O),
    ]);

    // test player x symbols image
    // check if element visible, trigger event is correct, and move function is called correct number of times.
    expect(XImgs.length).toBe(2);
    XImgs.forEach((img, index) => {
      expect(img).toBeVisible();
      fireEvent.click(img);
      expect(mockMoveFn).toHaveBeenCalledWith(XIndex[index]);
    });
    expect(mockMoveFn).toHaveBeenCalledTimes(2);
    // test player O symbols image
    expect(OImgs.length).toBe(3);
    OImgs.forEach((img, index) => {
      expect(img).toBeVisible();
      fireEvent.click(img);
      expect(mockMoveFn).toHaveBeenCalledWith(OIndex[index]);
    });
    expect(mockMoveFn).toHaveBeenCalledTimes(5);
  });
});
