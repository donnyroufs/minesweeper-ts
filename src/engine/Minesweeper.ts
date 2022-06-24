import { Board } from "./Board"
import { Bomb } from "./Bomb"
import { Cell } from "./Cell"
import { GameStatus } from "./GameStatus"
import { Neutral } from "./Neutral"
import { Position } from "./Position"

export class Minesweeper {
  private readonly _board: Board
  private _gameStatus: GameStatus = GameStatus.Idle

  public constructor(board: Board) {
    this._board = board
  }

  public start(): void {
    if (this.isPlaying()) return

    this._gameStatus = GameStatus.Playing
  }

  public reveal(position: Position): void {
    if (!this.isPlaying()) return

    const cell = this._board.getCell(position)

    cell.reveal()

    this.revealNeighborsWhenNoBombsAround(cell)
    this.determineWinCondition(cell)
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
      cell.getNeighbors().forEach((neighbor) => {
        neighbor.reveal()
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
}
