import { Position } from "./Position"

export abstract class Cell {
  private _isRevealed = false
  private _isFlagged = false
  private _position: Position

  public constructor(position: Position) {
    this._position = position
  }

  public isRevealed(): boolean {
    return this._isRevealed
  }

  public isFlagged(): boolean {
    return this._isFlagged
  }

  public getPosition(): Position {
    return Object.freeze(this._position)
  }

  public reveal(): void {
    if (this._isRevealed) return void 0
    if (this._isFlagged) return void 0

    this._isRevealed = true
  }

  public setPosition(position: Position) {
    this._position = position
  }

  public flag(): void {
    this._isFlagged = !this._isFlagged
  }
}
