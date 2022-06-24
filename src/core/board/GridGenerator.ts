import { Position, RandomNumberGenerator, Range } from "../shared"

import { Bomb, Cell, Neutral } from "../cells"
import { Grid } from "./Grid"
import { IGridGenerator } from "./IGridGenerator"

export class GridGenerator implements IGridGenerator {
  public generate(size: number, bombCount: number): Grid {
    return this.createGrid(size, bombCount)
  }

  private createGrid(size: number, bombCount: number): Grid {
    const grid: Grid = []

    for (let x = 0; x < size; x++) {
      grid[x] = []
      for (let y = 0; y < size; y++) {
        grid[x].push(new Neutral(new Position(x, y)))
      }
    }

    this.placeBombs(grid, bombCount, size)
    this.setNeighborsOnNeutralCells(size, grid)

    return grid
  }

  private placeBombs(grid: Grid, bombCount: number, size: number) {
    let bombsPlaced = 0

    while (bombsPlaced < bombCount) {
      const randomX = RandomNumberGenerator.generate(new Range(0, size))
      const randomY = RandomNumberGenerator.generate(new Range(0, size))

      const position = new Position(randomX, randomY)

      if (grid[randomX][randomY] instanceof Bomb) continue

      grid[randomX][randomY] = new Bomb(position)
      bombsPlaced++
    }
  }

  private setNeighborsOnNeutralCells(size: number, grid: Grid): void {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const cell = grid[x][y]

        if (!(cell instanceof Neutral)) {
          continue
        }

        const neighbors = this.getNeighbors(grid, cell.getPosition())
        cell.setNeighbors(neighbors)
      }
    }
  }

  private getNeighbors(grid: Grid, { x, y }: Position): Cell[] {
    const neighbors = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const tile = grid[x + xOffset]?.[y + yOffset]
        if (tile) neighbors.push(tile)
      }
    }

    return neighbors
  }
}
