import { Bomb } from "./Bomb"
import { Cell } from "./Cell"
import { DeepFreeze } from "./DeepFreeze"
import { Neutral } from "./Neutral"

type Grid = Cell[][]

export class Board {
  private readonly grid: Readonly<Grid>

  public constructor(size: number, bombs: number) {
    this.grid = this.createGrid(size, bombs)
  }

  public getGrid(): Readonly<Grid> {
    return DeepFreeze.freeze(this.grid)
  }

  private createGrid(size: number, bombs: number) {
    const grid: Grid = []
    let currentBombs = 0

    for (let x = 0; x < size; x++) {
      grid[x] = []
      for (let y = 0; y < size; y++) {
        if (currentBombs < bombs && Math.random() > 0.5) {
          grid[x].push(new Bomb())
          currentBombs++

          continue
        }

        grid[x].push(new Neutral())
      }
    }

    return grid
  }
}
