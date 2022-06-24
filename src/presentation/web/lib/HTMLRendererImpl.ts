import * as Core from "../../../core"

export class HTMLRendererImpl {
  private readonly _boardEl: Element
  private readonly _flagCountEl: Element

  public constructor(boardEl: Element, flagCountEl: Element) {
    this._boardEl = boardEl
    this._flagCountEl = flagCountEl
  }

  public renderFlagCount(count: number, placedBombs: number) {
    this._flagCountEl.innerHTML = `${placedBombs - count} 🚩`
  }

  public render(grid: Readonly<Core.Grid>): void {
    const cols = grid.length + 1

    const output = grid
      .flat()
      .map(
        (cell) =>
          `<div class="cell ${
            cell.isRevealed() && !(cell instanceof Core.Bomb)
              ? "cell--revealed"
              : ""
          }" data-x="${cell.getPosition().x}" data-y="${
            cell.getPosition().y
          }">${this.renderCell(cell)}</div>`
      )
      .join("")

    // 8
    ;(this._boardEl as HTMLElement).style["width"] = cols * 24 + 12 * 8 + "px"

    this._boardEl.innerHTML = output
  }

  private renderCell(cell: Core.Cell) {
    if (cell.isFlagged()) return "🚩"
    if (!cell.isRevealed()) return " "

    if (cell instanceof Core.Bomb) {
      return "💣"
    }

    if (cell instanceof Core.Neutral) {
      const count = cell.getBombCount()
      return count === 0 ? " " : count
    }
  }
}
