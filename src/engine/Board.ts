import { BoardOpts } from "./BoardOpts"
import { Cell } from "./Cell"
import { Grid } from "./Grid"
import { IGridGenerator } from "./IGridGenerator"
import { Position } from "./Position"
import { UnknownCellException } from "./UnknownCellException"

// NOTE: Check for invariants against cells that might have a position that does not exist?
export class Board {
  private readonly _grid: Grid

  public constructor(opts: BoardOpts, gridGenerator: IGridGenerator) {
    this._grid = gridGenerator.generate(opts.size, opts.bombCount)
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

  public getFlagCount(): number {
    return this._grid
      .flat()
      .reduce((acc, curr) => (curr.isFlagged() ? acc + 1 : acc), 0)
  }
  public hasUnrevealedNeutrals(): boolean {
    const res = this._grid
      .flat()
      .filter((c) => !(c instanceof Bomb))
      .some((c) => !c.isRevealed())

    return res
  }
}
