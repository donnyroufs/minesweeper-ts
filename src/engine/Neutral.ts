import { Cell } from "./Cell"

export class Neutral extends Cell {
  private _bombCount = 0

  public getBombCount() {
    return this._bombCount
  }

  public setBombCount(count: number): void {
    this._bombCount = count
  }
}
