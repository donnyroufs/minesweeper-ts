import { Board } from "../Board"
import { BoardOpts } from "../BoardOpts"
import { GridGenerator } from "../GridGenerator"
import { IGridGenerator } from "../IGridGenerator"

export class BoardBuilder {
  private _board!: Board
  private _size: number
  private _bombCount: number

  public withSize(size: number) {
    this._size = size
    return this
  }

  public withBombCount(bombCount: number) {
    this._bombCount = bombCount
    return this
  }

  public witFakeGridGenerator(
    gridGenerator: IGridGenerator
  ): Pick<this, "build"> {
    this._board = this.makeBoard(this._size, this._bombCount, gridGenerator)
    return this
  }

  public withRealGridGenerator(): Pick<this, "build"> {
    this._board = this.makeBoard(this._size, this._bombCount)
    return this
  }

  public build(): Board {
    return this._board
  }

  private makeBoard(
    size: number,
    totalBombs: number,
    gridGenerator: IGridGenerator = new GridGenerator()
  ): Board {
    return new Board(new BoardOpts(size, totalBombs), gridGenerator)
  }
}
