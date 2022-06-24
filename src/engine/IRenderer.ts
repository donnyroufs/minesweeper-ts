import { Grid } from "./Grid"

export interface IRenderer {
  onStart(grid: Grid): void
}
