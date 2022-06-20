import { Cell } from "./Cell"

export class Neutral extends Cell {
  public onReveal(): void {
    throw new Error("Not implemented")
  }
}
