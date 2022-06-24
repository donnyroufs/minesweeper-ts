import { Cell } from "../../cells"
import { Grid } from "../../board"
import { IGameEvent } from "../../shared"

export class CellUpdatedEvent implements IGameEvent {
  public readonly cell: Readonly<Cell>
  public readonly grid: Readonly<Grid>

  public constructor(cell: Readonly<Cell>, grid: Readonly<Grid>) {
    this.cell = cell
    this.grid = grid
  }
}
