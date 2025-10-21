import EventPayload from "./interfaces/EventPayload";

type EventHandler = (payload: EventPayload) => void;

export class EventBus {
  private events: Map<string, EventHandler[]> = new Map();

  listen(event: string, callback: EventHandler) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event)!.push(callback);

    console.log('listen', event);
    
  }

  trigger(event: string, payload: EventPayload) {
    const handlers = this.events.get(event);
    
    handlers && handlers.forEach(handler => handler(payload));

    console.log('triggered', event);
  }

  ignore(event: string, callback: EventHandler) {
    const handlers = this.events.get(event);
    if (handlers) {
      this.events.set(event, handlers.filter(h => h !== callback));
    }
  }
}