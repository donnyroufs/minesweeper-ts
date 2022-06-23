import { Grid } from "./Grid"

export interface IGridGenerator {
  generate(size: number, bombCount: number): Grid
}
