import { Board } from "./Board"
import { Bomb } from "./Bomb"
import { Neutral } from "./Neutral"

describe("board", () => {
  test.each([
    [3, 1],
    [5, 5],
    [10, 10],
  ])("creates a a grid of size %i with %i bombs", (size, bombCount) => {
    const board = new Board(size, bombCount)

    const grid = board.getGrid()
    const totalBombs = grid.flat().reduce((acc, curr) => {
      if (curr instanceof Bomb) {
        acc += 1
      }

      return acc
    }, 0)

    const totalNeutralCells = grid.flat().reduce((acc, curr) => {
      if (curr instanceof Neutral) {
        acc += 1
      }

      return acc
    }, 0)

    expect(totalBombs).toBe(bombCount)
    expect(totalNeutralCells).toBe(size * size - bombCount)
  })

  test("calculates the neighbor bomb count for each Neutral cell", () => {
    const board = createThreeByThreeBoard(1)
    const neutralCell = board
      .getGrid()
      .flat()
      .filter((c) => !(c instanceof Bomb))
      .at(0)!

    expect((neutralCell as Neutral).getBombCount()).toBe(1)
  })

  test("returns 0 when there are no bombs around", () => {
    const board = createThreeByThreeBoard(0)
    const neutralCell = board
      .getGrid()
      .flat()
      .filter((c) => !(c instanceof Bomb))
      .at(0)!

    expect((neutralCell as Neutral).getBombCount()).toBe(0)
  })
})

function createThreeByThreeBoard(bombCount = 1): Board {
  return new Board(3, bombCount)
}
