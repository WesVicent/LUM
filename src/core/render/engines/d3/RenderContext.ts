export default class RenderContext {
    private svg: D3SVGElement;
    public readonly width: number;
    public readonly height: number;

    public readonly hCenter:number
    public readonly vCenter:number

    constructor(svg: D3SVGElement, width: number, height: number) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.hCenter = width /2;
        this.vCenter = height /2;
    }

    public append(name: string): D3BaseTypeSelection {
        return this.svg.append(name);
    }

    public getCore(): D3SVGElement {
        return this.svg;
    }
}