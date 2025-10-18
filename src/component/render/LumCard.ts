import * as d3 from "d3";
import RenderService from "../../services/render/RenderService";
import LumText from "./LumText";
import IdAndPositions from "./interfaces/IdAndPositions";

export default class LumCard {
    private localGroup: D3GElement;
    private rect: D3RectElement;
    private line: D3LineElement;
    private text: LumText;

    private x: number;
    private y: number;
    private width: number;
    private height: number;

    // Resizing
    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;
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

    private resizingNodes: D3GElement;
    private isResizing: boolean = false;
    private resizeDirection: string | null = null;

    constructor(x: number, y: number, width: number, height: number, renderService: RenderService) {
        width = width < this.MIN_WIDTH ? this.MIN_WIDTH : width;
        height = height < this.MIN_HEIGHT ? this.MIN_HEIGHT : height;

        this.localGroup = renderService.createPrimitiveGroup(x, y, width, height);
        let stringText = '123456789-12345678';

        const rect = renderService.drawPrimitiveRect(0, 0, width, height, this.localGroup);
        const line = renderService.drawPrimitiveLine(0, 0 + height / 5, width, this.localGroup);
        const text = renderService.drawText(0, 0, width, height, 18, `${stringText}${stringText}${stringText}${stringText}${stringText}`, this.localGroup);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.rect = rect;
        this.line = line;
        this.text = text;

        this.resizingNodes = this.createResizingNodes();

        this.setupDragHandler();
        this.setupResizeHandler();
    }

    public remove() {
        this.line.remove();
        this.rect.remove();
    }

    public call(selection: D3DragGroupFunction): void {
        this.localGroup.call(selection);
    }

    private createNodePositionsArray(): Array<IdAndPositions> {
        const bbox = (this.localGroup.node() as SVGGElement).getBBox();

        return [
            { id: this.RESIZING_NODES_CLASS_SULFIX.topLeft, x: bbox.x, y: bbox.y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.top, x: bbox.x + bbox.width / 2, y: bbox.y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.topRight, x: bbox.x + bbox.width, y: bbox.y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.right, x: bbox.x + bbox.width, y: bbox.y + bbox.height / 2 },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomRight, x: bbox.x + bbox.width, y: bbox.y + bbox.height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottom, x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomLeft, x: bbox.x, y: bbox.y + bbox.height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.left, x: bbox.x, y: bbox.y + bbox.height / 2 },
        ];
    }

    private createResizingNodes(): D3GElement {
        const nodes = this.createNodePositionsArray();

        const resizingNodes = this.localGroup.append('g')
            .attr('class', 'resizing-nodes')
            .style('display', 'none');

        nodes.forEach(handle => {
            resizingNodes.append('rect')
                .attr('class', `handle-resiz resize-${handle.id}`)
                .attr('x', handle.x - this.RESIZING_NODES_SIZE / 2)
                .attr('y', handle.y - this.RESIZING_NODES_SIZE / 2)
                .attr('width', this.RESIZING_NODES_SIZE)
                .attr('height', this.RESIZING_NODES_SIZE)
                .attr('fill', '#096bc7')
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1)
                .attr('rx', 1)
                .style('cursor', this.getResizeCursor(handle.id));
        });

        return resizingNodes;
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
        const nodes = this.createNodePositionsArray();

        nodes.forEach(node => {
            switch (node.id) {
                case this.RESIZING_NODES_CLASS_SULFIX.right:
                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.topRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.top}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.left:
                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.topRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.top}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.bottom:
                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomLeft}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.left}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.top:
                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomLeft}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.resizingNodes.select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.left}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
            }
        });
    }

    private isBordersHighlighted(highlight: boolean): void {
        // Default
        let color = '#3d3d3dff';
        let lineSize = 1;

        if (highlight) {
            color = '#096bc7ff';
            lineSize = 2;
        }

        this.rect.attr('stroke-width', lineSize.toString())
            .attr('stroke', color);

        this.line.style("stroke-width", 1)
            .style("stroke", color);
    }

    private setupDragHandler(): void {
        const dragHandler = d3.drag<SVGGElement, unknown, void>()
            .on('start', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                event.sourceEvent.stopPropagation();

                this.resizingNodes.style('display', 'none');

                this.isBordersHighlighted(true);
            })
            .on('drag', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.x += event.dx;
                this.y += event.dy;

                this.localGroup.attr("transform", `translate(${this.x}, ${this.y})`);

                this.isBordersHighlighted(true);
            })
            .on('end', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.x += event.dx;
                this.y += event.dy;

                this.localGroup.attr("transform", `translate(${this.x}, ${this.y})`);

                // Keep resizing nodes after drag
                this.resizingNodes.style('display', null);

                this.isBordersHighlighted(false);
            });

        this.localGroup
            .style('cursor', 'grab')
            .call(dragHandler);
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

                this.isResizing = true;

                this.resizeDirection = d3.select(event.sourceEvent.target as SVGRectElement)
                    .attr('class')
                    .split(' ')
                    .find(className => className.startsWith('resize-'))
                    ?.replace('resize-', '') || null;

                this.isBordersHighlighted(true)
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


                this.localGroup.attr("transform", `translate(${this.x}, ${this.y})`);


                this.rect.attr('width', this.width)
                    .attr('height', this.height);

                this.line.attr('x2', this.width)
                    .attr('y1', this.height - (this.height - 18))
                    .attr('y2', this.height - (this.height - 18));

                this.updateResizingNodes();
            })
            .on('end', (event: D3DragRectEvent) => {
                this.isResizing = false;
                this.resizeDirection = null;
                this.x += event.dx;
                this.y += event.dy;

                this.isBordersHighlighted(false)
            });

        const resizeHandleSelection = this.resizingNodes.selectAll<SVGRectElement, unknown>('.handle-resiz');

        resizeDragHandler(resizeHandleSelection as any);
    }
}
