import { Bomb } from "./Bomb"
import { GameStatus } from "./GameStatus"
import { Grid } from "./Grid"
import { IGridGenerator } from "./IGridGenerator"
import { Minesweeper } from "./Minesweeper"
import { Neutral } from "./Neutral"
import { Position } from "./Position"
import { BoardBuilder } from "./testHelpers/BoardBuilder"
import { UnknownCellException } from "./UnknownCellException"

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

  public static makeWithFlag(): FakeGridGenerator {
    const bomb = new Bomb(new Position(0, 2))
    bomb.flag()

    return new FakeGridGenerator([
      [new Neutral(new Position(0, 0)), new Neutral(new Position(0, 1)), bomb],
    ])
  }

  public static makeWithRevealedCells(): FakeGridGenerator {
    const neutral = new Neutral(new Position(0, 0))
    neutral.reveal()

    const grid = [[neutral]]

    return new FakeGridGenerator(grid)
  }

  public static makeWithEmptyCells(): FakeGridGenerator {
    const n1 = new Neutral(new Position(0, 0), 1)
    const bomb = new Bomb(new Position(0, 1))
    const n2 = new Neutral(new Position(0, 2), 1)
    const n3 = new Neutral(new Position(0, 3), 0)
    const n4 = new Neutral(new Position(0, 4), 0)

    n1.setNeighbors([bomb])
    n2.setNeighbors([bomb])
    n3.setNeighbors([n2, n4])
    n4.setNeighbors([n3])

    return new FakeGridGenerator([[n1, bomb, n2, n3, n4]])
  }

  public static makeWithEmptyCellsAndOneFlagged(): FakeGridGenerator {
    const n1 = new Neutral(new Position(0, 0), 1)
    const bomb = new Bomb(new Position(0, 1))
    const n2 = new Neutral(new Position(0, 2), 1)
    const n3 = new Neutral(new Position(0, 3), 0)
    const n4 = new Neutral(new Position(0, 4), 0)
    n4.flag()

    n1.setNeighbors([bomb])
    n2.setNeighbors([bomb])
    n3.setNeighbors([n2, n4])
    n4.setNeighbors([n3])

    return new FakeGridGenerator([[n1, bomb, n2, n3, n4]])
  }
}

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

  test("when we click on a neutral cell with no bombs near it, we recusivly reveal the cells", async () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(FakeGridGenerator.makeWithEmptyCells())
      .build()
    const game = new Minesweeper(board)
    const revealedPositions = [new Position(0, 3), new Position(0, 4)]

    game.start()

    game.reveal(new Position(0, 3))

    revealedPositions.forEach((pos) => {
      const cell = board.getCell(pos)
      expect(cell.isRevealed()).toBe(true)
    })
  })

  test("we only reveal one cell when we click on a neutral cell with bombs around it", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(FakeGridGenerator.makeWithEmptyCells())
      .build()
    const game = new Minesweeper(board)
    const expectedRevealedCount = 1

    game.start()

    game.reveal(new Position(0, 2))

    const currentRevealedCount = board
      .getGrid()
      .flat()
      .reduce((acc, curr) => (curr.isRevealed() ? acc + 1 : acc), 0)

    expect(currentRevealedCount).toBe(expectedRevealedCount)
  })

  test("during recursion we do not reveal a flagged cell", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(FakeGridGenerator.makeWithEmptyCellsAndOneFlagged())
      .build()
    const game = new Minesweeper(board)
    const unrevealedPosition = new Position(0, 3)

    game.start()

    game.reveal(new Position(0, 3))

    expect(board.getCell(unrevealedPosition).isFlagged()).toBe(false)
  })

  test("we can remove a set flag", () => {
    const board = new BoardBuilder()
      .witFakeGridGenerator(new FakeGridGenerator())
      .build()
    const pos = new Position(0, 0)
    const game = new Minesweeper(board)
    game.start()

    board.getCell(pos).flag()
    expect(board.getCell(pos).isFlagged()).toBe(true)

    board.getCell(pos).flag()
    expect(board.getCell(pos).isFlagged()).toBe(false)
  })

  test.each([
    [
      [new Position(0, 0), new Position(0, 1)],
      FakeGridGenerator.makeWithFlag(),
    ],
    [[new Position(0, 2)], new FakeGridGenerator()],
  ])(
    "on lose or win we reveal the entire board and remove all flags",
    (positions, generator) => {
      const board = new BoardBuilder()
        .witFakeGridGenerator(generator)
        .build()
      const game = new Minesweeper(board)

      game.start()

      positions.forEach((pos) => game.reveal(pos))

      expect(board.hasUnrevealedNeutrals()).toBe(false)
      expect(board.getFlagCount()).toBe(0)
    }
  )
})
