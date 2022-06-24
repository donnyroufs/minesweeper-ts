import { Cell } from "./Cell"
import { Position } from "./Position"

export class Neutral extends Cell {
  private _bombCount = 0
  private _neighbors: Cell[] = []

  public constructor(position: Position, bombCount = 0) {
    super(position)
    this._bombCount = bombCount
  }

  public getBombCount() {
    return this._bombCount
  }

  public setBombCount(count: number): void {
    this._bombCount = count
  }

  public setNeighbors(neighbors: Cell[]) {
    this._neighbors = neighbors
  }

  public getNeighbors(): Cell[] {
    return this._neighbors
  }
}
