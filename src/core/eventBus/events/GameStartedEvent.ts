import { Grid } from "../../board"
import { IGameEvent } from "../../shared"

export class GameStartedEvent implements IGameEvent {
  public readonly grid: Readonly<Grid>

  public constructor(grid: Grid) {
    this.grid = grid
  }
}
