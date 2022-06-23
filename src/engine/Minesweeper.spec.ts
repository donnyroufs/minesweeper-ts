import { Board } from "./Board"
import { Bomb } from "./Bomb"
import { GameStatus } from "./GameStatus"
import { Minesweeper } from "./Minesweeper"
import { Position } from "./Position"
import { UnknownCellException } from "./UnknownCellException"

describe("minesweeper", () => {
  test("on reveal we reveal the cell", () => {
    const board = new Board(10, 10)
    const game = new Minesweeper(board)
    const pos = new Position(1, 1)

    game.start()

    game.reveal(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("if we try to reveal a cell that has been revealed we do nothing", () => {
    const board = new Board(10, 10)
    const game = new Minesweeper(board)
    const pos = new Position(1, 1)
    game.start()

    game.reveal(pos)
    game.reveal(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("throws an exception when we try to access a grid that does not exist", () => {
    const board = new Board(2, 0)
    const game = new Minesweeper(board)
    const pos = new Position(1, 5)
    game.start()

    const act = () => game.reveal(pos)

    expect(act).toThrowError(UnknownCellException)
  })

  test("we lose the game when we reveal a bomb", () => {
    const board = new Board(1, 1)
    const game = new Minesweeper(board)

    game.start()

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

    game.start()

    neutrals.forEach((n) => game.reveal(n.getPosition()))

    expect(game.getGameStatus()).toBe(GameStatus.Won)
  })

  test("we can start the game which sets the status to playing", () => {
    const board = new Board(2, 1)
    const game = new Minesweeper(board)

    game.start()

    expect(game.getGameStatus()).toBe(GameStatus.Playing)
  })

  test("if we try to start a game thats already playing we do nothing", () => {
    const board = new Board(2, 1)
    const game = new Minesweeper(board)

    expect(game.getGameStatus()).toBe(GameStatus.Idle)

    game.start()

    expect(game.getGameStatus()).toBe(GameStatus.Playing)
  })

  test("we cannot reveal or flag a cell if the game has not been started", () => {
    const board = new Board(2, 1)
    const game = new Minesweeper(board)
    const pos = new Position(0, 0)

    game.reveal(pos)
    game.flag(pos)

    expect(board.getCell(pos).isRevealed()).toBe(false)
    expect(board.getCell(pos).isFlagged()).toBe(false)
  })

  test("if we try to reveal a cell thats been flagged we do nothing", () => {
    const board = new Board(2, 1)
    const game = new Minesweeper(board)
    const pos = new Position(0, 0)
    game.start()

    game.flag(pos)
    game.reveal(pos)

    expect(board.getCell(pos).isRevealed()).toBe(false)
  })
})
