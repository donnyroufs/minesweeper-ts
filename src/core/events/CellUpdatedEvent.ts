import { Cell } from "../Cell"
import { Grid } from "../Grid"
import { IGameEvent } from "../IGameEvent"

export class CellUpdatedEvent implements IGameEvent {
  public readonly cell: Readonly<Cell>
  public readonly grid: Readonly<Grid>

  public constructor(cell: Readonly<Cell>, grid: Readonly<Grid>) {
    this.cell = cell
    this.grid = grid
  }
}
