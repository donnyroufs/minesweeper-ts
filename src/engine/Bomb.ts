import { Cell } from "./Cell"

export class Bomb extends Cell {
  public onReveal(): void {
    throw new Error("Not implemented")
  }
}
