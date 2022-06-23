import { Board } from "./Board"
import { Bomb } from "./Bomb"
import { GameStatus } from "./GameStatus"
import { Minesweeper } from "./Minesweeper"
import { Neutral } from "./Neutral"
import { Position } from "./Position"
import { UnknownCellException } from "./UnknownCellException"

describe("minesweeper", () => {
  test("on reveal we reveal the cell", () => {
    const board = new Board(10, 10)
    const game = new Minesweeper(board)
    const pos = new Position(1, 1)

    game.reveal(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("if we try to reveal a cell that has been revealed we do nothing", () => {
    const board = new Board(10, 10)
    const game = new Minesweeper(board)
    const pos = new Position(1, 1)

    game.reveal(pos)
    game.reveal(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("throws an exception when we try to access a grid that does not exist", () => {
    const board = new Board(2, 0)
    const game = new Minesweeper(board)
    const pos = new Position(1, 5)

    const act = () => game.reveal(pos)

    expect(act).toThrowError(UnknownCellException)
  })

  test("we lose the game when we reveal a bomb", () => {
    const board = new Board(1, 1)
    const game = new Minesweeper(board)

    expect(game.getGameStatus()).toBe(GameStatus.Playing)

    game.reveal(new Position(0, 0))

    expect(game.getGameStatus()).toBe(GameStatus.Lost)
  })

  test("we win the game when all cells but bombs have been revealed", () => {
    const board = new Board(2, 1)
    const game = new Minesweeper(board)
    const neutrals = board
      .getGrid()
      .flat()
      .filter((cell) => !(cell instanceof Bomb))

    expect(game.getGameStatus()).toBe(GameStatus.Playing)

    neutrals.forEach((n) => game.reveal(n.getPosition()))

    expect(game.getGameStatus()).toBe(GameStatus.Won)
  })
})
