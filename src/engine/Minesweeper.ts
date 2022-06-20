import { Board } from "./Board"
import { Position } from "./Position"

export class Minesweeper {
  private readonly _board: Board

  public constructor(board: Board) {
    this._board = board
  }

  public move(position: Position): void {
    this._board.getCell(position).reveal()
  }
}
