export class BoardOpts {
  public readonly size: number
  public readonly bombCount: number

  public constructor(size: number, bombCount: number) {
    this.size = size
    this.bombCount = bombCount
  }
}
