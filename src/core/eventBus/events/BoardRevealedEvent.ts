import { Grid } from "../../board"
import { IGameEvent } from "../../shared"

export class BoardRevealedEvent implements IGameEvent {
  public readonly grid: Readonly<Grid>

  public constructor(grid: Readonly<Grid>) {
    this.grid = grid
  }
}
