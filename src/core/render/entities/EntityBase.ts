import { EventBus } from '../EventBus';
import EventPayload from '../interfaces/EventPayload';
import Movable from '../interfaces/Movable';
import Resizable from '../interfaces/Resizable';

export default abstract class EntityBase implements Movable, Resizable {
  protected eventBus: EventBus;
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(id: string, x: number, y: number, width: number, height: number, eventBus: EventBus) {
    this.eventBus = eventBus;
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public abstract draw(): void;

  abstract translate(x: number, y: number): void;
  abstract highlightBorders(shouldHighlight: boolean): void;

  private emit(event: string, data: any) {
    this.eventBus.trigger(event, { entityId: this.id, ...data });
  }

  protected notifyChanges() {
    this.emit('ENTITY_CHANGED', { entity: this });
  }

  protected emitClick() {
    this.emit('ENTITY_CLICKED', {});
  }

  protected emitDragStart(payload: EventPayload) {
    this.emit('ENTITY_DRAG_S', payload);
  }

  protected emitDragging(payload: EventPayload) {
    this.emit('ENTITY_DRAGGING', payload);
  }

  protected emitDragEnd(payload: EventPayload) {
    this.emit('ENTITY_DRAG_E', payload);
  }

  protected emitFocus(payload: EventPayload) {
    this.emit('ENTITY_FOCUS', payload);
  }
}