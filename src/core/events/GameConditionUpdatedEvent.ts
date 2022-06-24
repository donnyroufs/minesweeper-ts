import { GameStatus, IGameEvent } from "../shared"
import { Grid } from "../board"

export class GameConditionUpdatedEvent implements IGameEvent {
  public readonly gameStatus: GameStatus
  public readonly grid: Readonly<Grid>

  public constructor(gameStatus: GameStatus, grid: Grid) {
    this.grid = grid
    this.gameStatus = gameStatus
  }
}
