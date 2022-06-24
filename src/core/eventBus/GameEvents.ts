import {
  CellUpdatedEvent,
  GameConditionUpdatedEvent,
  GameStartedEvent,
  BoardRevealedEvent,
} from "./events"

export type GameEvents = {
  "cell-updated": CellUpdatedEvent
  "game-condition-updated": GameConditionUpdatedEvent
  "game-started": GameStartedEvent
  "board-revealed": BoardRevealedEvent
}
