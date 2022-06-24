import { EventHandlerFn } from "./EventHandlerFn"
import { GameEvents } from "./GameEvents"

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
