import { Board } from "./Board"
import { Bomb } from "./Bomb"
import { GameStatus } from "./GameStatus"
import { Position } from "./Position"

export class Minesweeper {
  private readonly _board: Board
  private _gameStatus: GameStatus = GameStatus.Playing

  public constructor(board: Board) {
    this._board = board
  }

  public reveal(position: Position): void {
    const cell = this._board.getCell(position)
    cell.reveal()

    if (cell instanceof Bomb) {
      this._gameStatus = GameStatus.Lost
      return
    }

    if (!this._board.hasUnrevealedNeutrals()) {
      this._gameStatus = GameStatus.Won
      return
    }
  }

  public getGameStatus(): GameStatus {
    return this._gameStatus
  }
}
