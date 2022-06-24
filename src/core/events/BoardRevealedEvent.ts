import { Grid } from "../Grid"
import { IGameEvent } from "../IGameEvent"

export class BoardRevealedEvent implements IGameEvent {
  public readonly grid: Readonly<Grid>

  public constructor(grid: Readonly<Grid>) {
    this.grid = grid
  }
}
