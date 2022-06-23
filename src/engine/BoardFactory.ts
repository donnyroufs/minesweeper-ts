import { Board } from "./Board"
import { BoardOpts } from "./BoardOpts"
import { IGridGenerator } from "./IGridGenerator"

export class BoardFactory {
  public constructor(private readonly _gridGenerator: IGridGenerator) {}

  public make(opts: BoardOpts): Board {
    return new Board(opts, this._gridGenerator)
  }
}
