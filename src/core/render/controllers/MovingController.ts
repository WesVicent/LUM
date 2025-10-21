import { EventBus } from "../EventBus";
import EventPayload from "../interfaces/EventPayload";
import ControllerBase from "./ControllerBase";

export default class MovingController extends ControllerBase {

    constructor(eventBus: EventBus) {
        super(eventBus);
        console.info('Moving Controller setted up')
    }

    protected listenToEvents(): void {
        this.listen('ENTITY_DRAG_S', this.handleOnDragStart);
        this.listen('ENTITY_DRAGGING', this.handleOnDragging);
        this.listen('ENTITY_DRAG_E', this.handleOnDragEnd);
    }

    private handleOnDragStart(payload: EventPayload): void {
        const event = payload.event;
        const target = payload.target;

        event.sourceEvent.stopPropagation();

        target.highlightBorders(true);

    }

    private handleOnDragging(payload: EventPayload): void {
        const event = payload.event;
        const target = payload.target;

        target.x += event.dx;
        target.y += event.dy;

        target.translate(target.x, target.y);
    }

    private handleOnDragEnd(payload: EventPayload): void {
        const event = payload.event;
        const target = payload.target;

        target.x += event.dx;
        target.y += event.dy;

        target.translate(target.x, target.y);

        target.highlightBorders(false);
    }


}