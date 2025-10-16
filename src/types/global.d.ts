// Flatten up types.
type D3BaseType = d3.Selection<BaseType, unknown, HTMLElement, any>

type D3SVGElement = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
type D3GElement = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
type D3RectElement = d3.Selection<SVGRectElement, unknown, HTMLElement, any>;
type D3LineElement = d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
type D3TextElement = d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
type D3TextSpanElement = d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;

type D3DragRectBehavior = d3.DragBehavior<SVGRectElement, unknown, d3.SubjectPosition>;

type D3DragRectFunction = (selection: D3RectElement) => void;
type D3DragGroupFunction = (selection: D3GElement) => void;
                   