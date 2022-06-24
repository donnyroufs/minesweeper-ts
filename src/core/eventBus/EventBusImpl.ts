import { EventHandlerFn } from "./EventHandlerFn"
import { GameEvents } from "./GameEvents"
import { IEventBus } from "./IEventBus"

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

    handlers?.forEach((handler) => handler(data))
  }

  private exists(eventName: keyof GameEvents) {
    return this._subscribers.has(eventName)
  }
}
