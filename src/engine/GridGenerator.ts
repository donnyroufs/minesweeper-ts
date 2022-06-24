import { Bomb } from "./Bomb"
import { Cell } from "./Cell"
import { Grid } from "./Grid"
import { IGridGenerator } from "./IGridGenerator"
import { Neutral } from "./Neutral"
import { Position } from "./Position"

export class GridGenerator implements IGridGenerator {
  public generate(size: number, bombCount: number): Grid {
    return this.createGrid(size, bombCount)
  }

  private createGrid(size: number, bombCount: number): Grid {
    const grid: Grid = []
    let currentBombs = 0

    for (let x = 0; x < size; x++) {
      grid[x] = []
      for (let y = 0; y < size; y++) {
        if (currentBombs < bombCount) {
          grid[x].push(new Bomb(new Position(x, y)))
          currentBombs++

          continue
        }

        grid[x].push(new Neutral(new Position(x, y)))
      }
    }

    this.shuffleCells(size, grid)
    this.setBombCountOnNeutralCells(size, grid)

    return grid
  }

  private shuffleCells(size: number, grid: Grid): void {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const x1 = Math.floor(Math.random() * size)
        const y1 = Math.floor(Math.random() * size)

        const temp = grid[x][y]
        const replacer = grid[x1][y1]
        replacer.setPosition(new Position(x, y))
        temp.setPosition(new Position(x1, y1))
        grid[x][y] = replacer
        grid[x1][y1] = temp
      }
    }
  }

  private setBombCountOnNeutralCells(size: number, grid: Grid): void {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const cell = grid[x][y]

        if (!(cell instanceof Neutral)) {
          continue
        }

        const neighbors = this.getNeighbors(grid, cell.getPosition())
        cell.setBombCount(this.countBombsNearCell(neighbors))
        cell.setNeighbors(neighbors)
      }
    }
  }

  private countBombsNearCell(neighbors: Cell[]) {
    return neighbors.reduce((acc, curr) => {
      if (curr instanceof Bomb) {
        acc += 1
      }

      return acc
    }, 0)
  }

  private getNeighbors(grid: Grid, pos: Position) {
    const rowLimit = grid.length - 1
    const columnLimit = grid[0].length - 1
    const neighbors: Cell[] = []

    for (
      let x = Math.max(0, pos.x - 1);
      x <= Math.min(pos.y + 1, columnLimit);
      x++
    ) {
      for (
        let y = Math.max(0, pos.x - 1);
        y <= Math.min(pos.x + 1, rowLimit);
        y++
      ) {
        if (x !== pos.y || y !== pos.x) {
          neighbors.push(grid[x][y])
        }
      }
    }

    return neighbors
  }
}
