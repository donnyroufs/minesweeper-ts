import { GameStatus } from "../GameStatus"
import { Grid } from "../Grid"
import { IGameEvent } from "../IGameEvent"

export class GameConditionUpdatedEvent implements IGameEvent {
  public readonly gameStatus: GameStatus
  public readonly grid: Readonly<Grid>

  public constructor(gameStatus: GameStatus, grid: Grid) {
    this.grid = grid
    this.gameStatus = gameStatus
  }
}
