import { Board } from "./Board"
import { Bomb } from "./Bomb"
import { Cell } from "./Cell"
import { GameStatus } from "./GameStatus"
import { IRenderer } from "./IRenderer"
import { Neutral } from "./Neutral"
import { Position } from "./Position"

export class Minesweeper {
  private readonly _board: Board
  private _gameStatus: GameStatus = GameStatus.Idle
  private _renderer: IRenderer

  public constructor(board: Board, renderer?: IRenderer) {
    this._board = board
    // TODO: Refactor
    this._renderer = renderer || { onStart(grid) {} }
  }

  public start(): void {
    if (this.isPlaying()) return

    this._renderer.onStart(this._board.getGrid())

    this._gameStatus = GameStatus.Playing
  }

  public reveal(position: Position): void {
    if (!this.isPlaying()) return

    const cell = this._board.getCell(position)

    cell.reveal()

    this.revealNeighborsWhenNoBombsAround(cell)
    this.determineWinCondition(cell)
    this.revealBoardWhenGameOver()
  }

  public flag(position: Position): void {
    if (!this.isPlaying()) return

    this._board.getCell(position).flag()
  }

  public getGameStatus(): GameStatus {
    return this._gameStatus
  }

  private isPlaying(): boolean {
    return this._gameStatus === GameStatus.Playing
  }

  private revealNeighborsWhenNoBombsAround(cell: Cell) {
    if (
      cell instanceof Neutral &&
      cell.getBombCount() === 0 &&
      !cell.isFlagged()
    ) {
      cell
        .getNeighbors()
        .filter((c) => !(c instanceof Bomb))
        .filter((c) => !c.isRevealed())
        .forEach((neighbor) => {
          this.reveal(neighbor.getPosition())
        })
    }
  }

  private determineWinCondition(cell: Cell) {
    if (cell instanceof Bomb) {
      this._gameStatus = GameStatus.Lost
      return
    }

    if (!this._board.hasUnrevealedNeutrals()) {
      this._gameStatus = GameStatus.Won
      return
    }
  }

  private revealBoardWhenGameOver() {
    if (this.isIdle()) return
    if (this.isPlaying()) return

    this._board
      .getGrid()
      .flat()
      .forEach((cell) => {
        cell.reveal()

        if (cell.isFlagged()) cell.flag()
      })
  }

  private isIdle(): boolean {
    return this._gameStatus === GameStatus.Idle
  }
}
