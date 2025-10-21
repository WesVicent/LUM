import { EventBus } from '../EventBus';
import EventPayload from '../interfaces/EventPayload';

export default abstract class ControllerBase {
  protected eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.listenToEvents();
  }

  protected abstract listenToEvents(): void;

  protected listen(event: string, handler: (payload: EventPayload) => void) {
    this.eventBus.listen(event, handler);
  }

  protected trigger(event: string, payload: EventPayload) {
    this.eventBus.trigger(event, payload);
  }
}