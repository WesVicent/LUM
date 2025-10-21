import RenderService from "../../engines/d3/RenderService";
import { EventBus } from "../../EventBus";
import EventPayload from "../../interfaces/EventPayload";
import IdAndPositions from "../../interfaces/IdAndPositions";
import EntityBase from "../EntityBase";

export default class ResizeNode extends EntityBase {
    private nodes: Array<IdAndPositions>;
    private renderService: RenderService;

    private readonly RESIZING_NODES_SIZE: number = 8;
    private readonly RESIZING_NODES_CLASS_SULFIX = {
        topLeft: 'topLeft',
        top: 'top',
        topRight: 'topRight',
        left: 'left',
        right: 'right',
        bottomLeft: 'bottomLeft',
        bottom: 'bottom',
        bottomRight: 'bottomRight',
    };

    constructor(id: string, x: number, y: number, width: number, height: number, renderService: RenderService, eventBus: EventBus) {
        super(id, x, y, width, height, eventBus);

        this.renderService = renderService;
        this.nodes = this.createNodePositionsArray(x, y, width, height);

        this.eventBus.listen('ENTITY_FOCUS', this.handleFocus.bind(this));

        this.draw();
    }

    private handleFocus(payload: EventPayload) {
        const target = payload.target as EntityBase;
        
        this.translate(target.x, target.y);
    }

    private createNodePositionsArray(x: number, y: number, width: number, height: number): Array<IdAndPositions> {
        return [
            { id: this.RESIZING_NODES_CLASS_SULFIX.topLeft, x: x, y: y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.top, x: x + width / 2, y: y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.topRight, x: x + width, y: y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.right, x: x + width, y: y + height / 2 },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomRight, x: x + width, y: y + height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottom, x: x + width / 2, y: y + height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomLeft, x: x, y: y + height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.left, x: x, y: y + height / 2 },
        ];
    }

    private getResizeCursor(direction: string): string {
        const cursors: { [key: string]: string } = {
            [this.RESIZING_NODES_CLASS_SULFIX.top]: 'ns-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.bottom]: 'ns-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.right]: 'ew-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.left]: 'ew-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.topRight]: 'nesw-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.topLeft]: 'nwse-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.bottomRight]: 'nwse-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.bottomLeft]: 'nesw-resize'
        };

        return cursors[direction] || 'default';
    }

    public draw(): void {
        this.nodes.forEach(node => {
            this.renderService.drawPrimitiveRect(
                node.x - this.RESIZING_NODES_SIZE / 2,
                node.y - this.RESIZING_NODES_SIZE / 2,
                this.RESIZING_NODES_SIZE,
                this.RESIZING_NODES_SIZE,
                // this.card.localGroup
            )
                .attr('id', 'rsz-node')
                .attr('class', `handle-resiz resize-${node.id}`)
                .attr('fill', '#096bc7')
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1)
                .attr('rx', 1)
                .style('cursor', this.getResizeCursor(node.id));
        });
    }

    public translate(x: number, y: number): void {
        this.x = x;
        this.y = y;

        this.renderService.select('#rsz-node').attr('x', x).attr('y', y);
    }
    public highlightBorders(shouldHighlight: boolean): void {
        throw new Error("Method not implemented.");
    }

}