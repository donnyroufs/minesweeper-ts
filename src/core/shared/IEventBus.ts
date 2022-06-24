import {
  CellUpdatedEvent,
  GameConditionUpdatedEvent,
  GameStartedEvent,
  BoardRevealedEvent,
} from "../events"

export type EventHandlerFn<TEvent> = (data: TEvent) => void
export type GameEvents = {
  "cell-updated": CellUpdatedEvent
  "game-condition-updated": GameConditionUpdatedEvent
  "game-started": GameStartedEvent
  "board-revealed": BoardRevealedEvent
}

export interface IEventBus {
  emit<TEvent extends keyof GameEvents, TEventData extends GameEvents[TEvent]>(
    eventName: TEvent,
    data: TEventData
  ): void
  on<TEvent extends keyof GameEvents, TEventData extends GameEvents[TEvent]>(
    event: TEvent,
    handler: EventHandlerFn<TEventData>
  ): void
}

export class EventBus implements IEventBus {
  private readonly _subscribers: Map<keyof GameEvents, EventHandlerFn<any>[]> =
    new Map()

  public on<
    TEvent extends keyof GameEvents,
    TEventData extends GameEvents[TEvent]
  >(eventName: TEvent, handler: EventHandlerFn<TEventData>): void {
    if (!this.exists(eventName)) {
      this._subscribers.set(eventName, [])
    }

    const subscribers = this._subscribers.get(eventName)!
    subscribers.push(handler)
  }

  public emit<
    TEvent extends keyof GameEvents,
    TEventData extends GameEvents[TEvent]
  >(eventName: TEvent, data: TEventData): void {
    const handlers = this._subscribers.get(eventName)!

    if (!handlers) {
      console.warn(`does not have any listeners.`, eventName)
      return
    }

    handlers.forEach((handler) => handler(data))
  }

  private exists(eventName: keyof GameEvents) {
    return this._subscribers.has(eventName)
  }
}
