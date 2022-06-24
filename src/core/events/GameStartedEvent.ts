import { Grid } from "../Grid"
import { IGameEvent } from "../IGameEvent"

export class GameStartedEvent implements IGameEvent {
  public readonly grid: Readonly<Grid>

  public constructor(grid: Grid) {
    this.grid = grid
  }
}
