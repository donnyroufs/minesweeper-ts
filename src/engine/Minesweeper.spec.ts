import { Board } from "./Board"
import { Bomb } from "./Bomb"
import { Cell } from "./Cell"
import { GameStatus } from "./GameStatus"
import { Grid } from "./Grid"
import { IGridGenerator } from "./IGridGenerator"
import { Minesweeper } from "./Minesweeper"
import { Neutral } from "./Neutral"
import { Position } from "./Position"
import { BoardBuilder } from "./testHelpers/BoardBuilder"
import { UnknownCellException } from "./UnknownCellException"

describe("minesweeper", () => {
  test("on reveal we reveal the cell", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(new FakeGridGenerator())
      .build()

    const game = new Minesweeper(board)
    const pos = new Position(0, 0)

    game.start()

    game.reveal(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("if we try to reveal a cell that has been revealed we do nothing", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(FakeGridGenerator.makeWithRevealedCells())
      .build()

    const game = new Minesweeper(board)
    const pos = new Position(0, 0)

    game.start()

    game.reveal(pos)

    expect(board.getGrid()[pos.x][pos.y].isRevealed()).toBe(true)
  })

  test("throws an exception when we try to access a cell that does not exist", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(FakeGridGenerator.makeEmptyGrid())
      .build()

    const game = new Minesweeper(board)
    const pos = new Position(0, 0)
    game.start()

    const act = () => game.reveal(pos)

    expect(act).toThrowError(UnknownCellException)
  })

  test("we lose the game when we reveal a bomb", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(FakeGridGenerator.makeWithBomb())
      .build()
    const game = new Minesweeper(board)

    game.start()

    game.reveal(new Position(0, 0))

    expect(game.getGameStatus()).toBe(GameStatus.Lost)
  })

  test("we win the game when all cells but bombs have been revealed", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(new FakeGridGenerator())
      .build()
    const game = new Minesweeper(board)

    game.start()

    game.reveal(new Position(0, 0))
    game.reveal(new Position(0, 1))

    expect(game.getGameStatus()).toBe(GameStatus.Won)
  })

  test("we can start the game which sets the status to playing", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(new FakeGridGenerator())
      .build()
    const game = new Minesweeper(board)

    game.start()

    expect(game.getGameStatus()).toBe(GameStatus.Playing)
  })

  test("if we try to start a game thats already playing we do nothing", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(new FakeGridGenerator())
      .build()
    const game = new Minesweeper(board)

    expect(game.getGameStatus()).toBe(GameStatus.Idle)

    game.start()

    expect(game.getGameStatus()).toBe(GameStatus.Playing)
  })

  test("we cannot reveal or flag a cell if the game has not been started", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(new FakeGridGenerator())
      .build()
    const game = new Minesweeper(board)

    const pos = new Position(0, 0)

    game.reveal(pos)
    game.flag(pos)

    expect(board.getCell(pos).isRevealed()).toBe(false)
    expect(board.getCell(pos).isFlagged()).toBe(false)
  })

  test("if we try to reveal a cell thats been flagged we do nothing", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(new FakeGridGenerator())
      .build()
    const game = new Minesweeper(board)

    const pos = new Position(0, 0)
    game.start()

    game.flag(pos)
    game.reveal(pos)

    expect(board.getCell(pos).isRevealed()).toBe(false)
  })
})

class FakeGridGenerator implements IGridGenerator {
  public constructor(private readonly _grid: Grid | null = null) {}

  public generate(): Grid {
    if (this._grid !== null) {
      return this._grid
    }

    return [
      [
        new Neutral(new Position(0, 0)),
        new Neutral(new Position(0, 1)),
        new Bomb(new Position(0, 2)),
      ],
    ]
  }

  public static makeEmptyGrid(): FakeGridGenerator {
    return new FakeGridGenerator([[]])
  }

  public static makeWithBomb(): FakeGridGenerator {
    return new FakeGridGenerator([[new Bomb(new Position(0, 0))]])
  }

  public static makeWithRevealedCells(): FakeGridGenerator {
    const neutral = new Neutral(new Position(0, 0))
    neutral.reveal()

    const grid = [[neutral]]

    return new FakeGridGenerator(grid)
  }
}
