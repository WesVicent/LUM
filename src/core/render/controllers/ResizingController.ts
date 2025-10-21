import * as d3 from "d3";
import RenderService from "../engines/d3/RenderService";
import IdAndPositions from "../interfaces/IdAndPositions";
import LumCard from "../entities/LumCard";
import Controller from "./ControllerBase";
import { EventBus } from "../EventBus";

export default class ResizingControll extends Controller {
    private readonly renderService: RenderService;

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private card: LumCard;

    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;

    private isResizing: boolean = false;
    private resizeDirection: string | null = null;

    private nodes: Array<IdAndPositions>;

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

    constructor(x: number, y: number, width: number, height: number, renderService: RenderService, card: LumCard, eventBus: EventBus) {
        super(eventBus);

        this.renderService = renderService;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.card = card;

        this.nodes = this.createNodePositionsArray(x, y, width, height);

        this.createResizingNodes();
        this.setupResizeHandler();
    }

    protected listenToEvents(): void {}

    private createNodePositionsArray(x: number, y: number, width: number, height: number): Array<IdAndPositions> {
        return [
            { id: this.RESIZING_NODES_CLASS_SULFIX.topLeft, x: 0, y: 0 },
            { id: this.RESIZING_NODES_CLASS_SULFIX.top, x: width / 2, y: 0 },
            { id: this.RESIZING_NODES_CLASS_SULFIX.topRight, x: width, y: 0 },
            { id: this.RESIZING_NODES_CLASS_SULFIX.right, x: width, y: height / 2 },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomRight, x: width, y: height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottom, x: width / 2, y: height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomLeft, x: 0, y: height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.left, x: 0, y: height / 2 },
        ];
    }

    private createResizingNodes(): void {
        this.nodes.forEach(node => {
            this.renderService.drawPrimitiveRect(
                node.x - this.RESIZING_NODES_SIZE / 2,
                node.y - this.RESIZING_NODES_SIZE / 2,
                this.RESIZING_NODES_SIZE,
                this.RESIZING_NODES_SIZE,
                this.card.localGroup
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

    private updateResizingNodes(): void {
        this.nodes.forEach(node => {
            switch (node.id) {
                case this.RESIZING_NODES_CLASS_SULFIX.right:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('x', this.width - + this.RESIZING_NODES_SIZE / 2);

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.topRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.top}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.left:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.topRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.top}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.bottom:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomLeft}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.left}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.top:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomLeft}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.left}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
            }
        });
    }

    private resizeTop(event: D3DragRectEvent): void {
        if (this.height - event.y > this.MIN_HEIGHT) {
            this.height = Math.max(this.MIN_HEIGHT, this.height - event.y);
            this.y += event.y;
        }
    }
    private resizeRight(event: D3DragRectEvent): void {
        if (this.x + this.width > this.MIN_WIDTH) {
            this.width = Math.max(this.MIN_WIDTH, event.x)
        }

    }
    private resizeBottom(event: D3DragRectEvent): void {
        if (this.y + this.height > this.MIN_HEIGHT) {
            this.height = Math.max(this.MIN_HEIGHT, event.y)
        }
    }
    private resizeLeft(event: D3DragRectEvent): void {
        if (this.width - event.x > this.MIN_WIDTH) {
            this.width = Math.max(this.MIN_WIDTH, this.width - event.x);
            this.x += event.x;
        }
    }

    private setupResizeHandler(): void {
        const resizeDragHandler = d3.drag<SVGRectElement, unknown, void>()
            .on('start', (event: D3DragRectEvent) => {
                event.sourceEvent.stopPropagation();

                const cardPosition = this.card.getPositionAndSize();

                this.x = cardPosition.x;
                this.y = cardPosition.y;
                this.width = cardPosition.width;
                this.height = cardPosition.height;

                this.isResizing = true;

                this.resizeDirection = d3.select(event.sourceEvent.target as SVGRectElement)
                    .attr('class')
                    .split(' ')
                    .find(className => className.startsWith('resize-'))
                    ?.replace('resize-', '') || null;

                // this.isBordersHighlighted(true)
            })
            .on('drag', (event: D3DragRectEvent) => {
                if (!this.isResizing || !this.resizeDirection) return;

                switch (this.resizeDirection) {
                    case this.RESIZING_NODES_CLASS_SULFIX.right:
                        this.resizeRight(event);

                        break;
                    case this.RESIZING_NODES_CLASS_SULFIX.left:
                        this.resizeLeft(event);

                        break;
                    case this.RESIZING_NODES_CLASS_SULFIX.bottom:
                        this.resizeBottom(event);

                        break;
                    case this.RESIZING_NODES_CLASS_SULFIX.top:
                        this.resizeTop(event);

                        break;
                    case this.RESIZING_NODES_CLASS_SULFIX.topRight:
                        this.resizeTop(event);
                        this.resizeRight(event);

                        break;
                    case this.RESIZING_NODES_CLASS_SULFIX.topLeft:
                        this.resizeTop(event);
                        this.resizeLeft(event);

                        break;
                    case this.RESIZING_NODES_CLASS_SULFIX.bottomLeft:
                        this.resizeBottom(event);
                        this.resizeLeft(event);

                        break;
                    case this.RESIZING_NODES_CLASS_SULFIX.bottomRight:
                        this.resizeBottom(event);
                        this.resizeRight(event);

                        break;
                }

                this.card.onResize(this.x, this.y, this.width, this.height);

                this.updateResizingNodes();
            })
            .on('end', (event: D3DragRectEvent) => {
                this.isResizing = false;
                this.resizeDirection = null;
                this.x += event.dx;
                this.y += event.dy;
            });


        const resizeHandleSelection = d3.selectAll<SVGRectElement, unknown>('.handle-resiz');

        resizeDragHandler(resizeHandleSelection);
    }
}