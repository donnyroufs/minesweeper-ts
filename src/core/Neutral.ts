import { Bomb } from "./Bomb"
import { Cell } from "./Cell"
import { Position } from "./Position"

export class Neutral extends Cell {
  private _neighbors: Cell[] = []

  public constructor(position: Position) {
    super(position)
  }

  public getBombCount() {
    return this._neighbors.reduce(
      (acc, curr) => (curr instanceof Bomb ? acc + 1 : acc),
      0
    )
  }

  public setNeighbors(neighbors: Cell[]) {
    this._neighbors = neighbors
  }

  public getNeighbors(): Cell[] {
    return this._neighbors
  }
}
