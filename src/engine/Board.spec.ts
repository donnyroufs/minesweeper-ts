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
})
