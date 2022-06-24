import { Board, Cell, Neutral, Bomb } from "./board"
import {
  GameStartedEvent,
  CellUpdatedEvent,
  GameConditionUpdatedEvent,
  BoardRevealedEvent,
  IEventBus,
  EventBus,
  GameEvents,
  EventHandlerFn,
} from "./eventBus"
import { GameStatus, Position } from "./shared"

export class Minesweeper {
  private readonly _board: Board
  private readonly _eventBus: IEventBus
  private _gameStatus: GameStatus = GameStatus.Idle

  public constructor(board: Board, eventBus: IEventBus = new EventBus()) {
    this._board = board
    this._eventBus = eventBus
  }

  public start(): void {
    if (this.isPlaying()) return

    this._eventBus.emit(
      "game-started",
      new GameStartedEvent(this._board.getGrid())
    )

    this._gameStatus = GameStatus.Playing
  }

  public reveal(position: Position): void {
    if (!this.isPlaying()) return

    const cell = this._board.getCell(position)

    cell.reveal()
    this._eventBus.emit(
      "cell-updated",
      new CellUpdatedEvent(cell, this._board.getGrid())
    )

    this.revealNeighborsWhenNoBombsAround(cell)
    this.determineWinCondition(cell)
    this.revealBoardWhenGameOver()
  }

  public flag(position: Position): void {
    if (!this.isPlaying()) return

    const cell = this._board.getCell(position)
    cell.flag()
    this._eventBus.emit(
      "cell-updated",
      new CellUpdatedEvent(cell, this._board.getGrid())
    )
  }

  public getGameStatus(): GameStatus {
    return this._gameStatus
  }

  public on<
    TEvent extends keyof GameEvents,
    TEventData extends GameEvents[TEvent]
  >(eventName: TEvent, handler: EventHandlerFn<TEventData>): void {
    this._eventBus.on<TEvent, TEventData>(eventName, handler)
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
      this._eventBus.emit(
        "game-condition-updated",
        new GameConditionUpdatedEvent(this._gameStatus, this._board.getGrid())
      )
      return
    }

    if (!this._board.hasUnrevealedNeutrals()) {
      this._gameStatus = GameStatus.Won
      this._eventBus.emit(
        "game-condition-updated",
        new GameConditionUpdatedEvent(this._gameStatus, this._board.getGrid())
      )
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

    this._eventBus.emit(
      "board-revealed",
      new BoardRevealedEvent(this._board.getGrid())
    )
  }

  private isIdle(): boolean {
    return this._gameStatus === GameStatus.Idle
  }
}
