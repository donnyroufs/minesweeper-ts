import { Board } from "./Board"
import { Minesweeper } from "./Minesweeper"
import { Position } from "./Position"
import { UnknownCellException } from "./UnknownCellException"

describe("minesweeper", () => {
  test("on move we reveal the cell", () => {
    const board = new Board(10, 10)
    const game = new Minesweeper(board)
    const pos = new Position(1, 1)

    game.move(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("if we try to reveal a cell that has been revealed we do nothing", () => {
    const board = new Board(10, 10)
    const game = new Minesweeper(board)
    const pos = new Position(1, 1)

    game.move(pos)
    game.move(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("throws an exception when we try to access a grid that does not exist", () => {
    const board = new Board(2, 0)
    const game = new Minesweeper(board)
    const pos = new Position(1, 5)

    const act = () => game.move(pos)

    expect(act).toThrowError(UnknownCellException)
  })
})
