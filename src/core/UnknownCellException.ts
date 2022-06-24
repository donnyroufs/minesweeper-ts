export class UnknownCellException extends Error {
  public constructor() {
    super("The cell you tried to reach for does not exist")
  }
}
