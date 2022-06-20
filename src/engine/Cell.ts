export abstract class Cell {
  private _isRevealed = false

  public isRevealed(): boolean {
    return this._isRevealed
  }

  public reveal(): void {
    if (this._isRevealed) return void 0

    this._isRevealed = true
  }
}
