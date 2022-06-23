import { Bomb } from "./Bomb"
import { Cell } from "./Cell"
import { Neutral } from "./Neutral"
import { Position } from "./Position"
import { UnknownCellException } from "./UnknownCellException"

type Grid = Cell[][]

export class Board {
  private readonly _grid: Grid

  public constructor(size: number, bombs: number) {
    this._grid = this.createGrid(size, bombs)
  }

  public getGrid(): Grid {
    return this._grid
  }

  public getCell(position: Position): Cell {
    const cell = this._grid[position.x][position.y]

    if (!cell) {
      throw new UnknownCellException()
    }

    return cell
  }

  // TODO: Shuffle bombs (lodash)
  private createGrid(size: number, bombs: number): Grid {
    const grid: Grid = []
    let currentBombs = 0

    for (let x = 0; x < size; x++) {
      grid[x] = []
      for (let y = 0; y < size; y++) {
        if (currentBombs < bombs && Math.random() > 0.5) {
          grid[x].push(new Bomb(new Position(x, y)))
          currentBombs++

          continue
        }

        grid[x].push(new Neutral(new Position(x, y)))
      }
    }

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const cell = grid[x][y]

        if (!(cell instanceof Neutral)) {
          continue
        }

        cell.setBombCount(this.countBombsNearCell(grid, cell))
      }
    }

    return grid
  }

  private countBombsNearCell(grid: Grid, cell: Cell) {
    const neighbors = this.getNeighbors(grid, cell.getPosition())

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
