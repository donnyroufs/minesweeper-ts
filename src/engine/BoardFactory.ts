import { Board } from "./Board"
import { BoardOpts } from "./BoardOpts"
import { GridGenerator } from "./GridGenerator"
import { IGridGenerator } from "./IGridGenerator"

export class BoardFactory {
  public constructor(
    private readonly _gridGenerator: IGridGenerator = new GridGenerator()
  ) {}

  public make(opts: BoardOpts): Board {
    return new Board(opts, this._gridGenerator)
  }
}
